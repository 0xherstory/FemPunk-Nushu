'use client';

import React from 'react';
import { useAppStore } from '../../lib/stores/appStore';
import { useErrorHandler } from '../../lib/services/errorHandler';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import { useNetworkStatus } from '../../lib/hooks/useNetworkRetry';

export function GlobalErrorDisplay() {
  const { globalError } = useAppStore();
  const { clearError, getErrorInfo } = useErrorHandler();
  const { isOnline } = useNetworkStatus();
  
  if (!globalError) return null;
  
  const errorInfo = getErrorInfo(globalError.code as any);
  const isNetworkError = globalError.code === 'NETWORK_ERROR';
  
  // Don't show network errors when offline (handled by offline indicator)
  if (isNetworkError && !isOnline) return null;
  
  const getVariant = () => {
    switch (globalError.code) {
      case 'NETWORK_ERROR':
        return 'network';
      case 'WALLET_NOT_CONNECTED':
      case 'INSUFFICIENT_FUNDS':
        return 'wallet';
      case 'TRANSACTION_FAILED':
        return 'transaction';
      default:
        return 'default';
    }
  };
  
  const handleRetry = () => {
    clearError();
    // Optionally trigger a retry action based on error type
    if (globalError.code === 'NETWORK_ERROR') {
      window.location.reload();
    }
  };
  
  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <ErrorMessage
        title={errorInfo.message}
        message={errorInfo.suggestions.join(' • ')}
        variant={getVariant()}
        onRetry={handleRetry}
        onDismiss={clearError}
        className="shadow-lg"
      />
    </div>
  );
}

// Offline indicator
export function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  
  if (isOnline && !wasOffline) return null;
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <div className="px-4 py-2 text-center text-white text-sm font-medium">
        {isOnline ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            网络连接已恢复
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
            网络连接已断开
          </div>
        )}
      </div>
    </div>
  );
}

// Loading overlay for global loading states
export function GlobalLoadingOverlay() {
  const { isLoading } = useAppStore();
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
          <span className="text-gray-700 font-medium">处理中，请稍候...</span>
        </div>
      </div>
    </div>
  );
}