'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatEther } from 'viem';
import type { Artwork } from '@/types';

interface ArtworkDetailsModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (artwork: Artwork) => void;
  isLoading?: boolean;
}

export function ArtworkDetailsModal({
  artwork,
  isOpen,
  onClose,
  onPurchase,
  isLoading = false,
}: ArtworkDetailsModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!artwork) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handlePurchase = () => {
    onPurchase?.(artwork);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-heading-xl font-bold text-nushu-ink">
                  作品详情
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left side - Artwork image */}
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {artwork.canvasData ? (
                      <Image
                        src={artwork.canvasData}
                        alt={artwork.title}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-6xl mb-4">🎨</div>
                          <div className="text-body-base">作品预览</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Status badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {artwork.dailyTheme && (
                        <div className="bg-nushu-red/90 backdrop-blur-sm rounded-full px-3 py-1 text-body-sm font-medium text-white">
                          {artwork.dailyTheme.nushuCharacter.character}
                        </div>
                      )}
                      {artwork.mintedAt && (
                        <div className="bg-success-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-body-sm font-medium text-white">
                          已铸造
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Daily theme info */}
                  {artwork.dailyTheme && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{artwork.dailyTheme.nushuCharacter.character}</span>
                          <span>每日主题</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">主题:</span> {artwork.dailyTheme.title}
                          </div>
                          <div>
                            <span className="font-medium">含义:</span> {artwork.dailyTheme.nushuCharacter.meaning}
                          </div>
                          <div>
                            <span className="font-medium">读音:</span> {artwork.dailyTheme.nushuCharacter.pronunciation}
                          </div>
                          <p className="text-body-sm text-gray-600 mt-3">
                            {artwork.dailyTheme.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right side - Artwork details */}
                <div className="space-y-6">
                  {/* Basic info */}
                  <div>
                    <h1 className="text-heading-xl font-bold text-nushu-ink mb-2">
                      {artwork.title}
                    </h1>
                    <div className="flex items-center gap-4 text-body-sm text-gray-500">
                      <span>创作于 {formatDate(artwork.createdAt)}</span>
                      {artwork.mintedAt && (
                        <span>铸造于 {formatDate(artwork.mintedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Price and purchase */}
                  {artwork.price && (
                    <Card className="border-primary-200 bg-primary-50/30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-heading-xl font-bold text-nushu-ink">
                              {formatPrice(artwork.price)}
                            </div>
                            <div className="text-body-sm text-gray-500">当前价格</div>
                          </div>
                          <Button
                            variant="nushu"
                            size="lg"
                            onClick={handlePurchase}
                            loading={isLoading}
                            className="px-8"
                          >
                            立即购买
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle>协作创作者 ({artwork.contributors.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {artwork.contributors.map((contributor, index) => (
                          <div key={contributor.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-body-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-nushu-ink">
                                  {contributor.address.slice(0, 6)}...{contributor.address.slice(-4)}
                                </div>
                                <div className="text-body-sm text-gray-500">
                                  贡献度: {contributor.contribution.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-body-sm text-gray-500">
                              <div>{contributor.strokeCount} 笔画</div>
                              <div>{Math.round(contributor.timeSpent / 60)} 分钟</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>技术信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-body-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">作品 ID:</span>
                          <span className="font-mono">{artwork.id}</span>
                        </div>
                        {artwork.nftTokenId && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">NFT Token ID:</span>
                            <span className="font-mono">#{artwork.nftTokenId}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">协作创作者:</span>
                          <span>{artwork.contributors.length} 人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">总笔画数:</span>
                          <span>{artwork.contributors.reduce((acc, c) => acc + c.strokeCount, 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}