import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorStore } from '../../lib/stores/colorStore';
import type { ColorNFT } from '../../types';

const mockColorNFT: ColorNFT = {
  id: 'test-color-1',
  colorHex: '#FF0000',
  tokenId: 1,
  owner: '0x1234567890123456789012345678901234567890',
  mintedAt: new Date('2024-01-01'),
  price: '1000000000000000000' as any, // Use string instead of BigInt for tests
};

const mockColorNFT2: ColorNFT = {
  id: 'test-color-2',
  colorHex: '#00FF00',
  tokenId: 2,
  owner: '0x1234567890123456789012345678901234567890',
  mintedAt: new Date('2024-01-02'),
  price: '1500000000000000000' as any, // Use string instead of BigInt for tests
};

describe('ColorStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useColorStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useColorStore());
      
      expect(result.current.userColors).toEqual([]);
      expect(result.current.availableColors).toEqual([]);
      expect(result.current.selectedColor).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('User Colors Management', () => {
    it('should set user colors', () => {
      const { result } = renderHook(() => useColorStore());
      const colors = [mockColorNFT, mockColorNFT2];

      act(() => {
        result.current.setUserColors(colors);
      });

      expect(result.current.userColors).toEqual(colors);
    });

    it('should add user color', () => {
      const { result } = renderHook(() => useColorStore());

      act(() => {
        result.current.addUserColor(mockColorNFT);
      });

      expect(result.current.userColors).toContain(mockColorNFT);
    });

    it('should remove user color', () => {
      const { result } = renderHook(() => useColorStore());

      // Add colors first
      act(() => {
        result.current.setUserColors([mockColorNFT, mockColorNFT2]);
      });

      // Remove one color
      act(() => {
        result.current.removeUserColor(mockColorNFT.id);
      });

      expect(result.current.userColors).not.toContain(mockColorNFT);
      expect(result.current.userColors).toContain(mockColorNFT2);
    });

    it('should move color from available to user colors when added', () => {
      const { result } = renderHook(() => useColorStore());

      // Set available colors first
      act(() => {
        result.current.setAvailableColors([mockColorNFT, mockColorNFT2]);
      });

      // Add one to user colors
      act(() => {
        result.current.addUserColor(mockColorNFT);
      });

      expect(result.current.userColors).toContain(mockColorNFT);
      expect(result.current.availableColors).not.toContain(mockColorNFT);
      expect(result.current.availableColors).toContain(mockColorNFT2);
    });
  });

  describe('Available Colors Management', () => {
    it('should set available colors', () => {
      const { result } = renderHook(() => useColorStore());
      const colors = [mockColorNFT, mockColorNFT2];

      act(() => {
        result.current.setAvailableColors(colors);
      });

      expect(result.current.availableColors).toEqual(colors);
    });
  });

  describe('Selected Color Management', () => {
    it('should set selected color', () => {
      const { result } = renderHook(() => useColorStore());
      const colorHex = '#FF0000';

      act(() => {
        result.current.setSelectedColor(colorHex);
      });

      expect(result.current.selectedColor).toBe(colorHex);
    });

    it('should clear selected color', () => {
      const { result } = renderHook(() => useColorStore());

      // Set a color first
      act(() => {
        result.current.setSelectedColor('#FF0000');
      });

      // Clear it
      act(() => {
        result.current.setSelectedColor(null);
      });

      expect(result.current.selectedColor).toBeNull();
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useColorStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useColorStore());
      const error = 'Failed to load colors';

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('Computed Values', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useColorStore());
      act(() => {
        result.current.setUserColors([mockColorNFT, mockColorNFT2]);
      });
    });

    it('should check if user has color', () => {
      const { result } = renderHook(() => useColorStore());

      expect(result.current.hasColor('#FF0000')).toBe(true);
      expect(result.current.hasColor('#0000FF')).toBe(false);
    });

    it('should get color by ID', () => {
      const { result } = renderHook(() => useColorStore());

      expect(result.current.getColorById('test-color-1')).toEqual(mockColorNFT);
      expect(result.current.getColorById('nonexistent')).toBeUndefined();
    });

    it('should get user color count', () => {
      const { result } = renderHook(() => useColorStore());

      expect(result.current.getUserColorCount()).toBe(2);
    });

    it('should get available color count', () => {
      const { result } = renderHook(() => useColorStore());
      
      act(() => {
        result.current.setAvailableColors([mockColorNFT]);
      });

      expect(result.current.getAvailableColorCount()).toBe(1);
    });
  });

  describe('Purchase Tracking', () => {
    it('should track purchase in progress', () => {
      const { result } = renderHook(() => useColorStore());
      const colorId = 'test-color-1';

      act(() => {
        result.current.setPurchaseInProgress(colorId, true);
      });

      expect(result.current.isPurchasing(colorId)).toBe(true);
    });

    it('should stop tracking purchase', () => {
      const { result } = renderHook(() => useColorStore());
      const colorId = 'test-color-1';

      // Start tracking
      act(() => {
        result.current.setPurchaseInProgress(colorId, true);
      });

      // Stop tracking
      act(() => {
        result.current.setPurchaseInProgress(colorId, false);
      });

      expect(result.current.isPurchasing(colorId)).toBe(false);
    });

    it('should track multiple purchases independently', () => {
      const { result } = renderHook(() => useColorStore());
      const colorId1 = 'test-color-1';
      const colorId2 = 'test-color-2';

      act(() => {
        result.current.setPurchaseInProgress(colorId1, true);
        result.current.setPurchaseInProgress(colorId2, true);
      });

      expect(result.current.isPurchasing(colorId1)).toBe(true);
      expect(result.current.isPurchasing(colorId2)).toBe(true);

      act(() => {
        result.current.setPurchaseInProgress(colorId1, false);
      });

      expect(result.current.isPurchasing(colorId1)).toBe(false);
      expect(result.current.isPurchasing(colorId2)).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useColorStore());

      // Set some state first
      act(() => {
        result.current.setUserColors([mockColorNFT]);
        result.current.setSelectedColor('#FF0000');
        result.current.setLoading(true);
        result.current.setError('Some error');
        result.current.setPurchaseInProgress('test-color-1', true);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.userColors).toEqual([]);
      expect(result.current.availableColors).toEqual([]);
      expect(result.current.selectedColor).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isPurchasing('test-color-1')).toBe(false);
    });
  });
});