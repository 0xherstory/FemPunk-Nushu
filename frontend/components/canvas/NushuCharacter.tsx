'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';

interface NushuCharacterProps {
  character: {
    character: string;
    meaning: string;
    pronunciation: string;
  };
}

export function NushuCharacter({ character }: NushuCharacterProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">女书字</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-2 p-1 rounded-full hover:bg-amber-100 transition-colors"
            title={showDetails ? "隐藏详情" : "显示详情"}
          >
            <svg 
              className={`w-4 h-4 text-amber-600 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Nushu Character Display */}
        <div className="mb-4">
          <div className="relative inline-block">
            {/* Character */}
            <div className="text-6xl font-serif text-amber-800 mb-2 select-none">
              {character.character}
            </div>
            
            {/* Decorative border */}
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30 pointer-events-none"></div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <div className="text-lg font-medium text-gray-800">
            {character.meaning}
          </div>
          <div className="text-sm text-gray-600">
            读音: {character.pronunciation}
          </div>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-amber-200 space-y-3 text-left">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">关于女书</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                女书是世界上唯一的女性专用文字，主要流传于湖南省江永县。
                它是女性之间传递情感、记录生活的独特文字系统。
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">字形特点</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                女书字形秀丽，笔画流畅，多为斜体，具有独特的美学价值。
                每个字都承载着深厚的文化内涵和女性智慧。
              </p>
            </div>

            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                文化传承
              </div>
            </div>
          </div>
        )}

        {/* Interactive Elements */}
        <div className="mt-4 pt-4 border-t border-amber-200">
          <div className="flex justify-center space-x-2">
            <button 
              className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors"
              onClick={() => {
                // Copy character to clipboard
                navigator.clipboard.writeText(character.character);
              }}
            >
              复制字符
            </button>
            <button 
              className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors"
              onClick={() => {
                // Share character info
                if (navigator.share) {
                  navigator.share({
                    title: `女书字: ${character.meaning}`,
                    text: `${character.character} - ${character.meaning} (${character.pronunciation})`,
                  });
                }
              }}
            >
              分享
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}