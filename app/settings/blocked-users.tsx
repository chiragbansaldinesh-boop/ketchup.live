import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Trash2, Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { privacyService } from '@/services/privacyService';
import { BlockedUser } from '@/types/privacy';

export default function BlockedUsersScreen() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingUserId, setUnblockingUserId] = useState<string | null>(null);

  React.useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      const users = await privacyService.getBlockedUsers();
      setBlockedUsers(users);
    } catch (error) {
      Alert.alert('Error', 'Failed to load blocked users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}? They will be able to see your profile and message you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            setUnblockingUserId(userId);
            try {
              await privacyService.unblockUser(userId);
              setBlockedUsers(prev => prev.filter(user => user.id !== userId));
              Alert.alert('Success', `${userName} has been unblocked.`);
            } catch (error) {
              Alert.alert('Error', 'Failed to unblock user. Please try again.');
            } finally {
              setUnblockingUserId(null);
            }
          },
        },
      ]
    );
  };

  const BlockedUserCard = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.photo }} style={styles.userPhoto} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.venue && (
          <Text style={styles.userVenue}>Blocked from {item.venue}</Text>
        )}
        {item.reason && (
          <View style={styles.reasonContainer}>
            <AlertTriangle size={12} color="#F59E0B" />
            <Text style={styles.reasonText}>{item.reason}</Text>
          </View>
        )}
        <Text style={styles.blockedDate}>Blocked {item.blockedAt}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => unblockUser(item.id, item.name)}
        disabled={unblockingUserId === item.id}
      >
        {unblockingUserId === item.id ? (
          <ActivityIndicator size="small" color="#DC2626" />
        ) : (
          <>
            <Trash2 size={16} color="#DC2626" />
            <Text style={styles.unblockText}>Unblock</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Blocked Users',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D50000" />
          <Text style={styles.loadingText}>Loading blocked users...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Blocked Users',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <View style={styles.container}>
        {blockedUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Shield size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptySubtitle}>
              Users you block will appear here. You can unblock them anytime.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.blockedCount}>
                {blockedUsers.length} blocked user{blockedUsers.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.description}>
                Blocked users can't see your profile or send you messages. You can unblock them anytime.
              </Text>
            </View>
            <FlatList
              data={blockedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BlockedUserCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.usersList}
            />
          </>
        )}
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
  blockedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  usersList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  userCard: {
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
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  userVenue: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 4,
  },
  blockedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  unblockingButton: {
    opacity: 0.6,
  },
  unblockText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 4,
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
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
});