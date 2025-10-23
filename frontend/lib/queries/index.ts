// Query client and utilities
export * from './queryClient';

// Query hooks
export * from './colorQueries';
export * from './artworkQueries';
export * from './themeQueries';

// Re-export commonly used hooks
export {
  useUserColors,
  useAvailableColors,
  useColorPrice,
  usePurchaseColor,
  useRedeemColor,
} from './colorQueries';

export {
  useFeaturedArtworks,
  useArtworks,
  useInfiniteArtworks,
  useArtworkDetails,
  useUserArtworks,
  useInfiniteUserArtworks,
  useMintArtwork,
} from './artworkQueries';

export {
  useCurrentTheme,
  useThemeByDate,
  useThemeHistory,
  useTodayTheme,
  useYesterdayTheme,
} from './themeQueries';