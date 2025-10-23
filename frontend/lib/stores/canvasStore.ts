'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CanvasState, CanvasStore as CanvasStoreType, DrawingTool, CanvasOperation } from '../../types';

interface CanvasStore extends CanvasStoreType {
  // Drawing tools
  selectedTool: 'brush' | 'eraser';
  brushSize: number;
  brushOpacity: number;
  
  // Canvas operations
  operationHistory: CanvasOperation[];
  undoStack: CanvasOperation[];
  redoStack: CanvasOperation[];
  
  // Actions
  setCanvasState: (state: CanvasState | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTool: (tool: 'brush' | 'eraser') => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  
  // Canvas operations
  addOperation: (operation: CanvasOperation) => void;
  undo: () => CanvasOperation | null;
  redo: () => CanvasOperation | null;
  clearHistory: () => void;
  
  // Canvas state management
  updateCanvasVersion: () => void;
  addActiveUser: (userId: string, userData: any) => void;
  removeActiveUser: (userId: string) => void;
  updateUserCursor: (userId: string, cursor: { x: number; y: number } | null) => void;
  
  // Computed values
  canUndo: () => boolean;
  canRedo: () => boolean;
  getActiveUserCount: () => number;
  isUserActive: (userId: string) => boolean;
  
  // Performance optimization
  lastSyncTime: number;
  syncThrottleMs: number;
  shouldSync: () => boolean;
  updateSyncTime: () => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  canvasState: null,
  isLoading: false,
  error: null,
  selectedTool: 'brush' as const,
  brushSize: 5,
  brushOpacity: 1,
  operationHistory: [],
  undoStack: [],
  redoStack: [],
  lastSyncTime: 0,
  syncThrottleMs: 100, // 100ms throttle for sync operations
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setCanvasState: (canvasState) => 
        set((state) => ({ ...state, canvasState })),
      
      setLoading: (isLoading) => 
        set((state) => ({ ...state, isLoading })),
      
      setError: (error) => 
        set((state) => ({ ...state, error })),
      
      setSelectedTool: (selectedTool) => 
        set((state) => ({ ...state, selectedTool })),
      
      setBrushSize: (brushSize) => 
        set((state) => ({ ...state, brushSize })),
      
      setBrushOpacity: (brushOpacity) => 
        set((state) => ({ ...state, brushOpacity })),
      
      // Canvas operations
      addOperation: (operation) => 
        set((state) => ({
          ...state,
          operationHistory: [...state.operationHistory, operation],
          undoStack: [...state.undoStack, operation],
          redoStack: [], // Clear redo stack when new operation is added
        })),
      
      undo: () => {
        const state = get();
        if (state.undoStack.length === 0) return null;
        
        const lastOperation = state.undoStack[state.undoStack.length - 1];
        set({
          ...state,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, lastOperation],
        });
        
        return lastOperation;
      },
      
      redo: () => {
        const state = get();
        if (state.redoStack.length === 0) return null;
        
        const nextOperation = state.redoStack[state.redoStack.length - 1];
        set({
          ...state,
          undoStack: [...state.undoStack, nextOperation],
          redoStack: state.redoStack.slice(0, -1),
        });
        
        return nextOperation;
      },
      
      clearHistory: () => 
        set((state) => ({
          ...state,
          operationHistory: [],
          undoStack: [],
          redoStack: [],
        })),
      
      // Canvas state management
      updateCanvasVersion: () => 
        set((state) => ({
          ...state,
          canvasState: state.canvasState ? {
            ...state.canvasState,
            version: state.canvasState.version + 1,
            lastModified: new Date(),
          } : null,
        })),
      
      addActiveUser: (userId, userData) => 
        set((state) => {
          if (!state.canvasState) return state;
          
          const existingUserIndex = state.canvasState.activeUsers.findIndex(
            user => user.address === userId
          );
          
          let newActiveUsers;
          if (existingUserIndex >= 0) {
            // Update existing user
            newActiveUsers = [...state.canvasState.activeUsers];
            newActiveUsers[existingUserIndex] = { ...newActiveUsers[existingUserIndex], ...userData };
          } else {
            // Add new user
            newActiveUsers = [...state.canvasState.activeUsers, { address: userId, ...userData }];
          }
          
          return {
            ...state,
            canvasState: {
              ...state.canvasState,
              activeUsers: newActiveUsers,
            },
          };
        }),
      
      removeActiveUser: (userId) => 
        set((state) => ({
          ...state,
          canvasState: state.canvasState ? {
            ...state.canvasState,
            activeUsers: state.canvasState.activeUsers.filter(user => user.address !== userId),
          } : null,
        })),
      
      updateUserCursor: (userId, cursor) => 
        set((state) => {
          if (!state.canvasState) return state;
          
          const userIndex = state.canvasState.activeUsers.findIndex(
            user => user.address === userId
          );
          
          if (userIndex === -1) return state;
          
          const newActiveUsers = [...state.canvasState.activeUsers];
          newActiveUsers[userIndex] = {
            ...newActiveUsers[userIndex],
            cursor,
          };
          
          return {
            ...state,
            canvasState: {
              ...state.canvasState,
              activeUsers: newActiveUsers,
            },
          };
        }),
      
      // Computed values
      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
      
      getActiveUserCount: () => get().canvasState?.activeUsers.length || 0,
      
      isUserActive: (userId) => {
        const { canvasState } = get();
        return canvasState?.activeUsers.some(user => user.address === userId) || false;
      },
      
      // Performance optimization
      shouldSync: () => {
        const { lastSyncTime, syncThrottleMs } = get();
        return Date.now() - lastSyncTime > syncThrottleMs;
      },
      
      updateSyncTime: () => 
        set((state) => ({ ...state, lastSyncTime: Date.now() })),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'canvas-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist tool settings, not canvas state (that comes from Liveblocks)
      partialize: (state) => ({
        selectedTool: state.selectedTool,
        brushSize: state.brushSize,
        brushOpacity: state.brushOpacity,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useCanvasState = () => useCanvasStore((state) => state.canvasState);
export const useCanvasLoading = () => useCanvasStore((state) => state.isLoading);
export const useCanvasError = () => useCanvasStore((state) => state.error);

export const useDrawingTools = () => useCanvasStore((state) => ({
  selectedTool: state.selectedTool,
  brushSize: state.brushSize,
  brushOpacity: state.brushOpacity,
  setSelectedTool: state.setSelectedTool,
  setBrushSize: state.setBrushSize,
  setBrushOpacity: state.setBrushOpacity,
}));

export const useCanvasHistory = () => useCanvasStore((state) => ({
  canUndo: state.canUndo(),
  canRedo: state.canRedo(),
  undo: state.undo,
  redo: state.redo,
  clearHistory: state.clearHistory,
}));

export const useActiveUsers = () => useCanvasStore((state) => ({
  activeUsers: state.canvasState?.activeUsers || [],
  activeUserCount: state.getActiveUserCount(),
  isUserActive: state.isUserActive,
  addActiveUser: state.addActiveUser,
  removeActiveUser: state.removeActiveUser,
  updateUserCursor: state.updateUserCursor,
}));

export const useCanvasSync = () => useCanvasStore((state) => ({
  shouldSync: state.shouldSync(),
  updateSyncTime: state.updateSyncTime,
  lastSyncTime: state.lastSyncTime,
}));