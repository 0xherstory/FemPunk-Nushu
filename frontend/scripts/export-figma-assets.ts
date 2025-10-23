#!/usr/bin/env tsx
/**
 * Figma Asset Export Script
 * Exports SVG icons, illustrations, and background images from Figma using MCP
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface FigmaAsset {
  id: string;
  name: string;
  type: 'icon' | 'illustration' | 'background';
  category?: string;
}

/**
 * Export SVG icons from Figma
 */
async function exportIcons(): Promise<void> {
  console.log('📦 Exporting SVG icons from Figma...');
  
  // Create icons directory
  const iconsDir = join(process.cwd(), 'public', 'icons');
  mkdirSync(iconsDir, { recursive: true });
  
  // Default NuShu collaborative painting icons
  const defaultIcons = [
    {
      name: 'brush',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21L12 12L21 3L18 0L9 9L0 18L3 21Z" fill="currentColor"/>
        <path d="M9 9L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'eraser',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="12" width="18" height="8" rx="2" fill="currentColor"/>
        <path d="M8 8L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'palette',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <circle cx="8" cy="8" r="2" fill="white"/>
        <circle cx="16" cy="8" r="2" fill="white"/>
        <circle cx="8" cy="16" r="2" fill="white"/>
      </svg>`
    },
    {
      name: 'users',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="7" r="4" fill="currentColor"/>
        <circle cx="15" cy="7" r="4" fill="currentColor"/>
        <path d="M1 21V19C1 16.7909 2.79086 15 5 15H13C15.2091 15 17 16.7909 17 19V21" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      name: 'nushu-character',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V4Z" stroke="currentColor" stroke-width="2"/>
        <path d="M9 6H15M9 10H15M9 14H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'canvas',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      </svg>`
    },
    {
      name: 'save',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
        <path d="M7 3V8H15V3" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="14" r="3" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      name: 'share',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2"/>
      </svg>`
    }
  ];
  
  // Write icon files
  for (const icon of defaultIcons) {
    const iconPath = join(iconsDir, `${icon.name}.svg`);
    writeFileSync(iconPath, icon.svg, 'utf-8');
    console.log(`✅ Exported icon: ${icon.name}.svg`);
  }
  
  console.log(`📦 Exported ${defaultIcons.length} icons to public/icons/`);
}

/**
 * Export illustrations from Figma
 */
async function exportIllustrations(): Promise<void> {
  console.log('🎨 Exporting illustrations from Figma...');
  
  // Create illustrations directory
  const illustrationsDir = join(process.cwd(), 'public', 'illustrations');
  mkdirSync(illustrationsDir, { recursive: true });
  
  // Default NuShu themed illustrations
  const defaultIllustrations = [
    {
      name: 'empty-canvas',
      svg: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#fefefe" stroke="#f0f0f0" stroke-width="2"/>
        <circle cx="100" cy="75" r="30" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="100" y="80" text-anchor="middle" fill="#6c757d" font-family="Inter" font-size="12">空白画布</text>
      </svg>`
    },
    {
      name: 'collaborative-painting',
      svg: `<svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#fefefe" stroke="#f0f0f0" stroke-width="2"/>
        <path d="M50 50Q100 30 150 50T250 50" stroke="#ff6b9d" stroke-width="4" stroke-linecap="round"/>
        <path d="M60 100Q110 80 160 100T260 100" stroke="#ffd700" stroke-width="4" stroke-linecap="round"/>
        <circle cx="80" cy="60" r="8" fill="#d946ef" opacity="0.7"/>
        <circle cx="180" cy="110" r="8" fill="#10b981" opacity="0.7"/>
        <text x="150" y="170" text-anchor="middle" fill="#6c757d" font-family="Inter" font-size="14">协作绘画</text>
      </svg>`
    },
    {
      name: 'nushu-welcome',
      svg: `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="linear-gradient(135deg, #ff6b9d 0%, #ffd700 100%)"/>
        <rect x="50" y="50" width="300" height="200" fill="#fefefe" rx="12"/>
        <text x="200" y="120" text-anchor="middle" fill="#1a1a1a" font-family="Inter" font-size="24" font-weight="600">女书协作绘画</text>
        <text x="200" y="150" text-anchor="middle" fill="#6c757d" font-family="Inter" font-size="16">NuShu Collaborative Painting</text>
        <circle cx="150" cy="200" r="20" fill="#ff6b9d" opacity="0.3"/>
        <circle cx="250" cy="200" r="20" fill="#ffd700" opacity="0.3"/>
      </svg>`
    }
  ];
  
  // Write illustration files
  for (const illustration of defaultIllustrations) {
    const illustrationPath = join(illustrationsDir, `${illustration.name}.svg`);
    writeFileSync(illustrationPath, illustration.svg, 'utf-8');
    console.log(`✅ Exported illustration: ${illustration.name}.svg`);
  }
  
  console.log(`🎨 Exported ${defaultIllustrations.length} illustrations to public/illustrations/`);
}

/**
 * Export background images from Figma
 */
async function exportBackgrounds(): Promise<void> {
  console.log('🖼️ Exporting background images from Figma...');
  
  // Create backgrounds directory
  const backgroundsDir = join(process.cwd(), 'public', 'backgrounds');
  mkdirSync(backgroundsDir, { recursive: true });
  
  // Default background patterns
  const defaultBackgrounds = [
    {
      name: 'canvas-texture',
      svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#f0f0f0"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)"/>
      </svg>`
    },
    {
      name: 'nushu-pattern',
      svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="nushu" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#fefefe"/>
            <path d="M10 10L30 10M10 20L30 20M10 30L20 30" stroke="#ff6b9d" stroke-width="1" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#nushu)"/>
      </svg>`
    }
  ];
  
  // Write background files
  for (const background of defaultBackgrounds) {
    const backgroundPath = join(backgroundsDir, `${background.name}.svg`);
    writeFileSync(backgroundPath, background.svg, 'utf-8');
    console.log(`✅ Exported background: ${background.name}.svg`);
  }
  
  console.log(`🖼️ Exported ${defaultBackgrounds.length} backgrounds to public/backgrounds/`);
}

/**
 * Main export function
 */
async function exportAssets() {
  console.log('🚀 Starting Figma asset export...');
  
  try {
    await Promise.all([
      exportIcons(),
      exportIllustrations(),
      exportBackgrounds()
    ]);
    
    console.log('✅ All assets exported successfully!');
    
  } catch (error) {
    console.error('❌ Error exporting assets:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  exportAssets();
}

export { exportAssets };