'use client';

import React, { useState } from 'react';

export function SetupGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
        title="设置指南"
      >
        ⚙️
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">🚀 快速设置指南</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* RPC Configuration */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  🌐 解决 RPC 限制问题
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="font-medium text-yellow-800 mb-2">
                      ⚠️ 如果遇到 "Too Many Requests" 错误:
                    </p>
                    <p className="text-yellow-700">
                      这是因为使用了公共 RPC 端点，有请求限制。
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="font-medium text-blue-800 mb-2">
                      💡 解决方案 - 获取免费 Alchemy API Key:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>访问 <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer" className="underline">https://www.alchemy.com/</a></li>
                      <li>注册免费账户</li>
                      <li>创建新的 App (选择 Ethereum Sepolia 网络)</li>
                      <li>复制 API Key</li>
                      <li>在项目根目录创建 <code className="bg-gray-100 px-1 rounded">.env.local</code> 文件</li>
                      <li>添加: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key_here</code></li>
                      <li>重启开发服务器</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Wallet Setup */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  👛 钱包设置
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="font-medium text-green-800 mb-2">
                      ✅ 推荐设置:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-green-700">
                      <li>安装 MetaMask 浏览器扩展</li>
                      <li>添加 Sepolia 测试网络</li>
                      <li>从水龙头获取测试 ETH: <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">sepoliafaucet.com</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contract Addresses */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  📋 合约地址配置
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    在 <code className="bg-gray-100 px-1 rounded">.env.local</code> 中设置:
                  </p>
                  <div className="bg-gray-50 border rounded p-3 font-mono text-xs">
                    <div>NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS=0x...</div>
                    <div>NEXT_PUBLIC_COLOR_NFT_CONTRACT_ADDRESS=0x...</div>
                    <div>NEXT_PUBLIC_ARTWORK_NFT_CONTRACT_ADDRESS=0x...</div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  🔧 常见问题
                </h3>
                <div className="space-y-2 text-sm">
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer font-medium">交易失败怎么办？</summary>
                    <div className="mt-2 text-gray-600 space-y-1">
                      <p>• 检查钱包余额是否足够</p>
                      <p>• 确认网络设置正确 (Sepolia)</p>
                      <p>• 尝试增加 Gas 费用</p>
                    </div>
                  </details>
                  
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer font-medium">连接钱包失败？</summary>
                    <div className="mt-2 text-gray-600 space-y-1">
                      <p>• 确保已安装 MetaMask</p>
                      <p>• 刷新页面重试</p>
                      <p>• 检查浏览器是否阻止弹窗</p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                开始使用
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}