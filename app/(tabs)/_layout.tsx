import { Tabs } from 'expo-router';
import { MessageCircle, QrCode, Trophy, User, MapPin, Navigation } from 'lucide-react-native';
import KetchupBottleIcon from '@/components/KetchupBottleIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <KetchupBottleIcon size={size} color={color} fill={color === '#E53935' ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan',
          tabBarIcon: ({ size, color }) => (
            <QrCode size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: 'Venues',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="proximity"
        options={{
          title: 'Location',
          tabBarIcon: ({ size, color }) => (
            <Navigation size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} fill={color === '#E53935' ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} fill={color === '#E53935' ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}