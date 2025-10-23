'use client';

import { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SimpleColorPaletteProps {
  userAddress?: string;
  isConnected: boolean;
  onConnectWallet: () => void;
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
  className?: string;
}

// Demo colors that are always available
const DEMO_COLORS = [
  '#FF6B9D', // 女书红
  '#FFD700', // 女书金
  '#2D3748', // 墨色
  '#000000', // 黑色
  '#FF0000', // 红色
  '#00FF00', // 绿色
  '#0000FF', // 蓝色
  '#FFFF00', // 黄色
  '#FF00FF', // 紫色
  '#00FFFF', // 青色
  '#FFA500', // 橙色
  '#800080', // 紫色
];

export function SimpleColorPalette({ 
  userAddress, 
  isConnected, 
  onConnectWallet, 
  onColorSelect,
  selectedColor,
  className 
}: SimpleColorPaletteProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleColorClick = useCallback((color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  }, [onColorSelect]);

  if (!isConnected) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">我的颜色</h3>
        
        <div className="text-center py-6">
          <div className="mb-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
            </svg>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            连接钱包获取您的颜色 NFT
          </p>
          
          <Button 
            onClick={onConnectWallet}
            variant="default"
            size="sm"
            className="mb-4"
          >
            连接钱包
          </Button>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">体验颜色:</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_COLORS.slice(0, 6).map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className={`w-full h-8 rounded border-2 transition-all ${
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
              演示模式 - 连接钱包解锁更多
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Connected user - show demo colors as owned colors
  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">我的颜色</h3>
        <span className="text-sm text-gray-500">
          {DEMO_COLORS.length} 个颜色
        </span>
      </div>

      <div className="space-y-4">
        {/* Owned Colors Grid */}
        <div>
          <p className="text-sm text-gray-600 mb-2">拥有的颜色:</p>
          <div className="grid grid-cols-4 gap-2">
            {DEMO_COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(color)}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`relative w-full h-10 rounded border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-purple-500 scale-105 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-102'
                }`}
                style={{ backgroundColor: color }}
                title={`颜色 NFT #${index + 1}`}
              >
                {selectedColor === color && (
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
          <div className="bg-gray-50 p-3 rounded">
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
        <div className="border-t pt-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.location.href = '/buy';
              }}
              className="flex-1 text-xs"
            >
              购买更多
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                window.location.href = '/collection';
              }}
              className="flex-1 text-xs"
            >
              查看藏品
            </Button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <p className="text-xs text-blue-700">
            🎨 演示模式：显示模拟颜色 NFT
          </p>
        </div>
      </div>
    </Card>
  );
}