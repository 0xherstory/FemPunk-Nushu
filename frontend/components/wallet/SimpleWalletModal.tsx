'use client';

import React from 'react';

interface SimpleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'purchase' | 'collection' | 'canvas' | 'manual';
  title?: string;
  description?: string;
}

export function SimpleWalletModal({ 
  isOpen, 
  onClose, 
  trigger = 'manual',
  title,
  description 
}: SimpleWalletModalProps) {
  if (!isOpen) return null;

  // Get context-specific content
  const getModalContent = () => {
    switch (trigger) {
      case 'purchase':
        return {
          title: title || '连接钱包购买颜色',
          description: description || '连接钱包以购买颜色 NFT 并参与协作绘画',
        };
      case 'collection':
        return {
          title: title || '查看我的藏品',
          description: description || '连接钱包以查看您拥有的颜色 NFT 和参与的作品',
        };
      case 'canvas':
        return {
          title: title || '开始创作',
          description: description || '连接钱包以获取随机颜色并开始协作绘画',
        };
      default:
        return {
          title: title || '连接钱包',
          description: description || '连接您的钱包以使用 Web3 功能',
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {content.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {content.description}
          </p>
        </div>

        {/* Connection content */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              这是演示模式。在实际部署中，这里会显示钱包连接选项。
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            支持 MetaMask、WalletConnect 等主流钱包
          </p>
        </div>
      </div>
    </div>
  );
}