'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ColorNFT } from '../../types';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

interface NFTDetailsModalProps {
  nft: ColorNFT | null;
  isOpen: boolean;
  onClose: () => void;
}

interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export function NFTDetailsModal({ nft, isOpen, onClose }: NFTDetailsModalProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'usage'>('details');

  if (!isOpen || !nft) return null;

  // Mock NFT metadata - in real implementation, this would come from IPFS/API
  const mockAttributes: NFTAttribute[] = [
    { trait_type: 'Color Family', value: 'Purple' },
    { trait_type: 'Rarity', value: 'Common' },
    { trait_type: 'Mint Batch', value: '1' },
    { trait_type: 'Usage Count', value: 5, display_type: 'number' },
  ];

  const mockHistory = [
    {
      event: 'Minted',
      from: null,
      to: address,
      date: nft.mintedAt,
      txHash: '0x1234...5678',
    },
    {
      event: 'Used in Artwork',
      from: null,
      to: null,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      txHash: '0x2345...6789',
    },
  ];

  const mockUsage = [
    {
      artworkId: 'artwork-1',
      title: 'Collaborative Artwork #1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      contribution: 15,
    },
    {
      artworkId: 'artwork-2', 
      title: 'Collaborative Artwork #2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      contribution: 8,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden bg-white">
        {/* Header */}
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                style={{ backgroundColor: nft.colorHex }}
              />
              <div>
                <h2 className="text-xl font-semibold">Color NFT #{nft.tokenId}</h2>
                <p className="text-sm text-gray-500 font-normal">{nft.colorHex.toUpperCase()}</p>
              </div>
            </CardTitle>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'details', label: '详情' },
              { key: 'history', label: '历史' },
              { key: 'usage', label: '使用记录' },
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
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <CardContent className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Color Preview */}
              <div className="text-center">
                <div 
                  className="w-32 h-32 mx-auto rounded-2xl shadow-lg border-4 border-white"
                  style={{ backgroundColor: nft.colorHex }}
                />
                <p className="mt-3 text-lg font-semibold">{nft.colorHex.toUpperCase()}</p>
                <p className="text-sm text-gray-500">RGB: {hexToRgb(nft.colorHex)}</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Token ID</p>
                    <p className="font-semibold">#{nft.tokenId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">购买价格</p>
                    <p className="font-semibold">{formatEther(nft.price)} ETH</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">获得时间</p>
                    <p className="font-semibold">{nft.mintedAt.toLocaleDateString('zh-CN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">状态</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      可用于绘画
                    </span>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div>
                <h4 className="font-semibold mb-3">属性</h4>
                <div className="grid grid-cols-2 gap-3">
                  {mockAttributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{attr.trait_type}</p>
                      <p className="font-semibold">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">合约信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">合约地址</span>
                    <span className="font-mono">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Token 标准</span>
                    <span>ERC-721</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">区块链</span>
                    <span>Ethereum</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-semibold">交易历史</h4>
              <div className="space-y-3">
                {mockHistory.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-gray-500">
                        {event.date.toLocaleDateString('zh-CN')} {event.date.toLocaleTimeString('zh-CN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{event.txHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h4 className="font-semibold">使用记录</h4>
              {mockUsage.length > 0 ? (
                <div className="space-y-3">
                  {mockUsage.map((usage, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{usage.title}</p>
                        <p className="text-sm text-gray-500">
                          {usage.date.toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">{usage.contribution}%</p>
                        <p className="text-xs text-gray-500">贡献度</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">暂无使用记录</p>
                  <p className="text-sm text-gray-400 mt-1">去画布使用这个颜色开始创作吧！</p>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-3">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => {
                // Navigate to canvas with this color selected
                onClose();
              }}
            >
              使用此颜色创作
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Open external link to view on blockchain explorer
                window.open(`https://etherscan.io/token/0x1234...5678?a=${nft.tokenId}`, '_blank');
              }}
            >
              在区块链浏览器查看
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return 'Invalid color';
}