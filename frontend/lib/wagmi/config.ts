import { createConfig, http, fallback } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get environment variables
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id-for-local-testing';
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set - using demo ID for local testing');
}

if (!alchemyApiKey) {
  console.warn('NEXT_PUBLIC_ALCHEMY_API_KEY is not set - using public RPC endpoints');
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
    [sepolia.id]: fallback([
      ...(alchemyApiKey ? [http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`)] : []),
      http('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
      http('https://rpc.sepolia.org'),
      http('https://ethereum-sepolia.publicnode.com'),
      http('https://sepolia.gateway.tenderly.co'),
    ]),
    [mainnet.id]: fallback([
      ...(alchemyApiKey ? [http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`)] : []),
      http('https://ethereum.publicnode.com'),
      http('https://cloudflare-eth.com'),
      http('https://rpc.ankr.com/eth'),
      http('https://eth.llamarpc.com'),
    ]),
  },
  ssr: true,
});

// Export chain configurations
export { chains };
export type SupportedChain = typeof chains[number];