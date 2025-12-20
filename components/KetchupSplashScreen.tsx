import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import KetchupBottleIcon from './KetchupBottleIcon';

interface KetchupSplashScreenProps {
  onComplete: () => void;
}

export default function KetchupSplashScreen({ onComplete }: KetchupSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <KetchupBottleIcon size={120} color="#FFFFFF" fill="#FFFFFF" />
        <Text style={styles.title}>Ketchup</Text>
        <Text style={styles.subtitle}>Real Connections, Nearby</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E10600',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.95,
    marginTop: 12,
    fontWeight: '500',
  },
});
