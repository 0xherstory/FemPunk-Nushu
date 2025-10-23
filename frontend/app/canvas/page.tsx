'use client';

import { useState, useEffect } from 'react';
import { CanvasLiveblocksProvider } from '../../lib/providers/LiveblocksProvider';
import { CollaborativeCanvas } from '../../components/canvas/CollaborativeCanvas';
import { SimpleCanvas } from '../../components/canvas/SimpleCanvas';
import { NavigationBar } from '../../components/navigation/NavigationBar';
import { DailyTheme } from '../../components/canvas/DailyTheme';
import { NushuCharacter } from '../../components/canvas/NushuCharacter';
import { SimpleColorPalette } from '../../components/canvas/SimpleColorPalette';
import { useAccount } from 'wagmi';
import { WalletModal } from '../../components/wallet/WalletModal';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
import { client } from '../../lib/liveblocks/config';

// Mock daily theme data - will be replaced with real data later
const mockDailyTheme = {
  id: '2024-01-01',
  date: '2024-01-01',
  title: '和谐',
  titleEn: 'Harmony',
  description: '今日主题是和谐，让我们一起创作体现和谐之美的作品',
  nushuCharacter: {
    character: '𛆁',
    meaning: '和谐、平衡、美好',
    pronunciation: 'hé xié'
  }
};

export default function CanvasPage() {
  const { address, isConnected } = useAccount();
  const { modalState, openModal: openWalletModal, closeModal: closeWalletModal } = useWalletModal();
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  // Debug logging
  useEffect(() => {
    console.log('CanvasPage mounted');
    console.log('Liveblocks client available:', !!client);
    console.log('User address:', address);
    console.log('Is connected:', isConnected);
  }, [address, isConnected]);

  // Listen for wallet modal events from canvas
  useEffect(() => {
    const handleOpenWalletModal = () => {
      openWalletModal();
    };

    window.addEventListener('openWalletModal', handleOpenWalletModal);
    return () => {
      window.removeEventListener('openWalletModal', handleOpenWalletModal);
    };
  }, [openWalletModal]);

  return (
    <CanvasLiveblocksProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <NavigationBar currentPage="canvas" />
        
        {/* Main Canvas Layout */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side - Canvas Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  协作画布
                </h2>
                
                {/* Canvas Component */}
                <div className="relative">
                  <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded-lg">
                    <p className="text-sm">
                      <strong>演示模式:</strong> 当前使用简单画布进行测试。功能包括基础绘画、颜色选择和画笔调节。
                    </p>
                  </div>
                  <SimpleCanvas 
                    userAddress={address}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Theme and Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Daily Theme */}
              <DailyTheme theme={mockDailyTheme} />
              
              {/* Nushu Character */}
              <NushuCharacter character={mockDailyTheme.nushuCharacter} />
              
              {/* Color Palette */}
              <SimpleColorPalette 
                userAddress={address}
                isConnected={isConnected}
                onConnectWallet={openWalletModal}
                onColorSelect={setSelectedColor}
                selectedColor={selectedColor}
              />
            </div>
          </div>
        </div>

        {/* Wallet Modal */}
        <WalletModal 
          isOpen={modalState.isOpen}
          onClose={closeWalletModal}
        />
      </div>
    </CanvasLiveblocksProvider>
  );
}