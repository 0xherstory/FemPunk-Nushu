'use client';

import React from 'react';
import { useWallet } from '../../lib/context/WalletContext';
import { useNetworkSwitch } from '../../lib/hooks/useNetworkSwitch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface WalletStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function WalletStatus({ showDetails = false, className = '' }: WalletStatusProps) {
  const { 
    isConnected, 
    address, 
    chainId, 
    isConnecting, 
    error,
    connect,
    disconnect 
  } = useWallet();
  
  const { 
    isWrongNetwork, 
    currentChain, 
    switchToDefaultNetwork, 
    isSwitching 
  } = useNetworkSwitch();

  if (!isConnected && !isConnecting) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">钱包未连接</h3>
            <p className="text-sm text-gray-600">连接钱包以使用平台功能</p>
          </div>
          <Button onClick={connect} variant="default" size="sm">
            连接钱包
          </Button>
        </div>
      </Card>
    );
  }

  if (isConnecting) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          <span className="text-sm text-gray-600">连接中...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 border-red-200 bg-red-50 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-800">连接错误</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <Button onClick={connect} variant="outline" size="sm">
            重试
          </Button>
        </div>
      </Card>
    );
  }

  if (isWrongNetwork) {
    return (
      <Card className={`p-4 border-yellow-200 bg-yellow-50 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-yellow-800">网络不匹配</h3>
            <p className="text-sm text-yellow-600">
              请切换到支持的网络
            </p>
          </div>
          <Button 
            onClick={switchToDefaultNetwork} 
            variant="outline" 
            size="sm"
            loading={isSwitching}
          >
            {isSwitching ? '切换中...' : '切换网络'}
          </Button>
        </div>
      </Card>
    );
  }

  // Connected and on correct network
  return (
    <Card className={`p-4 border-green-200 bg-green-50 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <h3 className="font-medium text-green-800">钱包已连接</h3>
            {showDetails && (
              <div className="text-sm text-green-600 space-y-1">
                <p>地址: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                <p>网络: {currentChain?.name}</p>
              </div>
            )}
          </div>
        </div>
        <Button onClick={disconnect} variant="ghost" size="sm">
          断开连接
        </Button>
      </div>
    </Card>
  );
}

// Compact wallet indicator for navigation bars
export function WalletIndicator() {
  const { isConnected, address, connect } = useWallet();
  const { isWrongNetwork } = useNetworkSwitch();

  if (!isConnected) {
    return (
      <Button onClick={connect} variant="default" size="sm">
        连接钱包
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        isWrongNetwork ? 'bg-yellow-500' : 'bg-green-500'
      }`}></div>
      <span className="text-sm font-medium">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
    </div>
  );
}

// Network status indicator
export function NetworkIndicator() {
  const { currentChain, isWrongNetwork, switchToDefaultNetwork, isSwitching } = useNetworkSwitch();

  if (isWrongNetwork) {
    return (
      <Button 
        onClick={switchToDefaultNetwork}
        variant="outline"
        size="sm"
        loading={isSwitching}
      >
        {isSwitching ? '切换中...' : '切换网络'}
      </Button>
    );
  }

  if (currentChain) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>{currentChain.name}</span>
        {currentChain.testnet && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            测试网
          </span>
        )}
      </div>
    );
  }

  return null;
}