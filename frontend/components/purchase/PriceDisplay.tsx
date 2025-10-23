'use client';

import React from 'react';
import { formatEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useCurrentColorPrice } from '../../lib/hooks/useColorNFTs';

interface PriceDisplayProps {
  className?: string;
}

export function PriceDisplay({ className }: PriceDisplayProps) {
  const { currentPrice, isLoading, error } = useCurrentColorPrice();

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>价格加载失败</p>
            <p className="text-sm text-gray-500 mt-1">请刷新页面重试</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">今日颜色价格</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Current Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
              ) : (
                `${formatEther(currentPrice as bigint)} ETH`
              )}
            </div>
            <p className="text-sm text-gray-600">
              每个颜色 NFT 的当前价格
            </p>
          </div>

          {/* Price Info */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">基础价格:</span>
              <span className="font-medium">0.01 ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">每日涨幅:</span>
              <span className="font-medium text-orange-600">+0.001 ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">价格上限:</span>
              <span className="font-medium">0.1 ETH</span>
            </div>
          </div>

          {/* Price Trend Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-orange-600 font-medium">价格每日递增</span>
          </div>

          {/* Purchase Tip */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            💡 提示：颜色价格每天上涨，早购买更优惠！购买后即可在画布中使用该颜色进行创作。
          </div>
        </div>
      </CardContent>
    </Card>
  );
}