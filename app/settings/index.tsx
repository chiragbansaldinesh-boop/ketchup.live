import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { ArrowLeft, Bell, MapPin, Eye, EyeOff, Globe, Moon, Settings as SettingsIcon, Trash2, Shield, Crown, CreditCard, CircleHelp as HelpCircle, Heart, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const [showVenueCheckins, setShowVenueCheckins] = useState(true);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [blurPhoto, setBlurPhoto] = useState(false);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [venueReminders, setVenueReminders] = useState(true);
  const [gameInvites, setGameInvites] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          onPress: () => {
            // Handle logout
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Location & Privacy',
      items: [
        {
          id: '1',
          icon: <MapPin size={20} color="#374151" />,
          title: 'Show Venue Check-ins',
          subtitle: 'Let others see where you\'ve been',
          type: 'toggle',
          value: showVenueCheckins,
          onPress: () => setShowVenueCheckins(!showVenueCheckins),
        },
        {
          id: '2',
          icon: <SettingsIcon size={20} color="#374151" />,
          title: 'Auto Check-in',
          subtitle: 'Automatically check-in when scanning QR',
          type: 'toggle',
          value: autoCheckIn,
          onPress: () => setAutoCheckIn(!autoCheckIn),
        },
        {
          id: '3',
          icon: blurPhoto ? <EyeOff size={20} color="#374151" /> : <Eye size={20} color="#374151" />,
          title: 'Blur Photo Until Match',
          subtitle: 'Hide your photo until mutual like',
          type: 'toggle',
          value: blurPhoto,
          onPress: () => setBlurPhoto(!blurPhoto),
        },
        {
          id: '4',
          icon: <Shield size={20} color="#374151" />,
          title: 'Hidden Venues',
          subtitle: 'Manage venues where you won\'t appear',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: '5',
          icon: <Bell size={20} color="#374151" />,
          title: 'Match Notifications',
          subtitle: 'Get notified of new matches',
          type: 'toggle',
          value: matchNotifications,
          onPress: () => setMatchNotifications(!matchNotifications),
        },
        {
          id: '6',
          icon: <MapPin size={20} color="#374151" />,
          title: 'Venue Reminders',
          subtitle: 'Reminders when check-in expires',
          type: 'toggle',
          value: venueReminders,
          onPress: () => setVenueReminders(!venueReminders),
        },
        {
          id: '7',
          icon: <Heart size={20} color="#374151" />,
          title: 'Game Invites',
          subtitle: 'Notifications for game invitations',
          type: 'toggle',
          value: gameInvites,
          onPress: () => setGameInvites(!gameInvites),
        },
      ],
    },
    {
      title: 'Safety & Security',
      items: [
        {
          id: '8',
          icon: <Shield size={20} color="#374151" />,
          title: 'Blocked Users',
          subtitle: 'Manage blocked accounts',
          type: 'navigation',
          onPress: () => router.push('/settings/blocked-users'),
        },
        {
          id: '9',
          icon: <Shield size={20} color="#374151" />,
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          onPress: () => router.push('/settings/privacy-policy'),
        },
        {
          id: '10',
          icon: <Shield size={20} color="#374151" />,
          title: 'Safety Tips',
          subtitle: 'Learn how to stay safe',
          type: 'navigation',
          onPress: () => router.push('/settings/safety-tips'),
        },
        {
          id: '11',
          icon: <Shield size={20} color="#374151" />,
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: '12',
          icon: <Globe size={20} color="#374151" />,
          title: 'Language',
          subtitle: 'English',
          type: 'navigation',
        },
        {
          id: '13',
          icon: <Moon size={20} color="#374151" />,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'toggle',
          value: darkMode,
          onPress: () => setDarkMode(!darkMode),
        },
        {
          id: '14',
          icon: <SettingsIcon size={20} color="#374151" />,
          title: 'Manage Data & Cache',
          subtitle: 'Clear app data and cache',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Subscription',
      items: [
        {
          id: '15',
          icon: <Crown size={20} color="#F59E0B" />,
          title: 'Ketchup Premium',
          subtitle: 'Upgrade to premium features',
          type: 'navigation',
        },
        {
          id: '16',
          icon: <CreditCard size={20} color="#374151" />,
          title: 'Payment Methods',
          subtitle: 'Manage billing information',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: '17',
          icon: <HelpCircle size={20} color="#374151" />,
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          type: 'navigation',
        },
        {
          id: '18',
          icon: <Heart size={20} color="#374151" />,
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          type: 'navigation',
        },
        {
          id: '19',
          icon: <SettingsIcon size={20} color="#374151" />,
          title: 'Submit Feedback',
          subtitle: 'Help us improve the app',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: '20',
          icon: <LogOut size={20} color="#DC2626" />,
          title: 'Log Out',
          subtitle: 'Sign out of your account',
          type: 'action',
          onPress: handleLogout,
          destructive: true,
        },
        {
          id: '21',
          icon: <Trash2 size={20} color="#DC2626" />,
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'action',
          onPress: handleDeleteAccount,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, item.destructive && styles.destructiveIcon]}>
          {item.icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#D1D5DB', true: '#FEE2E2' }}
          thumbColor={item.value ? '#E53935' : '#F3F4F6'}
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.version}>Ketchup.live v1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Ketchup Technologies</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    marginTop: 32,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#FEE2E2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#DC2626',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingArrow: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 76,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
  },
  version: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});