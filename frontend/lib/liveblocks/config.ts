import React from 'react';
import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

// Liveblocks client configuration
const publicKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

export const client = publicKey ? createClient({
  publicApiKey: publicKey,
  throttle: 16, // 60fps for smooth collaboration
}) : null;

// Define the collaborative state structure
export type Presence = {
  cursor: { x: number; y: number } | null;
  selectedColor: string | null;
  isDrawing: boolean;
  userAddress: string | null;
  userName: string | null;
};

export type Storage = {
  canvasObjects: any[]; // Will be properly typed with fabric.Object[]
  canvasVersion: number;
  lastModified: string;
  contributors: Record<string, {
    address: string;
    strokeCount: number;
    timeSpent: number;
    lastActive: string;
  }>;
};

export type UserMeta = {
  id: string;
  info: {
    address: string;
    name?: string;
    avatar?: string;
  };
};

export type RoomEvent = {
  type: 'CANVAS_UPDATED' | 'USER_JOINED' | 'USER_LEFT' | 'STROKE_ADDED';
  data: any;
  timestamp: string;
  userId: string;
};

// Create room context with proper typing (only if client exists)
const roomContext = client ? createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client) : null;

export const RoomProvider = roomContext?.RoomProvider || (({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children));
export const useRoom = roomContext?.useRoom || (() => null);
export const useMyPresence = roomContext?.useMyPresence || (() => [null, () => {}]);
export const useOthers = roomContext?.useOthers || (() => []);
export const useBroadcastEvent = roomContext?.useBroadcastEvent || (() => () => {});
export const useEventListener = roomContext?.useEventListener || (() => {});
export const useStorage = roomContext?.useStorage || (() => null);
export const useMutation = roomContext?.useMutation || (() => () => {});
export const useHistory = roomContext?.useHistory || (() => ({ canUndo: false, canRedo: false, undo: () => {}, redo: () => {} }));
export const useCanUndo = roomContext?.useCanUndo || (() => false);
export const useCanRedo = roomContext?.useCanRedo || (() => false);
export const useUndo = roomContext?.useUndo || (() => () => {});
export const useRedo = roomContext?.useRedo || (() => () => {});

// Room configuration
export const ROOM_CONFIG = {
  initialPresence: {
    cursor: null,
    selectedColor: null,
    isDrawing: false,
    userAddress: null,
    userName: null,
  } as Presence,
  
  initialStorage: {
    canvasObjects: [],
    canvasVersion: 0,
    lastModified: new Date().toISOString(),
    contributors: {},
  } as Storage,
};

// Canvas room ID generator
export function generateCanvasRoomId(date: string): string {
  return `canvas-${date}`;
}

// Get today's canvas room ID
export function getTodayCanvasRoomId(): string {
  const today = new Date().toISOString().split('T')[0];
  return generateCanvasRoomId(today);
}