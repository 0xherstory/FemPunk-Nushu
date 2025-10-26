'use client';

import React from 'react';
import { useAccount, useChainId } from 'wagmi';
import { getFemCanvasRevenueContract } from '../../lib/contracts/config';
import { useSendRevenue } from '../../lib/hooks/useRevenueContract';

export default function TestRevenuePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendRevenue, isLoading, error } = useSendRevenue();

  const handleTest = async () => {
    console.log('🧪 Test button clicked');
    console.log('📊 Wallet info:', { address, isConnected, chainId });
    
    if (chainId) {
      const contract = getFemCanvasRevenueContract(chainId);
      console.log('📋 Contract info:', contract);
      console.log('📍 Contract address:', contract.address);
      console.log('🔧 Contract ABI length:', contract.abi.length);
      console.log('🌍 Environment variables:', {
        NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS,
        NODE_ENV: process.env.NODE_ENV,
      });
      
      // Check if contract address is zero
      if (contract.address === '0x0000000000000000000000000000000000000000') {
        console.error('❌ Contract address is zero! Environment variable not loaded correctly.');
      }
    }

    if (isConnected) {
      console.log('🚀 Attempting to send revenue...');
      await sendRevenue(8417776330752267, '0.0018');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Revenue Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
          <p><strong>Address:</strong> {address || 'Not connected'}</p>
          <p><strong>Chain ID:</strong> {chainId || 'Unknown'}</p>
        </div>

        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Revenue Send'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}