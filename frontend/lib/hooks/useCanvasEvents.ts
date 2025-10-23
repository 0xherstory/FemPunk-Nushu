import { useCallback, useEffect, useState } from 'react';
import { useBroadcastEvent, useEventListener } from '../liveblocks/config';
import type { CanvasOperation } from '../../types';

export function useCanvasEvents() {
  const broadcast = useBroadcastEvent();
  const [eventCallbacks, setEventCallbacks] = useState<{
    onCanvasUpdated?: (operation: CanvasOperation) => void;
    onUserJoined?: (data: { userAddress: string; userName?: string }) => void;
    onUserLeft?: (data: { userAddress: string }) => void;
    onStrokeAdded?: (strokeData: any) => void;
  }>({});

  // Listen to all events at the top level
  useEventListener(({ event }) => {
    switch (event.type) {
      case 'CANVAS_UPDATED':
        eventCallbacks.onCanvasUpdated?.(event.data);
        break;
      case 'USER_JOINED':
        eventCallbacks.onUserJoined?.(event.data);
        break;
      case 'USER_LEFT':
        eventCallbacks.onUserLeft?.(event.data);
        break;
      case 'STROKE_ADDED':
        eventCallbacks.onStrokeAdded?.(event.data);
        break;
    }
  });

  // Broadcast canvas operation to other users
  const broadcastCanvasOperation = useCallback((operation: CanvasOperation) => {
    broadcast({
      type: 'CANVAS_UPDATED',
      data: operation,
      timestamp: new Date().toISOString(),
      userId: operation.userId,
    });
  }, [broadcast]);

  // Broadcast user join event
  const broadcastUserJoined = useCallback((userAddress: string, userName?: string) => {
    broadcast({
      type: 'USER_JOINED',
      data: { userAddress, userName },
      timestamp: new Date().toISOString(),
      userId: userAddress,
    });
  }, [broadcast]);

  // Broadcast user leave event
  const broadcastUserLeft = useCallback((userAddress: string) => {
    broadcast({
      type: 'USER_LEFT',
      data: { userAddress },
      timestamp: new Date().toISOString(),
      userId: userAddress,
    });
  }, [broadcast]);

  // Broadcast stroke added event
  const broadcastStrokeAdded = useCallback((strokeData: any, userAddress: string) => {
    broadcast({
      type: 'STROKE_ADDED',
      data: strokeData,
      timestamp: new Date().toISOString(),
      userId: userAddress,
    });
  }, [broadcast]);

  // Register event callbacks
  const registerCanvasUpdatedCallback = useCallback((callback: (operation: CanvasOperation) => void) => {
    setEventCallbacks(prev => ({ ...prev, onCanvasUpdated: callback }));
  }, []);

  const registerUserJoinedCallback = useCallback((callback: (data: { userAddress: string; userName?: string }) => void) => {
    setEventCallbacks(prev => ({ ...prev, onUserJoined: callback }));
  }, []);

  const registerUserLeftCallback = useCallback((callback: (data: { userAddress: string }) => void) => {
    setEventCallbacks(prev => ({ ...prev, onUserLeft: callback }));
  }, []);

  const registerStrokeAddedCallback = useCallback((callback: (strokeData: any) => void) => {
    setEventCallbacks(prev => ({ ...prev, onStrokeAdded: callback }));
  }, []);

  return {
    broadcastCanvasOperation,
    broadcastUserJoined,
    broadcastUserLeft,
    broadcastStrokeAdded,
    registerCanvasUpdatedCallback,
    registerUserJoinedCallback,
    registerUserLeftCallback,
    registerStrokeAddedCallback,
  };
}