'use client';

import React from 'react';
import { formatEther } from 'viem';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'error';
  transactionHash?: string;
  error?: string;
  purchasedColors?: string[];
  totalAmount?: bigint;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
}

export function TransactionStatus({
  status,
  transactionHash,
  error,
  purchasedColors = [],
  totalAmount,
  onRetry,
  onClose,
  className
}: TransactionStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        );
      case 'confirming':
        return (
          <div className="animate-pulse">
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return '发起交易中...';
      case 'confirming':
        return '等待区块链确认...';
      case 'success':
        return '购买成功！';
      case 'error':
        return '交易失败';
      default:
        return '';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'pending':
        return '正在准备交易，请在钱包中确认';
      case 'confirming':
        return '交易已提交，正在等待区块链网络确认';
      case 'success':
        return `成功购买 ${purchasedColors.length} 种颜色，现在可以在画布中使用了！`;
      case 'error':
        return error || '交易失败，请重试';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'confirming':
        return 'border-orange-200 bg-orange-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className={`${getStatusColor()} ${className}`}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h3 className="text-lg font-semibold text-gray-800">
            {getStatusTitle()}
          </h3>

          {/* Status Description */}
          <p className="text-gray-600">
            {getStatusDescription()}
          </p>

          {/* Transaction Details */}
          {(status === 'confirming' || status === 'success') && transactionHash && (
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="text-sm text-gray-600">交易哈希:</div>
              <div className="font-mono text-xs break-all text-gray-800 bg-gray-100 p-2 rounded">
                {transactionHash}
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-primary-500 hover:text-primary-600"
              >
                <span>在 Etherscan 查看</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Purchase Summary for Success */}
          {status === 'success' && (
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium text-gray-800">购买详情</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">颜色数量:</span>
                <span className="font-medium">{purchasedColors.length} 种</span>
              </div>
              {totalAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">支付金额:</span>
                  <span className="font-medium">{formatEther(totalAmount)} ETH</span>
                </div>
              )}
            </div>
          )}

          {/* Progress Indicator */}
          {(status === 'pending' || status === 'confirming') && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>进度</span>
                <span>{status === 'pending' ? '1/2' : '2/2'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    status === 'pending' ? 'w-1/2 bg-blue-500' : 'w-full bg-orange-500'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={status === 'pending' ? 'font-medium' : ''}>钱包确认</span>
                <span className={status === 'confirming' ? 'font-medium' : ''}>区块链确认</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 pt-2">
            {status === 'error' && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                重试
              </Button>
            )}
            
            {status === 'success' && (
              <Button 
                onClick={() => window.location.href = '/canvas'} 
                variant="nushu" 
                size="sm"
              >
                前往画布创作
              </Button>
            )}
            
            {(status === 'success' || status === 'error') && onClose && (
              <Button onClick={onClose} variant="ghost" size="sm">
                关闭
              </Button>
            )}
          </div>

          {/* Tips */}
          {status === 'confirming' && (
            <div className="text-xs text-gray-500 bg-white rounded-lg p-2">
              💡 区块链确认通常需要 1-2 分钟，请耐心等待
            </div>
          )}

          {status === 'success' && (
            <div className="text-xs text-gray-500 bg-white rounded-lg p-2">
              🎨 您的颜色 NFT 已添加到钱包，现在可以在协作画布中使用这些颜色进行创作了！
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}