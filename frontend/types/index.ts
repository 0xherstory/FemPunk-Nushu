// Core Web3 Types
export interface ColorNFT {
  id: string;
  colorHex: string;
  tokenId: number;
  owner: string;
  mintedAt: Date;
  price: bigint;
}

export interface DailyTheme {
  id: string;
  date: string;
  title: string;
  titleEn: string;
  description: string;
  nushuCharacter: {
    character: string;
    meaning: string;
    pronunciation: string;
  };
}

export interface Artwork {
  id: string;
  title: string;
  canvasData: string; // Base64 encoded canvas
  contributors: Contributor[];
  createdAt: Date;
  mintedAt?: Date;
  nftTokenId?: number;
  price?: bigint;
  dailyTheme: DailyTheme;
}

export interface Contributor {
  address: string;
  contribution: number; // 0-100 percentage
  strokeCount: number;
  timeSpent: number; // seconds
}

// Canvas and Collaboration Types
export interface CanvasState {
  objects: any[]; // fabric.Object[] - will be properly typed when fabric.js is imported
  version: number;
  lastModified: Date;
  activeUsers: ActiveUser[];
}

export interface ActiveUser {
  address: string;
  cursor: { x: number; y: number } | null;
  selectedColor: string | null;
  isDrawing: boolean;
  userName?: string;
  avatar?: string;
}

// Liveblocks specific types
export interface LiveblocksPresence {
  cursor: { x: number; y: number } | null;
  selectedColor: string | null;
  isDrawing: boolean;
  userAddress: string | null;
  userName: string | null;
}

export interface LiveblocksStorage {
  canvasObjects: any[];
  canvasVersion: number;
  lastModified: string;
  contributors: Record<string, ContributorData>;
}

export interface ContributorData {
  address: string;
  strokeCount: number;
  timeSpent: number;
  lastActive: string;
}

export interface ParticipatedArtwork {
  tokenId: number;
  title: string;
  contribution: number; // User's contribution percentage
  totalValue: bigint; // Total artwork value
  userEarnings: bigint; // User's share of earnings
  mintedAt: Date;
  canvasPreview: string; // Base64 image data
  isSettled: boolean; // Whether earnings have been distributed
  settlementDeadline?: Date;
}

export interface CanvasOperation {
  id: string;
  type: 'draw' | 'erase' | 'clear';
  userId: string;
  timestamp: Date;
  data: {
    path?: { x: number; y: number }[];
    color?: string;
    brushSize?: number;
    objectId?: string;
  };
}

export interface DrawingTool {
  type: 'brush' | 'eraser';
  size: number;
  color?: string;
  opacity?: number;
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  variant?: 'default' | 'artwork' | 'nft';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Store Types
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  error: string | null;
}

export interface ColorState {
  userColors: ColorNFT[];
  availableColors: ColorNFT[];
  selectedColor: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface CanvasStore {
  canvasState: CanvasState | null;
  isLoading: boolean;
  error: string | null;
  selectedTool: 'brush' | 'eraser';
  brushSize: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Environment Types
export interface EnvironmentConfig {
  walletConnectProjectId: string;
  alchemyApiKey: string;
  liveblocksPublicKey: string;
  colorNftContractAddress: string;
  artworkNftContractAddress: string;
  ipfsGateway: string;
  appEnv: 'development' | 'staging' | 'production';
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type ErrorCode = 
  | 'WALLET_NOT_CONNECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'TRANSACTION_FAILED'
  | 'NETWORK_ERROR'
  | 'CANVAS_SYNC_ERROR'
  | 'COLOR_NOT_OWNED'
  | 'INVALID_INPUT'
  | 'SERVER_ERROR';

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types for Analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

export type EventName = 
  | 'wallet_connected'
  | 'color_purchased'
  | 'canvas_stroke_drawn'
  | 'artwork_minted'
  | 'page_viewed'
  | 'error_occurred';

// Form Types
export interface PurchaseFormData {
  selectedColors: string[];
  paymentMethod: 'eth' | 'redemption_code';
  redemptionCode?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  type: 'general' | 'business' | 'support';
}