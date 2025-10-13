import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MapPin, Users, Clock, Star, Navigation, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import SafetyBanner from '@/components/SafetyBanner';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { checkProximityToMultipleLocations, VenueProximity, DEFAULT_CAFE } from '@/utils/locationUtils';

const { width } = Dimensions.get('window');

interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: number;
  activeUsers: number;
  rating: number;
  isCheckedIn: boolean;
  checkInExpiry?: string;
  lastVisited?: string;
}

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Blue Bottle Coffee',
    type: 'Coffee Shop',
    address: '123 Main St, San Francisco',
    distance: 0.2,
    activeUsers: 8,
    rating: 4.8,
    isCheckedIn: true,
    checkInExpiry: '2:30 PM',
  },
  {
    id: '2',
    name: 'The Rusty Anchor',
    type: 'Bar',
    address: '456 Ocean Ave, San Francisco',
    distance: 0.5,
    activeUsers: 12,
    rating: 4.6,
    isCheckedIn: false,
    lastVisited: '2 days ago',
  },
  {
    id: '3',
    name: 'Sunset Bistro',
    type: 'Restaurant',
    address: '789 Sunset Blvd, San Francisco',
    distance: 0.8,
    activeUsers: 5,
    rating: 4.7,
    isCheckedIn: false,
  },
  {
    id: '4',
    name: 'Central Park Café',
    type: 'Coffee Shop',
    address: '321 Park St, San Francisco',
    distance: 1.2,
    activeUsers: 15,
    rating: 4.9,
    isCheckedIn: false,
    lastVisited: '1 week ago',
  },
  {
    id: '5',
    name: 'Rooftop Lounge',
    type: 'Bar',
    address: '654 High St, San Francisco',
    distance: 1.5,
    activeUsers: 20,
    rating: 4.5,
    isCheckedIn: false,
  },
];

export default function VenuesScreen() {
  const currentUserId = 'current-user-id';
  
  // Location tracking for proximity detection
  const {
    userLocation,
    isLoading: locationLoading,
    error: locationError,
    permissionStatus,
    requestPermissions,
  } = useLocationTracking({
    cafeLocation: DEFAULT_CAFE,
    radiusMeters: 60,
  });
  
  const [venuesWithProximity, setVenuesWithProximity] = useState<VenueProximity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'coffee' | 'bar' | 'restaurant'>('all');
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [venues, setVenues] = useState(mockVenues);

  useEffect(() => {
    if (userLocation) {
      const venuesWithGeoPoints = mockVenues.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: venue.type,
        address: venue.address,
        location: DEFAULT_CAFE,
      }));

      const proximityData = checkProximityToMultipleLocations(
        userLocation,
        venuesWithGeoPoints,
        60
      );

      setVenuesWithProximity(proximityData);
    } else {
      const fallbackData: VenueProximity[] = mockVenues.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: venue.type,
        address: venue.address,
        distance: venue.distance * 1000,
        isWithinRadius: venue.isCheckedIn,
        formattedDistance: `${venue.distance} mi`,
      }));
      setVenuesWithProximity(fallbackData);
    }
  }, [userLocation]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredVenues = venuesWithProximity.filter(venue => {
    if (filter === 'all') return true;
    if (filter === 'coffee') return venue.type === 'Coffee Shop' || venue.type === 'coffee';
    if (filter === 'bar') return venue.type === 'Bar';
    if (filter === 'restaurant') return venue.type === 'Restaurant' || venue.type === 'restaurant';
    return true;
  });

  const extendCheckIn = (venueId: string) => {
    // TODO: Extend check-in via Supabase
    if (currentUserId) {
      console.log('Extending check-in for venue:', venueId);
    }
    
    setVenues(prev => prev.map(venue => 
      venue.id === venueId 
        ? { ...venue, checkInExpiry: '4:30 PM' }
        : venue
    ));
  };

  const VenueCard = ({ item }: { item: VenueProximity }) => (
    <TouchableOpacity style={styles.venueCard}>
      <View style={styles.venueHeader}>
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{item.name}</Text>
          <Text style={styles.venueType}>{item.type}</Text>
          <View style={styles.venueLocation}>
            <Navigation size={12} color="#6B7280" />
            <Text style={[
              styles.venueDistance,
              item.isWithinRadius && styles.venueDistanceNear
            ]}>
              {item.formattedDistance} away
            </Text>
            {item.isWithinRadius && (
              <CheckCircle size={12} color="#10B981" style={styles.nearbyIcon} />
            )}
          </View>
        </View>
        <View style={styles.venueStats}>
          {item.isWithinRadius ? (
            <View style={styles.atVenueContainer}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.atVenueText}>You're here!</Text>
            </View>
          ) : (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>{item.formattedDistance}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.venueAddress}>{item.address}</Text>

      {item.isWithinRadius ? (
        <View style={styles.checkedInContainer}>
          <View style={styles.checkedInStatus}>
            <View style={styles.checkedInDot} />
            <Text style={styles.checkedInText}>You're at this venue</Text>
          </View>
          <TouchableOpacity 
            style={styles.extendButton}
            onPress={() => extendCheckIn(item.id)}
          >
            <Clock size={16} color="#E53935" />
            <Text style={styles.extendText}>Extend</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.venueActions}>
          <TouchableOpacity style={styles.scanButton}>
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Venues</Text>
        <Text style={styles.subtitle}>
          {locationLoading ? 'Getting your location...' : 
           locationError ? 'Location unavailable' :
           'Discover people at local spots'}
        </Text>
      </View>

      {/* Location Permission Request */}
      {permissionStatus !== 'granted' && !locationLoading && (
        <View style={styles.permissionContainer}>
          <AlertCircle size={20} color="#F59E0B" />
          <Text style={styles.permissionText}>
            Enable location to see real-time distances to venues
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All' },
          { key: 'coffee', label: 'Coffee' },
          { key: 'bar', label: 'Bars' },
          { key: 'restaurant', label: 'Food' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterButton,
              filter === key && styles.activeFilter,
            ]}
            onPress={() => setFilter(key as any)}
          >
            <Text style={[
              styles.filterText,
              filter === key && styles.activeFilterText,
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showSafetyBanner && (
        <SafetyBanner onDismiss={() => setShowSafetyBanner(false)} />
      )}

      {locationLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>
            Getting your location...
          </Text>
        </View>
      )}

      <FlatList
        data={filteredVenues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VenueCard item={item} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.venuesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilter: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  venuesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  venueType: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
    marginBottom: 4,
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  venueDistanceNear: {
    color: '#10B981',
    fontWeight: '600',
  },
  nearbyIcon: {
    marginLeft: 4,
  },
  venueStats: {
    alignItems: 'flex-end',
  },
  atVenueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  atVenueText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  distanceContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  activeUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeUsers: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
    marginLeft: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  checkedInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  checkedInStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkedInDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  checkedInText: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
  },
  extendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  extendText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
    marginLeft: 4,
  },
  venueActions: {
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lastVisited: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    marginLeft: 12,
  },
  permissionButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
});