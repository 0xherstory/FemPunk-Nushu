'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useUserColors } from '../../lib/hooks/useColorNFTs';
import { COLOR_PALETTE, getColorById } from '../../lib/constants/colors';

interface ColorGridProps {
  selectedColors: string[];
  onColorSelect: (colorId: string) => void;
  maxSelection?: number;
  className?: string;
}

export function ColorGrid({ selectedColors, onColorSelect, maxSelection = 5, className }: ColorGridProps) {
  const { userColors } = useUserColors();
  
  const handleColorClick = (colorId: string) => {
    const isSelected = selectedColors.includes(colorId);
    const isOwned = userColors.some(ownedColor => 
      ownedColor.colorHex.toLowerCase() === COLOR_PALETTE.find(c => c.id === colorId)?.hex.toLowerCase()
    );
    
    // Don't allow selection of already owned colors
    if (isOwned) return;
    
    if (isSelected) {
      // Deselect color
      onColorSelect(colorId);
    } else {
      // Select color if under limit
      if (selectedColors.length < maxSelection) {
        onColorSelect(colorId);
      }
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selection Info */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          已选择 {selectedColors.length} / {maxSelection} 种颜色
        </span>
        {selectedColors.length >= maxSelection && (
          <span className="text-orange-600 font-medium">
            已达选择上限
          </span>
        )}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-8 gap-3">
        {COLOR_PALETTE.map((color) => {
          const isSelected = selectedColors.includes(color.id);
          const isOwned = userColors.some(ownedColor => 
            ownedColor.colorHex.toLowerCase() === color.hex.toLowerCase()
          );
          const canSelect = !isOwned && (isSelected || selectedColors.length < maxSelection);

          return (
            <div key={color.id} className="relative group">
              <button
                onClick={() => handleColorClick(color.id)}
                disabled={!canSelect && !isSelected}
                className={cn(
                  'w-12 h-12 rounded-lg border-2 transition-all duration-200 relative overflow-hidden',
                  'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  {
                    'border-primary-500 ring-2 ring-primary-500 ring-offset-2 scale-105': isSelected,
                    'border-gray-300 hover:border-gray-400': !isSelected && canSelect,
                    'border-green-500 opacity-60 cursor-not-allowed': isOwned,
                    'border-gray-200 opacity-40 cursor-not-allowed': !canSelect && !isSelected && !isOwned,
                  }
                )}
                style={{ backgroundColor: color.hex }}
                title={isOwned ? `已拥有 - ${color.name}` : color.name}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Owned Indicator */}
                {isOwned && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Color Name Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {color.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border-2 border-primary-500 rounded"></div>
          <span>已选择</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span>已拥有</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border border-gray-300 rounded bg-gray-100"></div>
          <span>可购买</span>
        </div>
      </div>
    </div>
  );
}