'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DailyTheme, AppError } from '../../types';

interface AppStore {
  // Global UI state
  isLoading: boolean;
  globalError: AppError | null;
  
  // Modal states
  walletModalOpen: boolean;
  nftDetailsModalOpen: boolean;
  artworkDetailsModalOpen: boolean;
  
  // Current data
  currentTheme: DailyTheme | null;
  
  // Network status
  isOnline: boolean;
  lastSyncTime: number;
  
  // User preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'zh' | 'en';
    autoSave: boolean;
    showTutorial: boolean;
    enableNotifications: boolean;
  };
  
  // Actions
  setLoading: (isLoading: boolean) => void;
  setGlobalError: (error: AppError | null) => void;
  
  // Modal actions
  setWalletModalOpen: (open: boolean) => void;
  setNftDetailsModalOpen: (open: boolean) => void;
  setArtworkDetailsModalOpen: (open: boolean) => void;
  closeAllModals: () => void;
  
  // Data actions
  setCurrentTheme: (theme: DailyTheme | null) => void;
  
  // Network actions
  setOnline: (isOnline: boolean) => void;
  updateSyncTime: () => void;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<AppStore['preferences']>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'zh' | 'en') => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  isLoading: false,
  globalError: null,
  walletModalOpen: false,
  nftDetailsModalOpen: false,
  artworkDetailsModalOpen: false,
  currentTheme: null,
  isOnline: true,
  lastSyncTime: Date.now(),
  preferences: {
    theme: 'system' as const,
    language: 'zh' as const,
    autoSave: true,
    showTutorial: true,
    enableNotifications: true,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setLoading: (isLoading) => 
        set((state) => ({ ...state, isLoading })),
      
      setGlobalError: (globalError) => 
        set((state) => ({ ...state, globalError })),
      
      // Modal actions
      setWalletModalOpen: (walletModalOpen) => 
        set((state) => ({ ...state, walletModalOpen })),
      
      setNftDetailsModalOpen: (nftDetailsModalOpen) => 
        set((state) => ({ ...state, nftDetailsModalOpen })),
      
      setArtworkDetailsModalOpen: (artworkDetailsModalOpen) => 
        set((state) => ({ ...state, artworkDetailsModalOpen })),
      
      closeAllModals: () => 
        set((state) => ({
          ...state,
          walletModalOpen: false,
          nftDetailsModalOpen: false,
          artworkDetailsModalOpen: false,
        })),
      
      // Data actions
      setCurrentTheme: (currentTheme) => 
        set((state) => ({ ...state, currentTheme })),
      
      // Network actions
      setOnline: (isOnline) => 
        set((state) => ({ ...state, isOnline })),
      
      updateSyncTime: () => 
        set((state) => ({ ...state, lastSyncTime: Date.now() })),
      
      // Preferences actions
      updatePreferences: (newPreferences) => 
        set((state) => ({
          ...state,
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      setTheme: (theme) => 
        set((state) => ({
          ...state,
          preferences: { ...state.preferences, theme },
        })),
      
      setLanguage: (language) => 
        set((state) => ({
          ...state,
          preferences: { ...state.preferences, language },
        })),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      // Persist preferences and some UI state
      partialize: (state) => ({
        preferences: state.preferences,
        currentTheme: state.currentTheme,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useAppLoading = () => useAppStore((state) => state.isLoading);
export const useGlobalError = () => useAppStore((state) => state.globalError);

export const useModals = () => useAppStore((state) => ({
  walletModalOpen: state.walletModalOpen,
  nftDetailsModalOpen: state.nftDetailsModalOpen,
  artworkDetailsModalOpen: state.artworkDetailsModalOpen,
  setWalletModalOpen: state.setWalletModalOpen,
  setNftDetailsModalOpen: state.setNftDetailsModalOpen,
  setArtworkDetailsModalOpen: state.setArtworkDetailsModalOpen,
  closeAllModals: state.closeAllModals,
}));

export const useCurrentTheme = () => useAppStore((state) => state.currentTheme);

export const useNetworkStatus = () => useAppStore((state) => ({
  isOnline: state.isOnline,
  lastSyncTime: state.lastSyncTime,
  setOnline: state.setOnline,
  updateSyncTime: state.updateSyncTime,
}));

export const usePreferences = () => useAppStore((state) => ({
  preferences: state.preferences,
  updatePreferences: state.updatePreferences,
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
}));