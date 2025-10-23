'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../wagmi/config';
import { WalletProvider } from '../context/WalletContext';
import { queryClient } from '../queries/queryClient';
import { useDataSync } from '../services/dataSync';
import { useGlobalSetup } from '../setup/globalSetup';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// RainbowKit theme configuration
const rainbowKitTheme = {
  ...lightTheme({
    accentColor: '#d946ef', // Primary brand color
    accentColorForeground: 'white',
    borderRadius: 'medium',
    fontStack: 'system',
  }),
  colors: {
    ...lightTheme().colors,
    modalBackground: 'white',
    modalBorder: '#e5e7eb',
    modalText: '#111827',
    modalTextSecondary: '#6b7280',
  },
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

// Internal component to handle data sync and global setup after providers are set up
function DataSyncProvider({ children }: { children: React.ReactNode }) {
  // useDataSync(); // Temporarily disabled for debugging
  // useGlobalSetup(); // Temporarily disabled for debugging
  return <>{children}</>;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={rainbowKitTheme}
          modalSize="compact"
          initialChain={wagmiConfig.chains[0]} // Default to first chain (Sepolia in dev)
          showRecentTransactions={true}
          coolMode={true} // Fun animation effects
        >
          <WalletProvider>
            <DataSyncProvider>
              {children}
            </DataSyncProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}