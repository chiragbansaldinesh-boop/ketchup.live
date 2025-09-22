import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MapPin, Users, CircleAlert as AlertCircle, Settings } from 'lucide-react-native';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { CafeLocation, formatDistance } from '@/utils/locationUtils';

interface ProximityDetectorProps {
  cafeLocation: CafeLocation;
  onShowNearbyPeople: () => void;
  radiusMeters?: number;
}

interface NearbyUser {
  id: string;
  name: string;
  photo: string;
  distance: number;
}

// Mock nearby users data
const mockNearbyUsers: NearbyUser[] = [
  {
    id: '1',
    name: 'Emma',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: 15,
  },
  {
    id: '2',
    name: 'Alex',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: 25,
  },
  {
    id: '3',
    name: 'Sophie',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: 35,
  },
];

export default function ProximityDetector({
  cafeLocation,
  onShowNearbyPeople,
  radiusMeters = 60,
}: ProximityDetectorProps) {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);

  const {
    userLocation,
    isWithinCafe,
    distance,
    isLoading,
    error,
    permissionStatus,
    requestPermissions,
  } = useLocationTracking({
    cafeLocation,
    radiusMeters,
    onEnterCafe: () => {
      console.log('User entered café area');
      showNearbyPeople();
    },
    onExitCafe: () => {
      console.log('User left café area');
      setNearbyUsers([]);
    },
  });

  const showNearbyPeople = async () => {
    try {
      // Simulate API call to fetch nearby users
      console.log('Fetching nearby users...');
      
      // In a real app, this would be an API call:
      // const response = await fetch('/api/nearby-users', {
      //   method: 'POST',
      //   body: JSON.stringify({ cafeId: cafeLocation.id, userLocation })
      // });
      // const users = await response.json();
      
      setNearbyUsers(mockNearbyUsers);
      onShowNearbyPeople();
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      Alert.alert('Error', 'Failed to load nearby users. Please try again.');
    }
  };

  const handlePermissionRequest = () => {
    Alert.alert(
      'Location Permission Required',
      'This app needs location access to show you people nearby at the café. Please enable location permissions in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => requestPermissions() },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  if (error || permissionStatus !== 'granted') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Location Access Needed</Text>
          <Text style={styles.errorText}>
            {error || 'Please enable location permissions to find people nearby at the café.'}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handlePermissionRequest}>
            <Settings size={16} color="#FFFFFF" />
            <Text style={styles.permissionButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isWithinCafe) {
    return (
      <View style={styles.container}>
        <View style={styles.outsideContainer}>
          <MapPin size={48} color="#6B7280" />
          <Text style={styles.outsideTitle}>You're not at the café location</Text>
          <Text style={styles.outsideSubtitle}>
            Visit {cafeLocation.name} to connect with others
          </Text>
          {distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                You're {formatDistance(distance)} away
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <View style={styles.successIcon}>
          <MapPin size={32} color="#10B981" />
        </View>
        <Text style={styles.insideTitle}>You're at {cafeLocation.name}!</Text>
        <Text style={styles.insideSubtitle}>
          Connect with {nearbyUsers.length} people nearby
        </Text>
        
        {nearbyUsers.length > 0 && (
          <View style={styles.nearbyUsersContainer}>
            <View style={styles.usersHeader}>
              <Users size={20} color="#E53935" />
              <Text style={styles.usersTitle}>People Nearby</Text>
            </View>
            
            <View style={styles.usersList}>
              {nearbyUsers.slice(0, 3).map((user) => (
                <View key={user.id} style={styles.userItem}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userDistance}>{formatDistance(user.distance)}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.showAllButton} onPress={onShowNearbyPeople}>
              <Text style={styles.showAllText}>View All People</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {nearbyUsers.length === 0 && (
          <TouchableOpacity style={styles.refreshButton} onPress={showNearbyPeople}>
            <Text style={styles.refreshText}>Refresh Nearby People</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    textAlign: 'center',
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
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  outsideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  outsideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  outsideSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  distanceContainer: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  distanceText: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '600',
  },
  insideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  insideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  insideSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  nearbyUsersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  usersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  usersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  usersList: {
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  userDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  showAllButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  showAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});