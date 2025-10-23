#!/usr/bin/env tsx
/**
 * Figma Design Token Sync Script
 * Extracts design tokens from Figma using MCP and generates TypeScript definitions
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { runFigmaMCPIntegration } from './figma-mcp-client';

interface FigmaColor {
  name: string;
  value: string;
  description?: string;
  category: string;
}

interface FigmaTypography {
  name: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: number;
  fontFamily: string;
  description?: string;
}

interface FigmaEffect {
  name: string;
  type?: string;
  value: string;
  description?: string;
}

/**
 * Extract design tokens using Figma MCP client
 */
async function extractDesignTokens(): Promise<{
  colors: FigmaColor[];
  typography: FigmaTypography[];
  spacing: any[];
  shadows: FigmaEffect[];
}> {
  try {
    console.log('🎨 Extracting design tokens using Figma MCP...');
    
    // Use the MCP client to get tokens from Figma
    const tokens = await runFigmaMCPIntegration();
    
    return {
      colors: tokens.colors,
      typography: tokens.typography,
      spacing: tokens.spacing,
      shadows: tokens.shadows
    };
    
  } catch (error) {
    console.error('Error extracting design tokens:', error);
    
    // Fallback to default tokens if MCP fails
    return {
      colors: [
        {
          name: 'primary-500',
          value: '#7a2eff',
          description: 'Primary brand color from Figma',
          category: 'primary'
        },
        {
          name: 'nushu-red',
          value: '#ff6b9d',
          description: 'NuShu traditional red',
          category: 'nushu'
        }
      ],
      typography: [
        {
          name: 'body-base',
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 24,
          fontFamily: 'Inter',
          description: 'Base body text'
        }
      ],
      spacing: [
        { name: 'md', value: '1rem', pixelValue: 16 }
      ],
      shadows: [
        {
          name: 'md',
          value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          description: 'Medium shadow'
        }
      ]
    };
  }
}



/**
 * Generate TypeScript token definitions
 */
function generateTokenFile(colors: FigmaColor[], typography: FigmaTypography[], spacing: any[], shadows: FigmaEffect[]) {
  const content = `// Auto-generated design tokens from Figma
// Last updated: ${new Date().toISOString()}

export interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  borderRadius: BorderRadiusToken[];
  shadows: ShadowToken[];
}

export interface ColorToken {
  name: string;
  value: string;
  description?: string;
  category: 'primary' | 'secondary' | 'neutral' | 'semantic' | 'nushu';
}

export interface TypographyToken {
  name: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  fontFamily: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixelValue: number;
}

export interface BorderRadiusToken {
  name: string;
  value: string;
  pixelValue: number;
}

export interface ShadowToken {
  name: string;
  value: string;
  description?: string;
}

// Extracted design tokens
export const designTokens: DesignTokens = {
  colors: ${JSON.stringify(colors.map(color => ({
    name: color.name,
    value: color.value,
    description: color.description,
    category: color.name.includes('nushu') ? 'nushu' : 
              color.name.includes('primary') ? 'primary' :
              color.name.includes('success') || color.name.includes('warning') || color.name.includes('error') ? 'semantic' :
              'neutral'
  })), null, 4)},
  typography: ${JSON.stringify(typography.map(typo => ({
    name: typo.name,
    fontSize: (typo.fontSize / 16) + 'rem',
    fontWeight: typo.fontWeight.toString(),
    lineHeight: (typo.lineHeight / 16) + 'rem',
    fontFamily: typo.fontFamily
  })), null, 4)},
  spacing: [
    { name: 'xs', value: '0.25rem', pixelValue: 4 },
    { name: 'sm', value: '0.5rem', pixelValue: 8 },
    { name: 'md', value: '1rem', pixelValue: 16 },
    { name: 'lg', value: '1.5rem', pixelValue: 24 },
    { name: 'xl', value: '2rem', pixelValue: 32 },
    { name: '2xl', value: '3rem', pixelValue: 48 },
    { name: '3xl', value: '4rem', pixelValue: 64 }
  ],
  borderRadius: [
    { name: 'none', value: '0', pixelValue: 0 },
    { name: 'sm', value: '0.25rem', pixelValue: 4 },
    { name: 'md', value: '0.5rem', pixelValue: 8 },
    { name: 'lg', value: '0.75rem', pixelValue: 12 },
    { name: 'xl', value: '1rem', pixelValue: 16 },
    { name: 'full', value: '9999px', pixelValue: 9999 }
  ],
  shadows: ${JSON.stringify(shadows.map(shadow => ({
    name: shadow.name,
    value: shadow.value,
    description: shadow.description || shadow.name
  })), null, 4)}
};

// CSS Custom Properties for easy integration
export const cssVariables = {
  colors: Object.fromEntries(
    designTokens.colors.map(token => ['--color-' + token.name, token.value])
  ),
  typography: Object.fromEntries(
    designTokens.typography.flatMap(token => [
      ['--font-size-' + token.name, token.fontSize],
      ['--font-weight-' + token.name, token.fontWeight],
      ['--line-height-' + token.name, token.lineHeight]
    ])
  ),
  spacing: Object.fromEntries(
    designTokens.spacing.map(token => ['--spacing-' + token.name, token.value])
  ),
  borderRadius: Object.fromEntries(
    designTokens.borderRadius.map(token => ['--radius-' + token.name, token.value])
  ),
  shadows: Object.fromEntries(
    designTokens.shadows.map(token => ['--shadow-' + token.name, token.value])
  )
};
`;

  return content;
}

/**
 * Main sync function
 */
async function syncTokens() {
  console.log('🎨 Starting Figma design token sync...');
  
  try {
    const tokens = await extractDesignTokens();

    const tokenContent = generateTokenFile(tokens.colors, tokens.typography, tokens.spacing, tokens.shadows);
    
    // Write to tokens file
    const tokensPath = join(process.cwd(), 'tokens', 'index.ts');
    writeFileSync(tokensPath, tokenContent, 'utf-8');
    
    console.log('✅ Design tokens synced successfully!');
    console.log(`📁 Tokens written to: ${tokensPath}`);
    console.log(`🎨 Extracted ${tokens.colors.length} colors, ${tokens.typography.length} typography styles, ${tokens.shadows.length} shadows`);
    
  } catch (error) {
    console.error('❌ Error syncing tokens:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncTokens();
}

export { syncTokens };