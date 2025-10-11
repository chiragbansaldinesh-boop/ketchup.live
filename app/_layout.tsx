import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User } from '@supabase/supabase-js';
import { supabaseAuthService } from '@/services/supabaseAuthService';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabaseAuthService.getSession().then((session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const subscription = supabaseAuthService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
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
