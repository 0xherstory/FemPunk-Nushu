import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollaborativeCanvas } from '../../components/canvas/CollaborativeCanvas';

// Mock dependencies
vi.mock('fabric', () => ({
  fabric: {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      dispose: vi.fn(),
      renderAll: vi.fn(),
      getObjects: vi.fn(() => []),
      add: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      setDimensions: vi.fn(),
      getWidth: vi.fn(() => 800),
      getHeight: vi.fn(() => 600),
    })),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: '#000000',
      width: 5,
    })),
  },
}));

vi.mock('@liveblocks/react', () => ({
  useRoom: vi.fn(),
  useMyPresence: vi.fn(),
  useOthers: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../../lib/hooks/useCanvasState', () => ({
  useCanvasState: vi.fn(),
}));

vi.mock('../../lib/hooks/useColorNFTs', () => ({
  useUserColors: vi.fn(),
}));

const mockUseRoom = vi.mocked(require('@liveblocks/react').useRoom);
const mockUseMyPresence = vi.mocked(require('@liveblocks/react').useMyPresence);
const mockUseOthers = vi.mocked(require('@liveblocks/react').useOthers);
const mockUseMutation = vi.mocked(require('@liveblocks/react').useMutation);
const mockUseCanvasState = vi.mocked(require('../../lib/hooks/useCanvasState').useCanvasState);
const mockUseUserColors = vi.mocked(require('../../lib/hooks/useColorNFTs').useUserColors);

describe('CollaborativeCanvas', () => {
  const defaultProps = {
    canvasId: 'test-canvas-1',
    userColors: [
      {
        id: 'color-1',
        colorHex: '#FF0000',
        tokenId: 1,
        owner: '0x123',
        mintedAt: new Date(),
        price: 1000000000000000000n,
      },
    ],
    onColorSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseRoom.mockReturnValue({
      id: 'test-room',
      getPresence: vi.fn(),
      updatePresence: vi.fn(),
    } as any);

    mockUseMyPresence.mockReturnValue([
      { cursor: { x: 0, y: 0 }, selectedColor: '#FF0000' },
      vi.fn(),
    ]);

    mockUseOthers.mockReturnValue([]);

    mockUseMutation.mockReturnValue(vi.fn());

    mockUseCanvasState.mockReturnValue({
      canvasState: {
        objects: [],
        version: 1,
        lastModified: new Date(),
        activeUsers: [],
      },
      isLoading: false,
      error: null,
    });

    mockUseUserColors.mockReturnValue({
      userColors: defaultProps.userColors,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render canvas container', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvasContainer = screen.getByTestId('collaborative-canvas');
      expect(canvasContainer).toBeInTheDocument();
    });

    it('should render loading state', () => {
      mockUseCanvasState.mockReturnValue({
        canvasState: null,
        isLoading: true,
        error: null,
      });

      render(<CollaborativeCanvas {...defaultProps} />);
      
      expect(screen.getByText('加载画布中...')).toBeInTheDocument();
    });

    it('should render error state', () => {
      mockUseCanvasState.mockReturnValue({
        canvasState: null,
        isLoading: false,
        error: 'Failed to load canvas',
      });

      render(<CollaborativeCanvas {...defaultProps} />);
      
      expect(screen.getByText('画布加载失败')).toBeInTheDocument();
      expect(screen.getByText('Failed to load canvas')).toBeInTheDocument();
    });

    it('should render canvas when ready', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img'); // Canvas element has img role
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Read-only Mode', () => {
    it('should disable drawing tools in read-only mode', () => {
      render(<CollaborativeCanvas {...defaultProps} isReadOnly={true} />);
      
      // Should not show drawing tools
      expect(screen.queryByTestId('drawing-tools')).not.toBeInTheDocument();
    });

    it('should show read-only indicator', () => {
      render(<CollaborativeCanvas {...defaultProps} isReadOnly={true} />);
      
      expect(screen.getByText('仅查看模式')).toBeInTheDocument();
    });
  });

  describe('Color Selection', () => {
    it('should call onColorSelect when color is selected', () => {
      const mockOnColorSelect = vi.fn();
      render(<CollaborativeCanvas {...defaultProps} onColorSelect={mockOnColorSelect} />);
      
      const colorButton = screen.getByTestId('color-FF0000');
      fireEvent.click(colorButton);
      
      expect(mockOnColorSelect).toHaveBeenCalledWith({
        id: 'color-1',
        colorHex: '#FF0000',
        tokenId: 1,
        owner: '0x123',
        mintedAt: expect.any(Date),
        price: 1000000000000000000n,
      });
    });

    it('should show no colors message when user has no colors', () => {
      mockUseUserColors.mockReturnValue({
        userColors: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<CollaborativeCanvas {...defaultProps} userColors={[]} />);
      
      expect(screen.getByText('您还没有颜色 NFT')).toBeInTheDocument();
      expect(screen.getByText('前往购买页面获取颜色')).toBeInTheDocument();
    });
  });

  describe('User Cursors', () => {
    it('should display other users cursors', () => {
      mockUseOthers.mockReturnValue([
        {
          connectionId: 1,
          presence: {
            cursor: { x: 100, y: 200 },
            selectedColor: '#00FF00',
          },
          info: { name: 'User 1' },
        },
        {
          connectionId: 2,
          presence: {
            cursor: { x: 300, y: 400 },
            selectedColor: '#0000FF',
          },
          info: { name: 'User 2' },
        },
      ]);

      render(<CollaborativeCanvas {...defaultProps} />);
      
      const cursors = screen.getAllByTestId(/user-cursor-/);
      expect(cursors).toHaveLength(2);
    });

    it('should not display cursors when no other users', () => {
      mockUseOthers.mockReturnValue([]);

      render(<CollaborativeCanvas {...defaultProps} />);
      
      const cursors = screen.queryAllByTestId(/user-cursor-/);
      expect(cursors).toHaveLength(0);
    });
  });

  describe('Canvas Operations', () => {
    it('should handle mouse events for drawing', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img');
      
      // Simulate drawing
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
      
      // Should update presence with drawing state
      expect(mockUseMyPresence()[1]).toHaveBeenCalled();
    });

    it('should handle touch events for mobile drawing', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img');
      
      // Simulate touch drawing
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 150, clientY: 150 }],
      });
      fireEvent.touchEnd(canvas);
      
      // Should handle touch events properly
      expect(mockUseMyPresence()[1]).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should throttle cursor updates', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img');
      const updatePresence = mockUseMyPresence()[1];
      
      // Rapid mouse movements
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(canvas, { clientX: i * 10, clientY: i * 10 });
      }
      
      // Should not call updatePresence for every movement due to throttling
      expect(updatePresence).toHaveBeenCalledTimes(1);
    });

    it('should cleanup on unmount', () => {
      const { unmount } = render(<CollaborativeCanvas {...defaultProps} />);
      
      unmount();
      
      // Should cleanup fabric canvas and event listeners
      // This is tested by ensuring no memory leaks or errors
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img');
      expect(canvas).toHaveAttribute('aria-label', '协作绘画画布');
    });

    it('should support keyboard navigation', () => {
      render(<CollaborativeCanvas {...defaultProps} />);
      
      const canvas = screen.getByRole('img');
      expect(canvas).toHaveAttribute('tabIndex', '0');
    });
  });
});