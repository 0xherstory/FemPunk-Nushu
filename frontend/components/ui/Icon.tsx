import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, ...props }, ref) => {
    // Load SVG content from exported Figma icons
    return (
      <svg
        ref={ref}
        className={cn(iconSizes[size], 'fill-current', className)}
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Load actual SVG content from Figma exports */}
        <use href={`/icons/${name}.svg#icon`} />
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

// Specific icon components for common use cases
export const BrushIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="brush" {...props} />
);

export const EraserIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="eraser" {...props} />
);

export const PaletteIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="palette" {...props} />
);

export const UsersIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="users" {...props} />
);

export const NushuCharacterIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="nushu-character" {...props} />
);

export const CanvasIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="canvas" {...props} />
);

export const SaveIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="save" {...props} />
);

export const ShareIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="share" {...props} />
);

export { Icon };