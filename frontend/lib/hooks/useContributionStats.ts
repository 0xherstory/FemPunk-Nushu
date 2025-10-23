import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useContributorArtworks } from './useArtworkNFTs';
import { useUserColors } from './useColorNFTs';
import type { Contributor } from '../../types';

export interface ContributionStats {
  totalArtworks: number;
  totalContribution: number; // Total percentage across all artworks
  averageContribution: number; // Average percentage per artwork
  totalColors: number;
  totalValueEarned: bigint; // Total ETH earned from contributions
  activeStreaks: number; // Days of consecutive participation
  lastActivity: Date | null;
}

export interface ParticipatedArtwork {
  tokenId: number;
  title: string;
  contribution: number; // User's contribution percentage
  totalValue: bigint; // Total artwork value
  userEarnings: bigint; // User's share of earnings
  mintedAt: Date;
  canvasPreview: string; // Base64 image data
  isSettled: boolean; // Whether earnings have been distributed
  settlementDeadline?: Date;
}

// Hook to get user's contribution statistics
export function useContributionStats() {
  const { address } = useAccount();
  const { tokenIds, isLoading: artworksLoading } = useContributorArtworks();
  const { userColors, isLoading: colorsLoading } = useUserColors();
  
  const [stats, setStats] = useState<ContributionStats>({
    totalArtworks: 0,
    totalContribution: 0,
    averageContribution: 0,
    totalColors: 0,
    totalValueEarned: 0n,
    activeStreaks: 0,
    lastActivity: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || artworksLoading || colorsLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Calculate stats from available data
    try {
      const totalArtworks = tokenIds.length;
      const totalColors = userColors.length;
      
      // Mock calculation - in real implementation, this would fetch from contracts
      const mockTotalContribution = totalArtworks * 15; // Average 15% per artwork
      const averageContribution = totalArtworks > 0 ? mockTotalContribution / totalArtworks : 0;
      const totalValueEarned = BigInt(totalArtworks) * BigInt('10000000000000000'); // 0.01 ETH per artwork
      
      setStats({
        totalArtworks,
        totalContribution: mockTotalContribution,
        averageContribution,
        totalColors,
        totalValueEarned,
        activeStreaks: Math.min(totalArtworks, 7), // Mock streak
        lastActivity: totalArtworks > 0 ? new Date() : null,
      });
    } catch (err) {
      setError('Failed to calculate contribution stats');
      console.error('Contribution stats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, tokenIds, userColors, artworksLoading, colorsLoading]);

  return {
    stats,
    isLoading: isLoading || artworksLoading || colorsLoading,
    error,
  };
}

// Hook to get detailed information about artworks user participated in
export function useParticipatedArtworks() {
  const { address } = useAccount();
  const { tokenIds, isLoading: tokenIdsLoading } = useContributorArtworks();
  
  const [artworks, setArtworks] = useState<ParticipatedArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || tokenIdsLoading || tokenIds.length === 0) {
      setArtworks([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Mock data generation - in real implementation, this would fetch from contracts
    const mockArtworks: ParticipatedArtwork[] = tokenIds.map((tokenId, index) => {
      const contribution = 10 + (index * 5) % 30; // Mock contribution between 10-40%
      const totalValue = BigInt('100000000000000000'); // 0.1 ETH
      const userEarnings = (totalValue * BigInt(contribution)) / 100n;
      
      return {
        tokenId,
        title: `Collaborative Artwork #${tokenId}`,
        contribution,
        totalValue,
        userEarnings,
        mintedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Staggered dates
        canvasPreview: '', // Would be actual canvas data
        isSettled: index % 3 === 0, // Mock some as settled
        settlementDeadline: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days from now
      };
    });
    
    setArtworks(mockArtworks);
    setIsLoading(false);
  }, [address, tokenIds, tokenIdsLoading]);

  return {
    artworks,
    isLoading: isLoading || tokenIdsLoading,
    error,
  };
}

// Hook to get pending settlements (artworks ready for earnings distribution)
export function usePendingSettlements() {
  const { artworks, isLoading } = useParticipatedArtworks();
  
  const pendingSettlements = artworks.filter(artwork => 
    !artwork.isSettled && 
    artwork.settlementDeadline && 
    artwork.settlementDeadline > new Date()
  );
  
  const totalPendingEarnings = pendingSettlements.reduce(
    (total, artwork) => total + artwork.userEarnings,
    0n
  );

  return {
    pendingSettlements,
    totalPendingEarnings,
    count: pendingSettlements.length,
    isLoading,
  };
}