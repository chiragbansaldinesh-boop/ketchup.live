import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface KetchupSplashScreenProps {
  onComplete?: () => void;
}

export default function KetchupSplashScreen({ onComplete }: KetchupSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;
  
  const particles = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    particles.current = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }));
  }, []);

  // Animate particles
  const animateParticles = () => {
    particles.current.forEach((particle) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: false,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.6 + 0.2,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
        ]).start(() => animateParticle());
      };
      animateParticle();
    });
  };

  // Main animation sequence
  useEffect(() => {
    // Start particle animation
    animateParticles();

    // Main sequence
    const sequence = Animated.sequence([
      // Initial fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: 1.1,
          duration: 8000,
          useNativeDriver: true,
        }),
      ]),
      
      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Text fade in
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      
      // Tagline fade in
      Animated.timing(taglineFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Flicker effect (continuous)
    const flickerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    sequence.start();
    flickerLoop.start();

    // Auto complete after 8 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 8000);

    return () => {
      clearTimeout(timer);
      flickerLoop.stop();
    };
  }, []);

  const KetchupBottle = () => (
    <Animated.View
      style={[
        styles.bottleContainer,
        {
          opacity: flickerAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Svg width="120" height="200" viewBox="0 0 120 220">
        <Defs>
          <Filter id="glow">
            <FeGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <FeMerge>
              <FeMergeNode in="coloredBlur"/>
              <FeMergeNode in="SourceGraphic"/>
            </FeMerge>
          </Filter>
        </Defs>
        
        {/* Bottle cap - wider and more detailed */}
        <Path
          d="M35 15 L85 15 C90 15 90 20 90 25 L90 35 C90 40 85 40 85 40 L35 40 C30 40 30 35 30 35 L30 25 C30 20 35 15 35 15 Z"
          stroke="#FF3333"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Bottle neck - narrower transition */}
        <Path
          d="M45 40 L45 50 C45 55 50 55 50 55 L70 55 C75 55 75 50 75 50 L75 40"
          stroke="#FF3333"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Main bottle body - classic ketchup bottle shape */}
        <Path
          d="M50 55 C40 55 30 65 25 80 L25 170 C25 185 35 195 50 195 L70 195 C85 195 95 185 95 170 L95 80 C90 65 80 55 70 55 L50 55 Z"
          stroke="#FF3333"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Ketchup drip inside bottle */}
        <Path
          d="M60 70 C50 70 40 80 40 90 L40 160 C40 170 50 180 60 180 C70 180 80 170 80 160 L80 90 C80 80 70 70 60 70 Z M55 85 C58 82 62 82 65 85"
          stroke="#FF3333"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          opacity="0.8"
        />
      </Svg>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background with texture */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']}
        style={styles.background}
      />
      
      {/* Particles */}
      {particles.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: [{ scale: particle.scale }],
            },
          ]}
        />
      ))}
      
      {/* Main content with zoom effect */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: zoomAnim }],
          },
        ]}
      >
        {/* Ketchup bottle */}
        <KetchupBottle />
        
        {/* Glow effect behind bottle */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim,
            },
          ]}
        />
        
        {/* App name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
            },
          ]}
        >
          <Text style={styles.appName}>Ketchup.live</Text>
          <View style={styles.textGlow} />
        </Animated.View>
        
        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineFadeAnim,
            },
          ]}
        >
          <Text style={styles.tagline}>Scan. Meet. Play. Connect.</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF3333',
    opacity: 0.1,
    top: -20,
  },
  textContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#FF3333',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  textGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF3333',
    opacity: 0.3,
    borderRadius: 10,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  taglineContainer: {
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '300',
    opacity: 0.9,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FF6666',
    borderRadius: 1,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});