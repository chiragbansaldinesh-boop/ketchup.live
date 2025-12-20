import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Shield, CircleCheck as CheckCircle, Calendar } from 'lucide-react-native';
import { privacyService } from '@/services/privacyService';
import { PrivacyPolicy } from '@/types/privacy';

export default function PrivacyPolicyScreen() {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const policyData = await privacyService.getPrivacyPolicy();
      setPolicy(policyData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load privacy policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPolicy = async () => {
    if (!policy) return;

    setAccepting(true);
    try {
      await privacyService.acceptPrivacyPolicy();
      setHasAccepted(true);
      Alert.alert(
        'Privacy Policy Accepted',
        'Thank you for reviewing and accepting our privacy policy.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record acceptance. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Privacy Policy',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D50000" />
          <Text style={styles.loadingText}>Loading privacy policy...</Text>
        </View>
      </>
    );
  }

  if (!policy) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Privacy Policy',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          }} 
        />
        <View style={styles.errorContainer}>
          <Shield size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Unable to Load Policy</Text>
          <Text style={styles.errorText}>
            Please check your connection and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPrivacyPolicy}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Privacy Policy',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Shield size={32} color="#D50000" />
            </View>
            <Text style={styles.title}>Privacy Policy</Text>
            <View style={styles.versionInfo}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.versionText}>
                Version {policy.version} • Last updated {policy.lastUpdated}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.introduction}>
              At Ketchup.live, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This policy explains how we 
              collect, use, and safeguard your data.
            </Text>

            {policy.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <View key={section.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionContent}>{section.content}</Text>
                </View>
              ))}

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <Text style={styles.sectionContent}>
                If you have any questions about this Privacy Policy, please contact us at:
                {'\n\n'}
                Email: privacy@ketchup.live
                {'\n'}
                Address: 123 Privacy Street, San Francisco, CA 94102
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {hasAccepted ? (
            <View style={styles.acceptedContainer}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.acceptedText}>Policy Accepted</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.acceptButton, accepting && styles.acceptButtonDisabled]}
              onPress={handleAcceptPolicy}
              disabled={accepting}
            >
              {accepting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.acceptButtonText}>I Accept This Policy</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  introduction: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 32,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D50000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  acceptButton: {
    backgroundColor: '#D50000',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  acceptedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  acceptedText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
});