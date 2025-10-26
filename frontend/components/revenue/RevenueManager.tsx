'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useSendRevenue, useClaimRevenue, useClaimableAmount, useCanvasRevenueStatus } from '../../lib/hooks/useRevenueContract';
import { ErrorAlert } from '../ui/ErrorAlert';

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasId: number;
  mode: 'send' | 'claim' | 'status';
}

export function RevenueModal({ isOpen, onClose, canvasId, mode }: RevenueModalProps) {
  const { address, isConnected } = useAccount();
  const [mintQuantity, setMintQuantity] = useState(100); // Default 100 NFTs
  
  const { sendRevenue, isLoading: isSending, isSuccess: sendSuccess, error: sendError, txHash: sendTxHash } = useSendRevenue();
  const { claimRevenue, isLoading: isClaiming, isSuccess: claimSuccess, error: claimError, txHash: claimTxHash } = useClaimRevenue();
  const { claimableAmount, isLoading: loadingClaimable } = useClaimableAmount(canvasId);
  const { status, isLoading: loadingStatus } = useCanvasRevenueStatus(canvasId);

  // Close modal on successful transaction
  useEffect(() => {
    if (sendSuccess || claimSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [sendSuccess, claimSuccess, onClose]);

  const handleSendRevenue = async () => {
    if (!mintQuantity || mintQuantity <= 0) {
      alert('请输入有效的铸造数量');
      return;
    }
    const totalAmount = (mintQuantity * 0.0018).toFixed(4);
    await sendRevenue(canvasId, totalAmount);
  };

  const handleClaimRevenue = async () => {
    await claimRevenue(canvasId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === 'send' && '发送收益'}
            {mode === 'claim' && '领取收益'}
            {mode === 'status' && '收益状态'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">请先连接钱包</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                关闭
              </button>
            </div>
          ) : (
            <>

              {/* Send Revenue Mode */}
              {mode === 'send' && (
                <div className="space-y-4">
                  {/* Unit Price Display */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">NFT 单价</p>
                      <p className="text-2xl font-bold text-blue-600">0.0018 ETH</p>
                      <p className="text-xs text-gray-500">每个 NFT 的固定价格</p>
                    </div>
                  </div>

                  {/* Mint Quantity Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      铸造数量
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={mintQuantity}
                      onChange={(e) => setMintQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 text-black text-lg font-medium border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      placeholder="100"
                    />
                    <p className="text-xs text-black mt-1 text-center">
                      建议数量: 100 个 NFT
                    </p>
                  </div>

                  {/* Total Amount Display */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">总金额:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {(mintQuantity * 0.0018).toFixed(4)} ETH
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {mintQuantity} × 0.0018 ETH = {(mintQuantity * 0.0018).toFixed(4)} ETH
                    </p>
                  </div>

                  <button
                    onClick={handleSendRevenue}
                    disabled={isSending || mintQuantity <= 0}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                  >
                    {isSending ? '发送中...' : `发送 ${(mintQuantity * 0.0018).toFixed(4)} ETH`}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    这些 ETH 将发送到收益合约，根据贡献比例分配给参与者
                  </p>

                  {sendError && (
                    <ErrorAlert 
                      error={sendError} 
                      onDismiss={() => {
                        // Clear error after user reads it
                      }}
                    />
                  )}

                  {sendSuccess && sendTxHash && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 mb-2">
                        🎉 收益发送成功!
                      </p>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${sendTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        查看交易详情 →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Claim Revenue Mode */}
              {mode === 'claim' && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">您的可领取金额</p>
                    {loadingClaimable ? (
                      <p className="text-gray-500">加载中...</p>
                    ) : (
                      <p className="text-2xl font-bold text-green-600">{claimableAmount} ETH</p>
                    )}
                  </div>

                  <button
                    onClick={handleClaimRevenue}
                    disabled={isClaiming || parseFloat(claimableAmount) <= 0}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isClaiming ? '领取中...' : parseFloat(claimableAmount) <= 0 ? '暂无可领取收益' : '确认领取'}
                  </button>

                  {claimError && (
                    <ErrorAlert 
                      error={claimError} 
                      onDismiss={() => {
                        // Clear error after user reads it
                      }}
                    />
                  )}

                  {claimSuccess && claimTxHash && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 mb-2">
                        🎉 收益领取成功!
                      </p>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${claimTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        查看交易详情 →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Status Mode */}
              {mode === 'status' && (
                <div className="space-y-4">
                  {/* Canvas Basic Info */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Canvas #{canvasId}</h3>
                    {loadingStatus ? (
                      <p className="text-gray-500">加载状态中...</p>
                    ) : status ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">总收益</p>
                          <p className="font-bold text-blue-600">{status.totalRevenue} ETH</p>
                        </div>
                        <div>
                          <p className="text-gray-600">贡献者</p>
                          <p className="font-bold text-purple-600">{status.contributorsCount} 人</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">暂无数据</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">您的可领取金额</span>
                      <span className="text-xl font-bold text-green-600">
                        {loadingClaimable ? '加载中...' : `${claimableAmount} ETH`}
                      </span>
                    </div>
                    
                    {status && (
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">分配状态</span>
                        <span className={`font-bold ${status.distributed ? 'text-green-600' : 'text-orange-600'}`}>
                          {status.distributed ? '✅ 已分配' : '⏳ 未分配'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    {parseFloat(claimableAmount) > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          // Trigger claim modal
                          setTimeout(() => {
                            const event = new CustomEvent('openRevenueModal', { 
                              detail: { canvasId, mode: 'claim' } 
                            });
                            window.dispatchEvent(event);
                          }, 100);
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                      >
                        💎 领取收益
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      关闭
                    </button>
                  </div>
                </div>
      
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for managing revenue modal
export function useRevenueModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    canvasId: number;
    mode: 'send' | 'claim' | 'status';
  }>({
    isOpen: false,
    canvasId: 0,
    mode: 'send'
  });

  const openModal = (canvasId: number, mode: 'send' | 'claim' | 'status' = 'send') => {
    setModalState({ isOpen: true, canvasId, mode });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Listen for custom events
  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const { canvasId, mode } = event.detail;
      openModal(canvasId, mode);
    };

    window.addEventListener('openRevenueModal', handleOpenModal as EventListener);
    return () => {
      window.removeEventListener('openRevenueModal', handleOpenModal as EventListener);
    };
  }, []);

  return {
    ...modalState,
    openModal,
    closeModal
  };
}