/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Module declarations for missing modules
declare module 'react' {
  export * from '@types/react';
}

declare module 'react-dom' {
  export * from '@types/react-dom';
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (path: string) => void;
    replace: (path: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (path: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/image' {
  import { ComponentProps } from 'react';
  interface ImageProps extends ComponentProps<'img'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    style?: React.CSSProperties;
  }
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'wagmi' {
  export function useAccount(): {
    address?: string;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
  };
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

export {};