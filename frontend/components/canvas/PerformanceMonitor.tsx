'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  queueStatus?: {
    queueLength: number;
    isProcessing: boolean;
  };
  historyInfo?: {
    undoCount: number;
    redoCount: number;
    canUndo: boolean;
    canRedo: boolean;
  };
  activeUserCount: number;
}

interface PerformanceMonitorProps {
  getMetrics: () => PerformanceMetrics;
  isVisible?: boolean;
}

export function PerformanceMonitor({ getMetrics, isVisible = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [fps, setFps] = useState(0);

  // Update metrics periodically
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getMetrics, isVisible]);

  // FPS monitoring
  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible]);

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div className="text-green-400 font-bold">Performance Monitor</div>
        
        <div>FPS: <span className="text-yellow-400">{fps}</span></div>
        
        <div>Active Users: <span className="text-blue-400">{metrics.activeUserCount}</span></div>
        
        {metrics.queueStatus && (
          <div>
            Queue: <span className="text-purple-400">{metrics.queueStatus.queueLength}</span>
            {metrics.queueStatus.isProcessing && <span className="text-red-400 ml-1">Processing</span>}
          </div>
        )}
        
        {metrics.historyInfo && (
          <div>
            History: <span className="text-cyan-400">{metrics.historyInfo.undoCount}</span>/
            <span className="text-cyan-400">{metrics.historyInfo.redoCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for toggling performance monitor
export function usePerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { isVisible, setIsVisible };
}