import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-500'); // default variant
      expect(button).toHaveClass('h-10'); // default size (md)
    });

    it('should render with custom text', () => {
      const text = 'Custom Button Text';
      render(<Button>{text}</Button>);
      
      expect(screen.getByRole('button', { name: text })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-button-class';
      render(<Button className={customClass}>Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(customClass);
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Button variant="default">Default</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-500', 'text-white');
    });

    it('should apply nushu variant styles', () => {
      render(<Button variant="nushu">Nushu</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-r', 'from-nushu-red', 'to-nushu-gold');
    });

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-primary-500', 'text-primary-500');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary-500');
    });

    it('should apply canvas variant styles', () => {
      render(<Button variant="canvas">Canvas</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-canvas-bg', 'border', 'text-nushu-ink');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-body-sm');
    });

    it('should apply medium size styles', () => {
      render(<Button size="md">Medium</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4', 'text-body-base');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6', 'text-body-lg');
    });

    it('should apply icon size styles', () => {
      render(<Button size="icon">Icon</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Button loading={true}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      
      // Text should still be visible
      expect(button).toHaveTextContent('Loading Button');
    });

    it('should not show loading spinner when loading is false', () => {
      render(<Button loading={false}>Normal Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });

    it('should disable button when loading', () => {
      render(<Button loading={true}>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled={true}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('should be disabled when both loading and disabled are true', () => {
      render(<Button loading={true} disabled={true}>Both</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<Button disabled={false}>Enabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled={true}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading={true}>Loading</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle other HTML button props', () => {
      const handleMouseOver = vi.fn();
      render(
        <Button onMouseOver={handleMouseOver} type="submit" id="test-button">
          Test
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('id', 'test-button');
      
      fireEvent.mouseOver(button);
      expect(handleMouseOver).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should support aria attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('should have focus-visible styles', () => {
      render(<Button>Focusable</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });
});