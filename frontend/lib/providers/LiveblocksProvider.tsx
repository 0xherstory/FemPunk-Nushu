'use client';

import { ReactNode } from 'react';
import { client, RoomProvider, ROOM_CONFIG } from '../liveblocks/config';

interface LiveblocksProviderProps {
  children: ReactNode;
  roomId: string;
  initialPresence?: any;
  initialStorage?: any;
}

export function LiveblocksProvider({ 
  children, 
  roomId,
  initialPresence,
  initialStorage 
}: LiveblocksProviderProps) {
  // If Liveblocks is not configured, render children without provider
  if (!client) {
    return <>{children}</>;
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={initialPresence || ROOM_CONFIG.initialPresence}
      initialStorage={initialStorage || ROOM_CONFIG.initialStorage}
    >
      {children}
    </RoomProvider>
  );
}

// Canvas-specific provider with today's room ID
export function CanvasLiveblocksProvider({ children }: { children: ReactNode }) {
  const today = new Date().toISOString().split('T')[0];
  const roomId = `canvas-${today}`;

  return (
    <LiveblocksProvider roomId={roomId}>
      {children}
    </LiveblocksProvider>
  );
}