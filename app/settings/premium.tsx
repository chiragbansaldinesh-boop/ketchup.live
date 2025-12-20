import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, Zap, Eye, MapPin, Star, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: <Zap size={24} color="#F59E0B" />,
    title: 'Unlimited Boosts',
    description: 'Appear first in venue pools anytime',
  },
  {
    icon: <Eye size={24} color="#F59E0B" />,
    title: 'See Who Liked You',
    description: 'View your admirers before swiping',
  },
  {
    icon: <MapPin size={24} color="#F59E0B" />,
    title: 'Venue History',
    description: 'Access detailed venue analytics',
  },
  {
    icon: <Star size={24} color="#F59E0B" />,
    title: 'Priority Support',
    description: 'Get help faster with premium support',
  },
];

const plans = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
    savings: null,
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$59.99',
    period: '/year',
    savings: 'Save 50%',
  },
];

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#E10600', '#FF6B6B']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFDF9" />
            </TouchableOpacity>
          </View>

          <Animated.View 
            style={[
              styles.content,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.hero}>
              <Crown size={64} color="#FFFDF9" fill="#FFFDF9" />
              <Text style={styles.heroTitle}>Be seen more.{'\n'}Meet better.</Text>
              <Text style={styles.heroSubtitle}>
                Unlock the full Ketchup experience
              </Text>
            </View>

            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                // Reveal plans on scroll
              }}
            >
              <View style={styles.plansContainer}>
                {plans.map((plan) => (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      selectedPlan === plan.id && styles.selectedPlan,
                    ]}
                    onPress={() => setSelectedPlan(plan.id)}
                  >
                    <View style={styles.planContent}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                      {plan.savings && (
                        <View style={styles.savingsTag}>
                          <Text style={styles.savingsText}>{plan.savings}</Text>
                        </View>
                      )}
                    </View>
                    <View style={[
                      styles.planSelector,
                      selectedPlan === plan.id && styles.selectedSelector,
                    ]}>
                      {selectedPlan === plan.id && (
                        <View style={styles.selectorDot} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.featuresContainer}>
                {premiumFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIcon}>{feature.icon}</View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Unlock Ketchup+</Text>
              </TouchableOpacity>
              
              <Text style={styles.disclaimer}>
                Cancel anytime. Auto-renews unless cancelled.
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,253,249,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFDF9',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,253,249,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContent: {
    flex: 1,
  },
  plansContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  planCard: {
    backgroundColor: 'rgba(255,253,249,0.15)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,253,249,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPlan: {
    backgroundColor: 'rgba(255,253,249,0.25)',
    borderColor: '#FFFDF9',
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFDF9',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFDF9',
    marginBottom: 2,
  },
  planPeriod: {
    fontSize: 14,
    color: 'rgba(255,253,249,0.7)',
    marginBottom: 8,
  },
  savingsTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 10,
    color: '#FFFDF9',
    fontWeight: '700',
  },
  planSelector: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,253,249,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSelector: {
    borderColor: '#FFFDF9',
  },
  selectorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFDF9',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,253,249,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,253,249,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFDF9',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: 'rgba(255,253,249,0.7)',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  upgradeButton: {
    backgroundColor: '#FFFDF9',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  upgradeButtonText: {
    color: '#E10600',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,253,249,0.6)',
    textAlign: 'center',
    lineHeight: 15,
  },
});