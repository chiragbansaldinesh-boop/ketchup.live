import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { Crown, Check, Zap, Eye, MapPin, Star } from 'lucide-react-native';

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

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Ketchup Premium',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Upgrade to Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock exclusive features and get the most out of Ketchup
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Check size={20} color="#10B981" />
            </View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={[
                    styles.planTitle,
                    selectedPlan === plan.id && styles.selectedPlanText,
                  ]}>
                    {plan.title}
                  </Text>
                  {plan.savings && (
                    <View style={styles.savingsTag}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.planPricing}>
                  <Text style={[
                    styles.planPrice,
                    selectedPlan === plan.id && styles.selectedPlanText,
                  ]}>
                    {plan.price}
                  </Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
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

        <View style={styles.footer}>
          <TouchableOpacity style={styles.upgradeButton}>
            <Crown size={20} color="#FFFFFF" />
            <Text style={styles.upgradeButtonText}>
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Cancel anytime. Subscription automatically renews unless cancelled.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedPlan: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginRight: 12,
  },
  selectedPlanText: {
    color: '#F59E0B',
  },
  savingsTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
  },
  planPeriod: {
    fontSize: 14,
    color: '#6B7280',
  },
  planSelector: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  selectedSelector: {
    borderColor: '#F59E0B',
  },
  selectorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});