'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ColorNFT, ColorState } from '../../types';

interface ColorStore extends ColorState {
  // Actions
  setUserColors: (colors: ColorNFT[]) => void;
  addUserColor: (color: ColorNFT) => void;
  removeUserColor: (colorId: string) => void;
  setAvailableColors: (colors: ColorNFT[]) => void;
  setSelectedColor: (colorHex: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Computed values
  hasColor: (colorHex: string) => boolean;
  getColorById: (colorId: string) => ColorNFT | undefined;
  getUserColorCount: () => number;
  getAvailableColorCount: () => number;
  
  // Purchase tracking
  purchaseInProgress: Set<string>;
  setPurchaseInProgress: (colorId: string, inProgress: boolean) => void;
  isPurchasing: (colorId: string) => boolean;
}

const initialState: ColorState = {
  userColors: [],
  availableColors: [],
  selectedColor: null,
  isLoading: false,
  error: null,
};

export const useColorStore = create<ColorStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      purchaseInProgress: new Set<string>(),
      
      // Actions
      setUserColors: (userColors) => 
        set((state) => ({ ...state, userColors })),
      
      addUserColor: (color) => 
        set((state) => ({
          ...state,
          userColors: [...state.userColors, color],
          // Remove from available colors if it was there
          availableColors: state.availableColors.filter(c => c.id !== color.id),
        })),
      
      removeUserColor: (colorId) => 
        set((state) => ({
          ...state,
          userColors: state.userColors.filter(c => c.id !== colorId),
        })),
      
      setAvailableColors: (availableColors) => 
        set((state) => ({ ...state, availableColors })),
      
      setSelectedColor: (selectedColor) => 
        set((state) => ({ ...state, selectedColor })),
      
      setLoading: (isLoading) => 
        set((state) => ({ ...state, isLoading })),
      
      setError: (error) => 
        set((state) => ({ ...state, error })),
      
      reset: () => set({ ...initialState, purchaseInProgress: new Set() }),
      
      // Computed values
      hasColor: (colorHex) => {
        const { userColors } = get();
        return userColors.some(color => color.colorHex === colorHex);
      },
      
      getColorById: (colorId) => {
        const { userColors, availableColors } = get();
        return [...userColors, ...availableColors].find(color => color.id === colorId);
      },
      
      getUserColorCount: () => get().userColors.length,
      
      getAvailableColorCount: () => get().availableColors.length,
      
      // Purchase tracking
      setPurchaseInProgress: (colorId, inProgress) => 
        set((state) => {
          const newSet = new Set(state.purchaseInProgress);
          if (inProgress) {
            newSet.add(colorId);
          } else {
            newSet.delete(colorId);
          }
          return { ...state, purchaseInProgress: newSet };
        }),
      
      isPurchasing: (colorId) => get().purchaseInProgress.has(colorId),
    }),
    {
      name: 'color-store',
      storage: createJSONStorage(() => localStorage),
      // Persist user colors but not loading states
      partialize: (state) => ({
        userColors: state.userColors,
        selectedColor: state.selectedColor,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useUserColors = () => useColorStore((state) => state.userColors);
export const useAvailableColors = () => useColorStore((state) => state.availableColors);
export const useSelectedColor = () => useColorStore((state) => state.selectedColor);
export const useColorLoading = () => useColorStore((state) => state.isLoading);
export const useColorError = () => useColorStore((state) => state.error);

// Computed selectors
export const useColorOwnership = () => useColorStore((state) => ({
  hasColor: state.hasColor,
  getColorById: state.getColorById,
  userColorCount: state.getUserColorCount(),
  availableColorCount: state.getAvailableColorCount(),
}));

export const usePurchaseStatus = () => useColorStore((state) => ({
  setPurchaseInProgress: state.setPurchaseInProgress,
  isPurchasing: state.isPurchasing,
}));