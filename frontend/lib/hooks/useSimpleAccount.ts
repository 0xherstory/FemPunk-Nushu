'use client';

import { useState, useCallback } from 'react';

// 模拟账户状态
export function useSimpleAccount() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  // 模拟连接钱包
  const connect = useCallback(() => {
    setIsConnected(true);
    setAddress('0x1234567890123456789012345678901234567890');
  }, []);

  // 模拟断开连接
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(undefined);
  }, []);

  return {
    address,
    isConnected,
    isConnecting: false,
    isDisconnected: !isConnected,
    connect,
    disconnect
  };
}