import { useState, useEffect, useCallback } from 'react';
import { firestoreService, FirestoreUser, FirestoreVenue, FirestoreMatch, FirestoreMessage } from '@/services/firestoreService';

// Hook for managing user data
export function useUser(userId: string | null) {
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await firestoreService.getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = useCallback(async (updates: Partial<FirestoreUser>) => {
    if (!userId) return;

    try {
      await firestoreService.updateUser(userId, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  }, [userId]);

  return { user, loading, error, updateUser };
}

// Hook for managing venues
export function useVenues() {
  const [venues, setVenues] = useState<FirestoreVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const venuesData = await firestoreService.getVenues();
        setVenues(venuesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch venues');
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return { venues, loading, error, refetch: () => setLoading(true) };
}

// Hook for managing user matches with real-time updates
export function useMatches(userId: string | null) {
  const [matches, setMatches] = useState<FirestoreMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = firestoreService.subscribeToUserMatches(userId, (matchesData) => {
      setMatches(matchesData);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [userId]);

  return { matches, loading, error };
}

// Hook for managing messages with real-time updates
export function useMessages(matchId: string | null) {
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = firestoreService.subscribeToMessages(matchId, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [matchId]);

  const sendMessage = useCallback(async (senderId: string, text: string) => {
    if (!matchId) return;

    try {
      await firestoreService.sendMessage(matchId, senderId, text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [matchId]);

  return { messages, loading, error, sendMessage };
}

// Hook for managing venue check-ins
export function useVenueCheckIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIn = useCallback(async (userId: string, venueId: string, durationHours?: number) => {
    try {
      setLoading(true);
      setError(null);
      const checkInId = await firestoreService.checkInToVenue(userId, venueId, durationHours);
      return checkInId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkOut = useCallback(async (checkInId: string) => {
    try {
      setLoading(true);
      setError(null);
      await firestoreService.checkOutFromVenue(checkInId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkIn, checkOut, loading, error };
}

// Hook for getting users at a venue with real-time updates
export function useVenueUsers(venueId: string | null) {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!venueId) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = firestoreService.subscribeToVenueUsers(venueId, (usersData) => {
      setUsers(usersData);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [venueId]);

  return { users, loading, error };
}

// Hook for location updates
export function useLocationUpdates(userId: string | null) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = useCallback(async (latitude: number, longitude: number) => {
    if (!userId) return;

    try {
      setUpdating(true);
      setError(null);
      await firestoreService.updateUserLocation(userId, latitude, longitude);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    } finally {
      setUpdating(false);
    }
  }, [userId]);

  return { updateLocation, updating, error };
}