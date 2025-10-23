'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NavigationBar } from '../../components/navigation/NavigationBar';
import { WalletModal } from '../../components/wallet/WalletModal';
import { ColorNFTGrid } from '../../components/collection/ColorNFTGrid';
import { ParticipatedArtworks } from '../../components/collection/ParticipatedArtworks';
import { ContributionStats } from '../../components/collection/ContributionStats';
import { NFTDetailsModal } from '../../components/collection/NFTDetailsModal';
import { useUserColors } from '../../lib/hooks/useColorNFTs';
import { useContributionStats, useParticipatedArtworks } from '../../lib/hooks/useContributionStats';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { ColorNFT, ParticipatedArtwork } from '../../types';

export default function CollectionPage() {
  const { address, isConnected } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<ColorNFT | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'artworks'>('overview');

  // Data hooks
  const { userColors, isLoading: colorsLoading, error: colorsError } = useUserColors();
  const { stats, isLoading: statsLoading } = useContributionStats();
  const { artworks, isLoading: artworksLoading } = useParticipatedArtworks();

  // Check wallet connection on mount
  useEffect(() => {
    if (!isConnected) {
      setShowWalletModal(true);
    }
  }, [isConnected]);

  // Handle NFT click
  const handleNFTClick = (nft: ColorNFT) => {
    setSelectedNFT(nft);
  };

  // Handle artwork click
  const handleArtworkClick = (artwork: ParticipatedArtwork) => {
    // Could open artwork details modal or navigate to artwork page
    console.log('Artwork clicked:', artwork);
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <>
        <NavigationBar currentPage="collection" />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    连接钱包查看藏品
                  </h2>
                  <p className="text-gray-600 mb-6">
                    连接您的钱包以查看拥有的颜色 NFT 和参与的协作作品
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => setShowWalletModal(true)}
                    className="w-full"
                  >
                    连接钱包
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          trigger="collection"
        />
      </>
    );
  }

  return (
    <>
      <NavigationBar currentPage="collection" />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  我的藏品
                </h1>
                <p className="text-gray-600">
                  查看您的颜色 NFT 收藏和协作作品贡献
                </p>
              </div>
              
              {/* User Info */}
              <div className="text-right">
                <p className="text-sm text-gray-500">钱包地址</p>
                <p className="font-mono text-sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: '概览', count: null },
                  { key: 'colors', label: '颜色 NFT', count: userColors.length },
                  { key: 'artworks', label: '参与作品', count: artworks.length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.key
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Contribution Stats */}
                <ContributionStats 
                  stats={stats} 
                  isLoading={statsLoading} 
                />
                
                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>最新颜色 NFT</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveTab('colors')}
                        >
                          查看全部
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userColors.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                          {userColors.slice(0, 8).map((color) => (
                            <div
                              key={color.id}
                              className="aspect-square rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: color.colorHex }}
                              onClick={() => handleNFTClick(color)}
                              title={`${color.colorHex} - NFT #${color.tokenId}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">暂无颜色 NFT</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            去购买颜色
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Artworks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>最新参与作品</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveTab('artworks')}
                        >
                          查看全部
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {artworks.length > 0 ? (
                        <div className="space-y-3">
                          {artworks.slice(0, 3).map((artwork) => (
                            <div
                              key={artwork.tokenId}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleArtworkClick(artwork)}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-medium text-purple-600">
                                  #{artwork.tokenId}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{artwork.title}</p>
                                <p className="text-xs text-gray-500">
                                  贡献 {artwork.contribution}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">暂无参与作品</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            开始创作
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <ColorNFTGrid
                colorNFTs={userColors}
                onNFTClick={handleNFTClick}
                isLoading={colorsLoading}
              />
            )}

            {activeTab === 'artworks' && (
              <ParticipatedArtworks
                artworks={artworks}
                onArtworkClick={handleArtworkClick}
                isLoading={artworksLoading}
              />
            )}
          </div>

          {/* Error States */}
          {colorsError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">加载颜色 NFT 时出错: {colorsError.message}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* NFT Details Modal */}
      <NFTDetailsModal
        nft={selectedNFT}
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
      />
    </>
  );
}