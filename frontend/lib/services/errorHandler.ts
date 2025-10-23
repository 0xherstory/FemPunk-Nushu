'use client';

import { useAppStore } from '../stores/appStore';
import type { AppError, ErrorCode } from '../../types';

// Error classification and handling service
export class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  
  static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }
  
  // Classify error and return appropriate error code
  classifyError(error: any): ErrorCode {
    if (!error) return 'SERVER_ERROR';
    
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';
    const status = error.status || error.response?.status;
    
    // Wallet related errors
    if (message.includes('user rejected') || code.includes('user_rejected')) {
      return 'WALLET_NOT_CONNECTED';
    }
    
    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return 'INSUFFICIENT_FUNDS';
    }
    
    // Transaction errors
    if (message.includes('transaction failed') || message.includes('reverted')) {
      return 'TRANSACTION_FAILED';
    }
    
    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      code.includes('network') ||
      status >= 500
    ) {
      return 'NETWORK_ERROR';
    }
    
    // Canvas/collaboration errors
    if (message.includes('canvas') || message.includes('liveblocks')) {
      return 'CANVAS_SYNC_ERROR';
    }
    
    // Color ownership errors
    if (message.includes('color not owned') || message.includes('unauthorized')) {
      return 'COLOR_NOT_OWNED';
    }
    
    // Input validation errors
    if (status >= 400 && status < 500) {
      return 'INVALID_INPUT';
    }
    
    return 'SERVER_ERROR';
  }
  
  // Create standardized error object
  createAppError(error: any, context?: string): AppError {
    const code = this.classifyError(error);
    const message = this.getErrorMessage(code, error);
    
    return {
      code,
      message,
      details: {
        originalError: error.message,
        context,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      },
      timestamp: new Date(),
    };
  }
  
  // Get user-friendly error message
  getErrorMessage(code: ErrorCode, originalError?: any): string {
    const messages: Record<ErrorCode, string> = {
      WALLET_NOT_CONNECTED: '请先连接钱包以继续操作',
      INSUFFICIENT_FUNDS: '余额不足，请确保账户有足够的 ETH',
      TRANSACTION_FAILED: '交易失败，请检查网络状态或稍后重试',
      NETWORK_ERROR: '网络连接异常，请检查网络设置',
      CANVAS_SYNC_ERROR: '画布同步失败，正在尝试重新连接',
      COLOR_NOT_OWNED: '您没有使用此颜色的权限，请先购买',
      INVALID_INPUT: '输入信息有误，请检查后重试',
      SERVER_ERROR: '服务器暂时不可用，请稍后重试',
    };
    
    return messages[code] || '发生未知错误，请稍后重试';
  }
  
  // Get recovery suggestions
  getRecoverySuggestions(code: ErrorCode): string[] {
    const suggestions: Record<ErrorCode, string[]> = {
      WALLET_NOT_CONNECTED: [
        '点击"连接钱包"按钮',
        '确保已安装 MetaMask 或其他支持的钱包',
        '检查钱包是否已解锁',
      ],
      INSUFFICIENT_FUNDS: [
        '向钱包地址转入足够的 ETH',
        '检查当前网络是否正确',
        '等待之前的交易完成',
      ],
      TRANSACTION_FAILED: [
        '检查网络连接状态',
        '增加 Gas 费用',
        '稍后重试交易',
      ],
      NETWORK_ERROR: [
        '检查网络连接',
        '尝试刷新页面',
        '切换到其他网络节点',
      ],
      CANVAS_SYNC_ERROR: [
        '检查网络连接',
        '刷新页面重新加载画布',
        '清除浏览器缓存',
      ],
      COLOR_NOT_OWNED: [
        '前往购买页面购买颜色',
        '使用兑换码获取颜色',
        '检查钱包连接状态',
      ],
      INVALID_INPUT: [
        '检查输入格式是否正确',
        '确保所有必填字段已填写',
        '重新输入信息',
      ],
      SERVER_ERROR: [
        '稍后重试',
        '刷新页面',
        '联系技术支持',
      ],
    };
    
    return suggestions[code] || ['刷新页面重试', '联系技术支持'];
  }
  
  // Handle error and update global state
  handleError(error: any, context?: string): AppError {
    const appError = this.createAppError(error, context);
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', appError);
    }
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(appError);
    }
    
    return appError;
  }
  
  // Report error to external service (placeholder)
  private reportError(error: AppError): void {
    // Example: Send to Sentry, LogRocket, etc.
    // Sentry.captureException(new Error(error.message), {
    //   tags: { errorCode: error.code },
    //   extra: error.details,
    // });
  }
}

// React hook for error handling
export function useErrorHandler() {
  const { setGlobalError } = useAppStore();
  const errorHandler = ErrorHandlerService.getInstance();
  
  const handleError = (error: any, context?: string) => {
    const appError = errorHandler.handleError(error, context);
    setGlobalError(appError);
    return appError;
  };
  
  const clearError = () => {
    setGlobalError(null);
  };
  
  const getErrorInfo = (code: ErrorCode) => ({
    message: errorHandler.getErrorMessage(code),
    suggestions: errorHandler.getRecoverySuggestions(code),
  });
  
  return {
    handleError,
    clearError,
    getErrorInfo,
  };
}

// Hook for handling async operations with error handling
export function useAsyncError() {
  const { handleError } = useErrorHandler();
  
  const executeAsync = async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };
  
  return { executeAsync };
}

// Global error event listeners
export function setupGlobalErrorHandlers() {
  const errorHandler = ErrorHandlerService.getInstance();
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    errorHandler.handleError(event.reason, 'unhandledrejection');
    event.preventDefault();
  });
  
  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    errorHandler.handleError(event.error, 'global');
  });
  
  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Resource loading error:', event.target);
      errorHandler.handleError(
        new Error(`Failed to load resource: ${(event.target as any)?.src || 'unknown'}`),
        'resource'
      );
    }
  }, true);
}