/**
 * Optimized Image Component
 * Uses Expo Image for better performance and caching
 */

import React from 'react';
import { Image, ImageProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image as ExpoImage, ImageSource } from 'expo-image';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: ImageSource | string | number;
  placeholder?: ImageSource | string | number;
  contentFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  transition?: number;
  showLoading?: boolean;
  fallback?: boolean; // Use React Native Image as fallback
}

/**
 * Optimized Image Component
 * Automatically uses Expo Image for better performance, with fallback to React Native Image
 */
export function OptimizedImage({
  source,
  placeholder,
  contentFit = 'cover',
  transition = 200,
  showLoading = false,
  fallback = false,
  style,
  ...props
}: OptimizedImageProps) {
  // If fallback is requested or source is a local require, use React Native Image
  if (fallback || typeof source === 'number') {
    return <Image source={source as any} style={style} {...props} />;
  }

  // Convert string URLs to proper format
  const imageSource = typeof source === 'string' 
    ? { uri: source }
    : source;

  const placeholderSource = placeholder
    ? (typeof placeholder === 'string' ? { uri: placeholder } : placeholder)
    : undefined;

  return (
    <View style={[styles.container, style]}>
      <ExpoImage
        source={imageSource}
        placeholder={placeholderSource}
        contentFit={contentFit === 'scale-down' ? 'contain' : contentFit}
        transition={transition}
        style={StyleSheet.absoluteFillObject}
        cachePolicy="memory-disk"
      />
      {showLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2E7D32" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

/**
 * Hook to get optimized image source
 */
export function useOptimizedImageSource(uri: string | null | undefined): ImageSource | null {
  if (!uri) return null;
  
  // If it's a relative path, prepend base URL
  if (uri.startsWith('/')) {
    const { API_CONFIG } = require('../services/api/config');
    return { uri: `${API_CONFIG.BASE_URL.replace('/api', '')}${uri}` };
  }
  
  return { uri };
}

