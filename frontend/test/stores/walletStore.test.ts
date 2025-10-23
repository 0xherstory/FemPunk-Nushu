import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWalletStore } from '../../lib/stores/walletStore';

describe('WalletStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useWalletStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useWalletStore());
      
      expect(result.current.address).toBeNull();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.chainId).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Actions', () => {
    it('should set wallet address', () => {
      const { result } = renderHook(() => useWalletStore());
      const testAddress = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setAddress(testAddress);
      });

      expect(result.current.address).toBe(testAddress);
    });

    it('should set connection status', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setConnected(true);
      });

      expect(result.current.isConnected).toBe(true);
    });

    it('should set connecting status', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setConnecting(true);
      });

      expect(result.current.isConnecting).toBe(true);
    });

    it('should set chain ID', () => {
      const { result } = renderHook(() => useWalletStore());
      const testChainId = 1;

      act(() => {
        result.current.setChainId(testChainId);
      });

      expect(result.current.chainId).toBe(testChainId);
    });

    it('should set error', () => {
      const { result } = renderHook(() => useWalletStore());
      const testError = 'Connection failed';

      act(() => {
        result.current.setError(testError);
      });

      expect(result.current.error).toBe(testError);
    });

    it('should set wallet state with partial update', () => {
      const { result } = renderHook(() => useWalletStore());
      const partialState = {
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        chainId: 1,
      };

      act(() => {
        result.current.setWalletState(partialState);
      });

      expect(result.current.address).toBe(partialState.address);
      expect(result.current.isConnected).toBe(partialState.isConnected);
      expect(result.current.chainId).toBe(partialState.chainId);
      expect(result.current.isConnecting).toBe(false); // Should remain unchanged
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useWalletStore());

      // Set some state first
      act(() => {
        result.current.setWalletState({
          address: '0x1234567890123456789012345678901234567890',
          isConnected: true,
          chainId: 1,
          error: 'Some error',
        });
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.address).toBeNull();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.chainId).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Computed Values', () => {
    it('should return false for isReady when not connected', () => {
      const { result } = renderHook(() => useWalletStore());

      expect(result.current.isReady()).toBe(false);
    });

    it('should return false for isReady when connected but no address', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setConnected(true);
      });

      expect(result.current.isReady()).toBe(false);
    });

    it('should return false for isReady when has error', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setWalletState({
          address: '0x1234567890123456789012345678901234567890',
          isConnected: true,
          error: 'Some error',
        });
      });

      expect(result.current.isReady()).toBe(false);
    });

    it('should return true for isReady when fully connected', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setWalletState({
          address: '0x1234567890123456789012345678901234567890',
          isConnected: true,
          error: null,
        });
      });

      expect(result.current.isReady()).toBe(true);
    });

    it('should validate chain correctly', () => {
      const { result } = renderHook(() => useWalletStore());
      const supportedChains = [1, 5, 11155111]; // mainnet, goerli, sepolia

      act(() => {
        result.current.setChainId(1);
      });

      expect(result.current.hasValidChain(supportedChains)).toBe(true);

      act(() => {
        result.current.setChainId(999);
      });

      expect(result.current.hasValidChain(supportedChains)).toBe(false);

      act(() => {
        result.current.setChainId(null);
      });

      expect(result.current.hasValidChain(supportedChains)).toBe(false);
    });
  });

  describe('Selectors', () => {
    it('should select wallet address correctly', () => {
      const { result } = renderHook(() => useWalletStore());
      const testAddress = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setAddress(testAddress);
      });

      const { result: addressResult } = renderHook(() => 
        useWalletStore((state) => state.address)
      );

      expect(addressResult.current).toBe(testAddress);
    });

    it('should select connection state correctly', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setWalletState({
          isConnected: true,
          isConnecting: false,
        });
      });

      const { result: connectionResult } = renderHook(() => 
        useWalletStore((state) => ({
          isConnected: state.isConnected,
          isConnecting: state.isConnecting,
          isReady: state.isReady(),
        }))
      );

      expect(connectionResult.current.isConnected).toBe(true);
      expect(connectionResult.current.isConnecting).toBe(false);
    });
  });
});