import type { CanvasOperation } from '../../types';

interface QueuedOperation {
  operation: CanvasOperation;
  timestamp: number;
  retryCount: number;
}

export class OperationQueue {
  private queue: QueuedOperation[] = [];
  private isProcessing = false;
  private batchSize = 10;
  private batchInterval = 100; // ms
  private maxRetries = 3;
  private onBatchProcess?: (operations: CanvasOperation[]) => Promise<void>;

  constructor(onBatchProcess?: (operations: CanvasOperation[]) => Promise<void>) {
    this.onBatchProcess = onBatchProcess;
  }

  // Add operation to queue
  enqueue(operation: CanvasOperation) {
    const queuedOp: QueuedOperation = {
      operation,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedOp);
    this.scheduleProcessing();
  }

  // Schedule batch processing
  private scheduleProcessing() {
    if (this.isProcessing) return;

    setTimeout(() => {
      this.processBatch();
    }, this.batchInterval);
  }

  // Process a batch of operations
  private async processBatch() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      // Get operations to process
      const operationsToProcess = this.queue.splice(0, this.batchSize);
      const operations = operationsToProcess.map(qop => qop.operation);

      // Process the batch
      if (this.onBatchProcess) {
        await this.onBatchProcess(operations);
      }

      // If there are more operations, schedule next batch
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    } catch (error) {
      console.error('Failed to process operation batch:', error);
      
      // Retry failed operations
      const failedOps = this.queue.splice(0, this.batchSize);
      failedOps.forEach(qop => {
        if (qop.retryCount < this.maxRetries) {
          qop.retryCount++;
          this.queue.unshift(qop); // Add back to front of queue
        }
      });
    } finally {
      this.isProcessing = false;
    }
  }

  // Get queue status
  getStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }

  // Clear queue
  clear() {
    this.queue = [];
    this.isProcessing = false;
  }

  // Set batch configuration
  setBatchConfig(batchSize: number, batchInterval: number) {
    this.batchSize = batchSize;
    this.batchInterval = batchInterval;
  }
}

// Debounced function utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttled function utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}