import { useReadContract, useReadContracts } from 'wagmi';
import { useAccount } from 'wagmi';
import { getColorNFTContract } from '../contracts/config';
import type { ColorNFT } from '../../types';

// Hook to get user's owned color NFTs
export function useUserColors() {
  const { address, chainId } = useAccount();
  
  const contract = chainId ? getColorNFTContract(chainId) : null;
  
  const { data: ownedColors, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getOwnedColors',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contract,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Transform contract data to ColorNFT type
  const transformedColors: ColorNFT[] = (ownedColors as any[])?.map((color: any) => ({
    id: `${chainId}-${color.tokenId}`,
    colorHex: color.colorHex,
    tokenId: Number(color.tokenId),
    owner: address || '',
    mintedAt: new Date(Number(color.mintedAt) * 1000),
    price: color.price,
  })) || [];

  return {
    userColors: transformedColors,
    isLoading,
    error,
    refetch,
  };
}

// Hook to get all available colors for purchase
export function useAvailableColors() {
  const { chainId } = useAccount();
  
  const contract = chainId ? getColorNFTContract(chainId) : null;
  
  const { data: availableColors, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getAvailableColors',
    query: {
      enabled: !!contract,
      refetchInterval: 60000, // Refetch every minute
    },
  });

  return {
    availableColors: availableColors || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook to get current color price
export function useCurrentColorPrice() {
  const { chainId } = useAccount();
  
  const contract = chainId ? getColorNFTContract(chainId) : null;
  
  const { data: currentPrice, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getCurrentPrice',
    query: {
      enabled: !!contract,
      refetchInterval: 300000, // Refetch every 5 minutes
    },
  });

  return {
    currentPrice: (currentPrice as bigint) || 0n,
    isLoading,
    error,
    refetch,
  };
}

// Hook to check if user owns a specific color
export function useOwnsColor(colorHex: string) {
  const { userColors, isLoading } = useUserColors();
  
  const ownsColor = userColors.some(color => 
    color.colorHex.toLowerCase() === colorHex.toLowerCase()
  );

  return {
    ownsColor,
    isLoading,
  };
}

// Hook to get user's color balance
export function useColorBalance() {
  const { address, chainId } = useAccount();
  
  const contract = chainId ? getColorNFTContract(chainId) : null;
  
  const { data: balance, isLoading, error } = useReadContract({
    ...contract,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contract,
    },
  });

  return {
    balance: balance ? Number(balance) : 0,
    isLoading,
    error,
  };
}