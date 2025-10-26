'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '../../lib/context/WalletContext';
import { useNetworkSwitch, useNetworkGuidance } from '../../lib/hooks/useSimpleNetworkSwitch';
import { Button } from '../ui/SimpleButton';
import { Card } from '../ui/SimpleCard';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'purchase' | 'collection' | 'canvas' | 'manual';
  title?: string;
  description?: string;
}

export function WalletModal({ 
  isOpen, 
  onClose, 
  trigger = 'manual',
  title,
  description 
}: WalletModalProps) {
  const { isConnected, needsNetworkSwitch } = useWallet();
  const { switchToDefaultNetwork, isSwitching } = useNetworkSwitch();
  const { shouldShowGuidance, guidance } = useNetworkGuidance();

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
      <Card className="relative w-full max-w-md mx-4 p-6 bg-white">
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

        {/* Network guidance */}
        {shouldShowGuidance && guidance && (
          <div className={`mb-4 p-3 rounded-lg ${
            guidance.type === 'warning' 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${
                guidance.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {guidance.type === 'warning' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  guidance.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {guidance.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  guidance.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                }`}>
                  {guidance.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connection content */}
        <div className="space-y-4">
          {!isConnected ? (
            // Wallet connection
            <div className="flex flex-col items-center">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              variant="default"
                              size="lg"
                              className="w-full"
                            >
                              连接钱包
                            </Button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          ) : needsNetworkSwitch ? (
            // Network switching
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                请切换到支持的网络以继续
              </p>
              <Button
                onClick={switchToDefaultNetwork}
                variant="default"
                size="lg"
                className="w-full"
                disabled={isSwitching}
              >
                {isSwitching ? '切换中...' : '切换网络'}
              </Button>
            </div>
          ) : (
            // Connected and ready
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                钱包已连接，您可以开始使用平台功能
              </p>
              <Button
                onClick={onClose}
                variant="default"
                size="lg"
                className="w-full"
              >
                开始使用
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            支持 MetaMask、WalletConnect 等主流钱包
          </p>
        </div>
      </Card>
    </div>
  );
}

// Simplified wallet button for quick access
export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="default">
                    连接钱包
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="outline">
                    切换网络
                  </Button>
                );
              }

              return (
                <Button onClick={openAccountModal} variant="ghost">
                  {account.displayName}
                  {account.displayBalance
                    ? ` (${account.displayBalance})`
                    : ''}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}