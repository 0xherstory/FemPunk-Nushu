'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WalletState } from '../../types';

interface WalletStore extends WalletState {
  // Actions
  setWalletState: (state: Partial<WalletState>) => void;
  setAddress: (address: string | null) => void;
  setConnected: (isConnected: boolean) => void;
  setConnecting: (isConnecting: boolean) => void;
  setChainId: (chainId: number | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Computed values
  isReady: () => boolean;
  hasValidChain: (supportedChainIds: number[]) => boolean;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  error: null,
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setWalletState: (newState) => 
        set((state) => ({ ...state, ...newState })),
      
      setAddress: (address) => 
        set((state) => ({ ...state, address })),
      
      setConnected: (isConnected) => 
        set((state) => ({ ...state, isConnected })),
      
      setConnecting: (isConnecting) => 
        set((state) => ({ ...state, isConnecting })),
      
      setChainId: (chainId) => 
        set((state) => ({ ...state, chainId })),
      
      setError: (error) => 
        set((state) => ({ ...state, error })),
      
      reset: () => set(initialState),
      
      // Computed values
      isReady: () => {
        const state = get();
        return state.isConnected && !!state.address && !state.error;
      },
      
      hasValidChain: (supportedChainIds) => {
        const { chainId } = get();
        return chainId ? supportedChainIds.includes(chainId) : false;
      },
    }),
    {
      name: 'wallet-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not temporary states
      partialize: (state) => ({
        address: state.address,
        chainId: state.chainId,
        // Don't persist connection states as they should be fresh on reload
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useWalletAddress = () => useWalletStore((state) => state.address);
export const useWalletConnection = () => useWalletStore((state) => ({
  isConnected: state.isConnected,
  isConnecting: state.isConnecting,
  isReady: state.isReady(),
}));
export const useWalletChain = () => useWalletStore((state) => ({
  chainId: state.chainId,
  hasValidChain: state.hasValidChain,
}));
export const useWalletError = () => useWalletStore((state) => state.error);