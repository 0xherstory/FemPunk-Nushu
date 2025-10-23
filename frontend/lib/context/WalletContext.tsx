'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type { WalletState } from '../../types';
import { parseWeb3Error } from '../utils/web3-errors';
import { sepolia, mainnet } from 'viem/chains';

const SUPPORTED_CHAINS = [sepolia, mainnet];
const DEFAULT_CHAIN = sepolia;

interface WalletContextType extends WalletState {
  connect: () => void;
  disconnect: () => void;
  isSupported: boolean;
  needsNetworkSwitch: boolean;
  switchToSupportedNetwork: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    error: null,
  });

  // Update wallet state when account changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      address: address || null,
      isConnected,
      isConnecting,
      chainId: chainId || null,
      error: null,
    }));
  }, [address, isConnected, isConnecting, chainId]);

  // Check if current network is supported
  const isSupported = chainId ? SUPPORTED_CHAINS.some(chain => chain.id === chainId) : false;
  const needsNetworkSwitch = isConnected && !isSupported;

  // Connect wallet function
  const connect = () => {
    try {
      if (openConnectModal) {
        openConnectModal();
      } else {
        setState(prev => ({
          ...prev,
          error: 'RainbowKit 连接模态框不可用',
        }));
      }
    } catch (error) {
      const parsedError = parseWeb3Error(error);
      setState(prev => ({
        ...prev,
        error: parsedError.message,
      }));
    }
  };

  // Disconnect wallet function
  const handleDisconnect = () => {
    try {
      disconnect();
      setState({
        address: null,
        isConnected: false,
        isConnecting: false,
        chainId: null,
        error: null,
      });
    } catch (error) {
      const parsedError = parseWeb3Error(error);
      setState(prev => ({
        ...prev,
        error: parsedError.message,
      }));
    }
  };

  // Switch to supported network (placeholder - actual switching handled by RainbowKit)
  const switchToSupportedNetwork = () => {
    // This will be handled by the network switch hook and RainbowKit UI
    console.log('Network switch requested');
  };

  const contextValue: WalletContextType = {
    ...state,
    connect,
    disconnect: handleDisconnect,
    isSupported,
    needsNetworkSwitch,
    switchToSupportedNetwork,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Hook for wallet connection status checks
export function useWalletConnection() {
  const { isConnected, address, chainId, isSupported, needsNetworkSwitch } = useWallet();
  
  const isReady = isConnected && address && isSupported;
  const requiresAction = !isConnected || needsNetworkSwitch;
  
  return {
    isReady,
    requiresAction,
    isConnected,
    hasAddress: !!address,
    isSupported,
    needsNetworkSwitch,
    chainId,
  };
}

// Hook for conditional wallet operations
export function useWalletGuard() {
  const { connect, isConnected, isSupported } = useWallet();
  
  const executeWithWallet = async (operation: () => Promise<void> | void) => {
    if (!isConnected) {
      connect();
      return false;
    }
    
    if (!isSupported) {
      // Network switch will be handled by UI components
      return false;
    }
    
    try {
      await operation();
      return true;
    } catch (error) {
      console.error('Wallet operation failed:', error);
      return false;
    }
  };
  
  return {
    executeWithWallet,
    canExecute: isConnected && isSupported,
  };
}