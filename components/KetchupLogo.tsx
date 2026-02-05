import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedG = Animated.createAnimatedComponent(G);

interface KetchupLogoProps {
  size?: number;
  animate?: boolean;
}

export default function KetchupLogo({ size = 140, animate = true }: KetchupLogoProps) {
  const bottleScale = useSharedValue(0);
  const bottleRotation = useSharedValue(-15);
  const drip1Y = useSharedValue(0);
  const drip2Y = useSharedValue(0);
  const drip3Y = useSharedValue(0);
  const drip1Opacity = useSharedValue(0);
  const drip2Opacity = useSharedValue(0);
  const drip3Opacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const bottleBounce = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      bottleScale.value = 1;
      bottleRotation.value = 0;
      return;
    }

    bottleScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    bottleRotation.value = withSpring(0, { damping: 8, stiffness: 80 });

    bottleBounce.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 400, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      )
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    const startDripAnimation = (
      dripY: Animated.SharedValue<number>,
      dripOpacity: Animated.SharedValue<number>,
      delay: number
    ) => {
      dripOpacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
      dripY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(30, { duration: 800, easing: Easing.in(Easing.quad) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
      dripOpacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 200 }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
    };

    startDripAnimation(drip1Y, drip1Opacity, 800);
    startDripAnimation(drip2Y, drip2Opacity, 1200);
    startDripAnimation(drip3Y, drip3Opacity, 1600);
  }, [animate]);

  const bottleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bottleScale.value },
      { rotate: `${bottleRotation.value}deg` },
      { translateY: bottleBounce.value },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: interpolate(glowScale.value, [1, 1.1], [0.3, 0.5]),
  }));

  const drip1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: drip1Y.value }],
    opacity: drip1Opacity.value,
  }));

  const drip2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: drip2Y.value }],
    opacity: drip2Opacity.value,
  }));

  const drip3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: drip3Y.value }],
    opacity: drip3Opacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.glow, glowAnimatedStyle, { width: size * 1.4, height: size * 1.4 }]} />

      <Animated.View style={bottleAnimatedStyle}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="55" r="38" fill="rgba(255,255,255,0.1)" />

          <G>
            <Path
              d="M42 8 L58 8 L58 16 L42 16 Z"
              fill="#8B0000"
              stroke="#5C0000"
              strokeWidth="1"
            />
            <Path
              d="M42 8 L58 8 L56 12 L44 12 Z"
              fill="#A52A2A"
            />

            <Path
              d="M40 16 L60 16 L60 24 Q60 26 58 26 L42 26 Q40 26 40 24 Z"
              fill="#CD5C5C"
              stroke="#8B0000"
              strokeWidth="1"
            />
            <Path
              d="M40 16 L60 16 L58 20 L42 20 Z"
              fill="#E77070"
            />

            <Path
              d="M42 26 L42 32 Q35 36 35 44 L35 80 Q35 88 42 88 L58 88 Q65 88 65 80 L65 44 Q65 36 58 32 L58 26"
              fill="#E10600"
              stroke="#8B0000"
              strokeWidth="1.5"
            />

            <Path
              d="M42 26 L42 32 Q35 36 35 44 L35 50 L65 50 L65 44 Q65 36 58 32 L58 26"
              fill="#FF2020"
            />

            <Ellipse cx="50" cy="66" rx="22" ry="14" fill="rgba(255,255,255,0.15)" />
            <Ellipse cx="50" cy="66" rx="18" ry="10" fill="rgba(255,255,255,0.9)" />
            <Path
              d="M38 63 Q50 58 62 63 L60 70 Q50 75 40 70 Z"
              fill="#E10600"
            />

            <Path
              d="M38 80 L62 80"
              stroke="rgba(139, 0, 0, 0.3)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <Path
              d="M40 84 L60 84"
              stroke="rgba(139, 0, 0, 0.3)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            <Ellipse cx="42" cy="50" rx="3" ry="8" fill="rgba(255,255,255,0.25)" />
          </G>
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.drip, { left: size * 0.35, top: size * 0.85 }, drip1Style]}>
        <Svg width={12} height={20} viewBox="0 0 12 20">
          <Path
            d="M6 0 Q6 8 3 12 Q0 16 6 20 Q12 16 9 12 Q6 8 6 0"
            fill="#E10600"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.drip, { left: size * 0.5, top: size * 0.88 }, drip2Style]}>
        <Svg width={10} height={16} viewBox="0 0 10 16">
          <Path
            d="M5 0 Q5 6 2.5 9 Q0 12 5 16 Q10 12 7.5 9 Q5 6 5 0"
            fill="#E10600"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.drip, { left: size * 0.58, top: size * 0.83 }, drip3Style]}>
        <Svg width={8} height={14} viewBox="0 0 8 14">
          <Path
            d="M4 0 Q4 5 2 7 Q0 10 4 14 Q8 10 6 7 Q4 5 4 0"
            fill="#E10600"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  drip: {
    position: 'absolute',
  },
});
