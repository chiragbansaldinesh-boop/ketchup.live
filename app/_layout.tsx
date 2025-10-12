import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, skip authentication and go directly to the app
    setIsLoading(false);
    setUser({ id: 'demo-user' }); // Demo user for testing
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});
