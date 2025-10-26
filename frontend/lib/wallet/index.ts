// Wallet Context and Providers
export { WalletProvider, useWallet, useWalletConnection, useWalletGuard } from '../context/WalletContext';
export { Web3Provider } from '../providers/Web3Provider';

// Wallet Components
export { WalletModal, WalletButton } from '../../components/wallet/WalletModal';
export { WalletStatus, WalletIndicator, NetworkIndicator } from '../../components/wallet/WalletStatus';

// Wallet Hooks
export { useWalletModal, useWalletGuardedAction } from '../hooks/useWalletModal';
export { useNetworkSwitch, useNetworkGuidance } from '../hooks/useNetworkSwitch';
export { useTransactionStatus, useTransactionQueue } from '../hooks/useTransactionStatus';
export { useGasEstimation, useGasDisplay } from '../hooks/useGasEstimation';

// Contract Hooks
export { useUserColors, useAvailableColors, useCurrentColorPrice, useOwnsColor, useColorBalance } from '../hooks/useColorNFTs';
export { usePurchaseColor, useRedeemColor, useMintArtwork, useTransferNFT } from '../hooks/useContractWrites';
export { useArtworkDetails, useContributorArtworks, useArtworkBalance, useArtworkOwner, useMultipleArtworks } from '../hooks/useArtworkNFTs';

// Contract Configuration
export { wagmiConfig, chains } from '../wagmi/config';
export { getColorNFTContract, getArtworkNFTContract, getFemCanvasRevenueContract, getContractConfig, SUPPORTED_CHAINS, DEFAULT_CHAIN, GAS_LIMITS, PRICE_CONFIG } from '../contracts/config';
export { ColorNFTABI, ArtworkNFTABI, FemCanvasRevenueABI, CONTRACT_ADDRESSES } from '../contracts/abis';

// Revenue Contract Hooks
export { useSendRevenue, useClaimRevenue, useClaimableAmount, useCanvasRevenueStatus } from '../hooks/useRevenueContract';

// Revenue Components
export { RevenueModal, useRevenueModal } from '../../components/revenue/RevenueManager';
export { RevenueButton, SendRevenueButton, ClaimRevenueButton, RevenueStatusButton } from '../../components/revenue/RevenueButton';

// Utilities
export { parseWeb3Error, isRetryableError, getErrorSeverity, formatErrorForUser, ERROR_MESSAGES } from '../utils/web3-errors';

// Types
export type { WalletModalTrigger } from '../hooks/useWalletModal';
export type { TransactionStatus, TransactionState } from '../hooks/useTransactionStatus';
export type { NetworkSwitchState } from '../hooks/useNetworkSwitch';
export type { GasEstimate } from '../hooks/useGasEstimation';
export type { Web3Error } from '../utils/web3-errors';