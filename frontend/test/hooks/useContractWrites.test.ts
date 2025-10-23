import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePurchaseColor, useMintArtwork, useRedeemCode } from '../../lib/hooks/useContractWrites';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}));

// Mock contract config
vi.mock('../../lib/contracts/config', () => ({
  getColorNFTContract: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    abi: [
      {
        name: 'purchaseColor',
        type: 'function',
        inputs: [
          { name: 'colorHex', type: 'string' },
          { name: 'quantity', type: 'uint256' },
        ],
      },
      {
        name: 'mintArtwork',
        type: 'function',
        inputs: [
          { name: 'canvasData', type: 'string' },
          { name: 'contributors', type: 'address[]' },
        ],
      },
      {
        name: 'redeemCode',
        type: 'function',
        inputs: [
          { name: 'code', type: 'string' },
        ],
      },
    ],
  })),
}));

const mockWriteContract = vi.fn();
const mockUseWriteContract = vi.mocked(useWriteContract);
const mockUseWaitForTransactionReceipt = vi.mocked(useWaitForTransactionReceipt);

describe('useContractWrites hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      error: null,
      reset: vi.fn(),
    } as any);

    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      error: null,
      data: undefined,
    } as any);
  });

  describe('usePurchaseColor', () => {
    it('should purchase color with correct parameters', async () => {
      const { result } = renderHook(() => usePurchaseColor());

      await result.current.purchaseColor('#FF0000', '1');

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        abi: expect.any(Array),
        functionName: 'purchaseColor',
        args: ['#FF0000', '1'],
        value: expect.any(BigInt),
      });
    });

    it('should handle multiple color purchases', async () => {
      const { result } = renderHook(() => usePurchaseColor());

      await result.current.purchaseColor('#FF0000', '2');

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          args: ['#FF0000', '2'],
        })
      );
    });

    it('should return pending state during transaction', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: true,
        error: null,
        reset: vi.fn(),
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      expect(result.current.isPending).toBe(true);
    });

    it('should return confirming state during receipt wait', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xhash123',
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: true,
        isSuccess: false,
        error: null,
        data: undefined,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      expect(result.current.isConfirming).toBe(true);
    });

    it('should return success state when transaction confirmed', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xhash123',
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        error: null,
        data: { transactionHash: '0xhash123' },
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle transaction errors', () => {
      const mockError = new Error('Transaction failed');
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: mockError,
        reset: vi.fn(),
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      expect(result.current.error).toBe(mockError);
    });

    it('should handle receipt errors', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xhash123',
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as any);

      const mockReceiptError = new Error('Transaction reverted');
      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: false,
        error: mockReceiptError,
        data: undefined,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      expect(result.current.error).toBe(mockReceiptError);
    });

    it('should reset transaction state', () => {
      const mockReset = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: null,
        reset: mockReset,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      result.current.reset();

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMintArtwork', () => {
    it('should mint artwork with correct parameters', async () => {
      const { result } = renderHook(() => useMintArtwork());

      const canvasData = 'base64-canvas-data';
      const contributors = ['0x123', '0x456'];

      await result.current.mintArtwork(canvasData, contributors);

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        abi: expect.any(Array),
        functionName: 'mintArtwork',
        args: [canvasData, contributors],
      });
    });

    it('should handle empty contributors array', async () => {
      const { result } = renderHook(() => useMintArtwork());

      await result.current.mintArtwork('canvas-data', []);

      expect(mockWriteContract).toHaveBeenCalledWith(
        expect.objectContaining({
          args: ['canvas-data', []],
        })
      );
    });

    it('should return transaction states correctly', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xhash123',
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        error: null,
        data: { 
          transactionHash: '0xhash123',
          logs: [{ topics: ['0xevent'], data: '0xdata' }],
        },
      } as any);

      const { result } = renderHook(() => useMintArtwork());

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.transactionHash).toBe('0xhash123');
    });
  });

  describe('useRedeemCode', () => {
    it('should redeem code with correct parameters', async () => {
      const { result } = renderHook(() => useRedeemCode());

      await result.current.redeemCode('PROMO123');

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        abi: expect.any(Array),
        functionName: 'redeemCode',
        args: ['PROMO123'],
      });
    });

    it('should handle invalid redemption codes', () => {
      const mockError = new Error('Invalid redemption code');
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: mockError,
        reset: vi.fn(),
      } as any);

      const { result } = renderHook(() => useRedeemCode());

      expect(result.current.error).toBe(mockError);
    });

    it('should handle successful redemption', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xhash123',
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as any);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        error: null,
        data: { 
          transactionHash: '0xhash123',
          logs: [{ 
            topics: ['0xRedemptionSuccess'], 
            data: '0x000000000000000000000000000000000000000000000000000000000000FF0000',
          }],
        },
      } as any);

      const { result } = renderHook(() => useRedeemCode());

      expect(result.current.isSuccess).toBe(true);
    });

    it('should validate redemption code format', async () => {
      const { result } = renderHook(() => useRedeemCode());

      // Should not call contract with empty code
      await expect(result.current.redeemCode('')).rejects.toThrow('Invalid redemption code');
      expect(mockWriteContract).not.toHaveBeenCalled();
    });
  });

  describe('Gas Estimation', () => {
    it('should estimate gas for purchase transaction', async () => {
      const mockEstimateGas = vi.fn().mockResolvedValue(BigInt(21000));
      
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: null,
        reset: vi.fn(),
        estimateGas: mockEstimateGas,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      if (result.current.estimateGas) {
        const gasEstimate = await result.current.estimateGas('#FF0000', '1');
        expect(gasEstimate).toBe(BigInt(21000));
      }
    });

    it('should handle gas estimation errors', async () => {
      const mockEstimateGas = vi.fn().mockRejectedValue(new Error('Gas estimation failed'));
      
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: null,
        reset: vi.fn(),
        estimateGas: mockEstimateGas,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      if (result.current.estimateGas) {
        await expect(result.current.estimateGas('#FF0000', '1')).rejects.toThrow('Gas estimation failed');
      }
    });
  });

  describe('Transaction Retry', () => {
    it('should allow retrying failed transactions', async () => {
      const mockReset = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: new Error('Transaction failed'),
        reset: mockReset,
      } as any);

      const { result } = renderHook(() => usePurchaseColor());

      // Reset and retry
      result.current.reset();
      await result.current.purchaseColor('#FF0000', '1');

      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockWriteContract).toHaveBeenCalledTimes(1);
    });
  });
});