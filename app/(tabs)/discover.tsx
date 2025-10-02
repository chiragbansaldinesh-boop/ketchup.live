import { DEFAULT_CAFE } from '@/utils/locationUtils';
import { useUser, useVenueUsers, useLocationUpdates } from '@/hooks/useFirestore';
import { firestoreService } from '@/services/firestoreService';
import { geoPointToCoordinates } from '@/utils/firestoreHelpers';

export default function DiscoverScreen() {
  // TODO: Replace with actual user ID from authentication
  const currentUserId = 'current-user-id';
  
  const { user: currentUser, updateUser } = useUser(currentUserId);
  const { users: venueUsers, loading: venueUsersLoading } = useVenueUsers('venue-001');
  const { updateLocation } = useLocationUpdates(currentUserId);
  
  const [users, setUsers] = useState(mockUsers);
  
  React.useEffect(() => {
    loadBlockedUsers();
    
    // TODO: Update user location in Firestore when location changes
    if (isWithinCafe && currentUser?.location) {
      const coords = geoPointToCoordinates(currentUser.location);
      updateLocation(coords.latitude, coords.longitude);
    }
  }, []);

  // Note: Removed proximity check - users can now discover people at any venue
  // The VenuesScreen handles showing proximity to all venues
  
}