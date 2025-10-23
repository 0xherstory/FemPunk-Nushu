import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get environment variables
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id-for-local-testing';
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set - using demo ID for local testing');
}

// Configure supported chains
const chains = [sepolia, mainnet] as const;

// Create wagmi config with minimal connectors
export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ 
      projectId: walletConnectProjectId,
      metadata: {
        name: 'FemPunk NüShu',
        description: 'Web3 协作绘画平台',
        url: 'https://fempunk-nushu.vercel.app',
        icons: ['https://fempunk-nushu.vercel.app/favicon.ico']
      }
    }),
  ],
  transports: {
    [sepolia.id]: http(
      alchemyApiKey 
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://rpc.sepolia.org'
    ),
    [mainnet.id]: http(
      alchemyApiKey
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://cloudflare-eth.com'
    ),
  },
  ssr: true,
});

// Export chain configurations
export { chains };
export type SupportedChain = typeof chains[number];