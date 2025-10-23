import React from 'react';
import { cn } from '@/lib/utils';

export interface FempunkLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FempunkLogo component extracted from Figma
 * Figma ID: 33:2524
 * Description: Main logo component with primary brand colors
 */
const FempunkLogo = React.forwardRef<HTMLDivElement, FempunkLogoProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          // Variant styles
          {
            'text-primary-500': variant === 'default',
            'border border-primary-500 text-primary-500': variant === 'outlined',
            'bg-primary-500 text-white': variant === 'filled',
          },
          // Size styles
          {
            'h-8 w-16': size === 'sm',
            'h-12 w-24': size === 'md', 
            'h-16 w-32': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {/* SVG logo content would go here */}
        <svg 
          viewBox="0 0 200 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Simplified representation of the Figma logo */}
          <rect x="10" y="10" width="30" height="40" fill="currentColor" rx="4" />
          <rect x="50" y="15" width="25" height="30" fill="var(--color-accent-green)" rx="4" />
          <rect x="85" y="10" width="30" height="40" fill="currentColor" rx="4" />
          <text x="125" y="35" fontSize="16" fill="currentColor" fontFamily="Inter">
            FemPunk
          </text>
        </svg>
      </div>
    );
  }
);

FempunkLogo.displayName = 'FempunkLogo';

export { FempunkLogo };