import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { getColorNFTContract, getArtworkNFTContract, GAS_LIMITS } from '../contracts/config';
import { useState } from 'react';

// Hook for purchasing color NFTs
export function usePurchaseColor() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);
  
  const contract = chainId ? getColorNFTContract(chainId) : null;

  const { isLoading: isReceiptLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const purchaseColor = async (colorHex: string, priceInEth: string) => {
    if (!contract) throw new Error('Contract not available');
    
    setIsConfirming(true);
    
    try {
      await writeContract({
        ...contract,
        functionName: 'purchaseColor',
        args: [colorHex],
        value: parseEther(priceInEth),
        gas: GAS_LIMITS.purchaseColor,
      });
    } catch (err) {
      setIsConfirming(false);
      throw err;
    }
  };

  return {
    purchaseColor,
    hash,
    isPending,
    isConfirming: isConfirming || isReceiptLoading,
    isSuccess,
    error,
  };
}

// Hook for redeeming color with code
export function useRedeemColor() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const contract = chainId ? getColorNFTContract(chainId) : null;

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const redeemColor = async (redemptionCode: string) => {
    if (!contract) throw new Error('Contract not available');
    
    await writeContract({
      ...contract,
      functionName: 'redeemColor',
      args: [redemptionCode],
      gas: GAS_LIMITS.redeemColor,
    });
  };

  return {
    redeemColor,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Hook for minting artwork NFTs
export function useMintArtwork() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const contract = chainId ? getArtworkNFTContract(chainId) : null;

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintArtwork = async (
    canvasData: string,
    contributors: string[],
    contributions: number[],
    dailyThemeId: string
  ) => {
    if (!contract) throw new Error('Contract not available');
    
    // Convert contributions to wei (assuming they're percentages)
    const contributionsInWei = contributions.map(c => BigInt(c * 100)); // Convert to basis points
    const contributorsAsAddresses = contributors as `0x${string}`[];
    
    await writeContract({
      ...contract,
      functionName: 'mintArtwork',
      args: [canvasData, contributorsAsAddresses, contributionsInWei, dailyThemeId],
      gas: GAS_LIMITS.mintArtwork,
    });
  };

  return {
    mintArtwork,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Hook for transferring NFTs
export function useTransferNFT() {
  const { address, chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transferColorNFT = async (to: string, tokenId: number) => {
    if (!address || !chainId) throw new Error('Wallet not connected');
    
    const contract = getColorNFTContract(chainId);
    
    await writeContract({
      ...contract,
      functionName: 'transferFrom',
      args: [address as `0x${string}`, to as `0x${string}`, BigInt(tokenId)],
      gas: GAS_LIMITS.transfer,
    });
  };

  const transferArtworkNFT = async (to: string, tokenId: number) => {
    if (!address || !chainId) throw new Error('Wallet not connected');
    
    const contract = getArtworkNFTContract(chainId);
    
    await writeContract({
      ...contract,
      functionName: 'transferFrom',
      args: [address as `0x${string}`, to as `0x${string}`, BigInt(tokenId)],
      gas: GAS_LIMITS.transfer,
    });
  };

  return {
    transferColorNFT,
    transferArtworkNFT,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}