'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasState } from '../../lib/hooks/useCanvasState';
import { useActiveUsers } from '../../lib/hooks/useActiveUsers';
import { useUserColors } from '../../lib/hooks/useColorNFTs';
import { CollaborativeCanvas as FabricCanvas } from '../../lib/canvas/fabricCanvas';
import { UserCursors } from './UserCursors';
import { PerformanceMonitor, usePerformanceMonitor } from './PerformanceMonitor';
import type { DailyTheme, DrawingTool } from '../../types';

interface CollaborativeCanvasProps {
  userAddress?: string;
  dailyTheme: DailyTheme;
  className?: string;
}

export function CollaborativeCanvas({ 
  userAddress, 
  dailyTheme, 
  className 
}: CollaborativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>({ 
    type: 'brush', 
    size: 5, 
    color: '#000000' 
  });

  // Hooks
  const { 
    canvasState, 
    addCanvasObject, 
    clearCanvas, 
    setIsDrawing, 
    setSelectedColor, 
    updateCursor, 
    setUserInfo, 
    recordStroke 
  } = useCanvasState();
  
  const { activeUsers, onlineCount } = useActiveUsers();
  const { userColors } = useUserColors();
  const { isVisible: showPerformanceMonitor } = usePerformanceMonitor();

  // Initialize canvas
  useEffect(() => {
    console.log('Canvas initialization effect running...', { 
      canvasRef: !!canvasRef.current, 
      fabricCanvasRef: !!fabricCanvasRef.current 
    });

    // Add a small delay to ensure the canvas element is fully rendered
    const initTimer = setTimeout(() => {
      if (canvasRef.current && !fabricCanvasRef.current) {
        try {
          console.log('Creating FabricCanvas...');
          fabricCanvasRef.current = new FabricCanvas(canvasRef.current);
          console.log('FabricCanvas created successfully');
          
          // Set up event handlers
          fabricCanvasRef.current.onPathCreated((path) => {
            console.log('Path created:', path);
            // Add path to Liveblocks storage
            const pathData = path.toObject();
            addCanvasObject(pathData);
            
            // Record stroke for contribution tracking
            if (userAddress) {
              recordStroke(userAddress);
            }
          });

          fabricCanvasRef.current.onObjectAdded((object) => {
            console.log('Object added:', object);
            // Sync object to other users
            const objectData = object.toObject();
            addCanvasObject(objectData);
          });

          console.log('Setting initialized to true');
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize canvas:', error);
          // Set initialized to true anyway to show the canvas
          setIsInitialized(true);
        }
      } else if (!canvasRef.current) {
        console.log('Canvas ref not ready, will retry...');
      }
    }, 100);

    // Set user info when address changes
    if (userAddress && fabricCanvasRef.current) {
      setUserInfo(userAddress);
    }

    return () => {
      clearTimeout(initTimer);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [userAddress, addCanvasObject, recordStroke, setUserInfo]);

  // Handle mouse events for cursor tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateCursor({ x, y });
  }, [updateCursor]);

  const handleMouseLeave = useCallback(() => {
    updateCursor(null);
  }, [updateCursor]);

  // Check if user owns the selected color
  const canUseColor = useCallback((color: string) => {
    if (!userAddress || !userColors.length) return false;
    return userColors.some(ownedColor => 
      ownedColor.colorHex.toLowerCase() === color.toLowerCase()
    );
  }, [userAddress, userColors]);

  // Enhanced color validation with user feedback
  const validateColorUsage = useCallback((color: string) => {
    if (!userAddress) {
      return { canUse: false, reason: 'wallet_not_connected' };
    }
    if (!canUseColor(color)) {
      return { canUse: false, reason: 'color_not_owned' };
    }
    return { canUse: true, reason: null };
  }, [userAddress, canUseColor]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Validate color usage before allowing drawing
    if (currentTool.color) {
      const validation = validateColorUsage(currentTool.color);
      if (!validation.canUse) {
        return; // Prevent drawing if color not owned
      }
    }
    setIsDrawing(true);
  }, [setIsDrawing, currentTool.color, validateColorUsage]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  // Tool management
  const handleToolChange = useCallback((tool: DrawingTool) => {
    setCurrentTool(tool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setTool(tool);
    }
    
    // Update selected color in presence
    if (tool.color) {
      setSelectedColor(tool.color);
    }
  }, [setSelectedColor]);

  const handleBrushSizeChange = useCallback((size: number) => {
    const newTool = { ...currentTool, size };
    setCurrentTool(newTool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setBrushSize(size);
    }
  }, [currentTool]);

  const handleColorChange = useCallback((color: string) => {
    const newTool = { ...currentTool, color };
    setCurrentTool(newTool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setBrushColor(color);
    }
    setSelectedColor(color);
  }, [currentTool, setSelectedColor]);

  const handleClearCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clearCanvas();
    }
    clearCanvas();
  }, [clearCanvas]);





  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    updateCursor({ x, y });
    setIsDrawing(true);
  }, [updateCursor, setIsDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    updateCursor({ x, y });
  }, [updateCursor]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    updateCursor(null);
  }, [setIsDrawing, updateCursor]);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      activeUserCount: onlineCount,
    };
  }, [onlineCount]);

  if (!isInitialized) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化画布...</p>
          <p className="text-xs text-gray-500 mt-2">
            Debug: Canvas ref: {canvasRef.current ? 'Ready' : 'Not ready'}, 
            Fabric: {fabricCanvasRef.current ? 'Created' : 'Not created'}
          </p>
          <button 
            onClick={() => setIsInitialized(true)}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            强制显示画布 (调试用)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Canvas */}
      <div 
        className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block border border-gray-300"
          style={{ touchAction: 'none' }}
        />
        
        {/* User cursors overlay */}
        <UserCursors />

        {/* Wallet connection overlay */}
        {!userAddress && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">连接钱包开始创作</h3>
              <p className="text-gray-600 mb-4">
                连接您的钱包以参与协作绘画，获取颜色权限，并记录您的创作贡献。
              </p>
              <button
                onClick={() => {
                  // This will be handled by the parent component
                  window.dispatchEvent(new CustomEvent('openWalletModal'));
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                连接钱包
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex gap-2 bg-white p-3 rounded-lg shadow-lg border">
        <button
          onClick={() => handleToolChange({ ...currentTool, type: 'brush' })}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentTool.type === 'brush' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          画笔
        </button>
        
        <button
          onClick={() => handleToolChange({ ...currentTool, type: 'eraser' })}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentTool.type === 'eraser' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          橡皮擦
        </button>

        <div className="flex items-center gap-2 ml-2">
          <label className="text-sm text-gray-600">大小:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={currentTool.size}
            onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{currentTool.size}</span>
        </div>

        <button
          onClick={handleClearCanvas}
          className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors ml-2"
        >
          清空
        </button>
      </div>

      {/* Status info */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>在线用户: {onlineCount}</span>
          </div>
          <div>工具: {currentTool.type === 'brush' ? '画笔' : '橡皮擦'} ({currentTool.size}px)</div>
          {userAddress && (
            <div className="text-gray-500">
              用户: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* Performance monitor */}
      <PerformanceMonitor
        getMetrics={getPerformanceMetrics}
        isVisible={showPerformanceMonitor}
      />

      {/* Color permission warning */}
      {currentTool.color && userAddress && (() => {
        const validation = validateColorUsage(currentTool.color);
        if (validation.canUse) return null;
        
        return (
          <div className="absolute top-20 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">颜色权限不足</p>
                <p className="text-xs">
                  您没有使用此颜色的权限，请先购买对应的颜色 NFT
                </p>
                <button
                  onClick={() => window.location.href = '/buy'}
                  className="mt-2 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded transition-colors"
                >
                  去购买
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}