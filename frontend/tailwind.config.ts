import type { Config } from 'tailwindcss';
import { designTokens } from './tokens';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors from Figma design tokens via MCP
      colors: {
        primary: {
          500: designTokens.colors.find(c => c.name === 'primary-500')?.value || '#7a2eff',
          600: designTokens.colors.find(c => c.name === 'primary-600')?.value || '#6828b0',
        },
        accent: {
          green: designTokens.colors.find(c => c.name === 'accent-green')?.value || '#1ee11f',
        },
        nushu: {
          red: designTokens.colors.find(c => c.name === 'nushu-red')?.value || '#ff6b9d',
          gold: designTokens.colors.find(c => c.name === 'nushu-gold')?.value || '#ffd700',
          ink: designTokens.colors.find(c => c.name === 'nushu-ink')?.value || '#1a1a1a',
        },
        canvas: {
          bg: designTokens.colors.find(c => c.name === 'canvas-bg')?.value || '#fefefe',
          grid: designTokens.colors.find(c => c.name === 'canvas-grid')?.value || '#f0f0f0',
        },
        success: {
          500: designTokens.colors.find(c => c.name === 'success-500')?.value || '#10b981',
        },
        warning: {
          500: designTokens.colors.find(c => c.name === 'warning-500')?.value || '#f59e0b',
        },
        error: {
          500: designTokens.colors.find(c => c.name === 'error-500')?.value || '#ef4444',
        },
      },
      
      // Typography from Figma design tokens
      fontSize: Object.fromEntries(
        designTokens.typography.map(token => [
          token.name,
          [token.fontSize, { lineHeight: token.lineHeight, fontWeight: token.fontWeight }]
        ])
      ),
      
      // Spacing from design tokens
      spacing: Object.fromEntries(
        designTokens.spacing.map(token => [token.name, token.value])
      ),
      
      // Border radius from design tokens
      borderRadius: Object.fromEntries(
        designTokens.borderRadius.map(token => [token.name, token.value])
      ),
      
      // Box shadows from design tokens
      boxShadow: Object.fromEntries(
        designTokens.shadows.map(token => [token.name, token.value])
      ),
      
      // Custom animations for collaborative painting
      animation: {
        'brush-stroke': 'brush-stroke 0.3s ease-out',
        'canvas-zoom': 'canvas-zoom 0.2s ease-in-out',
        'user-cursor': 'user-cursor 2s ease-in-out infinite',
      },
      
      keyframes: {
        'brush-stroke': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'canvas-zoom': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'user-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      
      // Custom gradients for NuShu theme
      backgroundImage: {
        'nushu-gradient': 'linear-gradient(135deg, var(--color-nushu-red) 0%, var(--color-nushu-gold) 100%)',
        'canvas-texture': 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
      },
    },
  },
  plugins: [
    // Custom plugin for design token CSS variables
    function({ addBase }: { addBase: any }) {
      addBase({
        ':root': {
          // Color variables
          ...Object.fromEntries(
            designTokens.colors.map(token => [`--color-${token.name}`, token.value])
          ),
          // Typography variables
          ...Object.fromEntries(
            designTokens.typography.flatMap(token => [
              [`--font-size-${token.name}`, token.fontSize],
              [`--font-weight-${token.name}`, token.fontWeight],
              [`--line-height-${token.name}`, token.lineHeight],
            ])
          ),
          // Spacing variables
          ...Object.fromEntries(
            designTokens.spacing.map(token => [`--spacing-${token.name}`, token.value])
          ),
          // Border radius variables
          ...Object.fromEntries(
            designTokens.borderRadius.map(token => [`--radius-${token.name}`, token.value])
          ),
          // Shadow variables
          ...Object.fromEntries(
            designTokens.shadows.map(token => [`--shadow-${token.name}`, token.value])
          ),
        },
      });
    },
  ],
};

export default config;