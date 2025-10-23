'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArtworkCard } from './ArtworkCard';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '@/types';

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onPurchase?: (artwork: Artwork) => void;
  onView?: (artwork: Artwork) => void;
  className?: string;
}

export function ArtworkGrid({
  artworks,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onPurchase,
  onView,
  className,
}: ArtworkGridProps) {
  const [displayedArtworks, setDisplayedArtworks] = useState<Artwork[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Update displayed artworks when artworks prop changes
  useEffect(() => {
    setDisplayedArtworks(artworks);
  }, [artworks]);

  // Handle load more with loading state
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !onLoadMore) return;
    
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, onLoadMore]);

  // Infinite scroll detection
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= docHeight - 1000) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, onLoadMore, handleLoadMore]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🎨</div>
      <h3 className="text-heading-lg font-semibold text-nushu-ink mb-2">
        暂无作品
      </h3>
      <p className="text-body-base text-gray-500 mb-6">
        成为第一个创作者，开启女书艺术新篇章
      </p>
      <Button
        variant="nushu"
        onClick={() => window.location.href = '/canvas'}
      >
        开始创作
      </Button>
    </div>
  );

  if (isLoading && displayedArtworks.length === 0) {
    return <LoadingSkeleton />;
  }

  if (displayedArtworks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={className}>
      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {displayedArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <ArtworkCard
                artwork={artwork}
                onPurchase={onPurchase}
                onView={onView}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load more section */}
      {(hasMore || isLoadingMore) && (
        <div className="flex justify-center mt-12">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              <span>加载更多作品...</span>
            </div>
          ) : hasMore ? (
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="px-8"
            >
              加载更多作品
            </Button>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-body-sm">已显示全部作品</div>
            </div>
          )}
        </div>
      )}

      {/* Stats footer */}
      {displayedArtworks.length > 0 && (
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-xl px-8 py-4 shadow-md">
            <div className="text-center">
              <div className="text-heading-md font-bold text-nushu-ink">
                {displayedArtworks.length}
              </div>
              <div className="text-body-sm text-gray-500">作品总数</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-heading-md font-bold text-nushu-ink">
                {displayedArtworks.reduce((acc, artwork) => acc + artwork.contributors.length, 0)}
              </div>
              <div className="text-body-sm text-gray-500">参与创作者</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-heading-md font-bold text-nushu-ink">
                {new Set(displayedArtworks.map(artwork => artwork.dailyTheme?.id).filter(Boolean)).size}
              </div>
              <div className="text-body-sm text-gray-500">女书主题</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}