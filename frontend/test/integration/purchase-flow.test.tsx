import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PurchaseButton } from '../../components/purchase/PurchaseButton';
import { useWallet } from '../../lib/context/WalletContext';
import { usePurchaseColor } from '../../lib/hooks/useContractWrites';
import { useCurrentColorPrice } from '../../lib/hooks/useColorNFTs';

// Mock dependencies
vi.mock('../../lib/context/WalletContext');
vi.mock('../../lib/hooks/useContractWrites');
vi.mock('../../lib/hooks/useColorNFTs');
vi.mock('../../lib/constants/colors', () => ({
  getColorById: vi.fn((id: string) => ({
    id,
    hex: id === 'red' ? '#FF0000' : '#00FF00',
    name: id === 'red' ? 'Red' : 'Green',
  })),
}));

const mockUseWallet = vi.mocked(useWallet);
const mockUsePurchaseColor = vi.mocked(usePurchaseColor);
const mockUseCurrentColorPrice = vi.mocked(useCurrentColorPrice);

describe('Purchase Flow Integration', () => {
  const mockConnect = vi.fn();
  const mockPurchaseColor = vi.fn();
  const mockOnPurchaseSuccess = vi.fn();
  const mockOnPurchaseError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseWallet.mockReturnValue({
      isConnected: true,
      connect: mockConnect,
    } as any);

    mockUsePurchaseColor.mockReturnValue({
      purchaseColor: mockPurchaseColor,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
    } as any);

    mockUseCurrentColorPrice.mockReturnValue({
      currentPrice: BigInt('1000000000000000000'), // 1 ETH
    } as any);
  });

  describe('Wallet Connection', () => {
    it('should prompt to connect wallet when not connected', () => {
      mockUseWallet.mockReturnValue({
        isConnected: false,
        connect: mockConnect,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /连接钱包购买/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('should not call purchase when wallet not connected', () => {
      mockUseWallet.mockReturnValue({
        isConnected: false,
        connect: mockConnect,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockPurchaseColor).not.toHaveBeenCalled();
    });
  });

  describe('Color Selection', () => {
    it('should show disabled state when no colors selected', () => {
      render(
        <PurchaseButton
          selectedColors={[]}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /请选择颜色/i });
      expect(button).toBeDisabled();
    });

    it('should show correct count and price for selected colors', () => {
      render(
        <PurchaseButton
          selectedColors={['red', 'green']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      expect(screen.getByText('2 种')).toBeInTheDocument();
      expect(screen.getByText('1 ETH')).toBeInTheDocument(); // Single price
      expect(screen.getByText('2 ETH')).toBeInTheDocument(); // Total price
    });
  });

  describe('Purchase Process', () => {
    it('should initiate purchase when button clicked', async () => {
      mockPurchaseColor.mockResolvedValue(undefined);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /购买 1 种颜色/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPurchaseColor).toHaveBeenCalledWith('#FF0000', '1');
      });
    });

    it('should show loading state during purchase', () => {
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        error: null,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /购买中/i });
      expect(button).toBeDisabled();
    });

    it('should show confirming state', () => {
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: false,
        isConfirming: true,
        isSuccess: false,
        error: null,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /购买中/i });
      expect(button).toBeDisabled();
    });

    it('should handle multiple color purchases', async () => {
      mockPurchaseColor.mockResolvedValue(undefined);

      render(
        <PurchaseButton
          selectedColors={['red', 'green']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button', { name: /购买 2 种颜色/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPurchaseColor).toHaveBeenCalledTimes(2);
        expect(mockPurchaseColor).toHaveBeenCalledWith('#FF0000', '1');
        expect(mockPurchaseColor).toHaveBeenCalledWith('#00FF00', '1');
      });
    });

    it('should show progress for multiple purchases', () => {
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        error: null,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red', 'green']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      // This would show during the purchase process
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Success Handling', () => {
    it('should show success message when purchase succeeds', () => {
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: false,
        isConfirming: false,
        isSuccess: true,
        error: null,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      expect(screen.getByText('购买成功！')).toBeInTheDocument();
      expect(screen.getByText(/颜色 NFT 已添加到您的钱包/)).toBeInTheDocument();
    });

    it('should call onPurchaseSuccess callback', async () => {
      mockPurchaseColor.mockResolvedValue(undefined);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnPurchaseSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when purchase fails', () => {
      const mockError = { message: 'Insufficient funds' };
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        error: mockError,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      expect(screen.getByText('购买失败')).toBeInTheDocument();
      expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
    });

    it('should show generic error message when no specific error', () => {
      const mockError = {};
      mockUsePurchaseColor.mockReturnValue({
        purchaseColor: mockPurchaseColor,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        error: mockError,
      } as any);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      expect(screen.getByText(/请检查网络连接和钱包余额后重试/)).toBeInTheDocument();
    });

    it('should call onPurchaseError callback when purchase fails', async () => {
      const error = new Error('Purchase failed');
      mockPurchaseColor.mockRejectedValue(error);

      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnPurchaseError).toHaveBeenCalledWith('Purchase failed');
      });
    });
  });

  describe('Purchase Tips', () => {
    it('should show helpful tips', () => {
      render(
        <PurchaseButton
          selectedColors={['red']}
          onPurchaseSuccess={mockOnPurchaseSuccess}
          onPurchaseError={mockOnPurchaseError}
        />
      );

      expect(screen.getByText(/购买后的颜色 NFT 将立即可用于画布创作/)).toBeInTheDocument();
      expect(screen.getByText(/参与协作绘画可获得作品收益分成/)).toBeInTheDocument();
      expect(screen.getByText(/交易确认通常需要 1-2 分钟/)).toBeInTheDocument();
    });
  });
});