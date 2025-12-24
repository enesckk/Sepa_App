/**
 * Performance Monitoring Utilities
 * Basic performance tracking and monitoring
 */

import React from 'react';

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  fn: () => T,
  label?: string
): T {
  if (__DEV__) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    if (label) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  return fn();
}

/**
 * Measure async function execution time
 */
export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  if (__DEV__) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;
    
    if (label) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  return fn();
}

/**
 * Track screen render time
 */
export function trackScreenRender(screenName: string) {
  if (__DEV__) {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`[Performance] Screen ${screenName} rendered in ${duration.toFixed(2)}ms`);
    };
  }
  
  return () => {};
}

/**
 * Track API call performance
 */
export function trackApiCall(endpoint: string) {
  if (__DEV__) {
    const start = performance.now();
    
    return {
      end: () => {
        const end = performance.now();
        const duration = end - start;
        console.log(`[Performance] API ${endpoint}: ${duration.toFixed(2)}ms`);
      },
    };
  }
  
  return { end: () => {} };
}

/**
 * Memory usage tracker (basic)
 */
export function logMemoryUsage(label?: string) {
  if (__DEV__ && typeof performance !== 'undefined' && (performance as any).memory) {
    const memory = (performance as any).memory;
    const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
    const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
    
    console.log(
      `[Memory] ${label || 'Current'}: ${used}MB / ${total}MB (Limit: ${limit}MB)`
    );
  }
}

/**
 * Component render counter
 */
export function useRenderCount(componentName: string) {
  if (__DEV__) {
    const count = React.useRef(0);
    count.current += 1;
    
    React.useEffect(() => {
      console.log(`[Render] ${componentName} rendered ${count.current} times`);
    });
  }
}
