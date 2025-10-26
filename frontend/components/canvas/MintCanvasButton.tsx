'use client';

import React, { useState } from 'react';

interface MintCanvasButtonProps {
  canvasId: number;
  className?: string;
  children?: React.ReactNode;
}

export function MintCanvasButton({ canvasId, className = '', children = 'Mint Canvas' }: MintCanvasButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleMint = async () => {
    console.log('🎨 Minting canvas:', canvasId);

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      const response = await fetch('/api/canvas/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canvas_id: canvasId
        }),
      });

      console.log('📡 Mint API response status:', response.status);
      const result = await response.json();
      console.log('📋 Mint API result:', result);

      if (result.success && result.txHash) {
        console.log('🎉 Canvas minted successfully:', result.txHash);
        setTxHash(result.txHash);
        setSuccess('Canvas 铸造成功!');
      } else {
        throw new Error(result.error || 'Failed to mint canvas');
      }
    } catch (err: any) {
      console.error('❌ Mint canvas error:', err);
      setError(err.message || 'Canvas 铸造失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleMint}
        disabled={isLoading}
        className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? '铸造中...' : children}
      </button>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          <div className="flex items-center gap-2 mb-2">
            <span>✅</span>
            <span className="font-medium">{success}</span>
          </div>

          {txHash && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">交易哈希:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </code>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  <span>🔗</span>
                  <span>在 Etherscan 上查看</span>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(txHash);
                    alert('交易哈希已复制到剪贴板！');
                  }}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs"
                  title="复制交易哈希"
                >
                  <span>📋</span>
                  <span>复制哈希</span>
                </button>

                <button
                  onClick={() => {
                    const contractAddress = '0xb3E67356EEF4D675196B7aFfe43e9bd6fc4BA0b0';
                    const tokenId = canvasId.toString();
                    const info = `合约地址: ${contractAddress}\nToken ID: ${tokenId}`;
                    navigator.clipboard.writeText(info);
                    alert('NFT导入信息已复制到剪贴板！\n可以在钱包中导入NFT时使用。');
                  }}
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs"
                  title="复制NFT导入信息"
                >
                  <span>🎨</span>
                  <span>复制NFT信息</span>
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                💡 你可以在钱包中导入此NFT：
                <br />
                合约地址: <code className="bg-gray-100 px-1 rounded">0xb3E67356EEF4D675196B7aFfe43e9bd6fc4BA0b0</code>
                <br />
                Token ID: <code className="bg-gray-100 px-1 rounded">{canvasId}</code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}