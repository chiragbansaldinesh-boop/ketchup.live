import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import KetchupSplashScreen from '@/components/KetchupSplashScreen';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Navigate to main app
    router.replace('/(tabs)');
  };

  if (showSplash) {
    return <KetchupSplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <View style={styles.container}>
      {/* This won't be shown as we navigate away */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});