'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface SimpleCanvasProps {
  userAddress?: string;
  className?: string;
}

export function SimpleCanvas({ userAddress, className }: SimpleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, currentColor, brushSize]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setStrokeCount(0);
  }, []);

  const mintArtwork = useCallback(() => {
    if (!canvasRef.current || !userAddress) return;

    // Get canvas data
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    // Simulate minting process
    alert(`铸造作品 NFT!\n\n画布数据: ${imageData.slice(0, 50)}...\n笔画数: ${strokeCount}\n创作者: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}\n\n这是演示模式，实际部署时会调用智能合约。`);
  }, [userAddress, strokeCount]);

  return (
    <div className={`relative ${className}`}>
      {/* Canvas */}
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

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
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">颜色:</label>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-8 h-8 rounded border"
          />
        </div>

        <div className="flex items-center gap-2 ml-2">
          <label className="text-sm text-gray-600">大小:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}</span>
        </div>

        <button
          onClick={clearCanvas}
          className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors ml-2"
        >
          清空
        </button>

        {hasDrawn && userAddress && (
          <button
            onClick={mintArtwork}
            className="px-3 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors ml-2"
          >
            铸造 NFT
          </button>
        )}
      </div>

      {/* Status info */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>简单画布模式</span>
          </div>
          <div>画笔大小: {brushSize}px</div>
          <div>颜色: {currentColor}</div>
          <div>笔画数: {strokeCount}</div>
          {userAddress && (
            <div className="text-gray-500">
              用户: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* Mint Button Area */}
      {hasDrawn && userAddress && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="text-center">
            <div className="mb-2">
              <svg className="w-8 h-8 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">作品完成!</h4>
            <p className="text-xs text-gray-600 mb-3">
              将您的创作铸造为 NFT
            </p>
            <button
              onClick={mintArtwork}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 text-sm font-medium"
            >
              🎨 铸造艺术 NFT
            </button>
            <p className="text-xs text-gray-400 mt-2">
              笔画: {strokeCount} | 演示模式
            </p>
          </div>
        </div>
      )}
    </div>
  );
}