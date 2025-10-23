// Store exports
export * from './walletStore';
export * from './colorStore';
export * from './canvasStore';
export * from './appStore';

// Re-export commonly used selectors for convenience
export {
  useWalletAddress,
  useWalletConnection,
  useWalletChain,
  useWalletError,
} from './walletStore';

export {
  useUserColors,
  useAvailableColors,
  useSelectedColor,
  useColorLoading,
  useColorError,
  useColorOwnership,
  usePurchaseStatus,
} from './colorStore';

export {
  useCanvasState,
  useCanvasLoading,
  useCanvasError,
  useDrawingTools,
  useCanvasHistory,
  useActiveUsers,
  useCanvasSync,
} from './canvasStore';

export {
  useAppLoading,
  useGlobalError,
  useModals,
  useCurrentTheme,
  useNetworkStatus,
  usePreferences,
} from './appStore';