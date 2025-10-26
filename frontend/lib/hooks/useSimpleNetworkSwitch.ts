import { useSwitchChain, useChainId, useAccount } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';
import { sepolia, mainnet } from 'viem/chains';

const SUPPORTED_CHAINS = [sepolia, mainnet] as const;
const DEFAULT_CHAIN = sepolia;

export interface NetworkSwitchState {
  isWrongNetwork: boolean;
  currentChain: typeof SUPPORTED_CHAINS[number] | null;
  targetChain: typeof SUPPORTED_CHAINS[number];
  isSwitching: boolean;
  error: string | null;
}

// Hook for managing network switching
export function useNetworkSwitch() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();
  
  const [state, setState] = useState<NetworkSwitchState>({
    isWrongNetwork: false,
    currentChain: null,
    targetChain: DEFAULT_CHAIN,
    isSwitching: false,
    error: null,
  });

  // Determine current chain and if it's supported
  useEffect(() => {
    if (!isConnected) {
      setState(prev => ({
        ...prev,
        isWrongNetwork: false,
        currentChain: null,
      }));
      return;
    }

    const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
    const isWrongNetwork = !currentChain;

    setState(prev => ({
      ...prev,
      isWrongNetwork,
      currentChain: currentChain || null,
    }));
  }, [chainId, isConnected]);

  // Update switching state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isSwitching: isPending,
      error: error?.message || null,
    }));
  }, [isPending, error]);

  // Switch to default network
  const switchToDefaultNetwork = useCallback(async () => {
    if (!switchChain) {
      setState(prev => ({
        ...prev,
        error: '钱包不支持网络切换',
      }));
      return false;
    }

    try {
      setState(prev => ({
        ...prev,
        error: null,
      }));

      await switchChain({ chainId: DEFAULT_CHAIN.id });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络切换失败';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [switchChain]);

  return {
    ...state,
    switchToDefaultNetwork,
    supportedChains: SUPPORTED_CHAINS,
  };
}

// Hook for network-specific warnings and guidance
export function useNetworkGuidance() {
  const { isWrongNetwork, currentChain, targetChain } = useNetworkSwitch();
  const { isConnected } = useAccount();

  const getGuidanceMessage = useCallback(() => {
    if (!isConnected) {
      return {
        type: 'info' as const,
        title: '连接钱包',
        message: '请先连接钱包以使用平台功能',
        action: '连接钱包',
      };
    }

    if (isWrongNetwork) {
      return {
        type: 'warning' as const,
        title: '网络不匹配',
        message: `请切换到 ${targetChain.name} 网络以继续使用`,
        action: '切换网络',
      };
    }

    if (currentChain?.testnet) {
      return {
        type: 'info' as const,
        title: '测试网络',
        message: '您正在使用测试网络，所有交易都是模拟的',
        action: null,
      };
    }

    return null;
  }, [isConnected, isWrongNetwork, currentChain, targetChain]);

  const shouldShowGuidance = isConnected && (isWrongNetwork || currentChain?.testnet);

  return {
    shouldShowGuidance,
    guidance: getGuidanceMessage(),
  };
}