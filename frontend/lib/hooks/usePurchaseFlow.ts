import { useState, useCallback, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { usePurchaseColor } from './useContractWrites';
import { useCurrentColorPrice } from './useColorNFTs';
import { useWallet } from '../context/WalletContext';

export interface PurchaseState {
  selectedColors: string[];
  paymentMethod: 'eth' | 'redemption_code';
  redemptionCode: string;
  isProcessing: boolean;
  currentStep: 'selection' | 'payment' | 'confirmation' | 'success' | 'error';
  error: string | null;
  transactionHash: string | null;
  purchasedColors: string[];
}

export interface PurchaseFlowHooks {
  state: PurchaseState;
  actions: {
    selectColor: (colorId: string) => void;
    deselectColor: (colorId: string) => void;
    clearSelection: () => void;
    setPaymentMethod: (method: 'eth' | 'redemption_code') => void;
    setRedemptionCode: (code: string) => void;
    startPurchase: () => Promise<void>;
    confirmPurchase: () => Promise<void>;
    resetFlow: () => void;
    retryPurchase: () => Promise<void>;
  };
  computed: {
    totalPrice: bigint;
    canPurchase: boolean;
    hasInsufficientFunds: boolean;
    isWalletReady: boolean;
    estimatedGasFee: bigint;
    maxSelectableColors: number;
  };
}

const MAX_COLORS_PER_PURCHASE = 5;

export function usePurchaseFlow(): PurchaseFlowHooks {
  const { address, isConnected } = useAccount();
  const { isSupported } = useWallet();
  const { currentPrice } = useCurrentColorPrice();
  const priceInWei = currentPrice as bigint;
  const { purchaseColor, isPending, isConfirming, isSuccess, error: contractError } = usePurchaseColor();
  
  // Get user's ETH balance
  const { data: balance } = useBalance({
    address,
  });

  const [state, setState] = useState<PurchaseState>({
    selectedColors: [],
    paymentMethod: 'eth',
    redemptionCode: '',
    isProcessing: false,
    currentStep: 'selection',
    error: null,
    transactionHash: null,
    purchasedColors: [],
  });

  // Computed values
  const totalPrice = priceInWei * BigInt(state.selectedColors.length);
  const estimatedGasFee = BigInt(150000) * BigInt(21000000000); // Rough estimate: 150k gas * 21 gwei
  const totalCost = totalPrice + estimatedGasFee;
  const hasInsufficientFunds = balance ? balance.value < totalCost : false;
  const isWalletReady = isConnected && !!address && isSupported;
  const canPurchase = state.selectedColors.length > 0 && 
                     isWalletReady && 
                     !hasInsufficientFunds && 
                     !state.isProcessing;

  // Actions
  const selectColor = useCallback((colorId: string) => {
    setState(prev => {
      if (prev.selectedColors.includes(colorId)) return prev;
      if (prev.selectedColors.length >= MAX_COLORS_PER_PURCHASE) return prev;
      
      return {
        ...prev,
        selectedColors: [...prev.selectedColors, colorId],
        error: null,
      };
    });
  }, []);

  const deselectColor = useCallback((colorId: string) => {
    setState(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.filter(id => id !== colorId),
      error: null,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedColors: [],
      error: null,
    }));
  }, []);

  const setPaymentMethod = useCallback((method: 'eth' | 'redemption_code') => {
    setState(prev => ({
      ...prev,
      paymentMethod: method,
      error: null,
    }));
  }, []);

  const setRedemptionCode = useCallback((code: string) => {
    setState(prev => ({
      ...prev,
      redemptionCode: code,
      error: null,
    }));
  }, []);

  const startPurchase = useCallback(async () => {
    if (!canPurchase) {
      setState(prev => ({
        ...prev,
        error: '无法开始购买流程，请检查选择和钱包状态',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      currentStep: 'payment',
      isProcessing: true,
      error: null,
    }));

    // Pre-flight checks
    try {
      if (state.paymentMethod === 'eth') {
        // Check balance again
        if (hasInsufficientFunds) {
          throw new Error(`余额不足。需要 ${formatEther(totalCost)} ETH，当前余额 ${formatEther(balance?.value || 0n)} ETH`);
        }
      }

      setState(prev => ({
        ...prev,
        currentStep: 'confirmation',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        currentStep: 'error',
        isProcessing: false,
        error: error instanceof Error ? error.message : '购买准备失败',
      }));
    }
  }, [canPurchase, hasInsufficientFunds, totalCost, balance, state.paymentMethod]);

  const confirmPurchase = useCallback(async () => {
    if (state.currentStep !== 'confirmation') return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      const purchasedColors: string[] = [];

      if (state.paymentMethod === 'eth') {
        // Purchase colors one by one
        for (const colorId of state.selectedColors) {
          const colorHex = getColorHexById(colorId);
          if (colorHex) {
            await purchaseColor(colorHex, formatEther(priceInWei));
            purchasedColors.push(colorId);
          }
        }
      } else {
        // Handle redemption code flow
        // This would integrate with the RedemptionCodeInput component
        throw new Error('兑换码购买流程需要使用兑换码组件');
      }

      setState(prev => ({
        ...prev,
        currentStep: 'success',
        isProcessing: false,
        purchasedColors,
        selectedColors: [], // Clear selection after successful purchase
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        currentStep: 'error',
        isProcessing: false,
        error: error instanceof Error ? error.message : '购买失败，请重试',
      }));
    }
  }, [state.currentStep, state.paymentMethod, state.selectedColors, purchaseColor, currentPrice]);

  const retryPurchase = useCallback(async () => {
    setState(prev => ({
      ...prev,
      currentStep: 'selection',
      isProcessing: false,
      error: null,
    }));
  }, []);

  const resetFlow = useCallback(() => {
    setState({
      selectedColors: [],
      paymentMethod: 'eth',
      redemptionCode: '',
      isProcessing: false,
      currentStep: 'selection',
      error: null,
      transactionHash: null,
      purchasedColors: [],
    });
  }, []);

  // Update state based on contract status
  useEffect(() => {
    if (contractError) {
      setState(prev => ({
        ...prev,
        currentStep: 'error',
        isProcessing: false,
        error: contractError.message || '交易失败',
      }));
    }
  }, [contractError]);

  useEffect(() => {
    if (isSuccess && state.currentStep !== 'success') {
      setState(prev => ({
        ...prev,
        currentStep: 'success',
        isProcessing: false,
        purchasedColors: prev.selectedColors,
        selectedColors: [],
      }));
    }
  }, [isSuccess, state.currentStep]);

  // Update processing state based on contract status
  useEffect(() => {
    const isContractProcessing = isPending || isConfirming;
    setState(prev => ({
      ...prev,
      isProcessing: isContractProcessing || prev.isProcessing,
    }));
  }, [isPending, isConfirming]);

  return {
    state,
    actions: {
      selectColor,
      deselectColor,
      clearSelection,
      setPaymentMethod,
      setRedemptionCode,
      startPurchase,
      confirmPurchase,
      resetFlow,
      retryPurchase,
    },
    computed: {
      totalPrice,
      canPurchase,
      hasInsufficientFunds,
      isWalletReady,
      estimatedGasFee,
      maxSelectableColors: MAX_COLORS_PER_PURCHASE,
    },
  };
}

import { getColorById } from '../constants/colors';

// Helper function to get color hex by ID using shared constants
function getColorHexById(colorId: string): string | null {
  const color = getColorById(colorId);
  return color ? color.hex : null;
}