import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data helpers
export const createMockColorNFT = (overrides = {}) => ({
  id: 'test-color-1',
  colorHex: '#FF0000',
  tokenId: 1,
  owner: '0x1234567890123456789012345678901234567890',
  mintedAt: new Date('2024-01-01'),
  price: BigInt('1000000000000000000'), // 1 ETH
  ...overrides,
});

export const createMockCanvasState = (overrides = {}) => ({
  objects: [],
  version: 1,
  lastModified: new Date('2024-01-01'),
  activeUsers: [],
  ...overrides,
});

export const createMockWalletState = (overrides = {}) => ({
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true,
  isConnecting: false,
  chainId: 1,
  error: null,
  ...overrides,
});

// Test helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};