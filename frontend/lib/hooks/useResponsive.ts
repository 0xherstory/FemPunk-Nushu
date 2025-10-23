'use client';

import { useState, useEffect } from 'react';

// Tailwind CSS breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');
  
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Determine current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    }
    
    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = currentBreakpoint === 'sm';
  const isTablet = currentBreakpoint === 'md';
  const isDesktop = ['lg', 'xl', '2xl'].includes(currentBreakpoint);
  const isLargeScreen = ['xl', '2xl'].includes(currentBreakpoint);
  
  const isBreakpoint = (bp: Breakpoint) => {
    return windowSize.width >= breakpoints[bp];
  };
  
  const isBreakpointDown = (bp: Breakpoint) => {
    return windowSize.width < breakpoints[bp];
  };
  
  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isBreakpoint,
    isBreakpointDown,
    breakpoints,
  };
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) {
  const { currentBreakpoint } = useResponsive();
  
  // Find the appropriate value for current breakpoint
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  // Fallback to the smallest defined value
  for (const bp of breakpointOrder.reverse()) {
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

// Hook for touch device detection
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };
    
    setIsTouchDevice(checkTouchDevice());
  }, []);
  
  return isTouchDevice;
}

// Hook for device orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    handleOrientationChange();
    
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  return orientation;
}

// Hook for safe area insets (for mobile devices with notches)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  
  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };
    
    updateSafeArea();
    
    // Update on resize and orientation change
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);
  
  return safeArea;
}

// Hook for viewport height (handles mobile browser address bar)
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(0);
  
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport if available (better for mobile)
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };
    
    updateViewportHeight();
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      return () => {
        window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      };
    } else {
      window.addEventListener('resize', updateViewportHeight);
      return () => {
        window.removeEventListener('resize', updateViewportHeight);
      };
    }
  }, []);
  
  return viewportHeight;
}

// Hook for responsive canvas sizing
export function useCanvasSize() {
  const { windowSize, isMobile, isTablet } = useResponsive();
  const viewportHeight = useViewportHeight();
  
  const getCanvasSize = () => {
    const padding = isMobile ? 16 : 32;
    const headerHeight = 64; // Navigation bar height
    const sidebarWidth = isMobile ? 0 : 320; // Sidebar width on desktop
    
    const availableWidth = windowSize.width - (isMobile ? 0 : sidebarWidth) - padding * 2;
    const availableHeight = viewportHeight - headerHeight - padding * 2;
    
    // Maintain aspect ratio (4:3 for canvas)
    const aspectRatio = 4 / 3;
    
    let canvasWidth = Math.min(availableWidth, 800); // Max canvas width
    let canvasHeight = canvasWidth / aspectRatio;
    
    // If height exceeds available space, constrain by height
    if (canvasHeight > availableHeight) {
      canvasHeight = availableHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    return {
      width: Math.floor(canvasWidth),
      height: Math.floor(canvasHeight),
      aspectRatio,
    };
  };
  
  return getCanvasSize();
}

// Responsive grid columns hook
export function useResponsiveGrid(options: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}) {
  const columns = useResponsiveValue(options);
  return columns || 1;
}