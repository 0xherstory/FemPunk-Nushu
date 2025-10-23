'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ParticipatedArtwork } from '../../lib/hooks/useContributionStats';
import { formatEther } from 'viem';

interface ParticipatedArtworksProps {
  artworks: ParticipatedArtwork[];
  onArtworkClick?: (artwork: ParticipatedArtwork) => void;
  isLoading?: boolean;
}

interface ArtworkCardProps {
  artwork: ParticipatedArtwork;
  onClick?: () => void;
}

function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Artwork Preview */}
        <div className="relative mb-3">
          <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200">
            {artwork.canvasPreview && !imageError ? (
              <img 
                src={artwork.canvasPreview} 
                alt={artwork.title}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-purple-500">协作作品</span>
              </div>
            )}
          </div>
          
          {/* Settlement Status Badge */}
          <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
            artwork.isSettled 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {artwork.isSettled ? '已结算' : '待结算'}
          </div>
        </div>

        {/* Artwork Details */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {artwork.title}
          </h4>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>NFT #{artwork.tokenId}</span>
            <span>{artwork.mintedAt.toLocaleDateString('zh-CN')}</span>
          </div>
          
          {/* Contribution Stats */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">我的贡献</span>
              <span className="font-medium text-purple-600">{artwork.contribution}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${artwork.contribution}%` }}
              />
            </div>
          </div>
          
          {/* Earnings */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">我的收益</span>
            <span className="font-medium text-green-600">
              {formatEther(artwork.userEarnings)} ETH
            </span>
          </div>
          
          {/* Settlement Info */}
          {!artwork.isSettled && artwork.settlementDeadline && (
            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              结算截止: {artwork.settlementDeadline.toLocaleDateString('zh-CN')}
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              查看详情
            </Button>
            {!artwork.isSettled && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle settlement claim
                }}
              >
                申请结算
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        暂无参与作品
      </h3>
      <p className="text-gray-500 mb-4">
        您还没有参与任何协作作品，去画布开始创作吧！
      </p>
      <Button variant="default">
        开始创作
      </Button>
    </div>
  );
}

export function ParticipatedArtworks({ artworks, onArtworkClick, isLoading }: ParticipatedArtworksProps) {
  const [filter, setFilter] = useState<'all' | 'settled' | 'pending'>('all');
  
  const filteredArtworks = artworks.filter(artwork => {
    if (filter === 'settled') return artwork.isSettled;
    if (filter === 'pending') return !artwork.isSettled;
    return true;
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (artworks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            参与的作品
          </h3>
          <p className="text-sm text-gray-500">
            共参与 {artworks.length} 个协作作品
          </p>
        </div>
        
        {/* Filter Options */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待结算' },
              { key: 'settled', label: '已结算' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  filter === option.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{artworks.length}</div>
            <div className="text-sm text-gray-500">总作品数</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {artworks.filter(a => !a.isSettled).length}
            </div>
            <div className="text-sm text-gray-500">待结算</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatEther(
                artworks.reduce((sum, artwork) => sum + artwork.userEarnings, 0n)
              )}
            </div>
            <div className="text-sm text-gray-500">总收益 (ETH)</div>
          </CardContent>
        </Card>
      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.tokenId}
              artwork={artwork}
              onClick={() => onArtworkClick?.(artwork)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === 'settled' && '暂无已结算作品'}
            {filter === 'pending' && '暂无待结算作品'}
          </p>
        </div>
      )}
    </div>
  );
}