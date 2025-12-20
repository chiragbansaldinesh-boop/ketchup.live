import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, MapPin, Camera, CreditCard as Edit3, LogOut, Film, Trophy, Crown, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { supabaseAuthService } from '@/services/supabaseAuthService';
import { supabaseDatabaseService } from '@/services/supabaseDatabaseService';

export default function Profile() {
  const [isOnline, setIsOnline] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = await supabaseAuthService.getCurrentUser();
              if (user) {
                await supabaseDatabaseService.updateUserOnlineStatus(user.id, false);
              }
            } catch (error) {
              console.error('Error during logout:', error);
            }
            // For demo purposes, just navigate to login
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const userProfile = {
    name: "Alex Johnson",
    age: 28,
    bio: "Coffee enthusiast, dog lover, and weekend adventurer. Always up for trying new places!",
    interests: ["Coffee", "Travel", "Photography", "Dogs", "Music"],
    photos: [
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    currentVenue: "Brew & Beans Café",
    totalMatches: 47,
    venuesVisited: 23
  };

  const stats = [
    { label: "Matches", value: userProfile.totalMatches, icon: Heart },
    { label: "Venues", value: userProfile.venuesVisited, icon: MapPin },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: userProfile.photos[0] }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editPhotoButton}>
                <Camera size={16} color="#FFFDF9" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={18} color="#E10600" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.bio}>{userProfile.bio}</Text>
              
              {/* Online Status */}
              <View style={styles.statusRow}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#999' }]} />
                  <Text style={styles.statusText}>
                    {isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
                <Switch
                  value={isOnline}
                  onValueChange={setIsOnline}
                  trackColor={{ false: '#ddd', true: '#E10600' }}
                  thumbColor="#FFFDF9"
                />
              </View>

              {/* Current Venue */}
              {isOnline && userProfile.currentVenue && (
                <View style={styles.currentVenue}>
                  <MapPin size={16} color="#E10600" />
                  <Text style={styles.venueText}>Currently at {userProfile.currentVenue}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <stat.icon size={24} color="#E10600" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {userProfile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Photo Gallery */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGallery}>
              {userProfile.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.galleryPhoto} />
              ))}
              <TouchableOpacity style={styles.addPhotoButton}>
                <Camera size={24} color="#999" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/stories')}
            >
              <Film size={20} color="#E10600" />
              <Text style={styles.actionText}>My Stories</Text>
              <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/rewards')}
            >
              <Trophy size={20} color="#E10600" />
              <Text style={styles.actionText}>Rewards</Text>
              <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/settings/subscription')}
            >
              <Crown size={20} color="#E10600" />
              <Text style={styles.actionText}>Subscription</Text>
              <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={20} color="#E10600" />
              <Text style={styles.actionText}>Settings & Privacy</Text>
              <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ff4444" />
              <Text style={[styles.actionText, { color: '#ff4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225,6,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225,6,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFDF9',
    margin: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#E10600',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFDF9',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  currentVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225,6,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  venueText: {
    fontSize: 14,
    color: '#E10600',
    fontWeight: '500',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(225,6,0,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: '#E10600',
    fontWeight: '500',
  },
  photoGallery: {
    flexDirection: 'row',
  },
  galleryPhoto: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(26,26,26,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(225,6,0,0.05)',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  actionText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,68,68,0.05)',
    borderColor: 'rgba(255,68,68,0.1)',
  },
});