import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

// Sentry 配置
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // 性能监控
      integrations: [
        new BrowserTracing({
          // 自动追踪页面导航
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
      ],
      
      // 采样率配置
      tracesSampleRate: 0.1, // 10% 的事务被追踪
      profilesSampleRate: 0.1, // 10% 的事务被性能分析
      
      // 错误过滤
      beforeSend(event, hint) {
        // 过滤掉开发环境错误
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        
        // 过滤掉网络错误
        if (event.exception) {
          const error = hint.originalException;
          if (error instanceof TypeError && error.message.includes('fetch')) {
            return null;
          }
        }
        
        return event;
      },
      
      // 用户上下文
      initialScope: {
        tags: {
          component: 'web3-painting-platform',
        },
      },
    });
  }
};

// Web3 错误追踪
export const trackWeb3Error = (error: Error, context: {
  action: string;
  contractAddress?: string;
  transactionHash?: string;
  userAddress?: string;
}) => {
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'web3');
    scope.setContext('web3_context', context);
    
    if (context.userAddress) {
      scope.setUser({ id: context.userAddress });
    }
    
    Sentry.captureException(error);
  });
};

// 画布操作错误追踪
export const trackCanvasError = (error: Error, context: {
  canvasId: string;
  operation: string;
  userCount: number;
}) => {
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'canvas');
    scope.setContext('canvas_context', context);
    Sentry.captureException(error);
  });
};

// 性能指标追踪
export const trackPerformanceMetric = (name: string, value: number, unit: string = 'ms') => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${value}${unit}`,
    level: 'info',
    data: {
      metric: name,
      value,
      unit,
    },
  });
};

// 用户行为追踪
export const trackUserAction = (action: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'user_action',
    message: action,
    level: 'info',
    data,
  });
};

// 业务指标追踪
export const trackBusinessMetric = (metric: string, value: number, metadata?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    scope.setTag('metric_type', 'business');
    scope.setContext('business_metric', {
      metric,
      value,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
    
    Sentry.captureMessage(`Business Metric: ${metric} = ${value}`, 'info');
  });
};