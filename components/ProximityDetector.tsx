import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Users, Navigation } from 'lucide-react-native';
import { useLocationTracking } from '@/hooks/useLocationTracking';

interface ProximityDetectorProps {
  cafeLocation: {
    latitude: number;
    longitude: number;
  };
  onShowNearbyPeople: () => void;
  radiusMeters: number;
}

export default function ProximityDetector({
  cafeLocation,
  onShowNearbyPeople,
  radiusMeters,
}: ProximityDetectorProps) {
  const { isWithinCafe, distance, error } = useLocationTracking({
    cafeLocation,
    radiusMeters,
  });

  const [nearbyCount] = useState(12);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MapPin size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorText}>
            Please enable location services to see nearby people
          </Text>
        </View>
      </View>
    );
  }

  if (distance === null) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D50000" />
          <Text style={styles.loadingText}>Detecting your location...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isWithinCafe ? (
        <View style={styles.insideCafe}>
          <View style={styles.iconContainer}>
            <Users size={64} color="#10B981" />
          </View>
          <Text style={styles.title}>You're at the café!</Text>
          <Text style={styles.subtitle}>
            {nearbyCount} people are nearby and ready to connect
          </Text>
          <View style={styles.distanceContainer}>
            <Navigation size={20} color="#10B981" />
            <Text style={styles.distanceText}>
              Within {radiusMeters}m radius
            </Text>
          </View>
          <TouchableOpacity
            style={styles.showPeopleButton}
            onPress={onShowNearbyPeople}
          >
            <Text style={styles.showPeopleText}>See Nearby People</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.outsideCafe}>
          <View style={styles.iconContainer}>
            <MapPin size={64} color="#6B7280" />
          </View>
          <Text style={styles.title}>Not at the café</Text>
          <Text style={styles.subtitle}>
            Visit the café to connect with people nearby
          </Text>
          <View style={styles.distanceContainer}>
            <Navigation size={20} color="#D50000" />
            <Text style={[styles.distanceText, styles.distanceTextAway]}>
              {Math.round(distance)}m away
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Head to the café to start meeting people who are there right now
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  insideCafe: {
    alignItems: 'center',
    width: '100%',
  },
  outsideCafe: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 32,
  },
  distanceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  distanceTextAway: {
    color: '#D50000',
  },
  showPeopleButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#D50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  showPeopleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});
