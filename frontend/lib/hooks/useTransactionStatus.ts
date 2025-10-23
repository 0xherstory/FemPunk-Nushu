import { useState, useEffect, useCallback } from 'react';
import { useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseWeb3Error, type Web3Error } from '../utils/web3-errors';

export type TransactionStatus = 
  | 'idle'
  | 'preparing'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error';

export interface TransactionState {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: Web3Error;
  confirmations?: number;
  gasUsed?: bigint;
  blockNumber?: number;
  receipt?: any;
}

// Hook for tracking transaction status with user feedback
export function useTransactionStatus(hash?: `0x${string}`) {
  const [state, setState] = useState<TransactionState>({
    status: 'idle',
  });

  const publicClient = usePublicClient();
  
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  // Update state based on transaction receipt
  useEffect(() => {
    if (!hash) {
      setState({ status: 'idle' });
      return;
    }

    if (isConfirming) {
      setState(prev => ({
        ...prev,
        status: 'confirming',
        hash,
      }));
    } else if (isSuccess && receipt) {
      setState(prev => ({
        ...prev,
        status: 'success',
        hash,
        receipt,
        gasUsed: receipt.gasUsed,
        blockNumber: Number(receipt.blockNumber),
        confirmations: 1, // Will be updated by confirmation tracking
      }));
    } else if (isError && receiptError) {
      const parsedError = parseWeb3Error(receiptError);
      setState(prev => ({
        ...prev,
        status: 'error',
        hash,
        error: {
          ...parsedError,
          transactionHash: hash,
        },
      }));
    }
  }, [hash, isConfirming, isSuccess, isError, receipt, receiptError]);

  // Track confirmations after transaction success
  useEffect(() => {
    if (!receipt || !publicClient) return;

    const trackConfirmations = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        const confirmations = Number(currentBlock - receipt.blockNumber) + 1;
        
        setState(prev => ({
          ...prev,
          confirmations,
        }));

        // Stop tracking after 12 confirmations (considered final)
        if (confirmations >= 12) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error tracking confirmations:', error);
      }
    };

    // Track confirmations every 15 seconds
    const intervalId = setInterval(trackConfirmations, 15000);
    trackConfirmations(); // Initial call

    return () => clearInterval(intervalId);
  }, [receipt, publicClient]);

  // Reset transaction state
  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Set preparing state (before transaction is sent)
  const setPreparing = useCallback(() => {
    setState({ status: 'preparing' });
  }, []);

  // Set pending state (transaction sent but not confirmed)
  const setPending = useCallback((hash: `0x${string}`) => {
    setState({
      status: 'pending',
      hash,
    });
  }, []);

  return {
    ...state,
    reset,
    setPreparing,
    setPending,
    isLoading: state.status === 'preparing' || state.status === 'pending' || state.status === 'confirming',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}

// Hook for managing multiple transactions
export function useTransactionQueue() {
  const [transactions, setTransactions] = useState<Map<string, TransactionState>>(new Map());

  const addTransaction = useCallback((id: string, hash: `0x${string}`) => {
    setTransactions(prev => new Map(prev).set(id, {
      status: 'pending',
      hash,
    }));
  }, []);

  const updateTransaction = useCallback((id: string, update: Partial<TransactionState>) => {
    setTransactions(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...update });
      }
      return newMap;
    });
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTransactions(prev => {
      const newMap = new Map();
      prev.forEach((transaction, id) => {
        if (transaction.status !== 'success' && transaction.status !== 'error') {
          newMap.set(id, transaction);
        }
      });
      return newMap;
    });
  }, []);

  return {
    transactions: Array.from(transactions.entries()).map(([id, transaction]) => ({
      id,
      ...transaction,
    })),
    addTransaction,
    updateTransaction,
    removeTransaction,
    clearCompleted,
    pendingCount: Array.from(transactions.values()).filter(
      tx => tx.status === 'pending' || tx.status === 'confirming'
    ).length,
  };
}