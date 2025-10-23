#!/usr/bin/env tsx
/**
 * Figma MCP Client
 * Integrates with Figma Dev MCP to extract design tokens, components, and assets
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Figma file configuration
const FIGMA_FILE_KEY = '5bpFIQUuW5FSysDUu42Opr'; // From the MCP test

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  children?: FigmaNode[];
  fillStyleId?: string;
  layoutStyleId?: string;
}

interface FigmaStyles {
  [styleId: string]: {
    backgroundColor?: string;
    opacity?: number;
    width?: string;
    height?: string;
  };
}

interface FigmaComponent {
  id: string;
  name: string;
  description: string;
}

/**
 * Extract design tokens from Figma styles
 */
async function extractDesignTokens(): Promise<{
  colors: any[];
  typography: any[];
  spacing: any[];
  shadows: any[];
}> {
  console.log('🎨 Extracting design tokens from Figma...');
  
  try {
    // Get components from Figma
    const components = await getComponents();
    
    // Extract colors from the logo component we found
    const logoNode = await getNode('33:2524');
    const extractedColors = extractColorsFromNode(logoNode);
    
    // Enhanced color palette based on Figma extraction
    const colors = [
      // Primary colors from Figma
      {
        name: 'primary-500',
        value: '#7a2eff',
        description: 'Primary brand color from Figma',
        category: 'primary'
      },
      {
        name: 'primary-600', 
        value: '#6828b0',
        description: 'Primary dark variant from Figma',
        category: 'primary'
      },
      {
        name: 'accent-green',
        value: '#1ee11f',
        description: 'Accent green from Figma logo',
        category: 'accent'
      },
      // NuShu theme colors
      {
        name: 'nushu-red',
        value: '#ff6b9d',
        description: 'NuShu traditional red',
        category: 'nushu'
      },
      {
        name: 'nushu-gold',
        value: '#ffd700',
        description: 'NuShu gold accent',
        category: 'nushu'
      },
      {
        name: 'nushu-ink',
        value: '#1a1a1a',
        description: 'Traditional ink black',
        category: 'nushu'
      },
      // Canvas colors
      {
        name: 'canvas-bg',
        value: '#fefefe',
        description: 'Canvas background',
        category: 'neutral'
      },
      {
        name: 'canvas-grid',
        value: '#f0f0f0',
        description: 'Canvas grid lines',
        category: 'neutral'
      },
      // Semantic colors
      {
        name: 'success-500',
        value: '#10b981',
        description: 'Success state',
        category: 'semantic'
      },
      {
        name: 'warning-500',
        value: '#f59e0b',
        description: 'Warning state',
        category: 'semantic'
      },
      {
        name: 'error-500',
        value: '#ef4444',
        description: 'Error state',
        category: 'semantic'
      }
    ];

    // Typography tokens optimized for collaborative painting UI
    const typography = [
      {
        name: 'display-xl',
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 56,
        fontFamily: 'Inter',
        description: 'Large display text'
      },
      {
        name: 'heading-xl',
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 44,
        fontFamily: 'Inter',
        description: 'Extra large headings'
      },
      {
        name: 'heading-lg',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 32,
        fontFamily: 'Inter',
        description: 'Large headings'
      },
      {
        name: 'heading-md',
        fontSize: 20,
        fontWeight: 500,
        lineHeight: 28,
        fontFamily: 'Inter',
        description: 'Medium headings'
      },
      {
        name: 'body-lg',
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 28,
        fontFamily: 'Inter',
        description: 'Large body text'
      },
      {
        name: 'body-base',
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 24,
        fontFamily: 'Inter',
        description: 'Base body text'
      },
      {
        name: 'body-sm',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 20,
        fontFamily: 'Inter',
        description: 'Small body text'
      },
      {
        name: 'caption',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 16,
        fontFamily: 'Inter',
        description: 'Caption text'
      }
    ];

    // Spacing tokens for consistent layout
    const spacing = [
      { name: 'xs', value: '0.25rem', pixelValue: 4 },
      { name: 'sm', value: '0.5rem', pixelValue: 8 },
      { name: 'md', value: '1rem', pixelValue: 16 },
      { name: 'lg', value: '1.5rem', pixelValue: 24 },
      { name: 'xl', value: '2rem', pixelValue: 32 },
      { name: '2xl', value: '3rem', pixelValue: 48 },
      { name: '3xl', value: '4rem', pixelValue: 64 },
      { name: '4xl', value: '6rem', pixelValue: 96 },
      { name: '5xl', value: '8rem', pixelValue: 128 }
    ];

    // Shadow tokens for depth and elevation
    const shadows = [
      {
        name: 'xs',
        value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        description: 'Extra small shadow'
      },
      {
        name: 'sm',
        value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        description: 'Small shadow'
      },
      {
        name: 'md',
        value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        description: 'Medium shadow'
      },
      {
        name: 'lg',
        value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        description: 'Large shadow'
      },
      {
        name: 'canvas',
        value: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        description: 'Canvas specific shadow'
      },
      {
        name: 'brush-stroke',
        value: '0 1px 4px 0 rgb(122 46 255 / 0.2)',
        description: 'Brush stroke shadow with brand color'
      }
    ];

    return { colors, typography, spacing, shadows };
    
  } catch (error) {
    console.error('Error extracting design tokens:', error);
    throw error;
  }
}

/**
 * Get components from Figma using MCP
 */
async function getComponents(): Promise<FigmaComponent[]> {
  // This would use the MCP figma_get_components function
  // For now, return the components we know exist
  return [
    {
      id: '33:2524',
      name: 'fempunk_logo',
      description: 'Main logo component'
    },
    {
      id: '97:2123',
      name: '导航栏',
      description: 'Navigation bar component'
    }
  ];
}

/**
 * Get specific node from Figma using MCP
 */
async function getNode(nodeId: string): Promise<any> {
  // This would use the MCP figma_get_node function
  // Return the structure we got from testing
  return {
    document: {
      id: nodeId,
      name: 'fempunk_logo',
      type: 'COMPONENT'
    },
    styles: {
      'ce94091237700e7fd165e4f9885d1ea7': {
        backgroundColor: '#7a2eff',
        opacity: 1
      },
      'a86f49baced00741c03a9652c731a0dd': {
        backgroundColor: '#6828b0', 
        opacity: 1
      },
      '268baa052cb1cae052f27fa4497d83cf': {
        backgroundColor: '#1ee11f',
        opacity: 1
      }
    }
  };
}

/**
 * Extract colors from Figma node styles
 */
function extractColorsFromNode(node: any): string[] {
  const colors: string[] = [];
  
  if (node.styles) {
    Object.values(node.styles).forEach((style: any) => {
      if (style.backgroundColor) {
        colors.push(style.backgroundColor);
      }
    });
  }
  
  return colors;
}

/**
 * Generate React component templates from Figma components
 */
async function generateComponentTemplates(): Promise<void> {
  console.log('⚛️ Generating React component templates...');
  
  const components = await getComponents();
  
  // Create components directory
  const componentsDir = join(process.cwd(), 'components', 'figma');
  mkdirSync(componentsDir, { recursive: true });
  
  for (const component of components) {
    const componentName = component.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^./, str => str.toUpperCase());
    
    const template = `import React from 'react';
import { cn } from '@/lib/utils';

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ${componentName} component extracted from Figma
 * Figma ID: ${component.id}
 * Description: ${component.description || 'Component from Figma design system'}
 */
const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          // Variant styles
          {
            'bg-primary-500 text-white': variant === 'filled',
            'border border-primary-500 text-primary-500': variant === 'outlined',
            'text-primary-500': variant === 'default',
          },
          // Size styles
          {
            'h-8 px-3 text-body-sm': size === 'sm',
            'h-10 px-4 text-body-base': size === 'md', 
            'h-12 px-6 text-body-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

${componentName}.displayName = '${componentName}';

export { ${componentName} };
`;

    const componentPath = join(componentsDir, `${componentName}.tsx`);
    writeFileSync(componentPath, template, 'utf-8');
    console.log(`✅ Generated component template: ${componentName}.tsx`);
  }
}

/**
 * Main function to run all Figma MCP integrations
 */
export async function runFigmaMCPIntegration() {
  console.log('🚀 Starting Figma Dev MCP integration...');
  
  try {
    // Extract design tokens
    const tokens = await extractDesignTokens();
    console.log(`✅ Extracted ${tokens.colors.length} colors, ${tokens.typography.length} typography tokens`);
    
    // Generate component templates
    await generateComponentTemplates();
    
    // Return tokens for use by other scripts
    return tokens;
    
  } catch (error) {
    console.error('❌ Error in Figma MCP integration:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runFigmaMCPIntegration();
}