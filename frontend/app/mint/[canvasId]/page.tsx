'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { RevenueModal, useRevenueModal } from '../../../components/revenue/RevenueManager';
import { PageLayout } from '../../../components/layout/PageLayout';
import { useSendRevenue, useCanvasRevenueStatus, useClaimableAmount } from '../../../lib/hooks/useRevenueContract';

export default function MintPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const canvasId = parseInt(params.canvasId as string);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);

  const { sendRevenue, isLoading: isSendingRevenue, isSuccess: revenueSuccess } = useSendRevenue();
  const { status } = useCanvasRevenueStatus(canvasId);
  const { claimableAmount } = useClaimableAmount(canvasId);
  const { isOpen, mode, openModal, closeModal } = useRevenueModal();

  const handleMintWithRevenue = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    // Open revenue modal for sending
    openModal(canvasId, 'send');
  };

  const handleMintNFT = async () => {
    try {
      setIsMinting(true);
      setMintError(null);

      console.log('Calling backend to mint NFT...');
      const response = await fetch('/api/canvas/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canvas_id: canvasId
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Canvas minted successfully:', result.txHash);
        setMintSuccess(true);
      } else {
        throw new Error(result.error || 'Failed to mint canvas');
      }

    } catch (error: any) {
      console.error('Error minting canvas:', error);
      setMintError(error.message || 'Minting failed');
    } finally {
      setIsMinting(false);
    }
  };

  if (!canvasId || isNaN(canvasId)) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">无效的 Canvas ID</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              返回首页
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-bold mb-2">Mint Canvas #{canvasId}</h1>
          <p className="text-gray-600">
            通过发送收益到合约来铸造这个协作艺术品为 NFT
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">请连接钱包</h2>
            <p className="text-gray-600 mb-6">
              您需要连接 Web3 钱包才能进行铸造操作
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Canvas Status Card */}
            <div className="p-6 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Canvas #{canvasId} 状态</h2>
              {status ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">总收益</p>
                    <p className="text-lg font-bold text-blue-600">{status.totalRevenue} ETH</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">分配状态</p>
                    <p className={`text-lg font-bold ${status.distributed ? 'text-green-600' : 'text-orange-600'}`}>
                      {status.distributed ? '已分配' : '未分配'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">贡献者</p>
                    <p className="text-lg font-bold text-purple-600">{status.contributorsCount} 人</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">加载状态中...</div>
              )}
              
              <button
                onClick={() => openModal(canvasId, 'status')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                查看详细状态
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Send Revenue */}
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-2">发送收益</h3>
                <p className="text-gray-600 text-sm mb-4">
                  向合约发送 ETH 作为收益，将根据贡献比例分配给参与者
                </p>
                <button
                  onClick={handleMintWithRevenue}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  💰 发送收益
                </button>
              </div>

              {/* Claim Revenue */}
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-2">领取收益</h3>
                <p className="text-gray-600 text-sm mb-2">
                  您的可领取金额: <span className="font-medium text-green-600">{claimableAmount} ETH</span>
                </p>
                <button
                  onClick={() => openModal(canvasId, 'claim')}
                  disabled={parseFloat(claimableAmount) <= 0}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {parseFloat(claimableAmount) > 0 ? '💎 领取收益' : '暂无可领取收益'}
                </button>
              </div>
            </div>

            {/* Mint NFT Section */}
            <div className="p-6 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4">铸造 NFT</h2>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  将此协作画布铸造为 NFT (需要先发送收益到合约)
                </p>
                <p className="text-sm text-gray-500">
                  建议先发送收益，然后再铸造 NFT
                </p>
              </div>
              
              <button
                onClick={handleMintNFT}
                disabled={isMinting}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isMinting ? '铸造中...' : '🎨 铸造 NFT'}
              </button>

              {mintError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{mintError}</p>
                </div>
              )}

              {mintSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    🎉 NFT 铸造成功!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Modal */}
        <RevenueModal
          isOpen={isOpen}
          onClose={closeModal}
          canvasId={canvasId}
          mode={mode}
        />
      </div>
    </PageLayout>
  );
}