interface CanvasSnapshot {
  id: string;
  data: string;
  timestamp: number;
  userId: string;
  description?: string;
}

export class UndoRedoManager {
  private undoStack: CanvasSnapshot[] = [];
  private redoStack: CanvasSnapshot[] = [];
  private maxHistorySize = 50;
  private currentSnapshot: CanvasSnapshot | null = null;

  // Save current canvas state
  saveState(canvasData: string, userId: string, description?: string): void {
    const snapshot: CanvasSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: canvasData,
      timestamp: Date.now(),
      userId,
      description,
    };

    // Add to undo stack
    this.undoStack.push(snapshot);

    // Limit stack size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }

    // Clear redo stack when new state is saved
    this.redoStack = [];

    this.currentSnapshot = snapshot;
  }

  // Undo last operation
  undo(): CanvasSnapshot | null {
    if (this.undoStack.length === 0) return null;

    const currentState = this.undoStack.pop();
    if (!currentState) return null;

    // Move current state to redo stack
    if (this.currentSnapshot) {
      this.redoStack.push(this.currentSnapshot);
    }

    // Get previous state
    const previousState = this.undoStack[this.undoStack.length - 1] || null;
    this.currentSnapshot = previousState;

    return previousState;
  }

  // Redo last undone operation
  redo(): CanvasSnapshot | null {
    if (this.redoStack.length === 0) return null;

    const stateToRestore = this.redoStack.pop();
    if (!stateToRestore) return null;

    // Move current state back to undo stack
    if (this.currentSnapshot) {
      this.undoStack.push(this.currentSnapshot);
    }

    this.currentSnapshot = stateToRestore;
    return stateToRestore;
  }

  // Check if undo is available
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // Check if redo is available
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Get current state
  getCurrentState(): CanvasSnapshot | null {
    return this.currentSnapshot;
  }

  // Get history info
  getHistoryInfo() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      currentSnapshot: this.currentSnapshot,
    };
  }

  // Clear all history
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentSnapshot = null;
  }

  // Set maximum history size
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    
    // Trim existing stacks if needed
    if (this.undoStack.length > size) {
      this.undoStack = this.undoStack.slice(-size);
    }
    if (this.redoStack.length > size) {
      this.redoStack = this.redoStack.slice(-size);
    }
  }

  // Get recent history for debugging
  getRecentHistory(count: number = 5): CanvasSnapshot[] {
    return this.undoStack.slice(-count);
  }
}