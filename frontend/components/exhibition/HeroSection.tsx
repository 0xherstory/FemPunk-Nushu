'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import type { Artwork } from '@/types';

interface HeroSectionProps {
  featuredArtwork?: Artwork | null;
}

export function HeroSection({ featuredArtwork }: HeroSectionProps) {
  const router = useRouter();

  const handleEnterCanvas = () => {
    router.push('/canvas');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-nushu-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-nushu-gold rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-display-xl text-gradient-nushu mb-6 font-bold">
              FemPunk NüShu
            </h1>
            <p className="text-heading-lg text-gray-600 mb-8 max-w-2xl">
              基于区块链技术的女书文化传承协作绘画平台
            </p>
            <p className="text-body-lg text-gray-500 mb-12 max-w-xl">
              与全球艺术家共同创作，用数字艺术传承千年女书文化，每一笔都是历史的见证
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="nushu"
                size="lg"
                onClick={handleEnterCanvas}
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                进入创作
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('artworks')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="text-lg px-8 py-4"
              >
                浏览作品
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-heading-lg font-bold text-nushu-ink">1,234</div>
                <div className="text-body-sm text-gray-500">创作者</div>
              </div>
              <div className="text-center">
                <div className="text-heading-lg font-bold text-nushu-ink">567</div>
                <div className="text-body-sm text-gray-500">作品</div>
              </div>
              <div className="text-center">
                <div className="text-heading-lg font-bold text-nushu-ink">89</div>
                <div className="text-body-sm text-gray-500">女书字</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Featured artwork */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {featuredArtwork ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nushu-red to-nushu-gold rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🎨</div>
                      <div className="text-body-sm">精选作品</div>
                    </div>
                  </div>
                  <h3 className="text-heading-md font-semibold mb-2">{featuredArtwork.title}</h3>
                  <p className="text-body-sm text-gray-500">
                    {featuredArtwork.contributors.length} 位艺术家协作完成
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nushu-red to-nushu-gold rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">女</div>
                      <div className="text-heading-md text-nushu-ink font-semibold">女书传承</div>
                      <div className="text-body-base text-gray-500 mt-2">数字艺术新篇章</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}