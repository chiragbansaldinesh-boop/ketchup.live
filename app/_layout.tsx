import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, StyleSheet } from 'react-native';
import KetchupSplashScreen from '@/components/KetchupSplashScreen';

export default function RootLayout() {
  useFrameworkReady();

  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <KetchupSplashScreen onComplete={handleSplashComplete} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/blocked-users" />
        <Stack.Screen name="settings/hidden-venues" />
        <Stack.Screen name="settings/privacy-policy" />
        <Stack.Screen name="settings/safety-tips" />
        <Stack.Screen name="settings/premium" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});
