import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Redirect to the main index screen
import { router } from 'expo-router';

export default function DiscoverScreen() {
  useEffect(() => {
    // Redirect to the main discover screen
    router.replace('/');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});