import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getFemCanvasRevenueContract, GAS_LIMITS } from '../contracts/config';
import { trackWeb3Error } from '../monitoring/sentry';
import { ErrorHandlerService } from '../services/errorHandler';

// Hook for sending revenue to contract
export const useSendRevenue = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorHandler = ErrorHandlerService.getInstance();

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendRevenue = async (canvasId: number, amountInEth: string) => {
    if (!address || !chainId) {
      setError('请先连接钱包');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contract = getFemCanvasRevenueContract(chainId);
      const amountInWei = parseEther(amountInEth);

      await writeContract({
        ...contract,
        functionName: 'receiveRevenue',
        args: [BigInt(canvasId)],
        value: amountInWei,
        gas: GAS_LIMITS.receiveRevenue,
      });

    } catch (err: any) {
      console.error('Send revenue error:', err);
      
      let errorMessage = '发送收益失败';
      
      // Handle specific error types
      if (err.message?.includes('User rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保账户有足够的 ETH';
      } else if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
        errorMessage = 'RPC 请求过多，请稍后重试或配置自己的 Alchemy API Key';
      } else if (err.message?.includes('network')) {
        errorMessage = '网络连接问题，请检查网络或稍后重试';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);

      trackWeb3Error(err, {
        action: 'send_revenue',
        contractAddress: getFemCanvasRevenueContract(chainId).address,
        userAddress: address,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendRevenue,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
};

// Hook for claiming revenue
export const useClaimRevenue = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorHandler = ErrorHandlerService.getInstance();

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimRevenue = async (canvasId: number) => {
    canvasId = 4122776673090566;
    if (!address || !chainId) {
      setError('请先连接钱包');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contract = getFemCanvasRevenueContract(chainId);

      await writeContract({
        ...contract,
        functionName: 'claimRevenue',
        args: [BigInt(canvasId)],
        gas: GAS_LIMITS.claimRevenue,
      });

    } catch (err: any) {
      console.error('Claim revenue error:', err);
      
      let errorMessage = '领取收益失败';
      
      // Handle specific error types
      if (err.message?.includes('User rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保账户有足够的 ETH 支付 Gas 费';
      } else if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
        errorMessage = 'RPC 请求过多，请稍后重试或配置自己的 Alchemy API Key';
      } else if (err.message?.includes('network')) {
        errorMessage = '网络连接问题，请检查网络或稍后重试';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);

      trackWeb3Error(err, {
        action: 'claim_revenue',
        contractAddress: getFemCanvasRevenueContract(chainId).address,
        userAddress: address,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimRevenue,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
};

// Hook for reading claimable amount
export const useClaimableAmount = (canvasId: number) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const contract = chainId ? getFemCanvasRevenueContract(chainId) : null;

  const { data: claimableWei, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getClaimableAmount',
    args: address ? [BigInt(canvasId), address] : undefined,
    query: {
      enabled: !!address && !!contract && canvasId > 0,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  const claimableAmount = claimableWei ? formatEther(claimableWei as bigint) : '0';

  return {
    claimableAmount,
    claimableWei: claimableWei as bigint,
    isLoading,
    error,
    refetch,
  };
};

// Hook for reading canvas revenue status
export const useCanvasRevenueStatus = (canvasId: number) => {
  const chainId = useChainId();

  const contract = chainId ? getFemCanvasRevenueContract(chainId) : null;

  const { data: revenueData, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getCanvasRevenueStatus',
    args: [BigInt(canvasId)],
    query: {
      enabled: !!contract && canvasId > 0,
      refetchInterval: 30000,
    },
  });

  const status = revenueData ? {
    totalRevenue: formatEther((revenueData as any)[0] as bigint),
    totalRevenueWei: (revenueData as any)[0] as bigint,
    distributed: (revenueData as any)[1] as boolean,
    contributorsCount: Number((revenueData as any)[2] as bigint),
  } : null;

  return {
    status,
    isLoading,
    error,
    refetch,
  };
};