'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useWallet } from '../../lib/context/WalletContext';
import { useRedeemColor } from '../../lib/hooks/useContractWrites';

interface RedemptionCodeInputProps {
  onRedemptionSuccess?: (colorHex: string) => void;
  onRedemptionError?: (error: string) => void;
  className?: string;
}

export function RedemptionCodeInput({ 
  onRedemptionSuccess, 
  onRedemptionError,
  className 
}: RedemptionCodeInputProps) {
  const [redemptionCode, setRedemptionCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { isConnected, connect } = useWallet();
  const { redeemColor, isPending, isConfirming, isSuccess, error } = useRedeemColor();

  const handleRedemption = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!redemptionCode.trim()) {
      onRedemptionError?.('请输入兑换码');
      return;
    }

    // Basic validation for redemption code format
    const codePattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!codePattern.test(redemptionCode.trim().toUpperCase())) {
      onRedemptionError?.('兑换码格式不正确，请检查后重试');
      return;
    }

    try {
      setIsValidating(true);
      
      // First validate the code with backend API
      const validationResponse = await validateRedemptionCode(redemptionCode.trim());
      
      if (!validationResponse.valid) {
        throw new Error(validationResponse.error || '兑换码无效');
      }

      // If validation passes, proceed with blockchain redemption
      await redeemColor(redemptionCode.trim().toUpperCase());
      
      // Clear the input on success
      setRedemptionCode('');
      onRedemptionSuccess?.(validationResponse.colorHex || '');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '兑换失败，请重试';
      onRedemptionError?.(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Auto-format the input with dashes
    let formatted = value.replace(/-/g, '');
    if (formatted.length > 8) {
      formatted = formatted.slice(0, 8) + '-' + formatted.slice(8);
    }
    if (formatted.length > 13) {
      formatted = formatted.slice(0, 13) + '-' + formatted.slice(13, 17);
    }
    
    setRedemptionCode(formatted);
  };

  const isLoading = isPending || isConfirming || isValidating;
  const isDisabled = !redemptionCode.trim() || isLoading;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7 5.955c-.003-.996-.01-1.991-.023-2.985a2 2 0 01-1.977-2.015c0-.114.009-.227.023-.34A6 6 0 0115 7z" />
          </svg>
          <span>兑换码兑换</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Field */}
        <div className="space-y-2">
          <label htmlFor="redemption-code" className="block text-sm font-medium text-gray-700">
            输入兑换码
          </label>
          <input
            id="redemption-code"
            type="text"
            value={redemptionCode}
            onChange={handleInputChange}
            placeholder="XXXXXXXX-XXXX-XXXX"
            maxLength={17}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-center tracking-wider"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            格式：8位字母数字-4位字母数字-4位字母数字
          </p>
        </div>

        {/* Redemption Button */}
        <Button
          onClick={handleRedemption}
          disabled={isDisabled}
          loading={isLoading}
          variant="outline"
          size="lg"
          className="w-full"
        >
          {!isConnected ? '连接钱包兑换' : isLoading ? '兑换中...' : '兑换颜色'}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">兑换失败</p>
                <p className="text-sm text-red-600 mt-1">
                  {error.message || '请检查兑换码是否正确'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">兑换成功！</p>
                <p className="text-sm text-green-600 mt-1">
                  颜色 NFT 已添加到您的钱包
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-blue-800">关于兑换码</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 兑换码可通过官方活动获得</li>
            <li>• 每个兑换码只能使用一次</li>
            <li>• 兑换的颜色随机分配</li>
            <li>• 兑换码有有效期限制</li>
          </ul>
        </div>

        {/* Get Code CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">还没有兑换码？</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('/community', '_blank')}
          >
            关注公众号获取兑换码
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// API function to validate redemption code
async function validateRedemptionCode(code: string): Promise<{
  valid: boolean;
  colorHex?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/redemption/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('验证请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Redemption code validation error:', error);
    return {
      valid: false,
      error: '网络错误，请重试'
    };
  }
}