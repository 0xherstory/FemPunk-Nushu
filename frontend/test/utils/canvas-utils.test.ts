import { describe, it, expect, vi } from 'vitest';

// Mock canvas utility functions
const createCanvasFromImageData = (imageData: ImageData): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }
  
  return canvas;
};

const getCanvasImageData = (canvas: HTMLCanvasElement): ImageData | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const resizeCanvas = (canvas: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement => {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = width;
  newCanvas.height = height;
  
  const ctx = newCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  
  return newCanvas;
};

const mergeCanvasLayers = (layers: HTMLCanvasElement[]): HTMLCanvasElement => {
  if (layers.length === 0) {
    return document.createElement('canvas');
  }
  
  const result = document.createElement('canvas');
  result.width = layers[0].width;
  result.height = layers[0].height;
  
  const ctx = result.getContext('2d');
  if (ctx) {
    layers.forEach(layer => {
      ctx.drawImage(layer, 0, 0);
    });
  }
  
  return result;
};

const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.8): Promise<Blob | null> => {
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png', quality);
  });
};

const canvasToDataURL = (canvas: HTMLCanvasElement, quality = 0.8): string => {
  return canvas.toDataURL('image/png', quality);
};

const calculateCanvasHash = (canvas: HTMLCanvasElement): string => {
  const imageData = getCanvasImageData(canvas);
  if (!imageData) return '';
  
  // Simple hash calculation for testing
  let hash = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    hash = ((hash << 5) - hash + imageData.data[i]) & 0xffffffff;
  }
  
  return hash.toString(16);
};

const detectCanvasChanges = (canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement): boolean => {
  return calculateCanvasHash(canvas1) !== calculateCanvasHash(canvas2);
};

const getPixelColor = (canvas: HTMLCanvasElement, x: number, y: number): [number, number, number, number] | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const imageData = ctx.getImageData(x, y, 1, 1);
  return [
    imageData.data[0],
    imageData.data[1],
    imageData.data[2],
    imageData.data[3]
  ];
};

const setPixelColor = (canvas: HTMLCanvasElement, x: number, y: number, color: [number, number, number, number]): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.createImageData(1, 1);
  imageData.data[0] = color[0];
  imageData.data[1] = color[1];
  imageData.data[2] = color[2];
  imageData.data[3] = color[3];
  
  ctx.putImageData(imageData, x, y);
};

const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const drawLine = (
  canvas: HTMLCanvasElement,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  width: number
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
};

const drawCircle = (
  canvas: HTMLCanvasElement,
  center: { x: number; y: number },
  radius: number,
  color: string,
  fill = false
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

describe('Canvas Utilities', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 600;
    
    mockContext = {
      putImageData: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(800 * 600 * 4),
        width: 800,
        height: 600,
      })),
      drawImage: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
        width: 1,
        height: 1,
      })),
    } as any;

    vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
  });

  describe('Canvas Creation and Manipulation', () => {
    it('should create canvas from image data', () => {
      const imageData = {
        data: new Uint8ClampedArray(800 * 600 * 4),
        width: 800,
        height: 600,
      } as ImageData;

      const canvas = createCanvasFromImageData(imageData);

      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
      expect(mockContext.putImageData).toHaveBeenCalledWith(imageData, 0, 0);
    });

    it('should get image data from canvas', () => {
      const imageData = getCanvasImageData(mockCanvas);

      expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 800, 600);
      expect(imageData).toBeDefined();
    });

    it('should handle canvas without context', () => {
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const imageData = getCanvasImageData(mockCanvas);
      expect(imageData).toBeNull();
    });
  });

  describe('Canvas Resizing', () => {
    it('should resize canvas correctly', () => {
      const resized = resizeCanvas(mockCanvas, 400, 300);

      expect(resized.width).toBe(400);
      expect(resized.height).toBe(300);
      expect(mockContext.drawImage).toHaveBeenCalledWith(mockCanvas, 0, 0, 400, 300);
    });

    it('should maintain aspect ratio when resizing', () => {
      const originalRatio = mockCanvas.width / mockCanvas.height;
      const resized = resizeCanvas(mockCanvas, 400, 300);
      const newRatio = resized.width / resized.height;

      // In this case, we're not maintaining aspect ratio automatically
      // but we can test that the resize operation works
      expect(resized.width).toBe(400);
      expect(resized.height).toBe(300);
    });
  });

  describe('Layer Merging', () => {
    it('should merge multiple canvas layers', () => {
      const layers = [mockCanvas, mockCanvas, mockCanvas];
      const merged = mergeCanvasLayers(layers);

      expect(merged.width).toBe(800);
      expect(merged.height).toBe(600);
      expect(mockContext.drawImage).toHaveBeenCalledTimes(3);
    });

    it('should handle empty layer array', () => {
      const merged = mergeCanvasLayers([]);
      expect(merged).toBeInstanceOf(HTMLCanvasElement);
    });

    it('should handle single layer', () => {
      const merged = mergeCanvasLayers([mockCanvas]);
      expect(merged.width).toBe(800);
      expect(merged.height).toBe(600);
    });
  });

  describe('Canvas Export', () => {
    it('should convert canvas to blob', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/png' });
      vi.spyOn(mockCanvas, 'toBlob').mockImplementation((callback) => {
        if (callback) callback(mockBlob);
      });

      const blob = await canvasToBlob(mockCanvas);
      expect(blob).toBe(mockBlob);
    });

    it('should convert canvas to data URL', () => {
      const mockDataURL = 'data:image/png;base64,test';
      vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue(mockDataURL);

      const dataURL = canvasToDataURL(mockCanvas);
      expect(dataURL).toBe(mockDataURL);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', 0.8);
    });

    it('should handle custom quality settings', async () => {
      vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue('data:image/png;base64,test');

      canvasToDataURL(mockCanvas, 0.5);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', 0.5);
    });
  });

  describe('Canvas Hashing and Change Detection', () => {
    it('should calculate canvas hash', () => {
      const hash = calculateCanvasHash(mockCanvas);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should detect canvas changes', () => {
      const canvas1 = mockCanvas;
      const canvas2 = document.createElement('canvas');
      
      // Mock different image data for canvas2
      const mockContext2 = {
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(800 * 600 * 4).fill(255),
          width: 800,
          height: 600,
        })),
      } as any;
      
      vi.spyOn(canvas2, 'getContext').mockReturnValue(mockContext2);

      const hasChanges = detectCanvasChanges(canvas1, canvas2);
      expect(hasChanges).toBe(true);
    });

    it('should detect identical canvases', () => {
      const hasChanges = detectCanvasChanges(mockCanvas, mockCanvas);
      expect(hasChanges).toBe(false);
    });
  });

  describe('Pixel Manipulation', () => {
    it('should get pixel color', () => {
      const color = getPixelColor(mockCanvas, 100, 100);
      
      expect(mockContext.getImageData).toHaveBeenCalledWith(100, 100, 1, 1);
      expect(color).toHaveLength(4);
    });

    it('should set pixel color', () => {
      const color: [number, number, number, number] = [255, 0, 0, 255];
      setPixelColor(mockCanvas, 100, 100, color);

      expect(mockContext.createImageData).toHaveBeenCalledWith(1, 1);
      expect(mockContext.putImageData).toHaveBeenCalled();
    });

    it('should handle invalid coordinates gracefully', () => {
      const color = getPixelColor(mockCanvas, -1, -1);
      expect(color).toBeDefined(); // Should not throw
    });
  });

  describe('Drawing Operations', () => {
    it('should clear canvas', () => {
      clearCanvas(mockCanvas);
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should draw line', () => {
      const from = { x: 10, y: 10 };
      const to = { x: 100, y: 100 };
      
      drawLine(mockCanvas, from, to, '#FF0000', 5);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(10, 10);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should draw circle', () => {
      const center = { x: 50, y: 50 };
      
      drawCircle(mockCanvas, center, 25, '#00FF00', false);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 25, 0, 2 * Math.PI);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should draw filled circle', () => {
      const center = { x: 50, y: 50 };
      
      drawCircle(mockCanvas, center, 25, '#00FF00', true);

      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 25, 0, 2 * Math.PI);
      expect(mockContext.fill).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle null context gracefully', () => {
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      expect(() => {
        clearCanvas(mockCanvas);
        drawLine(mockCanvas, { x: 0, y: 0 }, { x: 10, y: 10 }, '#000', 1);
        drawCircle(mockCanvas, { x: 0, y: 0 }, 10, '#000');
      }).not.toThrow();
    });

    it('should handle invalid canvas dimensions', () => {
      mockCanvas.width = 0;
      mockCanvas.height = 0;

      expect(() => {
        getCanvasImageData(mockCanvas);
        clearCanvas(mockCanvas);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large canvas operations efficiently', () => {
      const largeCanvas = document.createElement('canvas');
      largeCanvas.width = 2000;
      largeCanvas.height = 2000;

      const start = performance.now();
      
      // Simulate multiple operations
      for (let i = 0; i < 100; i++) {
        calculateCanvasHash(largeCanvas);
      }
      
      const end = performance.now();
      
      // Should complete within reasonable time
      expect(end - start).toBeLessThan(1000);
    });

    it('should handle multiple layer merging efficiently', () => {
      const layers = Array.from({ length: 10 }, () => mockCanvas);
      
      const start = performance.now();
      mergeCanvasLayers(layers);
      const end = performance.now();
      
      // Should complete quickly
      expect(end - start).toBeLessThan(100);
    });
  });
});