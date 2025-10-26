'use client';

import React from 'react';

interface RevenueButtonProps {
  canvasId: number;
  mode: 'send' | 'claim' | 'status';
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function RevenueButton({ 
  canvasId, 
  mode, 
  className = '', 
  children,
  variant = 'primary',
  size = 'md'
}: RevenueButtonProps) {
  
  const handleClick = () => {
    const event = new CustomEvent('openRevenueModal', { 
      detail: { canvasId, mode } 
    });
    window.dispatchEvent(event);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const getDefaultContent = () => {
    switch (mode) {
      case 'send':
        return '💰 发送收益';
      case 'claim':
        return '💎 领取收益';
      case 'status':
        return '📊 查看状态';
      default:
        return '收益管理';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-md font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children || getDefaultContent()}
    </button>
  );
}

// Preset buttons for common use cases
export function SendRevenueButton({ canvasId, className, children }: { canvasId: number; className?: string; children?: React.ReactNode }) {
  return (
    <RevenueButton 
      canvasId={canvasId} 
      mode="send" 
      variant="primary" 
      className={className}
    >
      {children}
    </RevenueButton>
  );
}

export function ClaimRevenueButton({ canvasId, className, children }: { canvasId: number; className?: string; children?: React.ReactNode }) {
  return (
    <RevenueButton 
      canvasId={canvasId} 
      mode="claim" 
      variant="success" 
      className={className}
    >
      {children}
    </RevenueButton>
  );
}

export function RevenueStatusButton({ canvasId, className, children }: { canvasId: number; className?: string; children?: React.ReactNode }) {
  return (
    <RevenueButton 
      canvasId={canvasId} 
      mode="status" 
      variant="outline" 
      className={className}
    >
      {children}
    </RevenueButton>
  );
}