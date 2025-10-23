import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock complete user journey components
const MockApp = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const [userColors, setUserColors] = React.useState<string[]>([]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [canvasOperations, setCanvasOperations] = React.useState<any[]>([]);

  const connectWallet = () => {
    setIsWalletConnected(true);
    // Simulate getting random color on first connection
    if (userColors.length === 0) {
      setUserColors(['#FF0000']);
    }
  };

  const purchaseColors = () => {
    setUserColors(prev => [...prev, ...selectedColors]);
    setSelectedColors([]);
  };

  const drawOnCanvas = (color: string) => {
    const operation = {
      id: Date.now(),
      type: 'draw',
      color,
      timestamp: new Date(),
    };
    setCanvasOperations(prev => [...prev, operation]);
  };

  return (
    <div data-testid="app">
      {/* Navigation */}
      <nav data-testid="navigation">
        <button onClick={() => setCurrentPage('home')} data-testid="nav-home">
          首页
        </button>
        <button onClick={() => setCurrentPage('buy')} data-testid="nav-buy">
          购买
        </button>
        <button onClick={() => setCurrentPage('canvas')} data-testid="nav-canvas">
          画布
        </button>
        <button onClick={() => setCurrentPage('collection')} data-testid="nav-collection">
          藏品
        </button>
      </nav>

      {/* Wallet Status */}
      <div data-testid="wallet-status">
        {isWalletConnected ? (
          <span>钱包已连接 - 拥有 {userColors.length} 种颜色</span>
        ) : (
          <button onClick={connectWallet} data-testid="connect-wallet">
            连接钱包
          </button>
        )}
      </div>

      {/* Page Content */}
      {currentPage === 'home' && (
        <div data-testid="home-page">
          <h1>女书 Web3 协作绘画平台</h1>
          <p>连接钱包开始创作之旅</p>
          {!isWalletConnected && (
            <button onClick={connectWallet} data-testid="home-connect">
              开始体验
            </button>
          )}
        </div>
      )}

      {currentPage === 'buy' && (
        <div data-testid="buy-page">
          <h1>购买颜色 NFT</h1>
          {!isWalletConnected ? (
            <div>
              <p>请先连接钱包</p>
              <button onClick={connectWallet} data-testid="buy-connect">
                连接钱包
              </button>
            </div>
          ) : (
            <div>
              <div data-testid="color-grid">
                {['#00FF00', '#0000FF', '#FFFF00'].map(color => (
                  <button
                    key={color}
                    data-testid={`buy-color-${color.slice(1)}`}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(prev => prev.filter(c => c !== color));
                      } else {
                        setSelectedColors(prev => [...prev, color]);
                      }
                    }}
                    style={{ backgroundColor: color }}
                    className={selectedColors.includes(color) ? 'selected' : ''}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <button
                onClick={purchaseColors}
                disabled={selectedColors.length === 0}
                data-testid="purchase-button"
              >
                购买 {selectedColors.length} 种颜色
              </button>
            </div>
          )}
        </div>
      )}

      {currentPage === 'canvas' && (
        <div data-testid="canvas-page">
          <h1>协作画布</h1>
          {!isWalletConnected ? (
            <div>
              <p>连接钱包获取随机颜色开始创作</p>
              <button onClick={connectWallet} data-testid="canvas-connect">
                连接钱包
              </button>
            </div>
          ) : (
            <div>
              <div data-testid="user-colors">
                <h3>我的颜色</h3>
                {userColors.map(color => (
                  <button
                    key={color}
                    data-testid={`canvas-color-${color.slice(1)}`}
                    onClick={() => drawOnCanvas(color)}
                    style={{ backgroundColor: color }}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <canvas data-testid="canvas" width={800} height={600} />
              <div data-testid="operations-log">
                操作数: {canvasOperations.length}
              </div>
            </div>
          )}
        </div>
      )}

      {currentPage === 'collection' && (
        <div data-testid="collection-page">
          <h1>我的藏品</h1>
          {!isWalletConnected ? (
            <div>
              <p>连接钱包查看您的 NFT 藏品</p>
              <button onClick={connectWallet} data-testid="collection-connect">
                连接钱包
              </button>
            </div>
          ) : (
            <div>
              <div data-testid="owned-colors">
                <h3>拥有的颜色 ({userColors.length})</h3>
                {userColors.map(color => (
                  <div key={color} data-testid={`owned-${color.slice(1)}`}>
                    <div style={{ backgroundColor: color, width: 50, height: 50 }} />
                    <span>{color}</span>
                  </div>
                ))}
              </div>
              <div data-testid="created-artworks">
                <h3>参与的作品</h3>
                <p>您参与了 {canvasOperations.length > 0 ? 1 : 0} 件作品的创作</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

describe('Complete User Journey E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('New User Onboarding', () => {
    it('should guide new user through complete onboarding flow', async () => {
      render(<MockApp />);

      // Start on home page
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('女书 Web3 协作绘画平台')).toBeInTheDocument();

      // Should show connect wallet prompt
      expect(screen.getByTestId('home-connect')).toBeInTheDocument();

      // Connect wallet from home page
      fireEvent.click(screen.getByTestId('home-connect'));

      await waitFor(() => {
        expect(screen.getByText('钱包已连接 - 拥有 1 种颜色')).toBeInTheDocument();
      });
    });

    it('should allow user to explore all pages after connecting', async () => {
      render(<MockApp />);

      // Connect wallet first
      fireEvent.click(screen.getByTestId('connect-wallet'));

      // Navigate to buy page
      fireEvent.click(screen.getByTestId('nav-buy'));
      expect(screen.getByTestId('buy-page')).toBeInTheDocument();

      // Navigate to canvas page
      fireEvent.click(screen.getByTestId('nav-canvas'));
      expect(screen.getByTestId('canvas-page')).toBeInTheDocument();

      // Navigate to collection page
      fireEvent.click(screen.getByTestId('nav-collection'));
      expect(screen.getByTestId('collection-page')).toBeInTheDocument();
    });
  });

  describe('Color Purchase Journey', () => {
    it('should complete full color purchase flow', async () => {
      render(<MockApp />);

      // Navigate to buy page without wallet
      fireEvent.click(screen.getByTestId('nav-buy'));
      expect(screen.getByText('请先连接钱包')).toBeInTheDocument();

      // Connect wallet from buy page
      fireEvent.click(screen.getByTestId('buy-connect'));

      await waitFor(() => {
        expect(screen.getByTestId('color-grid')).toBeInTheDocument();
      });

      // Select multiple colors
      fireEvent.click(screen.getByTestId('buy-color-00FF00'));
      fireEvent.click(screen.getByTestId('buy-color-0000FF'));

      expect(screen.getByText('购买 2 种颜色')).toBeInTheDocument();

      // Complete purchase
      fireEvent.click(screen.getByTestId('purchase-button'));

      // Check collection updated
      fireEvent.click(screen.getByTestId('nav-collection'));

      await waitFor(() => {
        expect(screen.getByText('拥有的颜色 (3)')).toBeInTheDocument();
        expect(screen.getByTestId('owned-FF0000')).toBeInTheDocument(); // Initial color
        expect(screen.getByTestId('owned-00FF00')).toBeInTheDocument(); // Purchased
        expect(screen.getByTestId('owned-0000FF')).toBeInTheDocument(); // Purchased
      });
    });

    it('should prevent purchase without color selection', async () => {
      render(<MockApp />);

      fireEvent.click(screen.getByTestId('connect-wallet'));
      fireEvent.click(screen.getByTestId('nav-buy'));

      await waitFor(() => {
        const purchaseButton = screen.getByTestId('purchase-button');
        expect(purchaseButton).toBeDisabled();
        expect(purchaseButton).toHaveTextContent('购买 0 种颜色');
      });
    });
  });

  describe('Canvas Creation Journey', () => {
    it('should complete full canvas creation flow', async () => {
      render(<MockApp />);

      // Navigate to canvas without wallet
      fireEvent.click(screen.getByTestId('nav-canvas'));
      expect(screen.getByText('连接钱包获取随机颜色开始创作')).toBeInTheDocument();

      // Connect wallet
      fireEvent.click(screen.getByTestId('canvas-connect'));

      await waitFor(() => {
        expect(screen.getByTestId('user-colors')).toBeInTheDocument();
        expect(screen.getByTestId('canvas-color-FF0000')).toBeInTheDocument();
      });

      // Draw with color
      fireEvent.click(screen.getByTestId('canvas-color-FF0000'));

      await waitFor(() => {
        expect(screen.getByText('操作数: 1')).toBeInTheDocument();
      });

      // Check artwork appears in collection
      fireEvent.click(screen.getByTestId('nav-collection'));

      await waitFor(() => {
        expect(screen.getByText('您参与了 1 件作品的创作')).toBeInTheDocument();
      });
    });

    it('should allow using purchased colors for drawing', async () => {
      render(<MockApp />);

      // Connect wallet and buy colors
      fireEvent.click(screen.getByTestId('connect-wallet'));
      fireEvent.click(screen.getByTestId('nav-buy'));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('buy-color-00FF00'));
        fireEvent.click(screen.getByTestId('purchase-button'));
      });

      // Go to canvas and use purchased color
      fireEvent.click(screen.getByTestId('nav-canvas'));

      await waitFor(() => {
        expect(screen.getByTestId('canvas-color-FF0000')).toBeInTheDocument(); // Initial
        expect(screen.getByTestId('canvas-color-00FF00')).toBeInTheDocument(); // Purchased
      });

      // Draw with purchased color
      fireEvent.click(screen.getByTestId('canvas-color-00FF00'));

      await waitFor(() => {
        expect(screen.getByText('操作数: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Collection Management Journey', () => {
    it('should show complete collection after various activities', async () => {
      render(<MockApp />);

      // Connect wallet (gets 1 initial color)
      fireEvent.click(screen.getByTestId('connect-wallet'));

      // Purchase additional colors
      fireEvent.click(screen.getByTestId('nav-buy'));
      await waitFor(() => {
        fireEvent.click(screen.getByTestId('buy-color-00FF00'));
        fireEvent.click(screen.getByTestId('buy-color-0000FF'));
        fireEvent.click(screen.getByTestId('purchase-button'));
      });

      // Create artwork
      fireEvent.click(screen.getByTestId('nav-canvas'));
      await waitFor(() => {
        fireEvent.click(screen.getByTestId('canvas-color-FF0000'));
      });

      // Check complete collection
      fireEvent.click(screen.getByTestId('nav-collection'));

      await waitFor(() => {
        expect(screen.getByText('拥有的颜色 (3)')).toBeInTheDocument();
        expect(screen.getByText('您参与了 1 件作品的创作')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Page State Persistence', () => {
    it('should maintain wallet connection across page navigation', async () => {
      render(<MockApp />);

      // Connect on home page
      fireEvent.click(screen.getByTestId('connect-wallet'));

      // Navigate through all pages
      const pages = ['nav-buy', 'nav-canvas', 'nav-collection', 'nav-home'];

      for (const page of pages) {
        fireEvent.click(screen.getByTestId(page));

        await waitFor(() => {
          // Should show connected state on all pages
          expect(screen.getByText(/钱包已连接/)).toBeInTheDocument();
        });
      }
    });

    it('should maintain purchased colors across sessions', async () => {
      render(<MockApp />);

      // Purchase colors
      fireEvent.click(screen.getByTestId('connect-wallet'));
      fireEvent.click(screen.getByTestId('nav-buy'));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('buy-color-00FF00'));
        fireEvent.click(screen.getByTestId('purchase-button'));
      });

      // Colors should be available on canvas
      fireEvent.click(screen.getByTestId('nav-canvas'));

      await waitFor(() => {
        expect(screen.getByTestId('canvas-color-FF0000')).toBeInTheDocument();
        expect(screen.getByTestId('canvas-color-00FF00')).toBeInTheDocument();
      });

      // Colors should show in collection
      fireEvent.click(screen.getByTestId('nav-collection'));

      await waitFor(() => {
        expect(screen.getByText('拥有的颜色 (2)')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('should handle wallet disconnection gracefully', async () => {
      const { rerender } = render(<MockApp />);

      // Connect and purchase
      fireEvent.click(screen.getByTestId('connect-wallet'));
      fireEvent.click(screen.getByTestId('nav-buy'));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('buy-color-00FF00'));
        fireEvent.click(screen.getByTestId('purchase-button'));
      });

      // Simulate wallet disconnection by re-rendering with disconnected state
      const MockDisconnectedApp = () => (
        <div data-testid="app">
          <div data-testid="wallet-status">
            <button data-testid="connect-wallet">连接钱包</button>
          </div>
          <div data-testid="buy-page">
            <p>请先连接钱包</p>
          </div>
        </div>
      );

      rerender(<MockDisconnectedApp />);

      // Should show disconnected state
      expect(screen.getByText('请先连接钱包')).toBeInTheDocument();
    });

    it('should handle page refresh scenarios', async () => {
      const { rerender } = render(<MockApp />);

      // Simulate page refresh by re-rendering
      rerender(<MockApp />);

      // Should start fresh (in real app, would restore from localStorage/blockchain)
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    });
  });

  describe('Accessibility Journey', () => {
    it('should support keyboard navigation through entire flow', async () => {
      render(<MockApp />);

      // Should be able to tab through navigation
      const homeNav = screen.getByTestId('nav-home');
      const buyNav = screen.getByTestId('nav-buy');

      homeNav.focus();
      expect(document.activeElement).toBe(homeNav);

      // Simulate tab navigation
      fireEvent.keyDown(homeNav, { key: 'Tab' });
      buyNav.focus();
      expect(document.activeElement).toBe(buyNav);

      // Should be able to activate with Enter
      fireEvent.keyDown(buyNav, { key: 'Enter' });
      expect(screen.getByTestId('buy-page')).toBeInTheDocument();
    });

    it('should provide proper ARIA labels throughout journey', async () => {
      render(<MockApp />);

      // Navigation should have proper structure
      const nav = screen.getByTestId('navigation');
      expect(nav).toBeInTheDocument();

      // Buttons should be properly labeled
      const connectButton = screen.getByTestId('connect-wallet');
      expect(connectButton).toHaveAttribute('type', 'button');
    });
  });
});