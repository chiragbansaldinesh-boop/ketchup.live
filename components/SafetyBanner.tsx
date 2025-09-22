import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';

interface SafetyBannerProps {
  onDismiss?: () => void;
}

export default function SafetyBanner({ onDismiss }: SafetyBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Shield size={20} color="#E53935" />
        <View style={styles.textContent}>
          <Text style={styles.title}>Stay Safe</Text>
          <Text style={styles.description}>
            Meet in public places and trust your instincts. Report any concerning behavior.
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => router.push('/settings/safety-tips')}
        >
          <Text style={styles.learnMoreText}>Safety Tips</Text>
          <ExternalLink size={12} color="#E53935" />
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  textContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  learnMoreText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
    marginRight: 4,
  },
  dismissButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dismissText: {
    fontSize: 12,
    color: '#7F1D1D',
    fontWeight: '500',
  },
});