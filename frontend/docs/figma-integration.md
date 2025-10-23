# Figma Dev MCP Integration

This document describes the Figma Dev MCP integration for the NuShu Collaborative Painting project.

## Overview

The Figma Dev MCP (Model Context Protocol) integration automatically extracts design tokens, components, and assets from Figma and integrates them into the React/Next.js application.

## Configuration

### MCP Server Setup

The Figma MCP server is configured in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "uvx",
      "args": ["figma-mcp", "--figma-api-key", "figd_MN9pf_I0igi6YpyK4AAXi-jVdreQcbnC85IYe748"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Figma File

- **File Key**: `5bpFIQUuW5FSysDUu42Opr`
- **Components**: Logo, Navigation, UI elements
- **Design System**: Colors, Typography, Spacing, Shadows

## Design Tokens

### Colors

Extracted from Figma and available in the design system:

- **Primary Colors**: `#7a2eff` (primary-500), `#6828b0` (primary-600)
- **Accent Colors**: `#1ee11f` (accent-green)
- **NuShu Theme**: `#ff6b9d` (nushu-red), `#ffd700` (nushu-gold), `#1a1a1a` (nushu-ink)
- **Canvas Colors**: `#fefefe` (canvas-bg), `#f0f0f0` (canvas-grid)
- **Semantic Colors**: Success, Warning, Error states

### Typography

- **Display**: 48px/700 for large headings
- **Headings**: 36px, 24px, 20px with appropriate weights
- **Body**: 18px, 16px, 14px for content
- **Caption**: 12px for small text
- **Font Family**: Inter

### Spacing

Consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

### Shadows

- **xs, sm, md, lg**: Standard elevation shadows
- **canvas**: Specific shadow for canvas elements
- **brush-stroke**: Special shadow with brand color for painting elements

## File Structure

```
├── scripts/
│   ├── figma-mcp-client.ts      # MCP client for Figma integration
│   ├── sync-figma-tokens.ts     # Token extraction and sync
│   ├── export-figma-assets.ts   # Asset export (SVGs, images)
│   └── setup-figma-integration.ts # Complete setup script
├── tokens/
│   └── index.ts                 # Design token definitions
├── styles/
│   └── figma-tokens.css         # CSS variables and utilities
├── components/
│   ├── ui/                      # Base UI components using tokens
│   └── figma/                   # Components extracted from Figma
├── public/
│   ├── icons/                   # Exported SVG icons
│   ├── illustrations/           # Exported illustrations
│   └── backgrounds/             # Exported background patterns
└── tailwind.config.ts           # Tailwind configured with tokens
```

## Usage

### Running Scripts

```bash
# Complete setup (run once)
tsx scripts/setup-figma-integration.ts

# Sync design tokens only
tsx scripts/sync-figma-tokens.ts

# Export assets only  
tsx scripts/export-figma-assets.ts
```

### Using Design Tokens in Components

```tsx
import { designTokens } from '@/tokens';

// In Tailwind classes
<div className="bg-primary-500 text-white shadow-md" />

// In CSS variables
<div style={{ color: 'var(--color-primary-500)' }} />

// In JavaScript
const primaryColor = designTokens.colors.find(c => c.name === 'primary-500')?.value;
```

### Using Exported Icons

```tsx
import { BrushIcon, PaletteIcon } from '@/components/ui/Icon';

<BrushIcon size="lg" className="text-primary-500" />
<PaletteIcon size="md" />
```

### Using Figma Components

```tsx
import { FempunkLogo } from '@/components/figma/FempunkLogo';

<FempunkLogo variant="filled" size="lg" />
```

## CSS Utilities

The integration provides several utility classes:

```css
/* Gradient text with NuShu colors */
.text-nushu-gradient

/* Gradient background */
.bg-nushu-gradient

/* Canvas texture pattern */
.canvas-texture

/* Brush stroke shadow */
.brush-stroke-shadow

/* Grid pattern for canvas */
.canvas-grid
```

## Tailwind Integration

The design tokens are automatically integrated into Tailwind CSS:

```tsx
// Colors
<div className="bg-primary-500 text-nushu-red" />

// Typography
<h1 className="text-heading-xl font-bold" />

// Spacing
<div className="p-lg m-xl" />

// Shadows
<div className="shadow-canvas" />
```

## MCP Functions Used

- `mcp_figma_get_components`: Get all components from Figma file
- `mcp_figma_get_node`: Get specific node details and styles
- `mcp_figma_get_workflow`: Get workflow connections (if available)

## Troubleshooting

### MCP Connection Issues

1. Verify MCP configuration in `.kiro/settings/mcp.json`
2. Check Figma API key is valid
3. Ensure `uvx` and `uv` are installed
4. Test connection with: `uvx figma-mcp --figma-api-key YOUR_KEY`

### Token Sync Issues

1. Check Figma file permissions
2. Verify file key is correct
3. Run with fallback tokens if MCP fails
4. Check console output for specific errors

### Asset Export Issues

1. Ensure directories exist: `public/icons`, `public/illustrations`, `public/backgrounds`
2. Check file permissions
3. Verify SVG content is valid

## Future Enhancements

- [ ] Automatic token sync on Figma file changes
- [ ] Component code generation from Figma components
- [ ] Asset optimization and compression
- [ ] Design token validation and linting
- [ ] Integration with design system documentation
- [ ] Support for Figma variables and modes
- [ ] Automated testing of design token usage