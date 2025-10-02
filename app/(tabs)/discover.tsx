import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DEFAULT_CAFE } from '@/utils/locationUtils';
import { useUser, useVenueUsers, useLocationUpdates } from '@/hooks/useFirestore';
import { firestoreService } from '@/services/firestoreService';
import { geoPointToCoordinates } from '@/utils/firestoreHelpers';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  location: string;
  distance: number;
  isOnline: boolean;
  lastSeen: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    bio: 'Coffee enthusiast and book lover. Always up for deep conversations over a good latte.',
    photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'],
    interests: ['Coffee', 'Reading', 'Photography'],
    location: 'Downtown Cafe',
    distance: 0.1,
    isOnline: true,
    lastSeen: 'Active now'
  },
  {
    id: '2',
    name: 'Alex',
    age: 28,
    bio: 'Digital nomad working on the next big thing. Love meeting new people and sharing ideas.',
    photos: ['https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'],
    interests: ['Technology', 'Travel', 'Startups'],
    location: 'Downtown Cafe',
    distance: 0.2,
    isOnline: true,
    lastSeen: '2 minutes ago'
  },
  {
    id: '3',
    name: 'Maya',
    age: 26,
    bio: 'Artist and yoga instructor. Seeking meaningful connections and creative collaborations.',
    photos: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'],
    interests: ['Art', 'Yoga', 'Meditation'],
    location: 'Downtown Cafe',
    distance: 0.3,
    isOnline: false,
    lastSeen: '1 hour ago'
  }
];

export default function DiscoverScreen() {
  // TODO: Replace with actual user ID from authentication
  const currentUserId = 'current-user-id';
  
  const { user: currentUser, updateUser } = useUser(currentUserId);
  const { users: venueUsers, loading: venueUsersLoading } = useVenueUsers('venue-001');
  const { updateLocation } = useLocationUpdates(currentUserId);
  
  const [users, setUsers] = useState(mockUsers);
  
  useEffect(() => {
    loadBlockedUsers();
    
    // TODO: Update user location in Firestore when location changes
    if (isWithinCafe && currentUser?.location) {
      const coords = geoPointToCoordinates(currentUser.location);
      updateLocation(coords.latitude, coords.longitude);
    }
  }, []);

  // Note: Removed proximity check - users can now discover people at any venue
  // The VenuesScreen handles showing proximity to all venues

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Find people nearby</Text>
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