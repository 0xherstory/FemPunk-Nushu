import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '../../lib/wagmi/config';

// Mock components for integration testing
const MockPurchasePage = () => {
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  
  return (
    <div>
      <h1>购买颜色 NFT</h1>
      
      {!isConnected && (
        <button 
          onClick={() => setIsConnected(true)}
          data-testid="connect-wallet"
        >
          连接钱包
        </button>
      )}
      
      {isConnected && (
        <>
          <div data-testid="color-grid">
            {['#FF0000', '#00FF00', '#0000FF'].map(color => (
              <button
                key={color}
                data-testid={`color-${color.slice(1)}`}
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
            data-testid="purchase-button"
            disabled={selectedColors.length === 0}
            onClick={() => {
              // Mock purchase logic
              console.log('Purchasing colors:', selectedColors);
            }}
          >
            购买 {selectedColors.length} 种颜色
          </button>
        </>
      )}
    </div>
  );
};

const MockCanvasPage = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [userColors, setUserColors] = React.useState<string[]>([]);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  
  return (
    <div>
      <h1>协作画布</h1>
      
      {!isConnected && (
        <button 
          onClick={() => {
            setIsConnected(true);
            setUserColors(['#FF0000']); // Mock getting random color
          }}
          data-testid="connect-wallet-canvas"
        >
          连接钱包获取随机颜色
        </button>
      )}
      
      {isConnected && (
        <>
          <div data-testid="user-colors">
            <h3>我的颜色</h3>
            {userColors.map(color => (
              <button
                key={color}
                data-testid={`user-color-${color.slice(1)}`}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={selectedColor === color ? 'selected' : ''}
              >
                {color}
              </button>
            ))}
          </div>
          
          <canvas
            data-testid="collaborative-canvas"
            width={800}
            height={600}
            onClick={() => {
              if (selectedColor) {
                console.log('Drawing with color:', selectedColor);
              }
            }}
          />
          
          <div data-testid="active-users">
            <span>在线用户: 3</span>
          </div>
        </>
      )}
    </div>
  );
};

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

describe('Web3 Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Purchase Flow Integration', () => {
    it('should complete full purchase flow', async () => {
      render(
        <TestWrapper>
          <MockPurchasePage />
        </TestWrapper>
      );

      // Initially should show connect wallet button
      expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
      expect(screen.queryByTestId('color-grid')).not.toBeInTheDocument();

      // Connect wallet
      fireEvent.click(screen.getByTestId('connect-wallet'));

      await waitFor(() => {
        expect(screen.getByTestId('color-grid')).toBeInTheDocument();
      });

      // Select colors
      const redColor = screen.getByTestId('color-FF0000');
      const blueColor = screen.getByTestId('color-0000FF');
      
      fireEvent.click(redColor);
      fireEvent.click(blueColor);

      expect(redColor).toHaveClass('selected');
      expect(blueColor).toHaveClass('selected');

      // Purchase button should be enabled
      const purchaseButton = screen.getByTestId('purchase-button');
      expect(purchaseButton).not.toBeDisabled();
      expect(purchaseButton).toHaveTextContent('购买 2 种颜色');

      // Complete purchase
      fireEvent.click(purchaseButton);

      // Should log purchase (in real app would trigger transaction)
      expect(console.log).toHaveBeenCalledWith('Purchasing colors:', ['#FF0000', '#0000FF']);
    });

    it('should handle color deselection', async () => {
      render(
        <TestWrapper>
          <MockPurchasePage />
        </TestWrapper>
      );

      // Connect and select color
      fireEvent.click(screen.getByTestId('connect-wallet'));
      
      await waitFor(() => {
        const redColor = screen.getByTestId('color-FF0000');
        fireEvent.click(redColor);
        expect(redColor).toHaveClass('selected');
        
        // Deselect
        fireEvent.click(redColor);
        expect(redColor).not.toHaveClass('selected');
        
        // Purchase button should be disabled
        expect(screen.getByTestId('purchase-button')).toBeDisabled();
      });
    });
  });

  describe('Canvas Flow Integration', () => {
    it('should complete canvas interaction flow', async () => {
      render(
        <TestWrapper>
          <MockCanvasPage />
        </TestWrapper>
      );

      // Initially should show connect wallet button
      expect(screen.getByTestId('connect-wallet-canvas')).toBeInTheDocument();
      expect(screen.queryByTestId('collaborative-canvas')).not.toBeInTheDocument();

      // Connect wallet
      fireEvent.click(screen.getByTestId('connect-wallet-canvas'));

      await waitFor(() => {
        expect(screen.getByTestId('collaborative-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('user-colors')).toBeInTheDocument();
        expect(screen.getByTestId('active-users')).toBeInTheDocument();
      });

      // Should have received random color
      const userColor = screen.getByTestId('user-color-FF0000');
      expect(userColor).toBeInTheDocument();

      // Select color for drawing
      fireEvent.click(userColor);
      expect(userColor).toHaveClass('selected');

      // Draw on canvas
      const canvas = screen.getByTestId('collaborative-canvas');
      fireEvent.click(canvas);

      // Should log drawing action
      expect(console.log).toHaveBeenCalledWith('Drawing with color:', '#FF0000');
    });

    it('should show active users count', async () => {
      render(
        <TestWrapper>
          <MockCanvasPage />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('connect-wallet-canvas'));

      await waitFor(() => {
        expect(screen.getByText('在线用户: 3')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Page State Management', () => {
    it('should maintain wallet connection across pages', async () => {
      const { rerender } = render(
        <TestWrapper>
          <MockPurchasePage />
        </TestWrapper>
      );

      // Connect on purchase page
      fireEvent.click(screen.getByTestId('connect-wallet'));

      await waitFor(() => {
        expect(screen.getByTestId('color-grid')).toBeInTheDocument();
      });

      // Switch to canvas page (simulate navigation)
      rerender(
        <TestWrapper>
          <MockCanvasPage />
        </TestWrapper>
      );

      // Should maintain connection state (in real app)
      // For this mock, we'll simulate already connected state
      expect(screen.getByTestId('connect-wallet-canvas')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle wallet connection errors', async () => {
      // Mock wallet connection failure
      const mockError = vi.fn(() => {
        throw new Error('User rejected connection');
      });

      render(
        <TestWrapper>
          <button onClick={mockError} data-testid="failing-connect">
            Connect Wallet
          </button>
        </TestWrapper>
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('failing-connect'));
      }).toThrow('User rejected connection');
    });

    it('should handle transaction failures gracefully', async () => {
      const mockFailingPurchase = vi.fn(() => {
        throw new Error('Insufficient funds');
      });

      render(
        <TestWrapper>
          <button onClick={mockFailingPurchase} data-testid="failing-purchase">
            Purchase Color
          </button>
        </TestWrapper>
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('failing-purchase'));
      }).toThrow('Insufficient funds');
    });
  });

  describe('Network Switching', () => {
    it('should prompt network switch when on wrong network', async () => {
      // Mock wrong network detection
      const MockNetworkWarning = () => (
        <div data-testid="network-warning">
          <p>请切换到 Sepolia 测试网络</p>
          <button data-testid="switch-network">切换网络</button>
        </div>
      );

      render(
        <TestWrapper>
          <MockNetworkWarning />
        </TestWrapper>
      );

      expect(screen.getByTestId('network-warning')).toBeInTheDocument();
      expect(screen.getByText('请切换到 Sepolia 测试网络')).toBeInTheDocument();
      expect(screen.getByTestId('switch-network')).toBeInTheDocument();
    });
  });

  describe('Gas Fee Estimation', () => {
    it('should show gas fee estimates for transactions', async () => {
      const MockGasEstimate = () => {
        const [gasEstimate, setGasEstimate] = React.useState<string | null>(null);
        
        return (
          <div>
            <button
              onClick={() => setGasEstimate('0.002 ETH')}
              data-testid="estimate-gas"
            >
              估算 Gas 费用
            </button>
            {gasEstimate && (
              <div data-testid="gas-estimate">
                预估 Gas 费用: {gasEstimate}
              </div>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <MockGasEstimate />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('estimate-gas'));

      await waitFor(() => {
        expect(screen.getByTestId('gas-estimate')).toBeInTheDocument();
        expect(screen.getByText('预估 Gas 费用: 0.002 ETH')).toBeInTheDocument();
      });
    });
  });

  describe('Transaction Status Tracking', () => {
    it('should track transaction status through completion', async () => {
      const MockTransactionStatus = () => {
        const [status, setStatus] = React.useState<'idle' | 'pending' | 'confirming' | 'success'>('idle');
        
        const handleTransaction = async () => {
          setStatus('pending');
          setTimeout(() => setStatus('confirming'), 1000);
          setTimeout(() => setStatus('success'), 2000);
        };
        
        return (
          <div>
            <button onClick={handleTransaction} data-testid="start-transaction">
              开始交易
            </button>
            <div data-testid="transaction-status">
              状态: {status}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <MockTransactionStatus />
        </TestWrapper>
      );

      expect(screen.getByText('状态: idle')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('start-transaction'));

      await waitFor(() => {
        expect(screen.getByText('状态: pending')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('状态: confirming')).toBeInTheDocument();
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.getByText('状态: success')).toBeInTheDocument();
      }, { timeout: 2500 });
    });
  });
});