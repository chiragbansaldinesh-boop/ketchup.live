import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import KetchupLogo from './KetchupLogo';

const { width, height } = Dimensions.get('window');

interface KetchupSplashScreenProps {
  onComplete: () => void;
}

interface LetterProps {
  letter: string;
  index: number;
  totalLetters: number;
}

function AnimatedLetter({ letter, index, totalLetters }: LetterProps) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotation = useSharedValue(-20);

  useEffect(() => {
    const delay = 400 + index * 80;

    translateY.value = withDelay(delay, withSpring(0, { damping: 12, stiffness: 100 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 120 }));
    rotation.value = withDelay(delay, withSpring(0, { damping: 8, stiffness: 80 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.letter, animatedStyle]}>
      {letter}
    </Animated.Text>
  );
}

interface ParticleProps {
  delay: number;
  startX: number;
  startY: number;
  size: number;
}

function FloatingParticle({ delay, startX, startY, size }: ParticleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.4, { duration: 500 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-100, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.random() * 40 - 20, { duration: 1500 }),
          withTiming(Math.random() * 40 - 20, { duration: 1500 })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000 }),
          withTiming(0.1, { duration: 2000 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function KetchupSplashScreen({ onComplete }: KetchupSplashScreenProps) {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const backgroundHue = useSharedValue(0);
  const exitScale = useSharedValue(1);

  const letters = 'Ketchup'.split('');

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: 200 + Math.random() * 1000,
      startX: Math.random() * width,
      startY: height * 0.6 + Math.random() * (height * 0.4),
      size: 8 + Math.random() * 16,
    }));
  }, []);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    subtitleTranslateY.value = withDelay(1000, withSpring(0, { damping: 15 }));

    backgroundHue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    const exitTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onComplete)();
      });
      exitScale.value = withTiming(1.1, { duration: 500, easing: Easing.out(Easing.quad) });
    }, 3000);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: exitScale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundHue.value,
      [0, 0.5, 1],
      ['#E10600', '#C70039', '#E10600']
    );
    return { backgroundColor };
  });

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]} />

      <View style={styles.gradientOverlay} />

      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          delay={particle.delay}
          startX={particle.startX}
          startY={particle.startY}
          size={particle.size}
        />
      ))}

      <View style={styles.content}>
        <Animated.View style={logoContainerStyle}>
          <KetchupLogo size={140} animate={true} />
        </Animated.View>

        <View style={styles.titleContainer}>
          {letters.map((letter, index) => (
            <AnimatedLetter
              key={index}
              letter={letter}
              index={index}
              totalLetters={letters.length}
            />
          ))}
        </View>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Real Connections, Nearby
        </Animated.Text>
      </View>

      <View style={styles.bottomGlow} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E10600',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  letter: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.95,
    marginTop: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'transparent',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: -50 },
    shadowOpacity: 0.1,
    shadowRadius: 100,
  },
});
