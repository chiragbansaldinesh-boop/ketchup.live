import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface KetchupSplashProps {
  visible: boolean;
  onComplete: () => void;
}

export default function KetchupSplash({ visible, onComplete }: KetchupSplashProps) {
  const splashAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(splashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(onComplete, 500);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.splash,
          {
            opacity: splashAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.ketchupDrop} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  splash: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ketchupDrop: {
    width: 60,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 30,
    transform: [{ rotate: '-15deg' }],
  },
});
</action>