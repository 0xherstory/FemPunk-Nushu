'use client';

import React from 'react';

interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  showSolutions?: boolean;
}

export function ErrorAlert({ error, onDismiss, showSolutions = true }: ErrorAlertProps) {
  const getSolutions = (error: string) => {
    if (error.includes('RPC 请求过多') || error.includes('429') || error.includes('Too Many Requests')) {
      return [
        '等待几分钟后重试',
        '获取免费的 Alchemy API Key: https://www.alchemy.com/',
        '在 .env.local 中设置 NEXT_PUBLIC_ALCHEMY_API_KEY',
        '或者使用其他钱包网络设置'
      ];
    }
    
    if (error.includes('余额不足')) {
      return [
        '确保钱包中有足够的 ETH',
        '从测试网水龙头获取测试 ETH',
        '检查当前网络是否正确'
      ];
    }
    
    if (error.includes('网络连接')) {
      return [
        '检查网络连接',
        '尝试刷新页面',
        '切换到其他网络再切换回来'
      ];
    }
    
    return [
      '检查钱包连接状态',
      '确认网络设置正确',
      '稍后重试'
    ];
  };

  const solutions = getSolutions(error);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            交易失败
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>
          
          {showSolutions && solutions.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-800 mb-2">解决方案:</p>
              <ul className="list-disc list-inside space-y-1">
                {solutions.map((solution, index) => (
                  <li key={index} className="text-xs text-red-600">
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600"
            >
              <span className="sr-only">关闭</span>
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}