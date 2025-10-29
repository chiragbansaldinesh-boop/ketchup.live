import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SafetyBanner() {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/settings/safety-tips')}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Shield size={20} color="#3B82F6" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Stay Safe</Text>
        <Text style={styles.subtitle}>
          Always meet in public places and follow safety guidelines
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 16,
  },
});
