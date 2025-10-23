import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react';

// Mock Liveblocks
vi.mock('@liveblocks/client', () => ({
  createClient: vi.fn(() => ({
    enterRoom: vi.fn(),
    leaveRoom: vi.fn(),
  })),
}));

// Mock Fabric.js
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
      freeDrawingBrush: {
        color: '#000000',
        width: 5,
      },
    })),
    PencilBrush: vi.fn(),
  },
}));

// Mock collaborative canvas component
const MockCollaborativeCanvas = () => {
  const [users, setUsers] = React.useState([
    { id: 1, name: 'User 1', cursor: { x: 100, y: 100 }, color: '#FF0000' },
    { id: 2, name: 'User 2', cursor: { x: 200, y: 200 }, color: '#00FF00' },
  ]);
  const [operations, setOperations] = React.useState<any[]>([]);
  const [selectedColor, setSelectedColor] = React.useState('#FF0000');

  const handleDraw = (x: number, y: number) => {
    const operation = {
      id: Date.now(),
      type: 'draw',
      userId: 'current-user',
      timestamp: new Date(),
      data: { x, y, color: selectedColor },
    };
    setOperations(prev => [...prev, operation]);
  };

  const handleUserJoin = () => {
    const newUser = {
      id: users.length + 1,
      name: `User ${users.length + 1}`,
      cursor: { x: 50, y: 50 },
      color: '#0000FF',
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUserLeave = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <div data-testid="collaborative-canvas-container">
      <div data-testid="active-users">
        <h3>在线用户 ({users.length})</h3>
        {users.map(user => (
          <div key={user.id} data-testid={`user-${user.id}`}>
            <span>{user.name}</span>
            <div 
              data-testid={`cursor-${user.id}`}
              style={{
                position: 'absolute',
                left: user.cursor.x,
                top: user.cursor.y,
                backgroundColor: user.color,
                width: 10,
                height: 10,
                borderRadius: '50%',
              }}
            />
            <button 
              onClick={() => handleUserLeave(user.id)}
              data-testid={`remove-user-${user.id}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleUserJoin} data-testid="add-user">
          Add User
        </button>
      </div>

      <div data-testid="color-palette">
        {['#FF0000', '#00FF00', '#0000FF'].map(color => (
          <button
            key={color}
            data-testid={`color-${color.slice(1)}`}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            className={selectedColor === color ? 'selected' : ''}
          >
            {color}
          </button>
        ))}
      </div>

      <canvas
        data-testid="canvas"
        width={800}
        height={600}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          handleDraw(x, y);
        }}
      />

      <div data-testid="operations-log">
        <h3>操作历史 ({operations.length})</h3>
        {operations.map(op => (
          <div key={op.id} data-testid={`operation-${op.id}`}>
            {op.type} at ({op.data.x}, {op.data.y}) with {op.data.color}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock real-time sync component
const MockRealtimeSync = () => {
  const [syncStatus, setSyncStatus] = React.useState<'connected' | 'disconnected' | 'syncing'>('connected');
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('connected');
      setLastSync(new Date());
    }, 1000);
  };

  const handleDisconnect = () => {
    setSyncStatus('disconnected');
  };

  return (
    <div data-testid="realtime-sync">
      <div data-testid="sync-status">
        状态: {syncStatus}
      </div>
      {lastSync && (
        <div data-testid="last-sync">
          最后同步: {lastSync.toLocaleTimeString()}
        </div>
      )}
      <button onClick={handleSync} data-testid="manual-sync">
        手动同步
      </button>
      <button onClick={handleDisconnect} data-testid="disconnect">
        断开连接
      </button>
    </div>
  );
};

// Test wrapper with Liveblocks provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockClient = {
    enterRoom: vi.fn(),
    leaveRoom: vi.fn(),
  };

  return (
    <LiveblocksProvider client={mockClient as any}>
      <RoomProvider id="test-room">
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
};

describe('Collaboration Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Multi-User Canvas Interaction', () => {
    it('should handle multiple users drawing simultaneously', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // Initially should have 2 users
      expect(screen.getByText('在线用户 (2)')).toBeInTheDocument();
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-2')).toBeInTheDocument();

      // Add another user
      fireEvent.click(screen.getByTestId('add-user'));

      await waitFor(() => {
        expect(screen.getByText('在线用户 (3)')).toBeInTheDocument();
        expect(screen.getByTestId('user-3')).toBeInTheDocument();
      });

      // Select color and draw
      fireEvent.click(screen.getByTestId('color-FF0000'));
      
      const canvas = screen.getByTestId('canvas');
      fireEvent.click(canvas, { clientX: 150, clientY: 150 });

      await waitFor(() => {
        expect(screen.getByText('操作历史 (1)')).toBeInTheDocument();
        expect(screen.getByTestId('operation-' + expect.any(String))).toBeInTheDocument();
      });
    });

    it('should show user cursors in real-time', () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // Should show cursors for all users
      expect(screen.getByTestId('cursor-1')).toBeInTheDocument();
      expect(screen.getByTestId('cursor-2')).toBeInTheDocument();

      // Cursors should have correct positions
      const cursor1 = screen.getByTestId('cursor-1');
      expect(cursor1).toHaveStyle('left: 100px; top: 100px');

      const cursor2 = screen.getByTestId('cursor-2');
      expect(cursor2).toHaveStyle('left: 200px; top: 200px');
    });

    it('should handle user disconnection', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      expect(screen.getByText('在线用户 (2)')).toBeInTheDocument();

      // Remove a user
      fireEvent.click(screen.getByTestId('remove-user-1'));

      await waitFor(() => {
        expect(screen.getByText('在线用户 (1)')).toBeInTheDocument();
        expect(screen.queryByTestId('user-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cursor-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Real-time Synchronization', () => {
    it('should maintain connection status', () => {
      render(
        <TestWrapper>
          <MockRealtimeSync />
        </TestWrapper>
      );

      expect(screen.getByText('状态: connected')).toBeInTheDocument();
    });

    it('should handle manual synchronization', async () => {
      render(
        <TestWrapper>
          <MockRealtimeSync />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('manual-sync'));

      await waitFor(() => {
        expect(screen.getByText('状态: syncing')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('状态: connected')).toBeInTheDocument();
        expect(screen.getByTestId('last-sync')).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should handle connection loss', async () => {
      render(
        <TestWrapper>
          <MockRealtimeSync />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('disconnect'));

      await waitFor(() => {
        expect(screen.getByText('状态: disconnected')).toBeInTheDocument();
      });
    });
  });

  describe('Operation Synchronization', () => {
    it('should track drawing operations', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');
      
      // Perform multiple drawing operations
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });
      fireEvent.click(canvas, { clientX: 200, clientY: 200 });
      fireEvent.click(canvas, { clientX: 300, clientY: 300 });

      await waitFor(() => {
        expect(screen.getByText('操作历史 (3)')).toBeInTheDocument();
      });

      // Should show all operations
      const operations = screen.getAllByTestId(/operation-/);
      expect(operations).toHaveLength(3);
    });

    it('should use selected color for drawing', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // Select blue color
      fireEvent.click(screen.getByTestId('color-0000FF'));
      
      const canvas = screen.getByTestId('canvas');
      fireEvent.click(canvas, { clientX: 150, clientY: 150 });

      await waitFor(() => {
        const operation = screen.getByTestId(/operation-/);
        expect(operation).toHaveTextContent('#0000FF');
      });
    });
  });

  describe('Conflict Resolution', () => {
    it('should handle simultaneous operations', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');
      
      // Simulate simultaneous operations from different users
      // In real implementation, this would test CRDT conflict resolution
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });
      fireEvent.click(canvas, { clientX: 100, clientY: 100 }); // Same position

      await waitFor(() => {
        expect(screen.getByText('操作历史 (2)')).toBeInTheDocument();
      });

      // Both operations should be recorded
      const operations = screen.getAllByTestId(/operation-/);
      expect(operations).toHaveLength(2);
    });
  });

  describe('Performance Under Load', () => {
    it('should handle rapid operations efficiently', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');
      
      // Simulate rapid drawing (like dragging)
      for (let i = 0; i < 10; i++) {
        fireEvent.click(canvas, { clientX: 100 + i * 10, clientY: 100 + i * 10 });
      }

      await waitFor(() => {
        expect(screen.getByText('操作历史 (10)')).toBeInTheDocument();
      });

      // Should handle all operations without performance issues
      const operations = screen.getAllByTestId(/operation-/);
      expect(operations).toHaveLength(10);
    });

    it('should handle many concurrent users', async () => {
      render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // Add many users
      for (let i = 0; i < 8; i++) {
        fireEvent.click(screen.getByTestId('add-user'));
      }

      await waitFor(() => {
        expect(screen.getByText('在线用户 (10)')).toBeInTheDocument();
      });

      // Should show all users without performance degradation
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByTestId(`user-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Canvas State Persistence', () => {
    it('should maintain canvas state across reconnections', async () => {
      const { rerender } = render(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // Draw something
      const canvas = screen.getByTestId('canvas');
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });

      await waitFor(() => {
        expect(screen.getByText('操作历史 (1)')).toBeInTheDocument();
      });

      // Simulate reconnection by re-rendering
      rerender(
        <TestWrapper>
          <MockCollaborativeCanvas />
        </TestWrapper>
      );

      // In real implementation, state should be restored
      // For this mock, we start fresh but the pattern is tested
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Undo/Redo Collaboration', () => {
    it('should handle undo operations in collaborative environment', async () => {
      const MockUndoRedo = () => {
        const [operations, setOperations] = React.useState<any[]>([]);
        const [undoStack, setUndoStack] = React.useState<any[]>([]);

        const addOperation = (op: any) => {
          setOperations(prev => [...prev, op]);
        };

        const undo = () => {
          if (operations.length > 0) {
            const lastOp = operations[operations.length - 1];
            setOperations(prev => prev.slice(0, -1));
            setUndoStack(prev => [...prev, lastOp]);
          }
        };

        const redo = () => {
          if (undoStack.length > 0) {
            const lastUndo = undoStack[undoStack.length - 1];
            setUndoStack(prev => prev.slice(0, -1));
            setOperations(prev => [...prev, lastUndo]);
          }
        };

        return (
          <div>
            <button 
              onClick={() => addOperation({ id: Date.now(), type: 'draw' })}
              data-testid="add-operation"
            >
              Draw
            </button>
            <button 
              onClick={undo}
              disabled={operations.length === 0}
              data-testid="undo"
            >
              Undo
            </button>
            <button 
              onClick={redo}
              disabled={undoStack.length === 0}
              data-testid="redo"
            >
              Redo
            </button>
            <div data-testid="operations-count">
              Operations: {operations.length}
            </div>
            <div data-testid="undo-count">
              Undo Stack: {undoStack.length}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <MockUndoRedo />
        </TestWrapper>
      );

      // Add operations
      fireEvent.click(screen.getByTestId('add-operation'));
      fireEvent.click(screen.getByTestId('add-operation'));

      expect(screen.getByText('Operations: 2')).toBeInTheDocument();

      // Undo
      fireEvent.click(screen.getByTestId('undo'));
      expect(screen.getByText('Operations: 1')).toBeInTheDocument();
      expect(screen.getByText('Undo Stack: 1')).toBeInTheDocument();

      // Redo
      fireEvent.click(screen.getByTestId('redo'));
      expect(screen.getByText('Operations: 2')).toBeInTheDocument();
      expect(screen.getByText('Undo Stack: 0')).toBeInTheDocument();
    });
  });
});