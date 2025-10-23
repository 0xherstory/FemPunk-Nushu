import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationBar } from '../../components/navigation/NavigationBar';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

const mockPush = vi.fn();
const mockUseRouter = vi.mocked(require('next/navigation').useRouter);
const mockUsePathname = vi.mocked(require('next/navigation').usePathname);

describe('NavigationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });

    mockUsePathname.mockReturnValue('/canvas');
  });

  describe('Rendering', () => {
    it('should render all navigation items', () => {
      render(<NavigationBar />);
      
      expect(screen.getByText('画布')).toBeInTheDocument();
      expect(screen.getByText('购买')).toBeInTheDocument();
      expect(screen.getByText('藏品')).toBeInTheDocument();
      expect(screen.getByText('社区')).toBeInTheDocument();
    });

    it('should render navigation icons', () => {
      render(<NavigationBar />);
      
      expect(screen.getByTestId('canvas-icon')).toBeInTheDocument();
      expect(screen.getByTestId('purchase-icon')).toBeInTheDocument();
      expect(screen.getByTestId('collection-icon')).toBeInTheDocument();
      expect(screen.getByTestId('community-icon')).toBeInTheDocument();
    });

    it('should have proper navigation structure', () => {
      render(<NavigationBar />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', '主导航');
    });
  });

  describe('Active State', () => {
    it('should highlight canvas tab when on canvas page', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const canvasTab = screen.getByRole('button', { name: /画布/ });
      expect(canvasTab).toHaveClass('text-primary-500', 'border-primary-500');
    });

    it('should highlight purchase tab when on purchase page', () => {
      mockUsePathname.mockReturnValue('/buy');
      render(<NavigationBar />);
      
      const purchaseTab = screen.getByRole('button', { name: /购买/ });
      expect(purchaseTab).toHaveClass('text-primary-500', 'border-primary-500');
    });

    it('should highlight collection tab when on collection page', () => {
      mockUsePathname.mockReturnValue('/collection');
      render(<NavigationBar />);
      
      const collectionTab = screen.getByRole('button', { name: /藏品/ });
      expect(collectionTab).toHaveClass('text-primary-500', 'border-primary-500');
    });

    it('should highlight community tab when on community page', () => {
      mockUsePathname.mockReturnValue('/community');
      render(<NavigationBar />);
      
      const communityTab = screen.getByRole('button', { name: /社区/ });
      expect(communityTab).toHaveClass('text-primary-500', 'border-primary-500');
    });

    it('should not highlight any tab when on unknown page', () => {
      mockUsePathname.mockReturnValue('/unknown');
      render(<NavigationBar />);
      
      const tabs = screen.getAllByRole('button');
      tabs.forEach(tab => {
        expect(tab).not.toHaveClass('text-primary-500', 'border-primary-500');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to canvas page when canvas tab clicked', () => {
      mockUsePathname.mockReturnValue('/buy');
      render(<NavigationBar />);
      
      const canvasTab = screen.getByRole('button', { name: /画布/ });
      fireEvent.click(canvasTab);
      
      expect(mockPush).toHaveBeenCalledWith('/canvas');
    });

    it('should navigate to purchase page when purchase tab clicked', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const purchaseTab = screen.getByRole('button', { name: /购买/ });
      fireEvent.click(purchaseTab);
      
      expect(mockPush).toHaveBeenCalledWith('/buy');
    });

    it('should navigate to collection page when collection tab clicked', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const collectionTab = screen.getByRole('button', { name: /藏品/ });
      fireEvent.click(collectionTab);
      
      expect(mockPush).toHaveBeenCalledWith('/collection');
    });

    it('should navigate to community page when community tab clicked', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const communityTab = screen.getByRole('button', { name: /社区/ });
      fireEvent.click(communityTab);
      
      expect(mockPush).toHaveBeenCalledWith('/community');
    });

    it('should not navigate when clicking already active tab', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const canvasTab = screen.getByRole('button', { name: /画布/ });
      fireEvent.click(canvasTab);
      
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should show full labels on desktop', () => {
      render(<NavigationBar />);
      
      expect(screen.getByText('画布')).toHaveClass('hidden', 'sm:block');
      expect(screen.getByText('购买')).toHaveClass('hidden', 'sm:block');
      expect(screen.getByText('藏品')).toHaveClass('hidden', 'sm:block');
      expect(screen.getByText('社区')).toHaveClass('hidden', 'sm:block');
    });

    it('should show icons on mobile', () => {
      render(<NavigationBar />);
      
      expect(screen.getByTestId('canvas-icon')).toHaveClass('block', 'sm:hidden');
      expect(screen.getByTestId('purchase-icon')).toHaveClass('block', 'sm:hidden');
      expect(screen.getByTestId('collection-icon')).toHaveClass('block', 'sm:hidden');
      expect(screen.getByTestId('community-icon')).toHaveClass('block', 'sm:hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<NavigationBar />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', '主导航');
    });

    it('should have proper button roles', () => {
      render(<NavigationBar />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should indicate current page to screen readers', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const canvasTab = screen.getByRole('button', { name: /画布/ });
      expect(canvasTab).toHaveAttribute('aria-current', 'page');
      
      const purchaseTab = screen.getByRole('button', { name: /购买/ });
      expect(purchaseTab).not.toHaveAttribute('aria-current');
    });

    it('should support keyboard navigation', () => {
      render(<NavigationBar />);
      
      const firstTab = screen.getByRole('button', { name: /画布/ });
      const secondTab = screen.getByRole('button', { name: /购买/ });
      
      // Should be focusable
      firstTab.focus();
      expect(document.activeElement).toBe(firstTab);
      
      // Should support tab navigation
      fireEvent.keyDown(firstTab, { key: 'Tab' });
      secondTab.focus();
      expect(document.activeElement).toBe(secondTab);
    });

    it('should handle keyboard activation', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const purchaseTab = screen.getByRole('button', { name: /购买/ });
      purchaseTab.focus();
      
      fireEvent.keyDown(purchaseTab, { key: 'Enter' });
      expect(mockPush).toHaveBeenCalledWith('/buy');
      
      fireEvent.keyDown(purchaseTab, { key: ' ' });
      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual States', () => {
    it('should show hover effects', () => {
      mockUsePathname.mockReturnValue('/canvas');
      render(<NavigationBar />);
      
      const purchaseTab = screen.getByRole('button', { name: /购买/ });
      expect(purchaseTab).toHaveClass('hover:text-primary-400', 'hover:border-primary-400');
    });

    it('should show focus states', () => {
      render(<NavigationBar />);
      
      const canvasTab = screen.getByRole('button', { name: /画布/ });
      expect(canvasTab).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary-500');
    });

    it('should have proper transition effects', () => {
      render(<NavigationBar />);
      
      const tabs = screen.getAllByRole('button');
      tabs.forEach(tab => {
        expect(tab).toHaveClass('transition-colors', 'duration-200');
      });
    });
  });

  describe('Badge Notifications', () => {
    it('should show notification badge when provided', () => {
      render(<NavigationBar notifications={{ collection: 3 }} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByTestId('collection-badge')).toBeInTheDocument();
    });

    it('should not show badge when no notifications', () => {
      render(<NavigationBar />);
      
      expect(screen.queryByTestId('collection-badge')).not.toBeInTheDocument();
    });

    it('should show dot indicator for boolean notifications', () => {
      render(<NavigationBar notifications={{ community: true }} />);
      
      expect(screen.getByTestId('community-dot')).toBeInTheDocument();
    });
  });
});