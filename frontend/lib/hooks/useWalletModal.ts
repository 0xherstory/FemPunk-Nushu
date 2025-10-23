import { useState, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';

export type WalletModalTrigger = 'purchase' | 'collection' | 'canvas' | 'manual';

interface WalletModalState {
  isOpen: boolean;
  trigger: WalletModalTrigger;
  title?: string;
  description?: string;
}

// Hook for managing wallet modal state
export function useWalletModal() {
  const { isConnected, isSupported } = useWallet();
  
  const [modalState, setModalState] = useState<WalletModalState>({
    isOpen: false,
    trigger: 'manual',
  });

  // Open modal with specific trigger and content
  const openModal = useCallback((
    trigger: WalletModalTrigger = 'manual',
    options?: {
      title?: string;
      description?: string;
    }
  ) => {
    setModalState({
      isOpen: true,
      trigger,
      title: options?.title,
      description: options?.description,
    });
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // Check if wallet action is needed and open modal if required
  const requireWallet = useCallback((
    trigger: WalletModalTrigger,
    options?: {
      title?: string;
      description?: string;
    }
  ): boolean => {
    if (!isConnected || !isSupported) {
      openModal(trigger, options);
      return false;
    }
    return true;
  }, [isConnected, isSupported, openModal]);

  // Specific trigger functions for common use cases
  const requireWalletForPurchase = useCallback(() => {
    return requireWallet('purchase', {
      title: '连接钱包购买颜色',
      description: '连接钱包以购买颜色 NFT 并参与协作绘画',
    });
  }, [requireWallet]);

  const requireWalletForCollection = useCallback(() => {
    return requireWallet('collection', {
      title: '查看我的藏品',
      description: '连接钱包以查看您拥有的颜色 NFT 和参与的作品',
    });
  }, [requireWallet]);

  const requireWalletForCanvas = useCallback(() => {
    return requireWallet('canvas', {
      title: '开始创作',
      description: '连接钱包以获取随机颜色并开始协作绘画',
    });
  }, [requireWallet]);

  return {
    modalState,
    openModal,
    closeModal,
    requireWallet,
    requireWalletForPurchase,
    requireWalletForCollection,
    requireWalletForCanvas,
    isWalletReady: isConnected && isSupported,
  };
}

// Hook for wallet-guarded operations
export function useWalletGuardedAction() {
  const { requireWallet } = useWalletModal();
  
  // Execute an action only if wallet is connected and ready
  const executeWithWallet = useCallback(async (
    action: () => Promise<void> | void,
    trigger: WalletModalTrigger = 'manual',
    options?: {
      title?: string;
      description?: string;
    }
  ): Promise<boolean> => {
    if (!requireWallet(trigger, options)) {
      return false;
    }
    
    try {
      await action();
      return true;
    } catch (error) {
      console.error('Wallet-guarded action failed:', error);
      return false;
    }
  }, [requireWallet]);

  return {
    executeWithWallet,
  };
}