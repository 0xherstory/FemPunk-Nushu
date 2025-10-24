import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { ColorNFT } from '../../types';

// Mock colors for development/demo mode
const MOCK_USER_COLORS: ColorNFT[] = [
  {
    id: 'demo-1',
    colorHex: '#FF6B9D',
    tokenId: 1,
    owner: '0x1234...5678',
    mintedAt: new Date(),
    price: BigInt('1000000000000000000'), // 1 ETH in wei
  },
  {
    id: 'demo-2', 
    colorHex: '#FFD700',
    tokenId: 2,
    owner: '0x1234...5678',
    mintedAt: new Date(),
    price: BigInt('1000000000000000000'),
  },
  {
    id: 'demo-3',
    colorHex: '#2D3748',
    tokenId: 3,
    owner: '0x1234...5678',
    mintedAt: new Date(),
    price: BigInt('1000000000000000000'),
  }
];

const AVAILABLE_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000'
];

// Hook to get user's owned color NFTs
export function useUserColors() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [userColors, setUserColors] = useState<ColorNFT[]>([]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (isConnected && address) {
        // Return mock colors for connected users
        setUserColors(MOCK_USER_COLORS.map(color => ({
          ...color,
          owner: address
        })));
      } else {
        // No colors for non-connected users
        setUserColors([]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [address, isConnected]);

  const refetch = () => {
    setIsLoading(true);
    // Simulate refetch
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return {
    userColors,
    isLoading,
    error: null,
    refetch,
  };
}

// Hook to get all available colors for purchase
export function useAvailableColors() {
  const [isLoading, setIsLoading] = useState(true);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvailableColors(AVAILABLE_COLORS);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  return {
    availableColors,
    isLoading,
    error: null,
    refetch,
  };
}

// Hook to get current color price
export function useCurrentColorPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<bigint>(BigInt('1000000000000000000')); // 1 ETH

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  return {
    currentPrice,
    isLoading,
    error: null,
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
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isConnected && address) {
        setBalance(MOCK_USER_COLORS.length);
      } else {
        setBalance(0);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [address, isConnected]);

  return {
    balance,
    isLoading,
    error: null,
  };
}