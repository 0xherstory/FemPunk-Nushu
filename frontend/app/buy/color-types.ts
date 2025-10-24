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