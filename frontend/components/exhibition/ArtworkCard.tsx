'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import type { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  onPurchase?: (artwork: Artwork) => void;
  onView?: (artwork: Artwork) => void;
  className?: string;
}

export function ArtworkCard({ artwork, onPurchase, onView, className }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPurchase?.(artwork);
  };

  const handleCardClick = () => {
    onView?.(artwork);
  };

  const formatPrice = (price: bigint) => {
    try {
      return `${parseFloat(formatEther(price)).toFixed(3)} ETH`;
    } catch {
      return '价格待定';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card
        className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Artwork Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {artwork.canvasData ? (
            <Image
              src={artwork.canvasData}
              alt={artwork.title}
              fill
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-body-sm">作品预览</div>
              </div>
            </div>
          )}
          
          {/* Overlay with gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Contributors count overlay */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-body-sm font-medium text-nushu-ink">
              {artwork.contributors.length} 位创作者
            </div>
          </div>

          {/* Daily theme badge */}
          {artwork.dailyTheme && (
            <div className="absolute top-3 left-3">
              <div className="bg-nushu-red/90 backdrop-blur-sm rounded-full px-3 py-1 text-body-sm font-medium text-white">
                {artwork.dailyTheme.nushuCharacter.character}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="text-heading-md font-semibold text-nushu-ink line-clamp-1">
              {artwork.title}
            </h3>
            
            {artwork.dailyTheme && (
              <p className="text-body-sm text-gray-600 line-clamp-1">
                主题: {artwork.dailyTheme.title}
              </p>
            )}
            
            <div className="flex items-center justify-between text-body-sm text-gray-500">
              <span>{formatDate(artwork.createdAt)}</span>
              {artwork.mintedAt && (
                <span className="bg-success-500/10 text-success-500 px-2 py-1 rounded-full text-caption font-medium">
                  已铸造
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            {artwork.price ? (
              <>
                <span className="text-heading-md font-bold text-nushu-ink">
                  {formatPrice(artwork.price)}
                </span>
                <span className="text-caption text-gray-500">当前价格</span>
              </>
            ) : (
              <span className="text-body-base text-gray-500">价格待定</span>
            )}
          </div>
          
          <Button
            variant="nushu"
            size="sm"
            onClick={handlePurchaseClick}
            className="min-w-[80px] shadow-md hover:shadow-lg transition-all duration-200"
            disabled={!artwork.price}
          >
            {artwork.price ? '购买' : '敬请期待'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}