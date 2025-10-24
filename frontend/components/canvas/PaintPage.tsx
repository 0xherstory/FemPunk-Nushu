'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { WalletModal } from '../wallet/WalletModal';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
import styles from './PaintPage.module.css';

/**
 * FemPunk Nvshu - Paint Page Component
 * Design: FemFunk-Nvshu - 绘画页-有颜色
 * Node ID: 101:2188
 * Dimensions: 1440px × 1024px
 *
 * Technology Stack:
 * - Next.js 14 (App Router)
 * - React 18
 * - CSS Modules for styling
 *
 * Future Integration Points:
 * - Canvas drawing: Fabric.js or Canvas API
 * - Real-time collaboration: Liveblocks/Yjs
 * - Wallet connection: wagmi v2 + viem + RainbowKit
 */

interface PaintPageProps {
  className?: string;
}

const PaintPage: React.FC<PaintPageProps> = ({ className }) => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { modalState, openModal: openWalletModal, closeModal: closeWalletModal } = useWalletModal();
  
  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#592386');
  const [brushSize, setBrushSize] = useState(1);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Available colors (demo colors)
  const availableColors = ['#592386', '#237286'];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveCanvasState();
  }, []);

  // Save canvas state for undo/redo
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 50) { // Limit history size
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setCanvasHistory(newHistory);
  }, [canvasHistory, historyIndex]);

  // Navigation handlers
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Canvas drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isConnected) {
      openWalletModal();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isConnected, openWalletModal]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isConnected) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, isConnected, currentColor, brushSize]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
      saveCanvasState();
    }
    setIsDrawing(false);
  }, [isDrawing, saveCanvasState]);

  // Tool handlers
  const handleBrushSizeChange = (delta: number) => {
    setBrushSize(prev => Math.max(1, Math.min(50, prev + delta)));
  };

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newIndex = historyIndex - 1;
      const imageData = canvasHistory[newIndex];
      ctx.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newIndex = historyIndex + 1;
      const imageData = canvasHistory[newIndex];
      ctx.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setStrokeCount(0);
    saveCanvasState();
  };

  const handleSave = () => {
    if (!canvasRef.current || !address) return;

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    // Simulate save/mint process
    alert(`保存作品成功!\n\n笔画数: ${strokeCount}\n创作者: ${address.slice(0, 6)}...${address.slice(-4)}\n\n这是演示模式，实际部署时会保存到区块链。`);
  };

  const handleMintColor = () => {
    if (!isConnected) {
      openWalletModal();
      return;
    }
    router.push('/buy');
  };
  return (
    <div className={`${styles.container} ${className || ''}`} data-name="绘画页-有颜色" data-node-id="101:2188">

      {/* Canvas Background with Mask */}
      <div className={styles.canvasBackground} data-name="Mask group" data-node-id="101:2189">
        <div className={styles.canvasImage} data-node-id="101:2191">
          <img
            src="https://www.figma.com/api/mcp/asset/2ccb6198-a3e8-418b-b296-55208a71f578"
            alt="Canvas Background"
          />
        </div>
        
        {/* Interactive Canvas */}
        <canvas
          ref={canvasRef}
          width={910}
          height={910}
          className="absolute inset-0 cursor-crosshair"
          style={{
            left: 'calc(50% - 455px)',
            top: 'calc(50% - 408px)',
            width: '910px',
            height: '910px',
            mixBlendMode: 'multiply'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Wallet connection overlay */}
        {!isConnected && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                onClick={() => openWalletModal()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                连接钱包
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className={styles.navbar} data-name="导航栏" data-node-id="101:2196">
        <div className={styles.navbarBackdrop} data-node-id="I101:2196;70:1816" />

        <div className={styles.navbarContent}>
          {/* Left Side: Logo and Menu */}
          <div className={styles.navbarLeft} data-node-id="I101:2196;70:1822">
            <button onClick={() => handleNavigation('/')} className={styles.logo} data-name="fempunk_logo" data-node-id="I101:2196;70:1823">
              <img
                src="https://www.figma.com/api/mcp/asset/0999c80e-150b-47bd-b16a-2b9945623dbc"
                alt="FemPunk Logo Layer 1"
              />
              <img
                src="https://www.figma.com/api/mcp/asset/f27a3ac7-2bf4-4b40-9215-2c2b2bf87093"
                alt="FemPunk Logo Layer 2"
              />
            </button>
            <button onClick={() => handleNavigation('/canvas')} className={`${styles.navLink} ${styles.active}`}>PAINT</button>
            <button onClick={() => handleNavigation('/buy')} className={styles.navLink}>COLOR</button>
            <button onClick={() => handleNavigation('/gallery')} className={styles.navLink}>GALLERY</button>
          </div>

          {/* Right Side: Connect Button */}
          <div className={styles.navbarRight} data-node-id="I101:2196;70:1817">
            <button 
              className={styles.connectButton} 
              data-node-id="I101:2196;70:1821"
              onClick={isConnected ? () => {} : () => openWalletModal()}
            >
              <img
                src="https://www.figma.com/api/mcp/asset/17dd0880-4f79-474b-9b15-1a7dd17fdaf4"
                alt="Wallet Icon"
                className={styles.walletIcon}
              />
              <span>{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tool Panel (Left Side) */}
      <div className={styles.toolPanel} data-node-id="101:2238">
        {/* Move Tool */}
        <div className={styles.toolItem} data-node-id="101:2246">
          <img
            src="https://www.figma.com/api/mcp/asset/bd4a117f-3d44-42a2-b862-2d10331ce82e"
            alt="Move Tool"
          />
        </div>

        {/* Hand Tool */}
        <div className={styles.toolItem} data-node-id="101:2239">
          <img
            src="https://www.figma.com/api/mcp/asset/42efefc3-fe5e-4549-8472-65ad556fd2e9"
            alt="Hand Tool"
          />
        </div>

        <div className={styles.divider} data-node-id="101:2241" />

        {/* Zoom Out */}
        <button className={styles.toolItem} data-node-id="101:2282" onClick={() => {}}>
          <img
            src="https://www.figma.com/api/mcp/asset/3eecc0bb-ddbb-4beb-8e19-a745c16d3dd4"
            alt="Zoom Out"
          />
        </button>

        {/* Zoom In */}
        <button className={styles.toolItem} data-node-id="101:2286" onClick={() => {}}>
          <img
            src="https://www.figma.com/api/mcp/asset/4494b5d6-4d46-4f8d-92f5-144bc57afb61"
            alt="Zoom In"
          />
        </button>

        <div className={styles.divider} data-node-id="101:2242" />

        {/* Brush Size Decrease */}
        <button className={styles.toolItem} data-node-id="101:2290" onClick={() => handleBrushSizeChange(-1)}>
          <img
            src="https://www.figma.com/api/mcp/asset/4e5412d2-1450-4f49-a19d-6e5bcd05fd8a"
            alt="Decrease Brush"
          />
        </button>

        <div className={styles.brushSizeIndicator} data-node-id="101:2245">{brushSize}px</div>

        {/* Brush Size Increase */}
        <button className={styles.toolItem} data-node-id="101:2293" onClick={() => handleBrushSizeChange(1)}>
          <img
            src="https://www.figma.com/api/mcp/asset/d43b361b-c817-483c-8927-dce4a1ffe75a"
            alt="Increase Brush"
          />
        </button>

        <div className={styles.divider} data-node-id="101:2243" />

        {/* Color Section */}
        <div className={styles.colorSection}>
          <div className={styles.colorLabel} data-node-id="101:2279">My Color</div>

          {/* Color Swatches */}
          <div className={styles.colorSwatches}>
            {availableColors.map((color, index) => (
              <button
                key={color}
                className={`${styles.colorSwatch} ${currentColor === color ? styles.active : ''}`}
                data-node-id={index === 0 ? "101:2259" : "101:2333"}
                style={{ background: color }}
                onClick={() => handleColorSelect(color)}
                title={`选择颜色 ${color}`}
              />
            ))}
          </div>

          {/* Mint Color Button */}
          <button className={styles.mintColorButton} data-node-id="101:2251" onClick={handleMintColor}>
            <span>Mint Color</span>
          </button>
        </div>

        <div className={styles.divider} data-node-id="101:2244" />

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {/* Undo */}
          <button 
            className={styles.actionButton} 
            data-node-id="101:2272"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="撤销"
          >
            <img
              src="https://www.figma.com/api/mcp/asset/26836a04-b252-4f76-84a0-4569b6667f48"
              alt="Undo"
            />
          </button>

          {/* Redo */}
          <button 
            className={styles.actionButton} 
            data-node-id="101:2276"
            onClick={handleRedo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="重做"
          >
            <img
              src="https://www.figma.com/api/mcp/asset/4976f618-136d-4008-9516-25ecf19136db"
              alt="Redo"
            />
          </button>

          {/* Import Image */}
          <button 
            className={styles.actionButton} 
            data-node-id="101:2268"
            onClick={() => alert('导入图片功能开发中')}
            title="导入图片"
          >
            <img
              src="https://www.figma.com/api/mcp/asset/e5c3d2f0-3764-462e-bcc3-d796a921a14d"
              alt="Import Image"
            />
          </button>

          {/* Clear Canvas */}
          <button 
            className={styles.actionButton} 
            data-node-id="101:2264"
            onClick={handleClear}
            title="清空画布"
          >
            <img
              src="https://www.figma.com/api/mcp/asset/0409163b-d49c-4a1a-9e71-191a6843dcf7"
              alt="Clear"
            />
          </button>

          {/* Save Button */}
          <button 
            className={styles.saveButton} 
            data-node-id="101:2254"
            onClick={handleSave}
            disabled={!hasDrawn || !isConnected}
            title="保存作品"
          >
            <img
              src="https://www.figma.com/api/mcp/asset/aef4a79c-5051-45db-a154-60c42dd838ad"
              alt="Save Icon"
            />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Right Info Panel */}
      <div className={styles.infoPanel} data-node-id="101:2197">

        {/* Nvshu of Today Section */}
        <div className={`${styles.infoSection} ${styles.nvshuToday}`}>
          <div className={styles.sectionHeader}>
            <h3>Nvshu of Today</h3>
            <div className={styles.countdownBadge} data-node-id="101:2222">
              Canvas locks in 13:13:34
            </div>
          </div>

          {/* Nvshu Character Display */}
          <div className={styles.nvshuCharacter} data-node-id="101:2198">
            <div className={styles.characterMask} data-node-id="101:2200">
              <img
                src="https://www.figma.com/api/mcp/asset/dcf0d13f-9ade-4973-9921-18bccb92ef36"
                alt="Nvshu Character Background"
              />
            </div>
            <div className={styles.characterOverlay} data-node-id="101:2204">
              <img
                src="https://www.figma.com/api/mcp/asset/0a7e46ce-4998-4fd1-a9ef-2274cd0e0aef"
                alt="Nvshu Character"
              />
            </div>
            <div className={styles.characterElements} data-node-id="101:2211">
              <img
                src="https://www.figma.com/api/mcp/asset/cf6bc0c4-6a58-421a-85fd-bcd098215db0"
                alt="Element 1"
                className={styles.element1}
              />
              <img
                src="https://www.figma.com/api/mcp/asset/61facb6b-4a5a-4cb0-ae49-90a162e8990e"
                alt="Element 2"
                className={styles.element2}
              />
            </div>
          </div>

          <div className={styles.nvshuTranslation} data-node-id="101:2218">
            <span className={styles.translationLabel}>Nvshu Translate：</span>
            <span className={styles.translationText}>Spring</span>
          </div>
        </div>

        {/* Theme of Today Section */}
        <div className={`${styles.infoSection} ${styles.themeSection}`} data-node-id="101:2231">
          <div className={styles.dividerLine} data-node-id="101:2232" />

          <div className={styles.sectionHeader}>
            <h3>Theme of Today</h3>
            <div className={styles.dayBadge} data-node-id="101:2234">Day 24</div>
          </div>

          <div className={styles.themeContent} data-node-id="101:2236">
            <p>Spring Garden</p>
          </div>
        </div>

        {/* What is Nvshu Section */}
        <div className={`${styles.infoSection} ${styles.whatNvshuSection}`} data-node-id="101:2224">
          <div className={styles.dividerLine} data-node-id="101:2225" />

          <div className={styles.sectionHeader}>
            <h3>What is Nvshu</h3>
          </div>

          <div className={styles.nvshuDescription} data-node-id="101:2227">
            <p>
              Nvshu is a unique script created <strong>by women</strong> in <strong>Jiangyong</strong> County, Hunan, China. Developed as a way for women to <strong>express their emotions</strong>, write poems, and <strong>communicate</strong> with one another in a patriarchal society, its <strong>elegant</strong>, slender strokes embody grace and resilience. Today, Nvshu stands as a powerful symbol of <strong>women&apos;s creativity,</strong> connection, and cultural heritage.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={modalState.isOpen}
        onClose={closeWalletModal}
        trigger="canvas"
      />

    </div>
  );
};

export default PaintPage;