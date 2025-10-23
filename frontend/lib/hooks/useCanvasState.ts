import { useCallback, useEffect, useState } from 'react';
import { useStorage, useMutation, useMyPresence, client } from '../liveblocks/config';
import type { CanvasState, CanvasOperation, ContributorData } from '../../types';

export function useCanvasState() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state fallbacks when Liveblocks is not available
  const [localCanvasObjects, setLocalCanvasObjects] = useState<any[]>([]);
  const [localCanvasVersion, setLocalCanvasVersion] = useState(0);
  const [localContributors, setLocalContributors] = useState<Record<string, ContributorData>>({});
  const [localPresence, setLocalPresence] = useState<any>({
    cursor: null,
    selectedColor: null,
    isDrawing: false,
    userAddress: null,
    userName: null,
  });

  // Try to use Liveblocks if available, otherwise use local state
  const canvasObjects = client ? useStorage((root) => root.canvasObjects) : localCanvasObjects;
  const canvasVersion = client ? useStorage((root) => root.canvasVersion) : localCanvasVersion;
  const lastModified = client ? useStorage((root) => root.lastModified) : new Date().toISOString();
  const contributors = client ? useStorage((root) => root.contributors) : localContributors;

  // Get current user presence
  const [myPresence, updateMyPresence] = client ? useMyPresence() : [localPresence, setLocalPresence];

  // Mutation to update canvas objects
  const updateCanvasObjects = client ? useMutation(({ storage }, objects: any[]) => {
    storage.set('canvasObjects', objects);
    storage.set('canvasVersion', (storage.get('canvasVersion') || 0) + 1);
    storage.set('lastModified', new Date().toISOString());
  }, []) : useCallback((objects: any[]) => {
    setLocalCanvasObjects(objects);
    setLocalCanvasVersion(prev => prev + 1);
  }, []);

  // Mutation to add a single object
  const addCanvasObject = client ? useMutation(({ storage }, object: any) => {
    const currentObjects = storage.get('canvasObjects') || [];
    const newObjects = [...currentObjects, object];
    storage.set('canvasObjects', newObjects);
    storage.set('canvasVersion', (storage.get('canvasVersion') || 0) + 1);
    storage.set('lastModified', new Date().toISOString());
  }, []) : useCallback((object: any) => {
    setLocalCanvasObjects(prev => [...prev, object]);
    setLocalCanvasVersion(prev => prev + 1);
  }, []);

  // Mutation to update contributor data
  const updateContributor = client ? useMutation(
    ({ storage }, userAddress: string, updates: Partial<ContributorData>) => {
      const currentContributors = storage.get('contributors') || {};
      const existingData = currentContributors[userAddress] || {
        address: userAddress,
        strokeCount: 0,
        timeSpent: 0,
        lastActive: new Date().toISOString(),
      };

      const updatedData = {
        ...existingData,
        ...updates,
        lastActive: new Date().toISOString(),
      };

      storage.set('contributors', {
        ...currentContributors,
        [userAddress]: updatedData,
      });
    },
    []
  ) : useCallback((userAddress: string, updates: Partial<ContributorData>) => {
    setLocalContributors(prev => {
      const existingData = prev[userAddress] || {
        address: userAddress,
        strokeCount: 0,
        timeSpent: 0,
        lastActive: new Date().toISOString(),
      };

      return {
        ...prev,
        [userAddress]: {
          ...existingData,
          ...updates,
          lastActive: new Date().toISOString(),
        }
      };
    });
  }, []);

  // Mutation to clear canvas
  const clearCanvas = client ? useMutation(({ storage }) => {
    storage.set('canvasObjects', []);
    storage.set('canvasVersion', (storage.get('canvasVersion') || 0) + 1);
    storage.set('lastModified', new Date().toISOString());
  }, []) : useCallback(() => {
    setLocalCanvasObjects([]);
    setLocalCanvasVersion(prev => prev + 1);
  }, []);

  // Update drawing state
  const setIsDrawing = useCallback((isDrawing: boolean) => {
    if (client) {
      updateMyPresence({ isDrawing });
    } else {
      setLocalPresence(prev => ({ ...prev, isDrawing }));
    }
  }, [updateMyPresence]);

  // Update selected color
  const setSelectedColor = useCallback((color: string | null) => {
    if (client) {
      updateMyPresence({ selectedColor: color });
    } else {
      setLocalPresence(prev => ({ ...prev, selectedColor: color }));
    }
  }, [updateMyPresence]);

  // Update cursor position
  const updateCursor = useCallback((cursor: { x: number; y: number } | null) => {
    if (client) {
      updateMyPresence({ cursor });
    } else {
      setLocalPresence(prev => ({ ...prev, cursor }));
    }
  }, [updateMyPresence]);

  // Set user info
  const setUserInfo = useCallback((userAddress: string, userName?: string) => {
    const info = { 
      userAddress,
      userName: userName || `User ${userAddress.slice(0, 6)}...`,
    };
    if (client) {
      updateMyPresence(info);
    } else {
      setLocalPresence(prev => ({ ...prev, ...info }));
    }
  }, [updateMyPresence]);

  // Record stroke for contribution tracking
  const recordStroke = useCallback((userAddress: string) => {
    if (!userAddress) return;
    
    updateContributor(userAddress, {
      strokeCount: ((contributors?.[userAddress]?.strokeCount || 0) + 1),
    });
  }, [updateContributor, contributors]);

  // Build canvas state object
  const canvasState: CanvasState | null = canvasObjects ? {
    objects: canvasObjects,
    version: canvasVersion || 0,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    activeUsers: [], // Will be populated by useActiveUsers hook
  } : null;

  // Handle loading state
  useEffect(() => {
    // Always set loading to false after a short delay for local state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    // State
    canvasState,
    isLoading,
    error,
    contributors: contributors || {},
    myPresence,

    // Actions
    updateCanvasObjects,
    addCanvasObject,
    clearCanvas,
    setIsDrawing,
    setSelectedColor,
    updateCursor,
    setUserInfo,
    recordStroke,
    updateContributor,
  };
}