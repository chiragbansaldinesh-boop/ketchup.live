import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Users, Clock, Navigation, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Flame, QrCode } from 'lucide-react-native';
import SafetyBanner from '@/components/SafetyBanner';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { checkProximityToMultipleLocations, VenueProximity, DEFAULT_CAFE } from '@/utils/locationUtils';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import EmptyState from '@/components/ui/EmptyState';

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
  image?: string;
  isHot?: boolean;
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
    image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=600',
    isHot: true,
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
    image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=600',
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
    image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'Central Park Cafe',
    type: 'Coffee Shop',
    address: '321 Park St, San Francisco',
    distance: 1.2,
    activeUsers: 15,
    rating: 4.9,
    isCheckedIn: false,
    lastVisited: '1 week ago',
    image: 'https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?auto=compress&cs=tinysrgb&w=600',
    isHot: true,
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
    image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=600',
    isHot: true,
  },
];

export default function VenuesScreen() {
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

  const getVenueData = (id: string) => mockVenues.find(v => v.id === id);

  const extendCheckIn = (venueId: string) => {
    setVenues(prev => prev.map(venue =>
      venue.id === venueId
        ? { ...venue, checkInExpiry: '4:30 PM' }
        : venue
    ));
  };

  const VenueCard = ({ item }: { item: VenueProximity }) => {
    const venueData = getVenueData(item.id);

    return (
      <TouchableOpacity style={styles.venueCard} activeOpacity={0.9}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: venueData?.image || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.cardImage}
          />
          <View style={styles.cardOverlay}>
            {venueData?.isHot && (
              <View style={styles.hotBadge}>
                <Flame size={12} color={colors.text.inverse} />
                <Text style={styles.hotText}>Hot</Text>
              </View>
            )}
            <View style={styles.activeUsersBadge}>
              <Users size={12} color={colors.text.inverse} />
              <Text style={styles.activeUsersText}>{venueData?.activeUsers} active</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{item.name}</Text>
              <View style={styles.typeDistanceRow}>
                <Text style={styles.venueType}>{item.type}</Text>
                <View style={styles.dot} />
                <View style={styles.distanceRow}>
                  <Navigation size={12} color={colors.text.tertiary} />
                  <Text style={[
                    styles.venueDistance,
                    item.isWithinRadius && styles.venueDistanceNear
                  ]}>
                    {item.formattedDistance}
                  </Text>
                </View>
              </View>
            </View>
            {item.isWithinRadius && (
              <View style={styles.hereIndicator}>
                <CheckCircle size={16} color={colors.success.main} />
              </View>
            )}
          </View>

          <Text style={styles.venueAddress} numberOfLines={1}>{item.address}</Text>

          {item.isWithinRadius ? (
            <View style={styles.checkedInContainer}>
              <View style={styles.checkedInStatus}>
                <View style={styles.checkedInDot} />
                <Text style={styles.checkedInText}>You're here</Text>
              </View>
              <TouchableOpacity
                style={styles.extendButton}
                onPress={() => extendCheckIn(item.id)}
              >
                <Clock size={14} color={colors.primary.main} />
                <Text style={styles.extendText}>Extend</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.checkInButton}>
              <QrCode size={16} color={colors.text.inverse} />
              <Text style={styles.checkInButtonText}>Check In</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Venues</Text>
        <Text style={styles.subtitle}>
          {locationLoading ? 'Getting your location...' :
            locationError ? 'Location unavailable' :
              'Discover people at local spots'}
        </Text>
      </View>

      {permissionStatus !== 'granted' && !locationLoading && (
        <View style={styles.permissionContainer}>
          <AlertCircle size={20} color={colors.warning.dark} />
          <Text style={styles.permissionText}>
            Enable location to see real-time distances
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>Enable</Text>
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
            onPress={() => setFilter(key as typeof filter)}
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
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>
            Getting your location...
          </Text>
        </View>
      )}

      {filteredVenues.length === 0 && !locationLoading ? (
        <EmptyState type="venues" />
      ) : (
        <FlatList
          data={filteredVenues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VenueCard item={item} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.main}
            />
          }
          contentContainerStyle={styles.venuesList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
  },
  activeFilter: {
    backgroundColor: colors.primary.main,
  },
  filterText: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: colors.text.inverse,
  },
  venuesList: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  venueCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardImageContainer: {
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  hotText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  activeUsersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  activeUsersText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  typeDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueType: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: spacing.sm,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  venueDistance: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  venueDistanceNear: {
    color: colors.success.main,
    fontWeight: '600',
  },
  hereIndicator: {
    backgroundColor: colors.success.light,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },
  venueAddress: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  checkedInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.success.light,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  checkedInStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedInDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success.main,
    marginRight: spacing.sm,
  },
  checkedInText: {
    ...typography.captionMedium,
    color: colors.success.dark,
  },
  extendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  extendText: {
    ...typography.captionMedium,
    color: colors.primary.main,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  checkInButtonText: {
    ...typography.bodySemibold,
    color: colors.text.inverse,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  permissionText: {
    flex: 1,
    ...typography.caption,
    color: colors.warning.dark,
  },
  permissionButton: {
    backgroundColor: colors.warning.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  permissionButtonText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
});
