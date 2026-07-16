// src/app/_layout.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right', 
          
          // THIS PROP FIXES THE WHITE FLASH:
          // It paints the underlying native window dark so the transition looks seamless.
          contentStyle: { backgroundColor: '#0D1117' }, 
        }} 
      />
    </SafeAreaProvider>
  );
}