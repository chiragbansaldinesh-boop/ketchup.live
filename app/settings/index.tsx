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
import { Bell, MapPin, Eye, EyeOff, Globe, Moon, Settings as SettingsIcon, Trash2, Shield, Crown, CreditCard, CircleHelp as HelpCircle, Heart, LogOut, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

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
            router.replace('/auth/login');
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
          icon: <MapPin size={20} color={colors.text.secondary} />,
          title: 'Show Venue Check-ins',
          subtitle: 'Let others see where you\'ve been',
          type: 'toggle',
          value: showVenueCheckins,
          onPress: () => setShowVenueCheckins(!showVenueCheckins),
        },
        {
          id: '2',
          icon: <SettingsIcon size={20} color={colors.text.secondary} />,
          title: 'Auto Check-in',
          subtitle: 'Automatically check-in when scanning QR',
          type: 'toggle',
          value: autoCheckIn,
          onPress: () => setAutoCheckIn(!autoCheckIn),
        },
        {
          id: '3',
          icon: blurPhoto ? <EyeOff size={20} color={colors.text.secondary} /> : <Eye size={20} color={colors.text.secondary} />,
          title: 'Blur Photo Until Match',
          subtitle: 'Hide your photo until mutual like',
          type: 'toggle',
          value: blurPhoto,
          onPress: () => setBlurPhoto(!blurPhoto),
        },
        {
          id: '4',
          icon: <Shield size={20} color={colors.text.secondary} />,
          title: 'Hidden Venues',
          subtitle: 'Manage venues where you won\'t appear',
          type: 'navigation',
          onPress: () => router.push('/settings/hidden-venues'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: '5',
          icon: <Bell size={20} color={colors.text.secondary} />,
          title: 'Match Notifications',
          subtitle: 'Get notified of new matches',
          type: 'toggle',
          value: matchNotifications,
          onPress: () => setMatchNotifications(!matchNotifications),
        },
        {
          id: '6',
          icon: <MapPin size={20} color={colors.text.secondary} />,
          title: 'Venue Reminders',
          subtitle: 'Reminders when check-in expires',
          type: 'toggle',
          value: venueReminders,
          onPress: () => setVenueReminders(!venueReminders),
        },
        {
          id: '7',
          icon: <Heart size={20} color={colors.text.secondary} />,
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
          icon: <Shield size={20} color={colors.text.secondary} />,
          title: 'Blocked Users',
          subtitle: 'Manage blocked accounts',
          type: 'navigation',
          onPress: () => router.push('/settings/blocked-users'),
        },
        {
          id: '9',
          icon: <Shield size={20} color={colors.text.secondary} />,
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          onPress: () => router.push('/settings/privacy-policy'),
        },
        {
          id: '10',
          icon: <Shield size={20} color={colors.text.secondary} />,
          title: 'Safety Tips',
          subtitle: 'Learn how to stay safe',
          type: 'navigation',
          onPress: () => router.push('/settings/safety-tips'),
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: '12',
          icon: <Globe size={20} color={colors.text.secondary} />,
          title: 'Language',
          subtitle: 'English',
          type: 'navigation',
        },
        {
          id: '13',
          icon: <Moon size={20} color={colors.text.secondary} />,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'toggle',
          value: darkMode,
          onPress: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      title: 'Subscription',
      items: [
        {
          id: '15',
          icon: <Crown size={20} color={colors.accent.gold} />,
          title: 'Ketchup Premium',
          subtitle: 'Upgrade to premium features',
          type: 'navigation',
          onPress: () => router.push('/settings/subscription'),
        },
        {
          id: '16',
          icon: <CreditCard size={20} color={colors.text.secondary} />,
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
          icon: <HelpCircle size={20} color={colors.text.secondary} />,
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          type: 'navigation',
        },
        {
          id: '18',
          icon: <Heart size={20} color={colors.text.secondary} />,
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: '20',
          icon: <LogOut size={20} color={colors.error.main} />,
          title: 'Log Out',
          subtitle: 'Sign out of your account',
          type: 'action',
          onPress: handleLogout,
          destructive: true,
        },
        {
          id: '21',
          icon: <Trash2 size={20} color={colors.error.main} />,
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
      activeOpacity={0.7}
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
          trackColor={{ false: colors.border.medium, true: colors.primary.light }}
          thumbColor={colors.background.primary}
        />
      ) : (
        <ChevronRight size={20} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTitleStyle: { ...typography.h4, color: colors.text.primary },
          headerShadowVisible: false,
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
          <Text style={styles.version}>Ketchup v1.0.0</Text>
          <Text style={styles.copyright}>Made with love</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  section: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionItems: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  destructiveIcon: {
    backgroundColor: colors.secondary.light,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  destructiveText: {
    color: colors.error.main,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: 72,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    marginHorizontal: spacing.lg,
  },
  version: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  copyright: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
