'use client';

import React, { useState } from 'react';
import { formatEther } from 'viem';
import { Button } from '../ui/Button';
import { useWallet } from '../../lib/context/WalletContext';
import { usePurchaseColor } from '../../lib/hooks/useContractWrites';
import { useCurrentColorPrice } from '../../lib/hooks/useColorNFTs';
import { getColorById } from '../../lib/constants/colors';

interface PurchaseButtonProps {
  selectedColors: string[];
  onPurchaseSuccess?: () => void;
  onPurchaseError?: (error: string) => void;
  className?: string;
}

export function PurchaseButton({ 
  selectedColors, 
  onPurchaseSuccess, 
  onPurchaseError,
  className 
}: PurchaseButtonProps) {
  const { isConnected, connect } = useWallet();
  const { currentPrice } = useCurrentColorPrice();
  const { purchaseColor, isPending, isConfirming, isSuccess, error } = usePurchaseColor();
  const [purchasingIndex, setPurchasingIndex] = useState<number>(-1);

  const totalPrice = (currentPrice as bigint) * BigInt(selectedColors.length);
  const isDisabled = selectedColors.length === 0 || isPending || isConfirming;

  const handlePurchase = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (selectedColors.length === 0) return;

    try {
      // For now, we'll purchase colors one by one
      // In a real implementation, you might want to batch this
      for (let i = 0; i < selectedColors.length; i++) {
        setPurchasingIndex(i);
        const colorId = selectedColors[i];
        
        // Get color hex from the color palette
        // This should match the ColorGrid component's COLOR_PALETTE
        const colorHex = getColorHexById(colorId);
        
        if (colorHex) {
          await purchaseColor(colorHex, formatEther(currentPrice as bigint));
        }
      }
      
      setPurchasingIndex(-1);
      onPurchaseSuccess?.();
    } catch (err) {
      setPurchasingIndex(-1);
      const errorMessage = err instanceof Error ? err.message : '购买失败，请重试';
      onPurchaseError?.(errorMessage);
    }
  };

  // Helper function to get color hex by ID using shared constants
  const getColorHexById = (colorId: string): string | null => {
    const color = getColorById(colorId);
    return color ? color.hex : null;
  };

  const getPurchaseButtonText = () => {
    if (!isConnected) {
      return '连接钱包购买';
    }
    
    if (selectedColors.length === 0) {
      return '请选择颜色';
    }
    
    if (isPending || isConfirming) {
      if (purchasingIndex >= 0) {
        return `购买中 (${purchasingIndex + 1}/${selectedColors.length})`;
      }
      return '购买中...';
    }
    
    return `购买 ${selectedColors.length} 种颜色`;
  };

  return (
    <div className={className}>
      {/* Purchase Summary */}
      {selectedColors.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">选择颜色数量:</span>
            <span className="font-medium">{selectedColors.length} 种</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">单价:</span>
            <span className="font-medium">{formatEther(currentPrice as bigint)} ETH</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold border-t border-purple-200 pt-2">
            <span>总计:</span>
            <span className="text-primary-500">{formatEther(totalPrice)} ETH</span>
          </div>
        </div>
      )}

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={isDisabled}
        loading={isPending || isConfirming}
        variant="nushu"
        size="lg"
        className="w-full"
      >
        {getPurchaseButtonText()}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">购买失败</p>
              <p className="text-sm text-red-600 mt-1">
                {error.message || '请检查网络连接和钱包余额后重试'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">购买成功！</p>
              <p className="text-sm text-green-600 mt-1">
                颜色 NFT 已添加到您的钱包，现在可以在画布中使用了
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Tips */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>💡 购买后的颜色 NFT 将立即可用于画布创作</p>
        <p>🎨 参与协作绘画可获得作品收益分成</p>
        <p>⚡ 交易确认通常需要 1-2 分钟</p>
      </div>
    </div>
  );
}