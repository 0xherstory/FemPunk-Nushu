'use client';

import { useState, useCallback } from 'react';
import { useUserColors } from '../../lib/hooks/useColorNFTs';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ColorPaletteProps {
  userAddress?: string;
  isConnected: boolean;
  onConnectWallet: () => void;
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
  className?: string;
}

// Predefined color palette - these would come from the smart contract
const DEFAULT_COLORS = [
  '#FF6B9D', // 女书红
  '#FFD700', // 女书金
  '#2D3748', // 墨色
  '#000000', // 黑色
  '#FFFFFF', // 白色
  '#FF0000', // 红色
  '#00FF00', // 绿色
  '#0000FF', // 蓝色
  '#FFFF00', // 黄色
  '#FF00FF', // 紫色
  '#00FFFF', // 青色
  '#FFA500', // 橙色
];

export function ColorPalette({ 
  userAddress, 
  isConnected, 
  onConnectWallet, 
  onColorSelect,
  selectedColor,
  className 
}: ColorPaletteProps) {
  const { userColors, isLoading } = useUserColors();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleColorClick = useCallback((color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  }, [onColorSelect]);

  const isColorOwned = useCallback((color: string) => {
    if (!userColors.length) return false;
    return userColors.some(ownedColor => 
      ownedColor.colorHex.toLowerCase() === color.toLowerCase()
    );
  }, [userColors]);

  const getRandomColors = () => {
    // Return 3 random colors for non-connected users
    return DEFAULT_COLORS.slice(0, 3);
  };

  if (!isConnected) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">我的颜色</h3>
        
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
            </svg>
          </div>
          
          <p className="text-gray-600 mb-4">
            连接钱包获取随机颜色
          </p>
          
          <Button 
            onClick={onConnectWallet}
            variant="default"
            className="mb-4"
          >
            连接钱包
          </Button>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">体验颜色:</p>
            <div className="grid grid-cols-3 gap-2">
              {getRandomColors().map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-purple-500 scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`体验颜色 ${index + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              体验模式，连接钱包解锁更多颜色
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">我的颜色</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">我的颜色</h3>
        <span className="text-sm text-gray-500">
          {userColors.length} 个颜色
        </span>
      </div>

      {userColors.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            您还没有颜色 NFT
          </p>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              // Navigate to purchase page - will be implemented in subtask 6
              window.location.href = '/buy';
            }}
          >
            购买颜色
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Owned Colors Grid */}
          <div>
            <p className="text-sm text-gray-600 mb-2">拥有的颜色:</p>
            <div className="grid grid-cols-4 gap-2">
              {userColors.map((colorNFT) => (
                <button
                  key={colorNFT.id}
                  onClick={() => handleColorClick(colorNFT.colorHex)}
                  onMouseEnter={() => setHoveredColor(colorNFT.colorHex)}
                  onMouseLeave={() => setHoveredColor(null)}
                  className={`relative w-full h-12 rounded-lg border-2 transition-all ${
                    selectedColor === colorNFT.colorHex 
                      ? 'border-purple-500 scale-105 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400 hover:scale-102'
                  }`}
                  style={{ backgroundColor: colorNFT.colorHex }}
                  title={`颜色 NFT #${colorNFT.tokenId}`}
                >
                  {selectedColor === colorNFT.colorHex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Info */}
          {hoveredColor && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: hoveredColor }}
                />
                <span className="text-sm font-medium">{hoveredColor}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                点击选择此颜色进行绘画
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.location.href = '/buy';
                }}
                className="flex-1"
              >
                购买更多
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  window.location.href = '/collection';
                }}
                className="flex-1"
              >
                查看藏品
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}