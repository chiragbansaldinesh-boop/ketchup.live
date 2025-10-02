/**
 * Location utilities for proximity detection and distance calculations
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CafeLocation extends Coordinates {
  name: string;
  id: string;
}

// Default café location - can be updated for different partners
export const DEFAULT_CAFE: CafeLocation = {
  id: 'cafe_001',
  name: 'Partner Café',
  latitude: 23.01,
  longitude: 72.48,
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate point
 * @param coord2 Second coordinate point
 * @returns Distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if user is within specified radius of a location
 * @param userLocation User's current coordinates
 * @param targetLocation Target location coordinates
 * @param radiusMeters Radius in meters (default: 60m = 200ft)
 * @returns Boolean indicating if user is within radius
 */
export function isWithinRadius(
  userLocation: Coordinates,
  targetLocation: Coordinates,
  radiusMeters: number = 60
): boolean {
  const distance = calculateDistance(userLocation, targetLocation);
  return distance <= radiusMeters;
}

/**
 * Format distance for display
 * @param distanceMeters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

/**
 * Check proximity to multiple locations
 * @param userLocation User's current coordinates
 * @param venues Array of venues with GeoPoint locations
 * @param radiusMeters Radius in meters for geofence detection (default: 60m)
 * @returns Array of venues with proximity data
 */
export interface VenueProximity {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: number;
  isWithinRadius: boolean;
  formattedDistance: string;
}

export function checkProximityToMultipleLocations(
  userLocation: Coordinates,
  venues: Array<{ id: string; name: string; type: string; address: string; location: any }>,
  radiusMeters: number = 60
): VenueProximity[] {
  return venues.map(venue => {
    // Convert GeoPoint to Coordinates if needed
    const venueCoords: Coordinates = venue.location.latitude !== undefined 
      ? { latitude: venue.location.latitude, longitude: venue.location.longitude }
      : venue.location;
    
    const distance = calculateDistance(userLocation, venueCoords);
    const isWithinRadius = distance <= radiusMeters;
    
    return {
      id: venue.id,
      name: venue.name,
      type: venue.type,
      address: venue.address,
      distance,
      isWithinRadius,
      formattedDistance: formatDistance(distance),
    };
  });
}