import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import { MapPin, EyeOff, Eye } from 'lucide-react-native';

interface HiddenVenue {
  id: string;
  name: string;
  type: string;
  address: string;
  isHidden: boolean;
  hiddenAt?: string;
}

const mockVenues: HiddenVenue[] = [
  {
    id: '1',
    name: 'Blue Bottle Coffee',
    type: 'Coffee Shop',
    address: '123 Main St, San Francisco',
    isHidden: false,
  },
  {
    id: '2',
    name: 'The Rusty Anchor',
    type: 'Bar',
    address: '456 Ocean Ave, San Francisco',
    isHidden: true,
    hiddenAt: '2 days ago',
  },
  {
    id: '3',
    name: 'Sunset Bistro',
    type: 'Restaurant',
    address: '789 Sunset Blvd, San Francisco',
    isHidden: false,
  },
  {
    id: '4',
    name: 'Central Park Café',
    type: 'Coffee Shop',
    address: '321 Park St, San Francisco',
    isHidden: true,
    hiddenAt: '1 week ago',
  },
];

export default function HiddenVenuesScreen() {
  const [venues, setVenues] = useState(mockVenues);

  const toggleVenueVisibility = (venueId: string) => {
    setVenues(prev => prev.map(venue => 
      venue.id === venueId 
        ? { 
            ...venue, 
            isHidden: !venue.isHidden,
            hiddenAt: !venue.isHidden ? 'Just now' : undefined
          }
        : venue
    ));
  };

  const VenueCard = ({ item }: { item: HiddenVenue }) => (
    <View style={styles.venueCard}>
      <View style={styles.venueInfo}>
        <View style={styles.venueHeader}>
          <View style={styles.venueIcon}>
            {item.isHidden ? (
              <EyeOff size={20} color="#DC2626" />
            ) : (
              <Eye size={20} color="#10B981" />
            )}
          </View>
          <View style={styles.venueDetails}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text style={styles.venueType}>{item.type}</Text>
            <View style={styles.venueLocation}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.venueAddress}>{item.address}</Text>
            </View>
            {item.isHidden && item.hiddenAt && (
              <Text style={styles.hiddenDate}>Hidden {item.hiddenAt}</Text>
            )}
          </View>
        </View>
      </View>
      <Switch
        value={!item.isHidden}
        onValueChange={() => toggleVenueVisibility(item.id)}
        trackColor={{ false: '#FEE2E2', true: '#D1FAE5' }}
        thumbColor={!item.isHidden ? '#10B981' : '#DC2626'}
      />
    </View>
  );

  const hiddenCount = venues.filter(v => v.isHidden).length;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Hidden Venues',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.description}>
            Control which venues you appear in. When hidden, other users won't see you in that venue's pool.
          </Text>
          {hiddenCount > 0 && (
            <View style={styles.statsContainer}>
              <EyeOff size={16} color="#DC2626" />
              <Text style={styles.statsText}>
                Hidden from {hiddenCount} venue{hiddenCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <FlatList
          data={venues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VenueCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.venuesList}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statsText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 6,
  },
  venuesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  venueInfo: {
    flex: 1,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  venueType: {
    fontSize: 12,
    color: '#D50000',
    fontWeight: '500',
    marginBottom: 4,
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  venueAddress: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  hiddenDate: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500',
  },
});