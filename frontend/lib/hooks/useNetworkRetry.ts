'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  nextRetryIn: number;
}

const defaultConfig: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.status >= 500 ||
      error?.message?.includes('timeout') ||
      error?.message?.includes('fetch')
    );
  },
};

export function useNetworkRetry<T>(
  asyncFunction: () => Promise<T>,
  config: RetryConfig = {}
) {
  const finalConfig = { ...defaultConfig, ...config };
  const { isOnline } = useAppStore();
  
  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    nextRetryIn: 0,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  
  const calculateDelay = useCallback((retryCount: number) => {
    const delay = Math.min(
      finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, retryCount),
      finalConfig.maxDelay
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, [finalConfig]);
  
  const startCountdown = useCallback((delay: number) => {
    setState(prev => ({ ...prev, nextRetryIn: Math.ceil(delay / 1000) }));
    
    const startTime = Date.now();
    const updateCountdown = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((delay - elapsed) / 1000));
      
      setState(prev => ({ ...prev, nextRetryIn: remaining }));
      
      if (remaining > 0) {
        countdownRef.current = setTimeout(updateCountdown, 1000);
      }
    };
    
    countdownRef.current = setTimeout(updateCountdown, 1000);
  }, []);
  
  const executeWithRetry = useCallback(async (): Promise<T> => {
    // Don't retry if offline
    if (!isOnline) {
      throw new Error('网络连接不可用，请检查网络设置');
    }
    
    let lastError: Error;
    
    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        setState(prev => ({
          ...prev,
          isRetrying: attempt > 0,
          retryCount: attempt,
          lastError: null,
          nextRetryIn: 0,
        }));
        
        const result = await asyncFunction();
        
        // Success - reset state
        setState({
          isRetrying: false,
          retryCount: 0,
          lastError: null,
          nextRetryIn: 0,
        });
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        setState(prev => ({
          ...prev,
          lastError,
          retryCount: attempt,
        }));
        
        // Don't retry if we've reached max retries or if retry condition fails
        if (
          attempt >= finalConfig.maxRetries ||
          !finalConfig.retryCondition(error)
        ) {
          setState(prev => ({
            ...prev,
            isRetrying: false,
          }));
          throw error;
        }
        
        // Calculate delay and wait before next retry
        const delay = calculateDelay(attempt);
        startCountdown(delay);
        
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, delay);
        });
      }
    }
    
    throw lastError!;
  }, [asyncFunction, finalConfig, isOnline, calculateDelay, startCountdown]);
  
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
    
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      nextRetryIn: 0,
    });
  }, []);
  
  const manualRetry = useCallback(() => {
    reset();
    return executeWithRetry();
  }, [reset, executeWithRetry]);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, []);
  
  // Auto-retry when coming back online
  useEffect(() => {
    if (isOnline && state.lastError && !state.isRetrying) {
      // Wait a bit before retrying to ensure connection is stable
      setTimeout(() => {
        manualRetry();
      }, 2000);
    }
  }, [isOnline, state.lastError, state.isRetrying, manualRetry]);
  
  return {
    execute: executeWithRetry,
    retry: manualRetry,
    reset,
    state,
    canRetry: state.retryCount < finalConfig.maxRetries && isOnline,
  };
}

// Hook for retrying React Query operations
export function useQueryRetry() {
  const { isOnline } = useAppStore();
  
  const retryFunction = useCallback((failureCount: number, error: any) => {
    // Don't retry if offline
    if (!isOnline) {
      return false;
    }
    
    // Don't retry client errors (4xx)
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    
    // Retry up to 3 times for network/server errors
    return failureCount < 3;
  }, [isOnline]);
  
  const retryDelay = useCallback((attemptIndex: number) => {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, attemptIndex), maxDelay);
    return delay + Math.random() * 1000;
  }, []);
  
  return {
    retry: retryFunction,
    retryDelay,
  };
}

// Hook for handling network status changes
export function useNetworkStatus() {
  const { isOnline, setOnline } = useAppStore();
  const [wasOffline, setWasOffline] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      if (wasOffline) {
        // Show reconnection message
        console.log('网络连接已恢复');
        setWasOffline(false);
      }
    };
    
    const handleOffline = () => {
      setOnline(false);
      setWasOffline(true);
      console.log('网络连接已断开');
    };
    
    // Set initial status
    setOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, wasOffline]);
  
  return {
    isOnline,
    wasOffline,
    isReconnecting: !isOnline && wasOffline,
  };
}

// Hook for handling Web3 transaction retries
export function useTransactionRetry() {
  const retryConfig: RetryConfig = {
    maxRetries: 2, // Fewer retries for transactions
    baseDelay: 5000, // Longer delay for blockchain operations
    retryCondition: (error) => {
      // Only retry on network errors, not on user rejection or insufficient funds
      return (
        error?.name === 'NetworkError' ||
        error?.code === 'NETWORK_ERROR' ||
        (error?.message && 
         !error.message.includes('user rejected') &&
         !error.message.includes('insufficient funds') &&
         !error.message.includes('gas'))
      );
    },
  };
  
  return useNetworkRetry;
}