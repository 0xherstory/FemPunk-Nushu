'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-primary-500',
  white: 'text-white',
  gray: 'text-gray-400',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  return (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  spinnerSize = 'lg',
  message = '加载中...',
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size={spinnerSize} />
            {message && (
              <p className="text-sm text-gray-600 font-medium">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline loading component
interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function InlineLoading({ 
  size = 'md', 
  message = '加载中...', 
  className 
}: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LoadingSpinner size={size} />
      {message && (
        <span className="text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
}

// Full page loading component
interface FullPageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

export function FullPageLoading({ 
  message = '正在加载 FemPunk NüShu...', 
  showLogo = true 
}: FullPageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              FemPunk NüShu
            </h1>
            <p className="text-gray-600">Web3 协作绘画平台</p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Button loading state
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = '处理中...',
  disabled,
  className,
  onClick,
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
        'bg-primary-500 hover:bg-primary-600 text-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      {isLoading ? loadingText : children}
    </button>
  );
}