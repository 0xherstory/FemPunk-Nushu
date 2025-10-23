import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasStore } from '../../lib/stores/canvasStore';
import type { CanvasState, CanvasOperation } from '../../types';

const mockCanvasState: CanvasState = {
  objects: [],
  version: 1,
  lastModified: new Date('2024-01-01'),
  activeUsers: [
    {
      address: '0x1234567890123456789012345678901234567890',
      cursor: { x: 100, y: 200 },
      selectedColor: '#FF0000',
      isDrawing: false,
    },
  ],
};

const mockOperation: CanvasOperation = {
  id: 'op-1',
  type: 'draw',
  userId: '0x1234567890123456789012345678901234567890',
  timestamp: new Date('2024-01-01'),
  data: {
    path: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
    color: '#FF0000',
    brushSize: 5,
  },
};

describe('CanvasStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCanvasStore.getState().reset();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      expect(result.current.canvasState).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedTool).toBe('brush');
      expect(result.current.brushSize).toBe(5);
      expect(result.current.brushOpacity).toBe(1);
      expect(result.current.operationHistory).toEqual([]);
      expect(result.current.undoStack).toEqual([]);
      expect(result.current.redoStack).toEqual([]);
    });
  });

  describe('Canvas State Management', () => {
    it('should set canvas state', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setCanvasState(mockCanvasState);
      });

      expect(result.current.canvasState).toEqual(mockCanvasState);
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useCanvasStore());
      const error = 'Canvas load failed';

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('Drawing Tools', () => {
    it('should set selected tool', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setSelectedTool('eraser');
      });

      expect(result.current.selectedTool).toBe('eraser');
    });

    it('should set brush size', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setBrushSize(10);
      });

      expect(result.current.brushSize).toBe(10);
    });

    it('should set brush opacity', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setBrushOpacity(0.5);
      });

      expect(result.current.brushOpacity).toBe(0.5);
    });
  });

  describe('Canvas Operations', () => {
    it('should add operation to history and undo stack', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addOperation(mockOperation);
      });

      expect(result.current.operationHistory).toContain(mockOperation);
      expect(result.current.undoStack).toContain(mockOperation);
      expect(result.current.redoStack).toEqual([]);
    });

    it('should clear redo stack when adding new operation', () => {
      const { result } = renderHook(() => useCanvasStore());
      const operation2: CanvasOperation = { ...mockOperation, id: 'op-2' };

      // Add operation, then undo it to populate redo stack
      act(() => {
        result.current.addOperation(mockOperation);
        result.current.undo();
      });

      expect(result.current.redoStack).toHaveLength(1);

      // Add new operation should clear redo stack
      act(() => {
        result.current.addOperation(operation2);
      });

      expect(result.current.redoStack).toEqual([]);
    });

    it('should undo operation', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addOperation(mockOperation);
      });

      let undoneOperation: any;
      act(() => {
        undoneOperation = result.current.undo();
      });

      expect(undoneOperation).toEqual(mockOperation);
      expect(result.current.undoStack).toEqual([]);
      expect(result.current.redoStack).toContain(mockOperation);
    });

    it('should return null when undoing empty stack', () => {
      const { result } = renderHook(() => useCanvasStore());

      let undoneOperation: any;
      act(() => {
        undoneOperation = result.current.undo();
      });

      expect(undoneOperation).toBeNull();
    });

    it('should redo operation', () => {
      const { result } = renderHook(() => useCanvasStore());

      // Add and undo operation first
      act(() => {
        result.current.addOperation(mockOperation);
        result.current.undo();
      });

      let redoneOperation: any;
      act(() => {
        redoneOperation = result.current.redo();
      });

      expect(redoneOperation).toEqual(mockOperation);
      expect(result.current.undoStack).toContain(mockOperation);
      expect(result.current.redoStack).toEqual([]);
    });

    it('should return null when redoing empty stack', () => {
      const { result } = renderHook(() => useCanvasStore());

      let redoneOperation: any;
      act(() => {
        redoneOperation = result.current.redo();
      });

      expect(redoneOperation).toBeNull();
    });

    it('should clear history', () => {
      const { result } = renderHook(() => useCanvasStore());

      // Add some operations first
      act(() => {
        result.current.addOperation(mockOperation);
        result.current.undo();
      });

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.operationHistory).toEqual([]);
      expect(result.current.undoStack).toEqual([]);
      expect(result.current.redoStack).toEqual([]);
    });
  });

  describe('Canvas Version Management', () => {
    it('should update canvas version', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setCanvasState(mockCanvasState);
      });

      const originalVersion = result.current.canvasState!.version;

      act(() => {
        result.current.updateCanvasVersion();
      });

      expect(result.current.canvasState!.version).toBe(originalVersion + 1);
      expect(result.current.canvasState!.lastModified).toBeInstanceOf(Date);
    });

    it('should not update version when canvas state is null', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updateCanvasVersion();
      });

      expect(result.current.canvasState).toBeNull();
    });
  });

  describe('Active Users Management', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useCanvasStore());
      act(() => {
        result.current.setCanvasState(mockCanvasState);
      });
    });

    it('should add new active user', () => {
      const { result } = renderHook(() => useCanvasStore());
      const newUserId = '0x9876543210987654321098765432109876543210';
      const userData = { cursor: { x: 50, y: 75 }, selectedColor: '#00FF00', isDrawing: true };

      act(() => {
        result.current.addActiveUser(newUserId, userData);
      });

      const activeUsers = result.current.canvasState!.activeUsers;
      expect(activeUsers).toHaveLength(2);
      expect(activeUsers.find(user => user.address === newUserId)).toMatchObject({
        address: newUserId,
        ...userData,
      });
    });

    it('should update existing active user', () => {
      const { result } = renderHook(() => useCanvasStore());
      const existingUserId = '0x1234567890123456789012345678901234567890';
      const updatedData = { selectedColor: '#0000FF', isDrawing: true };

      act(() => {
        result.current.addActiveUser(existingUserId, updatedData);
      });

      const activeUsers = result.current.canvasState!.activeUsers;
      expect(activeUsers).toHaveLength(1);
      const updatedUser = activeUsers.find(user => user.address === existingUserId);
      expect(updatedUser).toMatchObject({
        address: existingUserId,
        cursor: { x: 100, y: 200 }, // Original cursor should remain
        selectedColor: '#0000FF', // Updated
        isDrawing: true, // Updated
      });
    });

    it('should remove active user', () => {
      const { result } = renderHook(() => useCanvasStore());
      const userIdToRemove = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.removeActiveUser(userIdToRemove);
      });

      const activeUsers = result.current.canvasState!.activeUsers;
      expect(activeUsers).toHaveLength(0);
    });

    it('should update user cursor', () => {
      const { result } = renderHook(() => useCanvasStore());
      const userId = '0x1234567890123456789012345678901234567890';
      const newCursor = { x: 300, y: 400 };

      act(() => {
        result.current.updateUserCursor(userId, newCursor);
      });

      const activeUsers = result.current.canvasState!.activeUsers;
      const user = activeUsers.find(u => u.address === userId);
      expect(user?.cursor).toEqual(newCursor);
    });

    it('should handle cursor update for non-existent user', () => {
      const { result } = renderHook(() => useCanvasStore());
      const nonExistentUserId = '0x9999999999999999999999999999999999999999';
      const newCursor = { x: 300, y: 400 };

      act(() => {
        result.current.updateUserCursor(nonExistentUserId, newCursor);
      });

      // Should not crash and state should remain unchanged
      expect(result.current.canvasState!.activeUsers).toHaveLength(1);
    });
  });

  describe('Computed Values', () => {
    it('should check if can undo', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.canUndo()).toBe(false);

      act(() => {
        result.current.addOperation(mockOperation);
      });

      expect(result.current.canUndo()).toBe(true);
    });

    it('should check if can redo', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.canRedo()).toBe(false);

      act(() => {
        result.current.addOperation(mockOperation);
        result.current.undo();
      });

      expect(result.current.canRedo()).toBe(true);
    });

    it('should get active user count', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.getActiveUserCount()).toBe(0);

      act(() => {
        result.current.setCanvasState(mockCanvasState);
      });

      expect(result.current.getActiveUserCount()).toBe(1);
    });

    it('should check if user is active', () => {
      const { result } = renderHook(() => useCanvasStore());
      const userId = '0x1234567890123456789012345678901234567890';

      expect(result.current.isUserActive(userId)).toBe(false);

      act(() => {
        result.current.setCanvasState(mockCanvasState);
      });

      expect(result.current.isUserActive(userId)).toBe(true);
    });
  });

  describe('Performance Optimization', () => {
    it('should track sync timing', () => {
      const { result } = renderHook(() => useCanvasStore());

      // Initially should be able to sync
      expect(result.current.shouldSync()).toBe(true);

      act(() => {
        result.current.updateSyncTime();
      });

      // Immediately after update, should not sync (within throttle)
      expect(result.current.shouldSync()).toBe(false);
    });

    it('should allow sync after throttle period', async () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updateSyncTime();
      });

      // Mock time passage
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 200); // 200ms later

      expect(result.current.shouldSync()).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useCanvasStore());

      // Set some state first
      act(() => {
        result.current.setCanvasState(mockCanvasState);
        result.current.setSelectedTool('eraser');
        result.current.setBrushSize(15);
        result.current.addOperation(mockOperation);
        result.current.setLoading(true);
        result.current.setError('Some error');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.canvasState).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedTool).toBe('brush');
      expect(result.current.brushSize).toBe(5);
      expect(result.current.brushOpacity).toBe(1);
      expect(result.current.operationHistory).toEqual([]);
      expect(result.current.undoStack).toEqual([]);
      expect(result.current.redoStack).toEqual([]);
    });
  });
});