'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { useWalletStore } from '../stores/walletStore';
import { useAppStore } from '../stores/appStore';
import { networkHandlers, cacheUtils } from '../queries/queryClient';
import { createColorQueryPrefetch } from '../queries/colorQueries';
import { createArtworkQueryPrefetch } from '../queries/artworkQueries';
import { createThemeQueryPrefetch } from '../queries/themeQueries';

// Data synchronization service
export function useDataSync() {
  const queryClient = useQueryClient();
  const { address, isConnected, chainId: wagmiChainId } = useAccount();
  const chainId = useChainId();
  
  const { 
    setWalletState, 
    address: storeAddress, 
    chainId: storeChainId 
  } = useWalletStore();
  
  const { setOnline, updateSyncTime } = useAppStore();
  
  // Create prefetch functions with queryClient
  const colorQueryPrefetch = createColorQueryPrefetch(queryClient);
  const artworkQueryPrefetch = createArtworkQueryPrefetch(queryClient);
  const themeQueryPrefetch = createThemeQueryPrefetch(queryClient);
  
  // Sync wallet state between wagmi and store
  useEffect(() => {
    setWalletState({
      address: address || null,
      isConnected,
      chainId: chainId || null,
      isConnecting: false, // wagmi handles this separately
      error: null,
    });
  }, [address, isConnected, chainId, setWalletState]);
  
  // Handle wallet connection changes
  useEffect(() => {
    if (address && address !== storeAddress) {
      // New wallet connected - prefetch user data
      if (chainId) {
        colorQueryPrefetch.prefetchUserColors(address, chainId);
        artworkQueryPrefetch.prefetchUserArtworks(address);
      }
      updateSyncTime();
    } else if (!address && storeAddress) {
      // Wallet disconnected - clear user-specific cache
      networkHandlers.handleWalletDisconnect();
    }
  }, [address, storeAddress, chainId, updateSyncTime]);
  
  // Handle chain changes
  useEffect(() => {
    if (chainId && chainId !== storeChainId) {
      networkHandlers.handleChainChange(chainId);
      
      // Prefetch chain-specific data
      colorQueryPrefetch.prefetchAvailableColors(chainId);
      colorQueryPrefetch.prefetchColorPrice(chainId);
      
      updateSyncTime();
    }
  }, [chainId, storeChainId, updateSyncTime]);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      networkHandlers.handleNetworkChange(true);
      updateSyncTime();
    };
    
    const handleOffline = () => {
      setOnline(false);
      networkHandlers.handleNetworkChange(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, updateSyncTime]);
  
  // Periodic data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh critical data every 5 minutes
      if (chainId) {
        queryClient.invalidateQueries({
          queryKey: ['colors', 'price', chainId],
        });
      }
      
      // Refresh theme data every hour
      queryClient.invalidateQueries({
        queryKey: ['themes', 'current'],
      });
      
      updateSyncTime();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [queryClient, chainId, updateSyncTime]);
  
  // Initial data prefetch
  useEffect(() => {
    // Prefetch common data on app load
    themeQueryPrefetch.prefetchCurrentTheme();
    artworkQueryPrefetch.prefetchFeaturedArtworks();
    
    if (chainId) {
      colorQueryPrefetch.prefetchAvailableColors(chainId);
      colorQueryPrefetch.prefetchColorPrice(chainId);
    }
  }, [chainId]);
}

// Hook for manual data refresh
export function useDataRefresh() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const { updateSyncTime } = useAppStore();
  
  const refreshUserData = useCallback(async () => {
    if (!address || !chainId) return;
    
    // Invalidate user-specific queries
    cacheUtils.invalidateUserQueries(address);
    updateSyncTime();
  }, [address, chainId, updateSyncTime]);
  
  const refreshGlobalData = useCallback(async () => {
    // Invalidate global queries
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.includes('available') || 
               queryKey.includes('featured') || 
               queryKey.includes('current');
      },
    });
    updateSyncTime();
  }, [queryClient, updateSyncTime]);
  
  const refreshAll = useCallback(async () => {
    queryClient.invalidateQueries();
    updateSyncTime();
  }, [queryClient, updateSyncTime]);
  
  return {
    refreshUserData,
    refreshGlobalData,
    refreshAll,
  };
}

// Hook for cache management
export function useCacheManagement() {
  const queryClient = useQueryClient();
  
  const clearCache = useCallback(() => {
    cacheUtils.clearAll();
  }, []);
  
  const getCacheSize = useCallback(() => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  }, [queryClient]);
  
  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const stats = {
      total: queries.length,
      fresh: 0,
      stale: 0,
      error: 0,
      loading: 0,
    };
    
    queries.forEach(query => {
      switch (query.state.status) {
        case 'success':
          if (query.isStale()) {
            stats.stale++;
          } else {
            stats.fresh++;
          }
          break;
        case 'error':
          stats.error++;
          break;
        case 'pending':
          stats.loading++;
          break;
      }
    });
    
    return stats;
  }, [queryClient]);
  
  return {
    clearCache,
    getCacheSize,
    getCacheStats,
  };
}

// Hook for optimistic updates
export function useOptimisticUpdates() {
  const queryClient = useQueryClient();
  
  const updateColorOwnership = useCallback((address: string, chainId: number, newColor: any) => {
    // Optimistically update user colors
    queryClient.setQueryData(
      ['colors', 'user', address, chainId],
      (oldData: any[] | undefined) => {
        if (!oldData) return [newColor];
        return [...oldData, newColor];
      }
    );
    
    // Remove from available colors
    queryClient.setQueryData(
      ['colors', 'available', chainId],
      (oldData: any[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(color => color.id !== newColor.id);
      }
    );
  }, [queryClient]);
  
  const revertColorOwnership = useCallback((address: string, chainId: number, colorId: string) => {
    // Revert optimistic updates on error
    queryClient.invalidateQueries({
      queryKey: ['colors', 'user', address, chainId],
    });
    queryClient.invalidateQueries({
      queryKey: ['colors', 'available', chainId],
    });
  }, [queryClient]);
  
  return {
    updateColorOwnership,
    revertColorOwnership,
  };
}