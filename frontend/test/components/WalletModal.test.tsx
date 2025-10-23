import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletModal } from '../../components/wallet/WalletModal';

// Mock dependencies
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: (props: any) => React.ReactNode }) => {
      const mockProps = {
        account: null,
        chain: null,
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: vi.fn(),
        mounted: true,
      };
      return <div data-testid="connect-button-custom">{children(mockProps)}</div>;
    },
  },
}));

vi.mock('../../lib/context/WalletContext', () => ({
  useWallet: vi.fn(),
}));

vi.mock('../../lib/hooks/useNetworkSwitch', () => ({
  useNetworkSwitch: vi.fn(),
  useNetworkGuidance: vi.fn(),
}));

const mockUseWallet = vi.mocked(require('../../lib/context/WalletContext').useWallet);
const mockUseNetworkSwitch = vi.mocked(require('../../lib/hooks/useNetworkSwitch').useNetworkSwitch);
const mockUseNetworkGuidance = vi.mocked(require('../../lib/hooks/useNetworkSwitch').useNetworkGuidance);

describe('WalletModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    mockUseWallet.mockReturnValue({
      isConnected: false,
      needsNetworkSwitch: false,
    });

    mockUseNetworkSwitch.mockReturnValue({
      switchToDefaultNetwork: vi.fn(),
      isSwitching: false,
    });

    mockUseNetworkGuidance.mockReturnValue({
      shouldShowGuidance: false,
      guidance: null,
    });
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<WalletModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<WalletModal {...defaultProps} />);
      
      // Should render the modal backdrop and content
      expect(screen.getByText('连接钱包')).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<WalletModal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Context-specific Content', () => {
    it('should show purchase-specific content', () => {
      render(<WalletModal {...defaultProps} trigger="purchase" />);
      
      expect(screen.getByText('连接钱包购买颜色')).toBeInTheDocument();
      expect(screen.getByText('连接钱包以购买颜色 NFT 并参与协作绘画')).toBeInTheDocument();
    });

    it('should show collection-specific content', () => {
      render(<WalletModal {...defaultProps} trigger="collection" />);
      
      expect(screen.getByText('查看我的藏品')).toBeInTheDocument();
      expect(screen.getByText('连接钱包以查看您拥有的颜色 NFT 和参与的作品')).toBeInTheDocument();
    });

    it('should show canvas-specific content', () => {
      render(<WalletModal {...defaultProps} trigger="canvas" />);
      
      expect(screen.getByText('开始创作')).toBeInTheDocument();
      expect(screen.getByText('连接钱包以获取随机颜色并开始协作绘画')).toBeInTheDocument();
    });

    it('should show custom title and description', () => {
      const customTitle = 'Custom Title';
      const customDescription = 'Custom Description';
      
      render(
        <WalletModal 
          {...defaultProps} 
          title={customTitle}
          description={customDescription}
        />
      );
      
      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });
  });

  describe('Connection States', () => {
    it('should show connect button when not connected', () => {
      mockUseWallet.mockReturnValue({
        isConnected: false,
        needsNetworkSwitch: false,
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByTestId('connect-button-custom')).toBeInTheDocument();
    });

    it('should show network switch when connected but wrong network', () => {
      mockUseWallet.mockReturnValue({
        isConnected: true,
        needsNetworkSwitch: true,
      });

      const mockSwitchNetwork = vi.fn();
      mockUseNetworkSwitch.mockReturnValue({
        switchToDefaultNetwork: mockSwitchNetwork,
        isSwitching: false,
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByText('请切换到支持的网络以继续')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '切换网络' })).toBeInTheDocument();
    });

    it('should show switching state', () => {
      mockUseWallet.mockReturnValue({
        isConnected: true,
        needsNetworkSwitch: true,
      });

      mockUseNetworkSwitch.mockReturnValue({
        switchToDefaultNetwork: vi.fn(),
        isSwitching: true,
      });

      render(<WalletModal {...defaultProps} />);
      
      const switchButton = screen.getByRole('button', { name: '切换中...' });
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toBeDisabled();
    });

    it('should show success state when connected and ready', () => {
      mockUseWallet.mockReturnValue({
        isConnected: true,
        needsNetworkSwitch: false,
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByText('钱包已连接，您可以开始使用平台功能')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '开始使用' })).toBeInTheDocument();
    });
  });

  describe('Network Guidance', () => {
    it('should show warning guidance', () => {
      mockUseNetworkGuidance.mockReturnValue({
        shouldShowGuidance: true,
        guidance: {
          type: 'warning',
          title: 'Network Warning',
          message: 'Please switch to the correct network',
        },
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByText('Network Warning')).toBeInTheDocument();
      expect(screen.getByText('Please switch to the correct network')).toBeInTheDocument();
    });

    it('should show info guidance', () => {
      mockUseNetworkGuidance.mockReturnValue({
        shouldShowGuidance: true,
        guidance: {
          type: 'info',
          title: 'Network Info',
          message: 'You are on the correct network',
        },
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByText('Network Info')).toBeInTheDocument();
      expect(screen.getByText('You are on the correct network')).toBeInTheDocument();
    });

    it('should not show guidance when shouldShowGuidance is false', () => {
      mockUseNetworkGuidance.mockReturnValue({
        shouldShowGuidance: false,
        guidance: {
          type: 'warning',
          title: 'Should Not Show',
          message: 'This should not be visible',
        },
      });

      render(<WalletModal {...defaultProps} />);
      
      expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should call onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      render(<WalletModal {...defaultProps} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const mockOnClose = vi.fn();
      render(<WalletModal {...defaultProps} onClose={mockOnClose} />);
      
      // Find backdrop by class (since it doesn't have a specific role)
      const backdrop = document.querySelector('.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();
      
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should call onClose when "开始使用" button is clicked', () => {
      mockUseWallet.mockReturnValue({
        isConnected: true,
        needsNetworkSwitch: false,
      });

      const mockOnClose = vi.fn();
      render(<WalletModal {...defaultProps} onClose={mockOnClose} />);
      
      const startButton = screen.getByRole('button', { name: '开始使用' });
      fireEvent.click(startButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call switchToDefaultNetwork when switch button is clicked', () => {
      mockUseWallet.mockReturnValue({
        isConnected: true,
        needsNetworkSwitch: true,
      });

      const mockSwitchNetwork = vi.fn();
      mockUseNetworkSwitch.mockReturnValue({
        switchToDefaultNetwork: mockSwitchNetwork,
        isSwitching: false,
      });

      render(<WalletModal {...defaultProps} />);
      
      const switchButton = screen.getByRole('button', { name: '切换网络' });
      fireEvent.click(switchButton);
      
      expect(mockSwitchNetwork).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<WalletModal {...defaultProps} />);
      
      // Modal should be properly labeled
      expect(screen.getByText('连接钱包')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<WalletModal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      
      // Should be focusable
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('Footer Information', () => {
    it('should show supported wallets information', () => {
      render(<WalletModal {...defaultProps} />);
      
      expect(screen.getByText('支持 MetaMask、WalletConnect 等主流钱包')).toBeInTheDocument();
    });
  });
});