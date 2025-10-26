// RPC Health Check Utility
export const RPC_ENDPOINTS = {
  sepolia: [
    'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    'https://rpc.sepolia.org',
    'https://ethereum-sepolia.publicnode.com',
    'https://sepolia.gateway.tenderly.co',
  ],
  mainnet: [
    'https://ethereum.publicnode.com',
    'https://cloudflare-eth.com',
    'https://rpc.ankr.com/eth',
    'https://eth.llamarpc.com',
  ]
};

export async function checkRPCHealth(url: string): Promise<{ url: string; healthy: boolean; latency?: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      url,
      healthy: true,
      latency,
    };
  } catch (error) {
    return {
      url,
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkAllRPCs(network: 'sepolia' | 'mainnet' = 'sepolia') {
  const endpoints = RPC_ENDPOINTS[network];
  const results = await Promise.all(
    endpoints.map(url => checkRPCHealth(url))
  );
  
  console.log(`🔍 RPC Health Check for ${network}:`);
  results.forEach(result => {
    if (result.healthy) {
      console.log(`✅ ${result.url} - ${result.latency}ms`);
    } else {
      console.log(`❌ ${result.url} - ${result.error}`);
    }
  });
  
  return results;
}

// Auto-run health check in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run health check after a short delay
  setTimeout(() => {
    checkAllRPCs('sepolia');
  }, 2000);
}