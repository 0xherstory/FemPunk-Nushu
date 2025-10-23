// Liveblocks configuration and types
export * from '../liveblocks/config';

// Canvas integration
export { CollaborativeCanvas } from '../canvas/fabricCanvas';

// Hooks
export { useCanvasState } from '../hooks/useCanvasState';
export { useActiveUsers } from '../hooks/useActiveUsers';
export { useCanvasEvents } from '../hooks/useCanvasEvents';
// export { useCollaborativeCanvas } from '../hooks/useCollaborativeCanvas'; // Temporarily disabled due to build issues

// Performance optimization
export { OperationQueue, debounce, throttle } from '../canvas/operationQueue';
export { UndoRedoManager } from '../canvas/undoRedo';

// Conflict resolution
export {
  ConflictResolver,
  BatchConflictResolver,
  LastWriterWinsStrategy,
  OperationalTransformStrategy,
} from '../canvas/conflictResolution';

// Providers
export { LiveblocksProvider, CanvasLiveblocksProvider } from '../providers/LiveblocksProvider';

// Components
export { UserCursors } from '../../components/canvas/UserCursors';
export { PerformanceMonitor, usePerformanceMonitor } from '../../components/canvas/PerformanceMonitor';

// Utility functions
export function generateRoomId(prefix: string, identifier: string): string {
  return `${prefix}-${identifier}`;
}

export function getTodayRoomId(): string {
  const today = new Date().toISOString().split('T')[0];
  return generateRoomId('canvas', today);
}

export function getUserDisplayName(address: string, name?: string): string {
  return name || `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

// Constants
export const COLLABORATION_CONSTANTS = {
  MAX_CONCURRENT_USERS: 50,
  CURSOR_UPDATE_THROTTLE: 50, // ms
  CANVAS_SAVE_DEBOUNCE: 1000, // ms
  OPERATION_BATCH_SIZE: 10,
  OPERATION_BATCH_INTERVAL: 100, // ms
  MAX_HISTORY_SIZE: 50,
  DEFAULT_CANVAS_SIZE: { width: 800, height: 600 },
} as const;