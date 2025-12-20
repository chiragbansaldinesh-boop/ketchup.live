import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Check, Crown } from 'lucide-react-native';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  isPopular: boolean;
  savings?: string;
}

const plans: Plan[] = [
  {
    id: 'day',
    name: 'Daily Pass',
    price: '₹99',
    period: 'per day',
    isPopular: false,
  },
  {
    id: 'month',
    name: 'Monthly',
    price: '₹1,999',
    period: 'per month',
    isPopular: true,
    savings: 'Save 33%',
  },
  {
    id: 'year',
    name: 'Yearly',
    price: '₹9,999',
    period: 'per year',
    isPopular: false,
    savings: 'Save 58%',
  },
];

const features = [
  'Unlimited likes and super likes',
  'See who liked you',
  'Advanced filters',
  'Priority profile visibility',
  'Rewind last swipe',
  'Ad-free experience',
  'Exclusive venue perks',
  'Premium badge on profile',
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('month');

  const handleSubscribe = () => {
    console.log('Subscribe to:', selectedPlan);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.crownIcon}>
            <Crown size={48} color="#D50000" fill="#D50000" />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Get the most out of Ketchup with premium access
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.isPopular && styles.planCardPopular,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.radioButton}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What's Included</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.checkIcon}>
                <Check size={18} color="#D50000" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy. Subscription automatically renews unless cancelled 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>Go Premium</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  crownIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#D50000',
    backgroundColor: '#FFF5F5',
  },
  planCardPopular: {
    borderColor: '#D50000',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#D50000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D50000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D50000',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D50000',
  },
  planPeriod: {
    fontSize: 16,
    color: '#6B7280',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  termsSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  subscribeButton: {
    backgroundColor: '#D50000',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#D50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
