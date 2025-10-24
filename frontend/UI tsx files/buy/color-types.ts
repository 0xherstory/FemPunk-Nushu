/**
 * FemPunk Nvshu - Color Page TypeScript Types
 * Design: Mint颜色页 (Color Mint Page)
 * Node ID: 100:1983
 */

/**
 * Color item in the user's color collection
 */
export interface ColorItem {
  id: string;
  hex: string;
  imageUrl: string;
  mintedAt?: Date;
  tokenId?: string;
}

/**
 * Selected color information
 */
export interface SelectedColor {
  hex: string;
  rgb?: { r: number; g: number; b: number };
  imageUrl: string;
}

/**
 * Color Page Component Props
 */
export interface ColorPageProps {
  className?: string;
  selectedColor?: SelectedColor;
  userColors?: ColorItem[];
  walletAddress?: string;
  price?: {
    current: number;
    original?: number;
    currency: 'ETH' | 'MATIC' | string;
  };
  onMintColor?: (color: SelectedColor) => void;
  onColorSelect?: (color: SelectedColor) => void;
  onInvitationCodeSubmit?: (code: string) => void;
  onFreeReceive?: () => void;
}

/**
 * Navbar Props for Color Page
 */
export interface ColorNavbarProps {
  walletAddress?: string;
  onConnectWallet?: () => void;
  activeTab: 'paint' | 'color' | 'gallery' | 'collect';
}

/**
 * Color Wheel Props
 */
export interface ColorWheelProps {
  selectedColor?: string;
  onColorChange?: (color: SelectedColor) => void;
  disabled?: boolean;
}

/**
 * Invitation Code Input Props
 */
export interface InvitationCodeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (code: string) => void;
  disabled?: boolean;
}

/**
 * Your Colors List Props
 */
export interface YourColorsProps {
  colors: ColorItem[];
  onColorClick?: (color: ColorItem) => void;
}

/**
 * Mint transaction status
 */
export type MintStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * Mint transaction result
 */
export interface MintResult {
  status: MintStatus;
  transactionHash?: string;
  tokenId?: string;
  error?: string;
}
