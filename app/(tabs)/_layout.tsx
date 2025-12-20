import { Tabs } from 'expo-router';
import { MessageCircle, User, MapPin, Film, Heart } from 'lucide-react-native';
import KetchupBottleIcon from '@/components/KetchupBottleIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D50000',
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
            <Heart size={size} color={color} fill={color === '#D50000' ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Stories',
          tabBarIcon: ({ size, color }) => (
            <Film size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: 'Café Map',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Matches',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} fill={color === '#D50000' ? color : 'none'} />
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
      <Tabs.Screen
        name="scanner"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="proximity"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}