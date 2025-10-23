import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';
import { trackPerformanceMetric } from './sentry';

// Web Vitals 指标追踪
export const initWebVitals = () => {
  if (typeof window !== 'undefined') {
    // 累积布局偏移
    getCLS((metric) => {
      reportWebVital(metric);
    });
    
    // 首次输入延迟
    getFID((metric) => {
      reportWebVital(metric);
    });
    
    // 首次内容绘制
    getFCP((metric) => {
      reportWebVital(metric);
    });
    
    // 最大内容绘制
    getLCP((metric) => {
      reportWebVital(metric);
    });
    
    // 首字节时间
    getTTFB((metric) => {
      reportWebVital(metric);
    });
  }
};

// 上报 Web Vitals 指标
const reportWebVital = (metric: Metric) => {
  // 发送到 Sentry
  trackPerformanceMetric(metric.name, metric.value);
  
  // 发送到 Vercel Analytics
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
    window.va?.track('Web Vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
  
  // 发送到 Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

// 自定义性能指标
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private timers: Map<string, number> = new Map();
  
  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }
  
  // 开始计时
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }
  
  // 结束计时并上报
  endTimer(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer ${name} not found`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    // 上报性能指标
    trackPerformanceMetric(name, duration);
    
    // 记录到控制台 (开发环境)
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`, metadata);
    }
    
    return duration;
  }
  
  // 测量函数执行时间
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }
  
  // 测量同步函数执行时间
  measure<T>(name: string, fn: () => T): T {
    this.startTimer(name);
    try {
      const result = fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }
}

// Web3 性能监控
export const trackWeb3Performance = {
  // 钱包连接时间
  walletConnection: (duration: number) => {
    trackPerformanceMetric('wallet_connection_time', duration);
  },
  
  // 交易确认时间
  transactionConfirmation: (duration: number, transactionHash: string) => {
    trackPerformanceMetric('transaction_confirmation_time', duration);
  },
  
  // 合约调用时间
  contractCall: (duration: number, contractAddress: string, method: string) => {
    trackPerformanceMetric(`contract_call_${method}`, duration);
  },
  
  // NFT 加载时间
  nftLoading: (duration: number, tokenCount: number) => {
    trackPerformanceMetric('nft_loading_time', duration);
  },
};

// 画布性能监控
export const trackCanvasPerformance = {
  // 画布初始化时间
  initialization: (duration: number) => {
    trackPerformanceMetric('canvas_initialization', duration);
  },
  
  // 绘画操作延迟
  drawingLatency: (duration: number) => {
    trackPerformanceMetric('drawing_latency', duration);
  },
  
  // 同步延迟
  syncLatency: (duration: number, userCount: number) => {
    trackPerformanceMetric('canvas_sync_latency', duration);
  },
  
  // 渲染性能
  renderTime: (duration: number, objectCount: number) => {
    trackPerformanceMetric('canvas_render_time', duration);
  },
};

// 资源加载监控
export const trackResourceLoading = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // 获取资源加载时间
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // 页面加载时间
      trackPerformanceMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
      
      // DOM 构建时间
      trackPerformanceMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      
      // 资源加载统计
      const imageResources = resources.filter(r => r.initiatorType === 'img');
      const scriptResources = resources.filter(r => r.initiatorType === 'script');
      const styleResources = resources.filter(r => r.initiatorType === 'link');
      
      if (imageResources.length > 0) {
        const avgImageLoadTime = imageResources.reduce((sum, r) => sum + r.duration, 0) / imageResources.length;
        trackPerformanceMetric('avg_image_load_time', avgImageLoadTime);
      }
      
      if (scriptResources.length > 0) {
        const avgScriptLoadTime = scriptResources.reduce((sum, r) => sum + r.duration, 0) / scriptResources.length;
        trackPerformanceMetric('avg_script_load_time', avgScriptLoadTime);
      }
    });
  }
};

// 内存使用监控
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    
    setInterval(() => {
      trackPerformanceMetric('memory_used', memory.usedJSHeapSize / 1024 / 1024, 'MB');
      trackPerformanceMetric('memory_total', memory.totalJSHeapSize / 1024 / 1024, 'MB');
      trackPerformanceMetric('memory_limit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
    }, 30000); // 每30秒检查一次
  }
};