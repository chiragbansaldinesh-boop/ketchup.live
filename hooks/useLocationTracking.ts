import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface UseLocationTrackingProps {
  cafeLocation: LocationCoordinates;
  radiusMeters: number;
}

interface UseLocationTrackingResult {
  isWithinCafe: boolean;
  distance: number | null;
  currentLocation: LocationCoordinates | null;
  error: string | null;
}

export function useLocationTracking({
  cafeLocation,
  radiusMeters,
}: UseLocationTrackingProps): UseLocationTrackingResult {
  const [isWithinCafe, setIsWithinCafe] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Location permission not granted');
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const userCoords = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            setCurrentLocation(userCoords);

            const calculatedDistance = calculateDistance(
              userCoords,
              cafeLocation
            );

            setDistance(calculatedDistance);
            setIsWithinCafe(calculatedDistance <= radiusMeters);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to track location');
      }
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [cafeLocation, radiusMeters]);

  return { isWithinCafe, distance, currentLocation, error };
}

function calculateDistance(
  coords1: LocationCoordinates,
  coords2: LocationCoordinates
): number {
  const R = 6371e3;
  const φ1 = (coords1.latitude * Math.PI) / 180;
  const φ2 = (coords2.latitude * Math.PI) / 180;
  const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
  const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
