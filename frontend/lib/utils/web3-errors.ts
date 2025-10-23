import { BaseError, ContractFunctionRevertedError, UserRejectedRequestError } from 'viem';
import type { ErrorCode, AppError } from '../../types';

// Web3 Error Types
export interface Web3Error extends AppError {
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
}

// Error code mapping for common Web3 errors
export const WEB3_ERROR_CODES: Record<string, ErrorCode> = {
  'UserRejectedRequestError': 'WALLET_NOT_CONNECTED',
  'InsufficientFundsError': 'INSUFFICIENT_FUNDS',
  'ContractFunctionRevertedError': 'TRANSACTION_FAILED',
  'NetworkError': 'NETWORK_ERROR',
  'ChainMismatchError': 'NETWORK_ERROR',
  'ConnectorNotFoundError': 'WALLET_NOT_CONNECTED',
} as const;

// User-friendly error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  WALLET_NOT_CONNECTED: '请连接钱包以继续操作',
  INSUFFICIENT_FUNDS: '余额不足，请确保钱包中有足够的 ETH',
  TRANSACTION_FAILED: '交易失败，请重试',
  NETWORK_ERROR: '网络连接错误，请检查网络设置',
  CANVAS_SYNC_ERROR: '画布同步失败，请刷新页面',
  COLOR_NOT_OWNED: '您没有拥有此颜色，请先购买',
  INVALID_INPUT: '输入信息有误，请检查后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
} as const;

// Parse Web3 errors into user-friendly format
export function parseWeb3Error(error: unknown): Web3Error {
  const timestamp = new Date();
  
  if (error instanceof UserRejectedRequestError) {
    return {
      code: 'WALLET_NOT_CONNECTED',
      message: '用户取消了钱包操作',
      timestamp,
    };
  }
  
  if (error instanceof ContractFunctionRevertedError) {
    const revertReason = error.data?.errorName || error.shortMessage;
    
    // Parse common revert reasons
    if (revertReason?.includes('insufficient')) {
      return {
        code: 'INSUFFICIENT_FUNDS',
        message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
        details: revertReason,
        timestamp,
      };
    }
    
    if (revertReason?.includes('not owner') || revertReason?.includes('unauthorized')) {
      return {
        code: 'COLOR_NOT_OWNED',
        message: ERROR_MESSAGES.COLOR_NOT_OWNED,
        details: revertReason,
        timestamp,
      };
    }
    
    return {
      code: 'TRANSACTION_FAILED',
      message: ERROR_MESSAGES.TRANSACTION_FAILED,
      details: revertReason,
      timestamp,
    };
  }
  
  if (error instanceof BaseError) {
    const errorName = error.name;
    const errorCode = WEB3_ERROR_CODES[errorName] || 'TRANSACTION_FAILED';
    
    return {
      code: errorCode,
      message: ERROR_MESSAGES[errorCode],
      details: error.shortMessage || error.message,
      timestamp,
    };
  }
  
  // Generic error handling
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    code: 'TRANSACTION_FAILED',
    message: ERROR_MESSAGES.TRANSACTION_FAILED,
    details: errorMessage,
    timestamp,
  };
}

// Check if error is retryable
export function isRetryableError(error: Web3Error): boolean {
  const retryableCodes: ErrorCode[] = [
    'NETWORK_ERROR',
    'SERVER_ERROR',
    'TRANSACTION_FAILED',
  ];
  
  return retryableCodes.includes(error.code as ErrorCode);
}

// Get error severity level
export function getErrorSeverity(error: Web3Error): 'low' | 'medium' | 'high' {
  switch (error.code) {
    case 'WALLET_NOT_CONNECTED':
    case 'INVALID_INPUT':
      return 'low';
    
    case 'INSUFFICIENT_FUNDS':
    case 'COLOR_NOT_OWNED':
    case 'NETWORK_ERROR':
      return 'medium';
    
    case 'TRANSACTION_FAILED':
    case 'SERVER_ERROR':
    case 'CANVAS_SYNC_ERROR':
      return 'high';
    
    default:
      return 'medium';
  }
}

// Format error for user display
export function formatErrorForUser(error: Web3Error): {
  title: string;
  message: string;
  action?: string;
} {
  switch (error.code) {
    case 'WALLET_NOT_CONNECTED':
      return {
        title: '钱包未连接',
        message: error.message,
        action: '连接钱包',
      };
    
    case 'INSUFFICIENT_FUNDS':
      return {
        title: '余额不足',
        message: error.message,
        action: '充值 ETH',
      };
    
    case 'NETWORK_ERROR':
      return {
        title: '网络错误',
        message: error.message,
        action: '重试',
      };
    
    case 'COLOR_NOT_OWNED':
      return {
        title: '颜色权限不足',
        message: error.message,
        action: '购买颜色',
      };
    
    default:
      return {
        title: '操作失败',
        message: error.message,
        action: '重试',
      };
  }
}