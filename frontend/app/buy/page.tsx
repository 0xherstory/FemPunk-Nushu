'use client';

import React, { useState } from 'react';
import { NavigationBar } from '../../components/navigation/NavigationBar';
import { PriceDisplay } from '../../components/purchase/PriceDisplay';
import { ColorGrid } from '../../components/purchase/ColorGrid';
import { PurchaseButton } from '../../components/purchase/PurchaseButton';
import { RedemptionCodeInput } from '../../components/purchase/RedemptionCodeInput';
import { TransactionStatus } from '../../components/purchase/TransactionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePurchaseFlow } from '../../lib/hooks/usePurchaseFlow';
import { useWallet } from '../../lib/context/WalletContext';

export default function BuyPage() {
  const { isConnected, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<'purchase' | 'redeem'>('purchase');
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  
  const {
    state,
    actions,
    computed
  } = usePurchaseFlow();

  const handleColorSelect = (colorId: string) => {
    if (state.selectedColors.includes(colorId)) {
      actions.deselectColor(colorId);
    } else {
      actions.selectColor(colorId);
    }
  };

  const handlePurchaseSuccess = () => {
    setShowTransactionStatus(true);
    // Refresh user colors after successful purchase
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handlePurchaseError = (error: string) => {
    console.error('Purchase error:', error);
    // Error handling is managed by the purchase flow hook
  };

  const handleRedemptionSuccess = (colorHex: string) => {
    console.log('Redemption successful for color:', colorHex);
    // Show success message and refresh
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleRedemptionError = (error: string) => {
    console.error('Redemption error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar currentPage="buy" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              颜色 NFT 购买
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              购买颜色 NFT 来解锁绘画权限。每种颜色都是独特的数字资产，
              让您在协作画布上自由创作，并获得作品收益分成。
            </p>
          </div>

          {/* Wallet Connection Check */}
          {!isConnected && (
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  需要连接钱包
                </h3>
                <p className="text-gray-600 mb-4">
                  请先连接您的钱包以购买颜色 NFT
                </p>
                <Button onClick={connect} variant="nushu" size="lg">
                  连接钱包
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transaction Status Modal */}
          {showTransactionStatus && (state.currentStep === 'success' || state.currentStep === 'error') && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full">
                <TransactionStatus
                  status={state.currentStep === 'success' ? 'success' : 'error'}
                  error={state.error || undefined}
                  purchasedColors={state.purchasedColors}
                  totalAmount={computed.totalPrice}
                  onRetry={() => {
                    setShowTransactionStatus(false);
                    actions.retryPurchase();
                  }}
                  onClose={() => {
                    setShowTransactionStatus(false);
                    actions.resetFlow();
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Price and Info */}
            <div className="space-y-6">
              <PriceDisplay />
              
              {/* Purchase Method Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>购买方式</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('purchase')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'purchase'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      ETH 购买
                    </button>
                    <button
                      onClick={() => setActiveTab('redeem')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'redeem'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      兑换码
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Balance and Gas Info */}
              {isConnected && computed.isWalletReady && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">预估 Gas 费:</span>
                        <span className="font-medium">~0.003 ETH</span>
                      </div>
                      {computed.hasInsufficientFunds && (
                        <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
                          ⚠️ 余额不足，请充值后再试
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Middle Column - Color Selection or Redemption */}
            <div className="lg:col-span-2">
              {activeTab === 'purchase' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>选择颜色</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorGrid
                      selectedColors={state.selectedColors}
                      onColorSelect={handleColorSelect}
                      maxSelection={computed.maxSelectableColors}
                    />
                  </CardContent>
                </Card>
              ) : (
                <RedemptionCodeInput
                  onRedemptionSuccess={handleRedemptionSuccess}
                  onRedemptionError={handleRedemptionError}
                />
              )}
            </div>
          </div>

          {/* Purchase Button Section */}
          {activeTab === 'purchase' && isConnected && (
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <PurchaseButton
                    selectedColors={state.selectedColors}
                    onPurchaseSuccess={handlePurchaseSuccess}
                    onPurchaseError={handlePurchaseError}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Processing Status */}
          {state.isProcessing && (state.currentStep === 'payment' || state.currentStep === 'confirmation') && (
            <div className="mt-8">
              <TransactionStatus
                status={state.currentStep === 'payment' ? 'pending' : 'confirming'}
                transactionHash={state.transactionHash || undefined}
              />
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>购买说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">💰 关于价格</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 颜色价格每日递增</li>
                    <li>• 早购买享受更低价格</li>
                    <li>• 价格以 ETH 计价</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🎨 使用权益</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 在画布中使用拥有的颜色</li>
                    <li>• 参与协作获得收益分成</li>
                    <li>• 颜色 NFT 可转让交易</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🔒 安全保障</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 智能合约保障所有权</li>
                    <li>• 去中心化存储</li>
                    <li>• 透明的链上记录</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🎁 兑换码</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 关注公众号获取兑换码</li>
                    <li>• 参与活动赢取免费颜色</li>
                    <li>• 兑换码有时效限制</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}