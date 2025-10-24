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

/**
 * Gallery Page Component Props
 */
export interface GalleryPageProps {
  className?: string;
  artworks?: ArtworkItem[];
  walletAddress?: string;
  onArtworkClick?: (artwork: ArtworkItem) => void;
  onPaint?: (artwork: ArtworkItem) => void;
  onMint?: (artwork: ArtworkItem) => void;
  onBuy?: (artwork: ArtworkItem) => void;
  onConnectWallet?: () => void;
}

/**
 * Gallery Card Component Props
 */
export interface GalleryCardProps {
  artwork: ArtworkItem;
  onCardClick?: (artwork: ArtworkItem) => void;
  onActionClick?: (artwork: ArtworkItem) => void;
}

/**
 * Gallery Grid Props
 */
export interface GalleryGridProps {
  artworks: ArtworkItem[];
  onArtworkClick?: (artwork: ArtworkItem) => void;
  onPaint?: (artwork: ArtworkItem) => void;
  onMint?: (artwork: ArtworkItem) => void;
  onBuy?: (artwork: ArtworkItem) => void;
}

/**
 * Navbar Props for Gallery Page
 */
export interface GalleryNavbarProps {
  walletAddress?: string;
  onConnectWallet?: () => void;
  activeTab: 'paint' | 'color' | 'gallery' | 'collect';
}

/**
 * Artwork action result
 */
export interface ArtworkActionResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  error?: string;
}

/**
 * Gallery filter options
 */
export interface GalleryFilter {
  status?: ArtworkStatus[];
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'date' | 'price' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
