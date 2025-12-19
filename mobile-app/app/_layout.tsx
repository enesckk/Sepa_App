import React from 'react';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// NativeWind CSS import'u kaldırıldı - mobil uygulama StyleSheet kullanıyor

export default function RootLayout() {
  // Web için basit wrapper, native için full wrapper
  const Wrapper = Platform.OS === 'web' 
    ? View
    : GestureHandlerRootView;

  const wrapperStyle = Platform.OS === 'web' 
    ? { flex: 1 }
    : { flex: 1 };

  return (
    <Wrapper style={wrapperStyle}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
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
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </Wrapper>
  );
}

