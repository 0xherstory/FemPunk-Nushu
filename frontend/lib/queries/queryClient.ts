'use client';

import { QueryClient } from '@tanstack/react-query';

// Create a singleton query client with optimized configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Cache time - how long data stays in cache after component unmounts
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: (failureCount, error: any) => {
        if (error?.name === 'NetworkError' && failureCount < 1) {
          return true;
        }
        return false;
      },
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Wallet related queries
  wallet: {
    all: ['wallet'] as const,
    balance: (address: string, chainId: number) => 
      [...queryKeys.wallet.all, 'balance', address, chainId] as const,
    nfts: (address: string, chainId: number) => 
      [...queryKeys.wallet.all, 'nfts', address, chainId] as const,
  },
  
  // Color NFT related queries
  colors: {
    all: ['colors'] as const,
    available: (chainId: number) => 
      [...queryKeys.colors.all, 'available', chainId] as const,
    user: (address: string, chainId: number) => 
      [...queryKeys.colors.all, 'user', address, chainId] as const,
    price: (chainId: number) => 
      [...queryKeys.colors.all, 'price', chainId] as const,
    details: (tokenId: number, chainId: number) => 
      [...queryKeys.colors.all, 'details', tokenId, chainId] as const,
  },
  
  // Artwork related queries
  artworks: {
    all: ['artworks'] as const,
    list: (page: number, limit: number) => 
      [...queryKeys.artworks.all, 'list', page, limit] as const,
    details: (artworkId: string) => 
      [...queryKeys.artworks.all, 'details', artworkId] as const,
    user: (address: string, page: number) => 
      [...queryKeys.artworks.all, 'user', address, page] as const,
    featured: () => 
      [...queryKeys.artworks.all, 'featured'] as const,
  },
  
  // Daily theme queries
  themes: {
    all: ['themes'] as const,
    current: () => 
      [...queryKeys.themes.all, 'current'] as const,
    byDate: (date: string) => 
      [...queryKeys.themes.all, 'date', date] as const,
    history: (page: number) => 
      [...queryKeys.themes.all, 'history', page] as const,
  },
  
  // Canvas related queries
  canvas: {
    all: ['canvas'] as const,
    state: (canvasId: string) => 
      [...queryKeys.canvas.all, 'state', canvasId] as const,
    contributors: (canvasId: string) => 
      [...queryKeys.canvas.all, 'contributors', canvasId] as const,
  },
  
  // User profile queries
  user: {
    all: ['user'] as const,
    profile: (address: string) => 
      [...queryKeys.user.all, 'profile', address] as const,
    stats: (address: string) => 
      [...queryKeys.user.all, 'stats', address] as const,
    contributions: (address: string, page: number) => 
      [...queryKeys.user.all, 'contributions', address, page] as const,
  },
} as const;

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries for a specific address (useful when wallet changes)
  invalidateUserQueries: (address: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.includes(address);
      },
    });
  },
  
  // Invalidate queries by pattern
  invalidateByPattern: (pattern: string[]) => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return pattern.every(p => queryKey.includes(p));
      },
    });
  },
  
  // Clear all cache
  clearAll: () => {
    queryClient.clear();
  },
  
  // Remove specific query
  removeQuery: (queryKey: readonly unknown[]) => {
    queryClient.removeQueries({ queryKey });
  },
  
  // Set query data manually (useful for optimistic updates)
  setQueryData: <T>(queryKey: readonly unknown[], data: T) => {
    queryClient.setQueryData(queryKey, data);
  },
  
  // Get cached query data
  getQueryData: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  },
};

// Network status handling
export const networkHandlers = {
  // Handle online/offline status
  handleNetworkChange: (isOnline: boolean) => {
    if (isOnline) {
      // Refetch all queries when coming back online
      queryClient.refetchQueries({
        predicate: (query) => query.state.status === 'error',
      });
    } else {
      // Pause queries when offline
      queryClient.getQueryCache().getAll().forEach(query => {
        query.state.fetchStatus = 'idle';
      });
    }
  },
  
  // Handle wallet disconnection
  handleWalletDisconnect: () => {
    // Clear user-specific queries
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.includes('user') || 
               queryKey.includes('balance') || 
               queryKey.includes('nfts');
      },
    });
  },
  
  // Handle chain change
  handleChainChange: (newChainId: number) => {
    // Invalidate chain-specific queries
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        // If query key contains a chain ID that's different from new one
        return queryKey.some(key => 
          typeof key === 'number' && key !== newChainId
        );
      },
    });
  },
};