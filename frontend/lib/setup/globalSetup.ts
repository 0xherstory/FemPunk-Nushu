'use client';

import { setupGlobalErrorHandlers } from '../services/errorHandler';

// Global setup function to be called on app initialization
export function setupGlobalHandlers() {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Setup global error handlers
  setupGlobalErrorHandlers();
  
  // Setup performance monitoring
  if (process.env.NODE_ENV === 'production') {
    // Monitor performance metrics
    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as any;
            if (fidEntry.processingStart) {
              console.log('FID:', fidEntry.processingStart - entry.startTime);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              console.log('CLS:', (entry as any).value);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }
  
  // Setup console warnings for development
  if (process.env.NODE_ENV === 'development') {
    // Warn about missing alt attributes
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement.call(this, tagName, options);
      
      if (tagName.toLowerCase() === 'img') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name: string, value: string) {
          originalSetAttribute.call(this, name, value);
          
          // Check for missing alt attribute after src is set
          if (name === 'src' && !this.hasAttribute('alt')) {
            console.warn('Image missing alt attribute:', value);
          }
        };
      }
      
      return element;
    };
  }
  
  // Setup accessibility warnings
  if (process.env.NODE_ENV === 'development') {
    // Check for missing ARIA labels on interactive elements
    const checkAccessibility = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach((element) => {
        const hasLabel = 
          element.hasAttribute('aria-label') ||
          element.hasAttribute('aria-labelledby') ||
          element.textContent?.trim() ||
          element.querySelector('img[alt]');
        
        if (!hasLabel) {
          console.warn('Interactive element missing accessible label:', element);
        }
      });
    };
    
    // Run accessibility check after DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(checkAccessibility, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Hook to run global setup
export function useGlobalSetup() {
  if (typeof window !== 'undefined') {
    setupGlobalHandlers();
  }
}