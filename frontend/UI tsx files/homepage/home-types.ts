/**
 * TypeScript Type Definitions for Home Page
 * FemPunk Nvshu - Homepage Component
 */

/**
 * Artwork item in the community gallery
 */
export interface Artwork {
  id: string;
  imageUrl: string;
  title?: string;
  artist?: string;
  minted: boolean;
  price?: number;
  tokenId?: number;
}

/**
 * Nvshu character of the day
 */
export interface NvshuCharacterOfDay {
  id: string;
  characterImageUrl: string;
  translation: string;
  meaning?: string;
  theme?: string;
  date: Date;
}

/**
 * Home page component props
 */
export interface HomePageProps {
  className?: string;
  onStartPainting?: () => void;
  onViewAllArtworks?: () => void;
  onBuyArtwork?: (artworkId: string) => void;
  onMintArtwork?: (artworkId: string) => void;
  onNavigate?: (path: string) => void;
  featuredArtworks?: Artwork[];
  characterOfDay?: NvshuCharacterOfDay;
}

/**
 * Navigation menu item
 */
export interface NavMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

/**
 * Hero section props
 */
export interface HeroSectionProps {
  title: string;
  subtitle1: string;
  subtitle2: string;
}

/**
 * Nvshu Today section props
 */
export interface NvshuTodaySectionProps {
  character: NvshuCharacterOfDay;
  onStartPainting: () => void;
}

/**
 * Community artworks section props
 */
export interface CommunityArtworksSectionProps {
  artworks: Artwork[];
  onViewAll: () => void;
  onBuy: (artworkId: string) => void;
  onMint: (artworkId: string) => void;
}

/**
 * Artwork card props
 */
export interface ArtworkCardProps {
  artwork: Artwork;
  onBuy?: (artworkId: string) => void;
  onMint?: (artworkId: string) => void;
}

/**
 * Background decoration layer type
 */
export type DecorationLayerType =
  | 'gradient'
  | 'image'
  | 'pattern'
  | 'splash'
  | 'thorn'
  | 'polygon';

/**
 * Background decoration layer
 */
export interface DecorationLayer {
  id: string;
  type: DecorationLayerType;
  imageUrl?: string;
  position: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
  transform?: string;
  blendMode?: string;
  opacity?: number;
  zIndex?: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  enabled: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
}

/**
 * Section visibility state
 */
export interface SectionVisibility {
  hero: boolean;
  nvshuToday: boolean;
  community: boolean;
}

/**
 * Page metadata
 */
export interface HomePageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * CTA button configuration
 */
export interface CTAButtonConfig {
  text: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}
