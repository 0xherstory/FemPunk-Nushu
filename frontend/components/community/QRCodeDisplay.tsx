'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface QRCodeDisplayProps {
  qrCodeUrl?: string;
  title?: string;
  description?: string;
}

export function QRCodeDisplay({ 
  qrCodeUrl = '/images/qr-code-placeholder.png',
  title = 'FemPunk NüShu 公众号',
  description = '扫码关注获取最新活动信息和邀请码'
}: QRCodeDisplayProps) {
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const [qrCodeError, setQrCodeError] = useState(false);

  const handleImageLoad = () => {
    setQrCodeLoaded(true);
    setQrCodeError(false);
  };

  const handleImageError = () => {
    setQrCodeError(true);
    setQrCodeLoaded(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="relative">
              {!qrCodeError ? (
                <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {qrCodeLoaded ? (
                    <Image
                      src={qrCodeUrl}
                      alt="公众号二维码"
                      width={192}
                      height={192}
                      className="w-full h-full object-contain rounded-lg"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">二维码加载中...</p>
                    </div>
                  )}
                </div>
              ) : (
                // Fallback QR Code placeholder
                <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-1">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 ${
                              Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 font-medium">FemPunk NüShu</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              {description}
            </p>
            <p className="text-sm text-gray-500">
              微信扫一扫关注公众号
            </p>
          </div>

          {/* Features */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">关注后可获得：</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>免费颜色 NFT 兑换码</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>每日主题和女书文化知识</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>社区活动和创作挑战通知</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>平台功能更新和优化通知</span>
              </li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>1. 使用微信扫描上方二维码</p>
            <p>2. 点击关注 FemPunk NüShu 公众号</p>
            <p>3. 发送&ldquo;兑换码&rdquo;获取免费颜色 NFT</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}