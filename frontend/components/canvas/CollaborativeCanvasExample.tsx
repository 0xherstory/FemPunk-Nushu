'use client';

import { useRef, useEffect } from 'react';
import { CanvasLiveblocksProvider } from '../../lib/providers/LiveblocksProvider';
// import { useCollaborativeCanvas } from '../../lib/hooks/useCollaborativeCanvas'; // Temporarily disabled
import { UserCursors } from './UserCursors';
import { PerformanceMonitor, usePerformanceMonitor } from './PerformanceMonitor';

interface CollaborativeCanvasProps {
  userAddress?: string;
  className?: string;
}

function CanvasContent({ userAddress, className }: CollaborativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isVisible: showPerformanceMonitor } = usePerformanceMonitor();

  const {
    isInitialized,
    currentTool,
    activeUsers,
    canUndo,
    canRedo,
    setTool,
    setBrushSize,
    setBrushColor,
    clearCanvas,
    undo,
    redo,
    getPerformanceMetrics,
  } = {} as any; 
  
  // Temporarily disabled collaborative canvas
  // const result = useCollaborativeCanvas({
  //   canvasRef,
  //   userAddress,
  //   onStrokeAdded: () => {
  //     console.log('Stroke added by user:', userAddress);
  //   },
  // });

  return (
    <div className={`relative ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ touchAction: 'none' }} // Prevent scrolling on touch devices
      />

      {/* User cursors overlay */}
      <UserCursors />

      {/* Performance monitor */}
      <PerformanceMonitor
        getMetrics={getPerformanceMetrics}
        isVisible={showPerformanceMonitor}
      />

      {/* Simple toolbar */}
      <div className="absolute top-2 left-2 flex gap-2 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={() => setTool({ type: 'brush', size: currentTool.size, color: currentTool.color })}
          className={`px-3 py-1 rounded ${
            currentTool.type === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Brush
        </button>
        
        <button
          onClick={() => setTool({ type: 'eraser', size: currentTool.size })}
          className={`px-3 py-1 rounded ${
            currentTool.type === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Eraser
        </button>

        <input
          type="range"
          min="1"
          max="50"
          value={currentTool.size}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-20"
        />

        <input
          type="color"
          value={currentTool.color || '#000000'}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-8 h-8 rounded"
        />

        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Undo
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Redo
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1 rounded bg-red-500 text-white"
        >
          Clear
        </button>
      </div>

      {/* Status info */}
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-lg shadow-md text-sm">
        <div>Status: {isInitialized ? 'Ready' : 'Loading...'}</div>
        <div>Active Users: {activeUsers.length}</div>
        <div>Tool: {currentTool.type} ({currentTool.size}px)</div>
        {userAddress && <div>User: {userAddress.slice(0, 8)}...</div>}
      </div>
    </div>
  );
}

export function CollaborativeCanvasExample({ userAddress, className }: CollaborativeCanvasProps) {
  return (
    <CanvasLiveblocksProvider>
      <CanvasContent userAddress={userAddress} className={className} />
    </CanvasLiveblocksProvider>
  );
}