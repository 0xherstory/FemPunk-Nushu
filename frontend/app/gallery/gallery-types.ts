/**
 * FemPunk Nvshu - Gallery Page TypeScript Types
 * Design: 展览页 (Gallery Page)
 * Node ID: 101:2395
 */

/**
 * Artwork status types
 */
export type ArtworkStatus = 'painting' | 'mint' | 'buy';

/**
 * Button variant types
 */
export type ButtonVariant = 'paint' | 'mint' | 'buy';

/**
 * Color item in the palette
 */
export interface ColorItem {
  id: string;
  hex: string;
  imageUrl?: string;
}

/**
 * Artwork item in the gallery
 */
export interface ArtworkItem {
  id: string;
  title: string;
  day: number;
  theme: string;
  imageUrl: string;
  status: ArtworkStatus;
  participants: number;
  price?: number;
  currency?: 'ETH' | 'MATIC' | string;
  colors: ColorItem[];
  colorPaletteImageUrl?: string;
  createdAt?: Date;
  mintedAt?: Date;
  tokenId?: string;
}