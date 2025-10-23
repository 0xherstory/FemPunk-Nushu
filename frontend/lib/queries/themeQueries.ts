'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryClient';
import { useAppStore } from '../stores/appStore';
import type { DailyTheme } from '../../types';

// Mock API functions (replace with actual API calls)
const themeApi = {
  getCurrentTheme: async (): Promise<DailyTheme> => {
    // Mock current daily theme
    const today = new Date().toISOString().split('T')[0];
    return {
      id: `theme-${today}`,
      date: today,
      title: '和谐',
      titleEn: 'Harmony',
      description: '今日主题是和谐，让我们一起创作体现和谐之美的作品。',
      nushuCharacter: {
        character: '𛆁',
        meaning: '和谐、平衡、美好',
        pronunciation: 'hé xié',
      },
    };
  },
  
  getThemeByDate: async (date: string): Promise<DailyTheme> => {
    // Mock theme by date
    return {
      id: `theme-${date}`,
      date,
      title: '历史主题',
      titleEn: 'Historical Theme',
      description: `${date} 的主题内容。`,
      nushuCharacter: {
        character: '𛆂',
        meaning: '历史、传承',
        pronunciation: 'lì shǐ',
      },
    };
  },
  
  getThemeHistory: async (page: number): Promise<{
    themes: DailyTheme[];
    hasMore: boolean;
    total: number;
  }> => {
    // Mock theme history
    return {
      themes: [],
      hasMore: false,
      total: 0,
    };
  },
};

// Query hooks
export function useCurrentTheme() {
  const { setCurrentTheme } = useAppStore();
  
  const query = useQuery({
    queryKey: queryKeys.themes.current(),
    queryFn: themeApi.getCurrentTheme,
    staleTime: 1000 * 60 * 60, // 1 hour - themes don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchInterval: 1000 * 60 * 60, // Refetch every hour to check for new themes
  });

  // Handle side effects
  React.useEffect(() => {
    if (query.data) {
      setCurrentTheme(query.data);
    }
  }, [query.data, setCurrentTheme]);

  return query;
}

export function useThemeByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.themes.byDate(date),
    queryFn: () => themeApi.getThemeByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - historical themes are stable
  });
}

export function useThemeHistory(page: number = 1) {
  return useQuery({
    queryKey: queryKeys.themes.history(page),
    queryFn: () => themeApi.getThemeHistory(page),
    staleTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: (previousData) => previousData,
  });
}

// Utility hooks
export function useTodayTheme() {
  const today = new Date().toISOString().split('T')[0];
  return useThemeByDate(today);
}

export function useYesterdayTheme() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return useThemeByDate(yesterdayStr);
}

// Prefetch functions
export const createThemeQueryPrefetch = (queryClient: any) => ({
  prefetchCurrentTheme: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.themes.current(),
      queryFn: themeApi.getCurrentTheme,
      staleTime: 1000 * 60 * 60,
    });
  },
  
  prefetchThemeByDate: (date: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.themes.byDate(date),
      queryFn: () => themeApi.getThemeByDate(date),
      staleTime: 1000 * 60 * 60 * 24,
    });
  },
  
  prefetchThemeHistory: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.themes.history(1),
      queryFn: () => themeApi.getThemeHistory(1),
      staleTime: 1000 * 60 * 30,
    });
  },
});