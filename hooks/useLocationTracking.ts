import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { Coordinates, CafeLocation, isWithinRadius, calculateDistance } from '@/utils/locationUtils';

export interface LocationState {
  userLocation: Coordinates | null;
  isWithinCafe: boolean;
  distance: number | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
}

export interface UseLocationTrackingOptions {
  cafeLocation: CafeLocation;
  radiusMeters?: number;
  updateInterval?: number;
  onEnterCafe?: () => void;
  onExitCafe?: () => void;
}

export function useLocationTracking({
  cafeLocation,
  radiusMeters = 60, // 200 feet
  updateInterval = 5000, // 5 seconds
  onEnterCafe,
  onExitCafe,
}: UseLocationTrackingOptions) {
  const [locationState, setLocationState] = useState<LocationState>({
    userLocation: null,
    isWithinCafe: false,
    distance: null,
    isLoading: true,
    error: null,
    permissionStatus: null,
  });

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const wasWithinCafe = useRef(false);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Request foreground permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        setLocationState(prev => ({
          ...prev,
          error: 'Location permission denied. Please enable location access in settings.',
          permissionStatus: foregroundStatus,
          isLoading: false,
        }));
        return false;
      }

      // For background location (optional, for better tracking)
      if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        console.log('Background permission status:', backgroundStatus);
      }

      setLocationState(prev => ({
        ...prev,
        permissionStatus: foregroundStatus,
        error: null,
      }));

      return true;
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        error: `Permission error: ${error}`,
        isLoading: false,
      }));
      return false;
    }
  };

  const updateLocation = (location: Location.LocationObject) => {
    const userCoords: Coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    const distance = calculateDistance(userCoords, cafeLocation);
    const isWithin = isWithinRadius(userCoords, cafeLocation, radiusMeters);

    // Trigger callbacks on state change
    if (isWithin && !wasWithinCafe.current) {
      wasWithinCafe.current = true;
      onEnterCafe?.();
    } else if (!isWithin && wasWithinCafe.current) {
      wasWithinCafe.current = false;
      onExitCafe?.();
    }

    setLocationState(prev => ({
      ...prev,
      userLocation: userCoords,
      isWithinCafe: isWithin,
      distance,
      isLoading: false,
      error: null,
    }));
  };

  const startLocationTracking = async () => {
    try {
      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      updateLocation(location);

      // Start watching location changes
      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: updateInterval,
          distanceInterval: 10, // Update every 10 meters
        },
        updateLocation
      );
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        error: `Location tracking error: ${error}`,
        isLoading: false,
      }));
    }
  };

  const stopLocationTracking = () => {
    if (watchSubscription.current && typeof watchSubscription.current.remove === 'function') {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        await startLocationTracking();
      }
    };

    initializeLocation();

    return () => {
      stopLocationTracking();
    };
  }, [cafeLocation.id, radiusMeters, updateInterval]);

  return {
    ...locationState,
    startTracking: startLocationTracking,
    stopTracking: stopLocationTracking,
    requestPermissions,
  };
}