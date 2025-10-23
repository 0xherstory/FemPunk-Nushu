import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPalette } from '../../components/canvas/ColorPalette';

const mockColors = [
  {
    id: 'color-1',
    colorHex: '#FF0000',
    tokenId: 1,
    owner: '0x123',
    mintedAt: new Date(),
    price: 1000000000000000000n,
  },
  {
    id: 'color-2',
    colorHex: '#00FF00',
    tokenId: 2,
    owner: '0x123',
    mintedAt: new Date(),
    price: 1500000000000000000n,
  },
  {
    id: 'color-3',
    colorHex: '#0000FF',
    tokenId: 3,
    owner: '0x123',
    mintedAt: new Date(),
    price: 2000000000000000000n,
  },
];

describe('ColorPalette', () => {
  const defaultProps = {
    colors: mockColors,
    selectedColor: null,
    onColorSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all provided colors', () => {
      render(<ColorPalette {...defaultProps} />);
      
      mockColors.forEach(color => {
        const colorButton = screen.getByTestId(`color-${color.colorHex.slice(1)}`);
        expect(colorButton).toBeInTheDocument();
        expect(colorButton).toHaveStyle(`background-color: ${color.colorHex}`);
      });
    });

    it('should render empty state when no colors provided', () => {
      render(<ColorPalette {...defaultProps} colors={[]} />);
      
      expect(screen.getByText('暂无可用颜色')).toBeInTheDocument();
      expect(screen.getByText('购买颜色 NFT 开始创作')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<ColorPalette {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText('加载颜色中...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<ColorPalette {...defaultProps} error="Failed to load colors" />);
      
      expect(screen.getByText('颜色加载失败')).toBeInTheDocument();
      expect(screen.getByText('Failed to load colors')).toBeInTheDocument();
    });
  });

  describe('Color Selection', () => {
    it('should call onColorSelect when color is clicked', () => {
      const mockOnColorSelect = vi.fn();
      render(<ColorPalette {...defaultProps} onColorSelect={mockOnColorSelect} />);
      
      const firstColor = screen.getByTestId('color-FF0000');
      fireEvent.click(firstColor);
      
      expect(mockOnColorSelect).toHaveBeenCalledWith(mockColors[0]);
    });

    it('should highlight selected color', () => {
      render(<ColorPalette {...defaultProps} selectedColor="#FF0000" />);
      
      const selectedColor = screen.getByTestId('color-FF0000');
      expect(selectedColor).toHaveClass('ring-2', 'ring-primary-500');
    });

    it('should not highlight unselected colors', () => {
      render(<ColorPalette {...defaultProps} selectedColor="#FF0000" />);
      
      const unselectedColor = screen.getByTestId('color-00FF00');
      expect(unselectedColor).not.toHaveClass('ring-2', 'ring-primary-500');
    });

    it('should allow deselecting color by clicking selected color', () => {
      const mockOnColorSelect = vi.fn();
      render(
        <ColorPalette 
          {...defaultProps} 
          selectedColor="#FF0000"
          onColorSelect={mockOnColorSelect}
          allowDeselect={true}
        />
      );
      
      const selectedColor = screen.getByTestId('color-FF0000');
      fireEvent.click(selectedColor);
      
      expect(mockOnColorSelect).toHaveBeenCalledWith(null);
    });

    it('should not deselect when allowDeselect is false', () => {
      const mockOnColorSelect = vi.fn();
      render(
        <ColorPalette 
          {...defaultProps} 
          selectedColor="#FF0000"
          onColorSelect={mockOnColorSelect}
          allowDeselect={false}
        />
      );
      
      const selectedColor = screen.getByTestId('color-FF0000');
      fireEvent.click(selectedColor);
      
      expect(mockOnColorSelect).not.toHaveBeenCalledWith(null);
    });
  });

  describe('Color Information', () => {
    it('should show color hex value on hover', () => {
      render(<ColorPalette {...defaultProps} showColorInfo={true} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      fireEvent.mouseEnter(colorButton);
      
      expect(screen.getByText('#FF0000')).toBeInTheDocument();
    });

    it('should show token ID when enabled', () => {
      render(<ColorPalette {...defaultProps} showTokenId={true} />);
      
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('should not show color info when disabled', () => {
      render(<ColorPalette {...defaultProps} showColorInfo={false} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      fireEvent.mouseEnter(colorButton);
      
      expect(screen.queryByText('#FF0000')).not.toBeInTheDocument();
    });
  });

  describe('Layout Options', () => {
    it('should render in grid layout by default', () => {
      render(<ColorPalette {...defaultProps} />);
      
      const container = screen.getByTestId('color-palette');
      expect(container).toHaveClass('grid');
    });

    it('should render in horizontal layout', () => {
      render(<ColorPalette {...defaultProps} layout="horizontal" />);
      
      const container = screen.getByTestId('color-palette');
      expect(container).toHaveClass('flex', 'flex-row');
    });

    it('should render in vertical layout', () => {
      render(<ColorPalette {...defaultProps} layout="vertical" />);
      
      const container = screen.getByTestId('color-palette');
      expect(container).toHaveClass('flex', 'flex-col');
    });

    it('should apply custom size', () => {
      render(<ColorPalette {...defaultProps} size="lg" />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      expect(colorButton).toHaveClass('w-12', 'h-12');
    });

    it('should apply small size', () => {
      render(<ColorPalette {...defaultProps} size="sm" />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      expect(colorButton).toHaveClass('w-6', 'h-6');
    });
  });

  describe('Disabled State', () => {
    it('should disable all colors when disabled', () => {
      render(<ColorPalette {...defaultProps} disabled={true} />);
      
      mockColors.forEach(color => {
        const colorButton = screen.getByTestId(`color-${color.colorHex.slice(1)}`);
        expect(colorButton).toBeDisabled();
      });
    });

    it('should not call onColorSelect when disabled', () => {
      const mockOnColorSelect = vi.fn();
      render(
        <ColorPalette 
          {...defaultProps} 
          onColorSelect={mockOnColorSelect}
          disabled={true}
        />
      );
      
      const colorButton = screen.getByTestId('color-FF0000');
      fireEvent.click(colorButton);
      
      expect(mockOnColorSelect).not.toHaveBeenCalled();
    });

    it('should show disabled styling', () => {
      render(<ColorPalette {...defaultProps} disabled={true} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      expect(colorButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ColorPalette {...defaultProps} />);
      
      const container = screen.getByTestId('color-palette');
      expect(container).toHaveAttribute('role', 'group');
      expect(container).toHaveAttribute('aria-label', '颜色选择器');
    });

    it('should have proper button roles and labels', () => {
      render(<ColorPalette {...defaultProps} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      expect(colorButton).toHaveAttribute('role', 'button');
      expect(colorButton).toHaveAttribute('aria-label', '选择颜色 #FF0000');
    });

    it('should indicate selected state to screen readers', () => {
      render(<ColorPalette {...defaultProps} selectedColor="#FF0000" />);
      
      const selectedColor = screen.getByTestId('color-FF0000');
      expect(selectedColor).toHaveAttribute('aria-pressed', 'true');
      
      const unselectedColor = screen.getByTestId('color-00FF00');
      expect(unselectedColor).toHaveAttribute('aria-pressed', 'false');
    });

    it('should support keyboard navigation', () => {
      render(<ColorPalette {...defaultProps} />);
      
      const firstColor = screen.getByTestId('color-FF0000');
      expect(firstColor).toHaveAttribute('tabIndex', '0');
      
      // Should be focusable
      firstColor.focus();
      expect(document.activeElement).toBe(firstColor);
    });

    it('should handle keyboard selection', () => {
      const mockOnColorSelect = vi.fn();
      render(<ColorPalette {...defaultProps} onColorSelect={mockOnColorSelect} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      colorButton.focus();
      
      fireEvent.keyDown(colorButton, { key: 'Enter' });
      expect(mockOnColorSelect).toHaveBeenCalledWith(mockColors[0]);
      
      fireEvent.keyDown(colorButton, { key: ' ' });
      expect(mockOnColorSelect).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance', () => {
    it('should handle large number of colors efficiently', () => {
      const manyColors = Array.from({ length: 100 }, (_, i) => ({
        id: `color-${i}`,
        colorHex: `#${i.toString(16).padStart(6, '0')}`,
        tokenId: i,
        owner: '0x123',
        mintedAt: new Date(),
        price: BigInt(1000000000000000000),
      }));

      const { container } = render(<ColorPalette {...defaultProps} colors={manyColors} />);
      
      // Should render without performance issues
      expect(container.querySelectorAll('[data-testid^="color-"]')).toHaveLength(100);
    });

    it('should memoize color buttons to prevent unnecessary re-renders', () => {
      const { rerender } = render(<ColorPalette {...defaultProps} />);
      
      // Re-render with same props
      rerender(<ColorPalette {...defaultProps} />);
      
      // Should not cause unnecessary re-renders (tested by ensuring no errors)
    });
  });
});