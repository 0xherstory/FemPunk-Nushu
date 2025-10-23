'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { queryKeys, cacheUtils } from './queryClient';
import { useColorStore } from '../stores/colorStore';
import type { ColorNFT } from '../../types';

// Mock API functions (replace with actual contract calls)
const colorApi = {
  getUserColors: async (address: string, chainId: number): Promise<ColorNFT[]> => {
    // This would be replaced with actual wagmi contract read
    // For now, return mock data
    return [];
  },
  
  getAvailableColors: async (chainId: number): Promise<ColorNFT[]> => {
    // Mock available colors
    const mockColors: ColorNFT[] = [
      {
        id: '1',
        colorHex: '#ff6b9d',
        tokenId: 1,
        owner: '0x0000000000000000000000000000000000000000',
        mintedAt: new Date(),
        price: BigInt('1000000000000000000'), // 1 ETH in wei
      },
      {
        id: '2',
        colorHex: '#ffd700',
        tokenId: 2,
        owner: '0x0000000000000000000000000000000000000000',
        mintedAt: new Date(),
        price: BigInt('1000000000000000000'),
      },
    ];
    return mockColors;
  },
  
  getCurrentPrice: async (chainId: number): Promise<bigint> => {
    // Mock current price
    return BigInt('1000000000000000000'); // 1 ETH
  },
  
  purchaseColor: async (colorId: string, chainId: number): Promise<ColorNFT> => {
    // Mock purchase - would trigger actual transaction
    throw new Error('Purchase functionality not implemented');
  },
  
  validateRedemptionCode: async (code: string): Promise<{ valid: boolean; colorId?: string }> => {
    // Mock redemption code validation
    return { valid: false };
  },
};

// Query hooks
export function useUserColors() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { setUserColors, setLoading, setError } = useColorStore();
  
  const query = useQuery({
    queryKey: queryKeys.colors.user(address || '', chainId || 1),
    queryFn: () => colorApi.getUserColors(address!, chainId!),
    enabled: !!address && !!chainId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Handle side effects
  React.useEffect(() => {
    if (query.data) {
      setUserColors(query.data);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setUserColors, setLoading, setError]);

  React.useEffect(() => {
    if (query.error) {
      setError((query.error as any).message || 'Failed to fetch user colors');
      setLoading(false);
    }
  }, [query.error, setError, setLoading]);

  React.useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

export function useAvailableColors() {
  const chainId = useChainId();
  const { setAvailableColors, setLoading, setError } = useColorStore();
  
  const query = useQuery({
    queryKey: queryKeys.colors.available(chainId || 1),
    queryFn: () => colorApi.getAvailableColors(chainId!),
    enabled: !!chainId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle side effects
  React.useEffect(() => {
    if (query.data) {
      setAvailableColors(query.data);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setAvailableColors, setLoading, setError]);

  React.useEffect(() => {
    if (query.error) {
      setError((query.error as any).message || 'Failed to fetch available colors');
      setLoading(false);
    }
  }, [query.error, setError, setLoading]);

  return query;
}

export function useColorPrice() {
  const chainId = useChainId();
  
  return useQuery({
    queryKey: queryKeys.colors.price(chainId || 1),
    queryFn: () => colorApi.getCurrentPrice(chainId!),
    enabled: !!chainId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

// Mutation hooks
export function usePurchaseColor() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const { addUserColor, setPurchaseInProgress, setError } = useColorStore();
  
  return useMutation({
    mutationFn: ({ colorId }: { colorId: string }) => 
      colorApi.purchaseColor(colorId, chainId!),
    
    onMutate: async ({ colorId }) => {
      // Optimistic update
      setPurchaseInProgress(colorId, true);
      setError(null);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.colors.user(address || '', chainId || 1),
      });
      
      return { colorId };
    },
    
    onSuccess: (newColor, { colorId }) => {
      // Add the new color to user's collection
      addUserColor(newColor);
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.user(address || '', chainId || 1),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.available(chainId || 1),
      });
      
      setPurchaseInProgress(colorId, false);
    },
    
    onError: (error: any, { colorId }) => {
      setError(error.message || 'Purchase failed');
      setPurchaseInProgress(colorId, false);
      
      // Revert optimistic updates if needed
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.user(address || '', chainId || 1),
      });
    },
    
    onSettled: (_, __, { colorId }) => {
      setPurchaseInProgress(colorId, false);
    },
  });
}

export function useRedeemColor() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const { addUserColor, setError } = useColorStore();
  
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const validation = await colorApi.validateRedemptionCode(code);
      if (!validation.valid || !validation.colorId) {
        throw new Error('Invalid redemption code');
      }
      
      // In real implementation, this would trigger a contract call
      // to mint the color NFT to the user's address
      return validation.colorId;
    },
    
    onSuccess: (colorId) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.user(address || '', chainId || 1),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.available(chainId || 1),
      });
      
      setError(null);
    },
    
    onError: (error: any) => {
      setError(error.message || 'Redemption failed');
    },
  });
}

// Prefetch functions for performance optimization
export const createColorQueryPrefetch = (queryClient: any) => ({
  // Prefetch user colors when wallet connects
  prefetchUserColors: (address: string, chainId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.colors.user(address, chainId),
      queryFn: () => colorApi.getUserColors(address, chainId),
      staleTime: 1000 * 60 * 2,
    });
  },
  
  // Prefetch available colors on app load
  prefetchAvailableColors: (chainId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.colors.available(chainId),
      queryFn: () => colorApi.getAvailableColors(chainId),
      staleTime: 1000 * 60 * 5,
    });
  },
  
  // Prefetch color price
  prefetchColorPrice: (chainId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.colors.price(chainId),
      queryFn: () => colorApi.getCurrentPrice(chainId),
      staleTime: 1000 * 30,
    });
  },
});