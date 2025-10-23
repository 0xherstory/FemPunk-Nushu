'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { queryKeys } from './queryClient';
import type { Artwork, ParticipatedArtwork, PaginatedResponse } from '../../types';

// Mock API functions (replace with actual API calls)
const artworkApi = {
  getFeaturedArtworks: async (): Promise<Artwork[]> => {
    // Mock featured artworks
    return [];
  },
  
  getArtworks: async (page: number, limit: number): Promise<PaginatedResponse<Artwork>> => {
    // Mock paginated artworks
    return {
      items: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  },
  
  getArtworkDetails: async (artworkId: string): Promise<Artwork> => {
    // Mock artwork details
    throw new Error('Artwork not found');
  },
  
  getUserArtworks: async (address: string, page: number): Promise<PaginatedResponse<ParticipatedArtwork>> => {
    // Mock user participated artworks
    return {
      items: [],
      total: 0,
      page,
      limit: 10,
      hasMore: false,
    };
  },
  
  mintArtwork: async (canvasData: string, contributors: any[]): Promise<Artwork> => {
    // Mock artwork minting
    throw new Error('Minting not implemented');
  },
};

// Query hooks
export function useFeaturedArtworks() {
  return useQuery({
    queryKey: queryKeys.artworks.featured(),
    queryFn: artworkApi.getFeaturedArtworks,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useArtworks(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: queryKeys.artworks.list(page, limit),
    queryFn: () => artworkApi.getArtworks(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous page data while loading new page
  });
}

export function useInfiniteArtworks(limit: number = 12) {
  return useInfiniteQuery({
    queryKey: ['artworks', 'infinite', limit],
    queryFn: ({ pageParam = 1 }) => artworkApi.getArtworks(pageParam as number, limit),
    getNextPageParam: (lastPage: PaginatedResponse<Artwork>) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useArtworkDetails(artworkId: string) {
  return useQuery({
    queryKey: queryKeys.artworks.details(artworkId),
    queryFn: () => artworkApi.getArtworkDetails(artworkId),
    enabled: !!artworkId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUserArtworks(page: number = 1) {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: queryKeys.artworks.user(address || '', page),
    queryFn: () => artworkApi.getUserArtworks(address!, page),
    enabled: !!address,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

export function useInfiniteUserArtworks() {
  const { address } = useAccount();
  
  return useInfiniteQuery({
    queryKey: ['artworks', 'user', address, 'infinite'],
    queryFn: ({ pageParam = 1 }) => artworkApi.getUserArtworks(address!, pageParam as number),
    getNextPageParam: (lastPage: PaginatedResponse<ParticipatedArtwork>) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!address,
    staleTime: 1000 * 60 * 2,
  });
}

// Mutation hooks
export function useMintArtwork() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  
  return useMutation({
    mutationFn: ({ canvasData, contributors }: { canvasData: string; contributors: any[] }) =>
      artworkApi.mintArtwork(canvasData, contributors),
    
    onSuccess: (newArtwork) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.artworks.all,
      });
      
      if (address) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.artworks.user(address, 1),
        });
      }
      
      // Add the new artwork to featured artworks cache if appropriate
      queryClient.setQueryData(
        queryKeys.artworks.featured(),
        (oldData: Artwork[] | undefined) => {
          if (!oldData) return [newArtwork];
          return [newArtwork, ...oldData.slice(0, 9)]; // Keep only 10 featured
        }
      );
    },
    
    onError: (error) => {
      console.error('Failed to mint artwork:', error);
    },
  });
}

// Prefetch functions
export const createArtworkQueryPrefetch = (queryClient: any) => ({
  prefetchFeaturedArtworks: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.artworks.featured(),
      queryFn: artworkApi.getFeaturedArtworks,
      staleTime: 1000 * 60 * 10,
    });
  },
  
  prefetchArtworks: (page: number = 1, limit: number = 12) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.artworks.list(page, limit),
      queryFn: () => artworkApi.getArtworks(page, limit),
      staleTime: 1000 * 60 * 5,
    });
  },
  
  prefetchUserArtworks: (address: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.artworks.user(address, 1),
      queryFn: () => artworkApi.getUserArtworks(address, 1),
      staleTime: 1000 * 60 * 2,
    });
  },
  
  prefetchArtworkDetails: (artworkId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.artworks.details(artworkId),
      queryFn: () => artworkApi.getArtworkDetails(artworkId),
      staleTime: 1000 * 60 * 10,
    });
  },
});