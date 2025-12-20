import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X, MapPin, Info, QrCode, MoveVertical as MoreVertical, Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import VenueSessionTimer from '@/components/VenueSessionTimer';
import BlockUserModal from '@/components/BlockUserModal';
import SmallUserCard from '@/components/SmallUserCard';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { privacyService } from '@/services/privacyService';
import { DEFAULT_CAFE } from '@/utils/locationUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = screenHeight * 0.7;

interface User {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  venue: string;
  bio: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma',
    age: 26,
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Coffee', 'Art', 'Travel'],
    venue: 'Blue Bottle Coffee',
    bio: 'Love exploring new cafes and art galleries ✨',
  },
  {
    id: '2',
    name: 'Alex',
    age: 28,
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Music', 'Food', 'Hiking'],
    venue: 'Blue Bottle Coffee',
    bio: 'Musician by night, foodie by day 🎵',
  },
  {
    id: '3',
    name: 'Sophie',
    age: 24,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    interests: ['Books', 'Yoga', 'Photography'],
    venue: 'Blue Bottle Coffee',
    bio: 'Capturing moments and seeking adventures 📸',
  },
];

const recentMatches = [
  {
    id: 'm1',
    name: 'Sarah',
    age: 25,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: true,
    isOnline: true,
  },
  {
    id: 'm2',
    name: 'Jake',
    age: 27,
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: true,
    isOnline: false,
  },
  {
    id: 'm3',
    name: 'Maya',
    age: 24,
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: true,
    isOnline: true,
  },
  {
    id: 'm4',
    name: 'Chris',
    age: 29,
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: true,
    isOnline: false,
  },
];

const nearbyPeople = [
  {
    id: 'n1',
    name: 'Luna',
    age: 26,
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: false,
    isOnline: true,
  },
  {
    id: 'n2',
    name: 'David',
    age: 28,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: false,
    isOnline: true,
  },
  {
    id: 'n3',
    name: 'Zoe',
    age: 23,
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: false,
    isOnline: false,
  },
  {
    id: 'n4',
    name: 'Ryan',
    age: 30,
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    isMatch: false,
    isOnline: true,
  },
];

export default function DiscoverScreen() {
  const [users, setUsers] = useState(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [currentVenue] = useState('Blue Bottle Coffee');
  const [sessionExpiry] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours from now
  
  // Location tracking for proximity detection
  const { isWithinCafe, distance } = useLocationTracking({
    cafeLocation: DEFAULT_CAFE,
    radiusMeters: 60, // 200 feet
  });
  
  React.useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      const blockedIds = await privacyService.getBlockedUserIds();
      setBlockedUserIds(blockedIds);
    } catch (error) {
      console.error('Error loading blocked users:', error);
    }
  };

  // Filter out blocked users
  const filteredUsers = users.filter(user => !blockedUserIds.includes(user.id));

  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 120) {
        handleLike();
      } else if (gestureState.dx < -120) {
        handlePass();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleLike = () => {
    Animated.timing(pan, {
      toValue: { x: screenWidth, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowMatch(true);
      nextCard();
    });
  };

  const handlePass = () => {
    Animated.timing(pan, {
      toValue: { x: -screenWidth, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(nextCard);
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    pan.setValue({ x: 0, y: 0 });
  };

  const handleUserBlocked = () => {
    setShowBlockModal(false);
    setShowUserMenu(false);
    // Reload blocked users and move to next card
    loadBlockedUsers();
    nextCard();
  };

  const handleReportUser = () => {
    setShowUserMenu(false);
    Alert.alert(
      'Report User',
      'This will report the user to our safety team for review.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Report Submitted', 'Thank you for reporting. Our team will review this.');
          }
        },
      ]
    );
  };

  const handleExtendSession = () => {
    // Handle session extension
    console.log('Extending session...');
  };

  const handleSessionExpire = () => {
    // Handle session expiry
    console.log('Session expired');
  };

  const UserMenu = () => (
    <View style={styles.userMenuOverlay}>
      <TouchableOpacity 
        style={styles.userMenuBackdrop} 
        onPress={() => setShowUserMenu(false)}
      />
      <View style={styles.userMenu}>
        <TouchableOpacity 
          style={styles.userMenuItem}
          onPress={() => {
            setShowUserMenu(false);
            setShowBlockModal(true);
          }}
        >
          <Shield size={20} color="#DC2626" />
          <Text style={styles.userMenuText}>Block User</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.userMenuItem}
          onPress={handleReportUser}
        >
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.userMenuText}>Report User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const MatchModal = () => (
    <View style={styles.matchOverlay}>
      <View style={styles.matchModal}>
        <Text style={styles.matchTitle}>It's a Match! 🎉</Text>
        <View style={styles.matchPhotos}>
          <Image
            source={{ uri: users[currentIndex - 1]?.photo }}
            style={styles.matchPhoto}
          />
          <View style={styles.ketchupSplash}>
            <Text style={styles.splashText}>💕</Text>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.matchPhoto}
          />
        </View>
        <Text style={styles.matchSubtext}>
          You both liked each other at {users[currentIndex - 1]?.venue}
        </Text>
        <TouchableOpacity
          style={styles.startChatButton}
          onPress={() => setShowMatch(false)}
        >
          <Text style={styles.startChatText}>Start Chatting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMatch(false)}>
          <Text style={styles.keepSwipingText}>Keep Swiping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (currentIndex >= filteredUsers.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No more people at this venue</Text>
          <Text style={styles.emptySubtext}>
            Try scanning QR codes at different venues to meet new people!
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setCurrentIndex(0)}
          >
            <QrCode size={20} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan New Venue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show proximity message if user is not within café range
  if (!isWithinCafe) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MapPin size={64} color="#6B7280" />
          <Text style={styles.emptyTitle}>You're not at the café location</Text>
          <Text style={styles.emptySubtext}>
            Visit the café to connect with others nearby
          </Text>
          {distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                You're {Math.round(distance)}m away
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
  
  const currentUser = filteredUsers[currentIndex];
  
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No users available</Text>
          <Text style={styles.emptySubtext}>
            Check back later for new people to connect with!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VenueSessionTimer
        venueName={currentVenue}
        expiryTime={sessionExpiry}
        onExtend={handleExtendSession}
        onExpire={handleSessionExpire}
      />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.venueTag}>
            <MapPin size={16} color="#E10600" />
            <Text style={styles.venueText}>{currentUser.venue}</Text>
          </View>
        </View>

        {/* Recent Matches Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Matches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentMatches}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.usersList}
            renderItem={({ item }) => (
              <SmallUserCard
                id={item.id}
                name={item.name}
                age={item.age}
                photo={item.photo}
                isMatch={item.isMatch}
                isOnline={item.isOnline}
                onPress={() => console.log('Match pressed:', item.name)}
              />
            )}
          />
        </View>

        {/* Nearby People Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People Nearby</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyPeople}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.usersList}
            renderItem={({ item }) => (
              <SmallUserCard
                id={item.id}
                name={item.name}
                age={item.age}
                photo={item.photo}
                isMatch={item.isMatch}
                isOnline={item.isOnline}
                onPress={() => console.log('Nearby person pressed:', item.name)}
              />
            )}
          />
        </View>

        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { rotate },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <Image source={{ uri: currentUser.photo }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>
                    {currentUser.name}, {currentUser.age}
                  </Text>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={() => setShowUserMenu(true)}
                  >
                    <MoreVertical size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardBio}>{currentUser.bio}</Text>
                <View style={styles.interestsContainer}>
                  {currentUser.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.passButton} onPress={handlePass}>
            <X size={24} color="#E10600" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Heart size={24} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showMatch && <MatchModal />}
      {showUserMenu && <UserMenu />}
      
      <BlockUserModal
        visible={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        userId={currentUser.id}
        userName={currentUser.name}
        venue={currentUser.venue}
        onUserBlocked={handleUserBlocked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  venueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  venueText: {
    marginLeft: 6,
    color: '#E10600',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  seeAllText: {
    fontSize: 14,
    color: '#E10600',
    fontWeight: '600',
  },
  usersList: {
    paddingLeft: 4,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: CARD_HEIGHT + 40,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBio: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E10600',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E10600',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E10600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E10600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  distanceContainer: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  distanceText: {
    fontSize: 14,
    color: '#E10600',
    fontWeight: '600',
  },
  matchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    width: screenWidth * 0.85,
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E10600',
    marginBottom: 24,
    textAlign: 'center',
  },
  matchPhotos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  matchPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E10600',
  },
  ketchupSplash: {
    marginHorizontal: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 20,
  },
  matchSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: '#E10600',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    width: '100%',
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  keepSwipingText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  userMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  userMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userMenu: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  userMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userMenuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
});