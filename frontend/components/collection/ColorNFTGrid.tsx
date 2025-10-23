'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ColorNFT } from '../../types';
import { formatEther } from 'viem';

interface ColorNFTGridProps {
  colorNFTs: ColorNFT[];
  onNFTClick?: (nft: ColorNFT) => void;
  isLoading?: boolean;
}

interface ColorNFTCardProps {
  nft: ColorNFT;
  onClick?: () => void;
}

function ColorNFTCard({ nft, onClick }: ColorNFTCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Color Preview */}
        <div className="relative mb-3">
          <div 
            className="w-full h-24 rounded-lg shadow-inner border-2 border-white"
            style={{ backgroundColor: nft.colorHex }}
          />
          
          {/* Color Hex Display */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {nft.colorHex.toUpperCase()}
          </div>
          
          {/* NFT Badge */}
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
            NFT #{nft.tokenId}
          </div>
        </div>

        {/* NFT Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Color #{nft.tokenId}
            </span>
            <span className="text-xs text-gray-500">
              {formatEther(nft.price)} ETH
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            获得时间: {nft.mintedAt.toLocaleDateString('zh-CN')}
          </div>
          
          {/* Usage Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">可用于绘画</span>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            查看详情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        暂无颜色 NFT
      </h3>
      <p className="text-gray-500 mb-4">
        您还没有拥有任何颜色 NFT，去购买一些来开始创作吧！
      </p>
      <Button variant="default">
        去购买颜色
      </Button>
    </div>
  );
}

export function ColorNFTGrid({ colorNFTs, onNFTClick, isLoading }: ColorNFTGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (colorNFTs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            我的颜色 NFT
          </h3>
          <p className="text-sm text-gray-500">
            共 {colorNFTs.length} 个颜色，可用于协作绘画
          </p>
        </div>
        
        {/* Sort/Filter Options */}
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
            <option value="newest">最新获得</option>
            <option value="oldest">最早获得</option>
            <option value="price-high">价格从高到低</option>
            <option value="price-low">价格从低到高</option>
          </select>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {colorNFTs.map((nft) => (
          <ColorNFTCard
            key={nft.id}
            nft={nft}
            onClick={() => onNFTClick?.(nft)}
          />
        ))}
      </div>
    </div>
  );
}