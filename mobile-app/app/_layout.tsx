import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { initializeTokenManager } from '../src/services/api';
import { AppProvider, useApp } from '../src/contexts/AppContext';
import { Colors } from '../src/constants/colors';

// NativeWind CSS import'u kaldırıldı - mobil uygulama StyleSheet kullanıyor

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === '(tabs)';
    const inLoginGroup = firstSegment === 'login' || firstSegment === 'register';
    const hasNoSegment = !firstSegment;

    if (!isAuthenticated) {
      // User is not authenticated
      if (inAuthGroup || hasNoSegment) {
        // User is trying to access protected routes or app just opened
        router.replace('/login');
      }
    } else {
      // User is authenticated
      if (inLoginGroup || (hasNoSegment && !inAuthGroup)) {
        // User is on login/register page or app just opened (authenticated)
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  // Initialize token manager on app start
  useEffect(() => {
    initializeTokenManager().catch((error) => {
      if (__DEV__) {
        console.error('[RootLayout] Error initializing token manager:', error);
      }
    });
  }, []);

  // Web için basit wrapper, native için full wrapper
  const Wrapper = Platform.OS === 'web' 
    ? View
    : GestureHandlerRootView;

  const wrapperStyle = Platform.OS === 'web' 
    ? { flex: 1 }
    : { flex: 1 };

  return (
    <AppProvider>
      <Wrapper style={wrapperStyle}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </SafeAreaProvider>
      </Wrapper>
    </AppProvider>
  );
}

