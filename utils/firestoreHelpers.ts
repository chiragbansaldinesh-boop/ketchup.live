import { GeoPoint, Timestamp } from 'firebase/firestore';

// Helper functions for Firestore data conversion and utilities

export function geoPointToCoordinates(geoPoint: GeoPoint) {
  return {
    latitude: geoPoint.latitude,
    longitude: geoPoint.longitude,
  };
}

export function coordinatesToGeoPoint(latitude: number, longitude: number) {
  return new GeoPoint(latitude, longitude);
}

export function timestampToDate(timestamp: Timestamp) {
  return timestamp.toDate();
}

export function dateToTimestamp(date: Date) {
  return Timestamp.fromDate(date);
}

export function formatTimestamp(timestamp: Timestamp, format: 'relative' | 'absolute' = 'relative') {
  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (format === 'relative') {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
  
  return date.toLocaleString();
}

// Calculate distance between two GeoPoints (Haversine formula)
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Filter users within a certain radius
export function filterUsersByRadius(
  users: Array<{ location?: GeoPoint }>,
  centerPoint: GeoPoint,
  radiusMeters: number
) {
  return users.filter(user => {
    if (!user.location) return false;
    const distance = calculateDistance(centerPoint, user.location);
    return distance <= radiusMeters;
  });
}

// Generate a unique venue QR code
export function generateVenueQRCode(venueId: string): string {
  // In production, this would generate a proper QR code
  return `ketchup://venue/${venueId}`;
}

// Validate venue check-in expiry
export function isCheckInActive(expiresAt: Timestamp): boolean {
  return expiresAt.toMillis() > Date.now();
}

// Get time until check-in expires
export function getTimeUntilExpiry(expiresAt: Timestamp): string {
  const now = Date.now();
  const expiry = expiresAt.toMillis();
  const diffMs = expiry - now;
  
  if (diffMs <= 0) return 'Expired';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}m`;
  }
  
  return `${diffMinutes}m`;
}

// Batch operations helper
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Sanitize user input for Firestore
export function sanitizeUserInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Generate user-friendly error messages
export function getFirestoreErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  const code = error?.code;
  
  switch (code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested data was not found.';
    case 'already-exists':
      return 'This data already exists.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    case 'unauthenticated':
      return 'Please sign in to continue.';
    case 'unavailable':
      return 'Service is temporarily unavailable. Please try again.';
    default:
      return error?.message || 'An unexpected error occurred.';
  }
}