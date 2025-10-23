import { fabric } from 'fabric';
import type { DrawingTool } from '../../types';

export class CollaborativeCanvas {
  private canvas: fabric.Canvas;
  private isDrawing = false;
  private currentTool: DrawingTool = { type: 'brush', size: 5 };
  private onObjectAddedCallback?: (object: fabric.Object) => void;
  private onObjectModifiedCallback?: (object: fabric.Object) => void;
  private onObjectRemovedCallback?: (object: fabric.Object) => void;
  private onPathCreatedCallback?: (path: fabric.Path) => void;

  constructor(canvasElement: HTMLCanvasElement) {
    // Initialize Fabric.js canvas
    this.canvas = new fabric.Canvas(canvasElement, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: false, // Disable selection for collaborative drawing
      preserveObjectStacking: true,
    });

    this.setupEventListeners();
    this.setupDrawingBrush();
  }

  private setupEventListeners() {
    // Object added event
    this.canvas.on('object:added', (e) => {
      if (e.target && this.onObjectAddedCallback) {
        this.onObjectAddedCallback(e.target);
      }
    });

    // Object modified event
    this.canvas.on('object:modified', (e) => {
      if (e.target && this.onObjectModifiedCallback) {
        this.onObjectModifiedCallback(e.target);
      }
    });

    // Object removed event
    this.canvas.on('object:removed', (e) => {
      if (e.target && this.onObjectRemovedCallback) {
        this.onObjectRemovedCallback(e.target);
      }
    });

    // Path created event (for free drawing)
    this.canvas.on('path:created', (e: any) => {
      if (e.path && this.onPathCreatedCallback) {
        this.onPathCreatedCallback(e.path);
      }
    });

    // Drawing state events
    this.canvas.on('mouse:down', () => {
      this.isDrawing = true;
    });

    this.canvas.on('mouse:up', () => {
      this.isDrawing = false;
    });
  }

  private setupDrawingBrush() {
    // Configure free drawing brush
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.updateBrushSettings();
  }

  private updateBrushSettings() {
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = this.currentTool.size;
      this.canvas.freeDrawingBrush.color = this.currentTool.color || '#000000';
    }
  }

  // Public methods for tool management
  setTool(tool: DrawingTool) {
    this.currentTool = tool;
    
    if (tool.type === 'brush') {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    } else if (tool.type === 'eraser') {
      this.canvas.isDrawingMode = true;
      // Use PencilBrush with white color for eraser effect
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.canvas.backgroundColor as string || '#ffffff';
    }
    
    this.updateBrushSettings();
  }

  setBrushSize(size: number) {
    this.currentTool.size = size;
    this.updateBrushSettings();
  }

  setBrushColor(color: string) {
    this.currentTool.color = color;
    this.updateBrushSettings();
  }

  // Canvas state management
  getCanvasData(): string {
    return JSON.stringify(this.canvas.toJSON());
  }

  loadCanvasData(data: string) {
    try {
      this.canvas.loadFromJSON(data, () => {
        this.canvas.renderAll();
      });
    } catch (error) {
      console.error('Failed to load canvas data:', error);
    }
  }

  getCanvasObjects(): fabric.Object[] {
    return this.canvas.getObjects();
  }

  addObject(objectData: any) {
    try {
      // Use fabric.util.enlivenObjects with proper parameters
      fabric.util.enlivenObjects([objectData], (objects: fabric.Object[]) => {
        objects.forEach(obj => {
          this.canvas.add(obj);
        });
        this.canvas.renderAll();
      }, '');
    } catch (error) {
      console.error('Failed to add object:', error);
      // Fallback: try to create object directly
      try {
        const obj = new fabric.Object(objectData);
        this.canvas.add(obj);
        this.canvas.renderAll();
      } catch (fallbackError) {
        console.error('Fallback object creation failed:', fallbackError);
      }
    }
  }

  removeObject(objectId: string) {
    const objects = this.canvas.getObjects();
    const objectToRemove = objects.find(obj => (obj as any).id === objectId);
    if (objectToRemove) {
      this.canvas.remove(objectToRemove);
    }
  }

  clearCanvas() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
  }

  // Collaboration methods
  syncObjectFromRemote(objectData: any) {
    // Temporarily disable event listeners to prevent infinite loops
    this.canvas.off('object:added');
    this.canvas.off('object:modified');
    this.canvas.off('object:removed');

    this.addObject(objectData);

    // Re-enable event listeners
    this.setupEventListeners();
  }

  // Event handlers setup
  onObjectAdded(callback: (object: fabric.Object) => void) {
    this.onObjectAddedCallback = callback;
  }

  onObjectModified(callback: (object: fabric.Object) => void) {
    this.onObjectModifiedCallback = callback;
  }

  onObjectRemoved(callback: (object: fabric.Object) => void) {
    this.onObjectRemovedCallback = callback;
  }

  onPathCreated(callback: (path: fabric.Path) => void) {
    this.onPathCreatedCallback = callback;
  }

  // Utility methods
  getIsDrawing(): boolean {
    return this.isDrawing;
  }

  getCurrentTool(): DrawingTool {
    return this.currentTool;
  }

  getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  // Cleanup
  dispose() {
    this.canvas.dispose();
  }

  // Export methods
  toDataURL(format: string = 'image/png', quality: number = 1): string {
    return this.canvas.toDataURL({
      format,
      quality,
      multiplier: 1,
    });
  }

  // Undo/Redo support (will be enhanced in subtask 3.2)
  getCanvasState(): any {
    return {
      objects: this.canvas.toJSON(),
      version: Date.now(),
    };
  }

  restoreCanvasState(state: any) {
    this.canvas.loadFromJSON(state.objects, () => {
      this.canvas.renderAll();
    });
  }
}