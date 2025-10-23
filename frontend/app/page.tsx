'use client';

import React from 'react';
import { NavigationBar } from '../components/navigation/NavigationBar';
import { HeroSection } from '../components/exhibition/HeroSection';
import { ArtworkGrid } from '../components/exhibition/ArtworkGrid';
import { useExhibitionData } from '../lib/hooks/useExhibitionData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { artworks, featuredArtwork, isLoading, error, loadMore, hasMore } = useExhibitionData({
    pageSize: 8,
    autoLoad: true
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">加载失败</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <main>
        {/* Hero Section */}
        <HeroSection featuredArtwork={featuredArtwork} />
        
        {/* Exhibition Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              女书协作艺术展览
            </h2>
            <p className="text-gray-600 max-w-2xl">
              探索由全球艺术家共同创作的女书主题数字艺术作品。每一幅作品都承载着独特的文化传承和现代创新的融合。
            </p>
          </div>

          <ArtworkGrid
            artworks={artworks}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={hasMore ? loadMore : undefined}
          />

          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                关于女书 Web3 协作绘画平台
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">女书文化传承</h3>
                  <p className="text-gray-600 leading-relaxed">
                    女书是世界上唯一的女性文字，起源于中国湖南江永县。这种独特的文字系统承载着女性的智慧、情感和文化传承，是人类文明的珍贵遗产。
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Web3 协作创新</h3>
                  <p className="text-gray-600 leading-relaxed">
                    通过区块链技术和 NFT，我们为女书文化注入新的生命力。艺术家们可以实时协作创作，共同拥有作品版权，让传统文化在数字时代焕发新的光彩。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}