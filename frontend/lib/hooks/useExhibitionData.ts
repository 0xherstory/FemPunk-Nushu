'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMultipleArtworks } from './useArtworkNFTs';
import { useWallet } from '../context/WalletContext';
import type { Artwork, PaginatedResponse } from '@/types';

// Mock data for development - replace with real API calls
const mockArtworks: Artwork[] = [
  {
    id: '1',
    title: '春日女书',
    canvasData: '', // Will be replaced with actual canvas data
    contributors: [
      { address: '0x1234...5678', contribution: 45.5, strokeCount: 234, timeSpent: 1800 },
      { address: '0x9abc...def0', contribution: 32.1, strokeCount: 156, timeSpent: 1200 },
      { address: '0x5678...9abc', contribution: 22.4, strokeCount: 89, timeSpent: 900 },
    ],
    createdAt: new Date('2024-03-15T10:30:00Z'),
    mintedAt: new Date('2024-03-16T14:20:00Z'),
    nftTokenId: 1,
    price: BigInt('50000000000000000'), // 0.05 ETH
    dailyTheme: {
      id: 'spring-2024-03-15',
      date: '2024-03-15',
      title: '春日暖阳',
      titleEn: 'Spring Sunshine',
      description: '春天的温暖阳光照耀着大地，万物复苏，生机盎然。',
      nushuCharacter: {
        character: '春',
        meaning: '春天，生机，希望',
        pronunciation: 'chūn',
      },
    },
  },
  {
    id: '2',
    title: '夏夜星空',
    canvasData: '',
    contributors: [
      { address: '0xabcd...1234', contribution: 38.7, strokeCount: 198, timeSpent: 1500 },
      { address: '0xef01...5678', contribution: 35.2, strokeCount: 167, timeSpent: 1350 },
      { address: '0x2345...cdef', contribution: 26.1, strokeCount: 123, timeSpent: 1050 },
    ],
    createdAt: new Date('2024-03-14T20:15:00Z'),
    mintedAt: new Date('2024-03-15T09:45:00Z'),
    nftTokenId: 2,
    price: BigInt('75000000000000000'), // 0.075 ETH
    dailyTheme: {
      id: 'summer-2024-03-14',
      date: '2024-03-14',
      title: '夏夜繁星',
      titleEn: 'Summer Starry Night',
      description: '夏日夜晚，繁星点点，银河璀璨，诉说着古老的女书传说。',
      nushuCharacter: {
        character: '夏',
        meaning: '夏天，热情，繁盛',
        pronunciation: 'xià',
      },
    },
  },
  {
    id: '3',
    title: '秋月如钩',
    canvasData: '',
    contributors: [
      { address: '0x6789...abcd', contribution: 42.3, strokeCount: 211, timeSpent: 1680 },
      { address: '0xcdef...0123', contribution: 31.8, strokeCount: 145, timeSpent: 1200 },
      { address: '0x4567...89ab', contribution: 25.9, strokeCount: 98, timeSpent: 960 },
    ],
    createdAt: new Date('2024-03-13T16:45:00Z'),
    price: BigInt('60000000000000000'), // 0.06 ETH
    dailyTheme: {
      id: 'autumn-2024-03-13',
      date: '2024-03-13',
      title: '秋月寄情',
      titleEn: 'Autumn Moon Sentiment',
      description: '秋日月圆，思君不见，女书传情，诉说心中无限思念。',
      nushuCharacter: {
        character: '秋',
        meaning: '秋天，思念，收获',
        pronunciation: 'qiū',
      },
    },
  },
  {
    id: '4',
    title: '冬雪纷飞',
    canvasData: '',
    contributors: [
      { address: '0x89ab...cdef', contribution: 40.1, strokeCount: 189, timeSpent: 1440 },
      { address: '0x0123...4567', contribution: 33.5, strokeCount: 154, timeSpent: 1260 },
      { address: '0x5678...90ab', contribution: 26.4, strokeCount: 112, timeSpent: 1020 },
    ],
    createdAt: new Date('2024-03-12T12:20:00Z'),
    price: BigInt('80000000000000000'), // 0.08 ETH
    dailyTheme: {
      id: 'winter-2024-03-12',
      date: '2024-03-12',
      title: '冬雪飘洒',
      titleEn: 'Winter Snow',
      description: '冬日雪花纷飞，天地一片洁白，女书字迹在雪中显得格外清晰。',
      nushuCharacter: {
        character: '冬',
        meaning: '冬天，纯洁，坚韧',
        pronunciation: 'dōng',
      },
    },
  },
];

interface UseExhibitionDataOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

interface ExhibitionData {
  featuredArtwork: Artwork | null;
  artworks: Artwork[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useExhibitionData(options: UseExhibitionDataOptions = {}): ExhibitionData {
  const { pageSize = 12, autoLoad = true } = options;
  const { isConnected } = useWallet();
  
  const [state, setState] = useState({
    featuredArtwork: null as Artwork | null,
    artworks: [] as Artwork[],
    isLoading: false,
    error: null as string | null,
    hasMore: true,
    totalCount: 0,
    currentPage: 0,
  });

  // Simulate API call to fetch artworks
  const fetchArtworks = useCallback(async (page: number = 0, append: boolean = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedArtworks = mockArtworks.slice(startIndex, endIndex);
      
      const hasMore = endIndex < mockArtworks.length;
      
      setState(prev => ({
        ...prev,
        artworks: append ? [...prev.artworks, ...paginatedArtworks] : paginatedArtworks,
        featuredArtwork: prev.featuredArtwork || mockArtworks[0] || null,
        hasMore,
        totalCount: mockArtworks.length,
        currentPage: page,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '加载作品失败',
        isLoading: false,
      }));
    }
  }, [pageSize]);

  // Load more artworks
  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;
    
    await fetchArtworks(state.currentPage + 1, true);
  }, [state.isLoading, state.hasMore, state.currentPage, fetchArtworks]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await fetchArtworks(0, false);
  }, [fetchArtworks]);

  // Initial load
  useEffect(() => {
    if (autoLoad) {
      fetchArtworks(0, false);
    }
  }, [autoLoad, fetchArtworks]);

  return {
    featuredArtwork: state.featuredArtwork,
    artworks: state.artworks,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    loadMore,
    refresh,
  };
}

// Hook for handling artwork purchase flow
export function useArtworkPurchase() {
  const { isConnected, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseArtwork = useCallback(async (artwork: Artwork) => {
    setError(null);
    
    // Check wallet connection
    if (!isConnected) {
      connect();
      return false;
    }

    if (!artwork.price) {
      setError('该作品暂不可购买');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Simulate purchase transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with the actual smart contract
      console.log('Purchasing artwork:', artwork.id, 'for', artwork.price);
      
      // Show success message or redirect
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '购买失败，请重试';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, connect]);

  return {
    purchaseArtwork,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Hook for artwork viewing and details
export function useArtworkViewing() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const viewArtwork = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing the artwork to allow exit animation
    setTimeout(() => setSelectedArtwork(null), 300);
  }, []);

  return {
    selectedArtwork,
    isModalOpen,
    viewArtwork,
    closeModal,
  };
}