import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { getArtworkNFTContract } from '../contracts/config';
import type { Artwork, Contributor } from '../../types';

// Hook to get artwork details by token ID
export function useArtworkDetails(tokenId: number) {
  const { chainId } = useAccount();
  
  const contract = chainId ? getArtworkNFTContract(chainId) : null;
  
  const { data: artworkData, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getArtworkDetails',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!contract && tokenId > 0,
    },
  });

  // Transform contract data to Artwork type
  const artwork: Artwork | null = (artworkData as any) ? {
    id: `${chainId}-${tokenId}`,
    title: `Artwork #${tokenId}`,
    canvasData: (artworkData as any).canvasData,
    contributors: (artworkData as any).contributors.map((addr: string, index: number) => ({
      address: addr,
      contribution: Number((artworkData as any).contributions[index]) / 100, // Convert from basis points
      strokeCount: 0, // This would need to be tracked separately
      timeSpent: 0, // This would need to be tracked separately
    })) as Contributor[],
    createdAt: new Date(Number((artworkData as any).mintedAt) * 1000),
    mintedAt: new Date(Number((artworkData as any).mintedAt) * 1000),
    nftTokenId: tokenId,
    price: (artworkData as any).price,
    dailyTheme: {
      id: (artworkData as any).dailyThemeId,
      date: '',
      title: '',
      titleEn: '',
      description: '',
      nushuCharacter: {
        character: '',
        meaning: '',
        pronunciation: '',
      },
    },
  } : null;

  return {
    artwork,
    isLoading,
    error,
    refetch,
  };
}

// Hook to get artworks that a user contributed to
export function useContributorArtworks(contributorAddress?: string) {
  const { address, chainId } = useAccount();
  const targetAddress = contributorAddress || address;
  
  const contract = chainId ? getArtworkNFTContract(chainId) : null;
  
  const { data: tokenIds, isLoading, error, refetch } = useReadContract({
    ...contract,
    functionName: 'getContributorArtworks',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!contract,
      refetchInterval: 60000, // Refetch every minute
    },
  });

  return {
    tokenIds: (tokenIds as any[])?.map((id: any) => Number(id)) || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook to get user's artwork balance
export function useArtworkBalance() {
  const { address, chainId } = useAccount();
  
  const contract = chainId ? getArtworkNFTContract(chainId) : null;
  
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

// Hook to check artwork ownership
export function useArtworkOwner(tokenId: number) {
  const { chainId } = useAccount();
  
  const contract = chainId ? getArtworkNFTContract(chainId) : null;
  
  const { data: owner, isLoading, error } = useReadContract({
    ...contract,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!contract && tokenId > 0,
    },
  });

  return {
    owner: owner as string | undefined,
    isLoading,
    error,
  };
}

// Hook to get multiple artwork details efficiently
export function useMultipleArtworks(tokenIds: number[]) {
  const { chainId } = useAccount();
  
  // For now, return mock data to avoid the hooks rule violation
  // This should be replaced with proper batch contract reading
  const [state, setState] = useState({
    artworks: [] as Artwork[],
    isLoading: false,
    error: null as any,
  });

  useEffect(() => {
    if (!chainId || tokenIds.length === 0) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate loading multiple artworks
    setTimeout(() => {
      const mockArtworks: Artwork[] = tokenIds.map(tokenId => ({
        id: `${chainId}-${tokenId}`,
        title: `Artwork #${tokenId}`,
        canvasData: '',
        contributors: [],
        createdAt: new Date(),
        nftTokenId: tokenId,
        price: BigInt('50000000000000000'),
        dailyTheme: {
          id: `theme-${tokenId}`,
          date: new Date().toISOString().split('T')[0],
          title: `Theme ${tokenId}`,
          titleEn: `Theme ${tokenId}`,
          description: 'Mock theme description',
          nushuCharacter: {
            character: '女',
            meaning: 'Woman',
            pronunciation: 'nǚ',
          },
        },
      }));
      
      setState({
        artworks: mockArtworks,
        isLoading: false,
        error: null,
      });
    }, 1000);
  }, [chainId, tokenIds]);

  return state;
}