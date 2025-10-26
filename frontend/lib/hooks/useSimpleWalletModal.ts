'use client';

import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  trigger?: 'purchase' | 'collection' | 'canvas' | 'manual';
}

export function useSimpleWalletModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    trigger: 'manual'
  });

  const openModal = useCallback((trigger: 'purchase' | 'collection' | 'canvas' | 'manual' = 'manual') => {
    setModalState({
      isOpen: true,
      trigger
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    modalState,
    openModal,
    closeModal
  };
}