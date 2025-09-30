import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  GeoPoint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Types
export interface FirestoreUser {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  location?: GeoPoint;
  currentVenue?: string;
  isOnline: boolean;
  lastSeen: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreVenue {
  id: string;
  name: string;
  type: 'coffee' | 'bar' | 'restaurant';
  address: string;
  location: GeoPoint;
  activeUsers: number;
  rating: number;
  qrCode: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  venue: string;
  matchedAt: Timestamp;
  isActive: boolean;
  lastMessageAt?: Timestamp;
}

export interface FirestoreMessage {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface FirestoreCheckIn {
  id: string;
  userId: string;
  venueId: string;
  checkedInAt: Timestamp;
  expiresAt: Timestamp;
  isActive: boolean;
}

class FirestoreService {
  // User operations
  async createUser(userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<FirestoreUser | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<FirestoreUser>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number): Promise<void> {
    try {
      await this.updateUser(userId, {
        location: new GeoPoint(latitude, longitude),
        lastSeen: serverTimestamp() as Timestamp,
      });
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  }

  // Venue operations
  async getVenues(): Promise<FirestoreVenue[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'venues'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreVenue[];
    } catch (error) {
      console.error('Error getting venues:', error);
      throw error;
    }
  }

  async getVenue(venueId: string): Promise<FirestoreVenue | null> {
    try {
      const docRef = doc(db, 'venues', venueId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirestoreVenue;
      }
      return null;
    } catch (error) {
      console.error('Error getting venue:', error);
      throw error;
    }
  }

  // Check-in operations
  async checkInToVenue(userId: string, venueId: string, durationHours: number = 2): Promise<string> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + durationHours);

      const docRef = await addDoc(collection(db, 'checkIns'), {
        userId,
        venueId,
        checkedInAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        isActive: true,
      });

      // Update user's current venue
      await this.updateUser(userId, { currentVenue: venueId });

      return docRef.id;
    } catch (error) {
      console.error('Error checking in to venue:', error);
      throw error;
    }
  }

  async checkOutFromVenue(checkInId: string): Promise<void> {
    try {
      const docRef = doc(db, 'checkIns', checkInId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error checking out from venue:', error);
      throw error;
    }
  }

  async getUsersAtVenue(venueId: string): Promise<FirestoreUser[]> {
    try {
      // Get active check-ins for this venue
      const checkInsQuery = query(
        collection(db, 'checkIns'),
        where('venueId', '==', venueId),
        where('isActive', '==', true),
        where('expiresAt', '>', Timestamp.now())
      );
      
      const checkInsSnapshot = await getDocs(checkInsQuery);
      const userIds = checkInsSnapshot.docs.map(doc => doc.data().userId);

      if (userIds.length === 0) return [];

      // Get user details for each checked-in user
      const users: FirestoreUser[] = [];
      for (const userId of userIds) {
        const user = await this.getUser(userId);
        if (user) users.push(user);
      }

      return users;
    } catch (error) {
      console.error('Error getting users at venue:', error);
      throw error;
    }
  }

  // Match operations
  async createMatch(user1Id: string, user2Id: string, venue: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'matches'), {
        user1Id,
        user2Id,
        venue,
        matchedAt: serverTimestamp(),
        isActive: true,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  async getUserMatches(userId: string): Promise<FirestoreMatch[]> {
    try {
      const matchesQuery = query(
        collection(db, 'matches'),
        where('user1Id', '==', userId),
        where('isActive', '==', true),
        orderBy('matchedAt', 'desc')
      );
      
      const matchesQuery2 = query(
        collection(db, 'matches'),
        where('user2Id', '==', userId),
        where('isActive', '==', true),
        orderBy('matchedAt', 'desc')
      );

      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(matchesQuery),
        getDocs(matchesQuery2)
      ]);

      const matches1 = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreMatch[];
      const matches2 = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreMatch[];

      return [...matches1, ...matches2].sort((a, b) => 
        b.matchedAt.toMillis() - a.matchedAt.toMillis()
      );
    } catch (error) {
      console.error('Error getting user matches:', error);
      throw error;
    }
  }

  // Message operations
  async sendMessage(matchId: string, senderId: string, text: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        matchId,
        senderId,
        text,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Update match's last message timestamp
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        lastMessageAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(matchId: string, limitCount: number = 50): Promise<FirestoreMessage[]> {
    try {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('matchId', '==', matchId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(messagesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreMessage[];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToMessages(matchId: string, callback: (messages: FirestoreMessage[]) => void) {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('matchId', '==', matchId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreMessage[];
      callback(messages);
    });
  }

  subscribeToUserMatches(userId: string, callback: (matches: FirestoreMatch[]) => void) {
    const matchesQuery1 = query(
      collection(db, 'matches'),
      where('user1Id', '==', userId),
      where('isActive', '==', true)
    );

    const matchesQuery2 = query(
      collection(db, 'matches'),
      where('user2Id', '==', userId),
      where('isActive', '==', true)
    );

    // Note: Firestore doesn't support OR queries directly, so we need two listeners
    const unsubscribe1 = onSnapshot(matchesQuery1, () => {
      // Refetch all matches when any change occurs
      this.getUserMatches(userId).then(callback);
    });

    const unsubscribe2 = onSnapshot(matchesQuery2, () => {
      // Refetch all matches when any change occurs
      this.getUserMatches(userId).then(callback);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }

  subscribeToVenueUsers(venueId: string, callback: (users: FirestoreUser[]) => void) {
    const checkInsQuery = query(
      collection(db, 'checkIns'),
      where('venueId', '==', venueId),
      where('isActive', '==', true),
      where('expiresAt', '>', Timestamp.now())
    );

    return onSnapshot(checkInsQuery, async () => {
      // Refetch users when check-ins change
      const users = await this.getUsersAtVenue(venueId);
      callback(users);
    });
  }
}

export const firestoreService = new FirestoreService();