import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Trophy, Star, Heart, QrCode, Gamepad as GamepadIcon, Zap, Crown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  total?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const badges: Badge[] = [
  {
    id: '1',
    title: 'First Match',
    description: 'Get your first match',
    icon: <Heart size={32} color="#FFFFFF" />,
    earned: true,
    rarity: 'common',
  },
  {
    id: '2',
    title: 'QR Master',
    description: 'Scan 10 venue QR codes',
    icon: <QrCode size={32} color="#FFFFFF" />,
    earned: true,
    progress: 10,
    total: 10,
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Game Master',
    description: 'Play 25 games with matches',
    icon: <GamepadIcon size={32} color="#FFFFFF" />,
    earned: false,
    progress: 12,
    total: 25,
    rarity: 'epic',
  },
  {
    id: '4',
    title: 'Venue Explorer',
    description: 'Visit 20 different venues',
    icon: <Star size={32} color="#FFFFFF" />,
    earned: false,
    progress: 7,
    total: 20,
    rarity: 'rare',
  },
  {
    id: '5',
    title: 'Ketchup Legend',
    description: 'Get 100 matches',
    icon: <Crown size={32} color="#FFFFFF" />,
    earned: false,
    progress: 23,
    total: 100,
    rarity: 'legendary',
  },
  {
    id: '6',
    title: 'Speed Dater',
    description: 'Match with 5 people in one day',
    icon: <Zap size={32} color="#FFFFFF" />,
    earned: false,
    progress: 2,
    total: 5,
    rarity: 'epic',
  },
];

const boosts = [
  {
    id: '1',
    title: 'Venue Spotlight',
    description: 'Appear first in venue pool for 30 minutes',
    price: '$2.99',
    duration: '30 min',
    color: '#E53935',
  },
  {
    id: '2',
    title: 'Super Like',
    description: 'Send 5 super likes to stand out',
    price: '$1.99',
    duration: '5 uses',
    color: '#7C3AED',
  },
  {
    id: '3',
    title: 'Rewind',
    description: 'Undo your last 3 swipes',
    price: '$0.99',
    duration: '3 uses',
    color: '#059669',
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return '#6B7280';
    case 'rare': return '#3B82F6';
    case 'epic': return '#7C3AED';
    case 'legendary': return '#F59E0B';
    default: return '#6B7280';
  }
};

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState<'badges' | 'boosts'>('badges');

  const BadgeCard = ({ item }: { item: Badge }) => (
    <View style={[
      styles.badgeCard,
      { backgroundColor: getRarityColor(item.rarity) },
      !item.earned && styles.unearnedBadge
    ]}>
      <View style={[styles.badgeIcon, !item.earned && styles.unearnedIcon]}>
        {item.icon}
      </View>
      <Text style={[styles.badgeTitle, !item.earned && styles.unearnedText]}>
        {item.title}
      </Text>
      <Text style={[styles.badgeDescription, !item.earned && styles.unearnedText]}>
        {item.description}
      </Text>
      {!item.earned && item.progress !== undefined && item.total !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(item.progress / item.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress}/{item.total}
          </Text>
        </View>
      )}
      {item.earned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>✨ Earned</Text>
        </View>
      )}
    </View>
  );

  const BoostCard = ({ item }: { item: any }) => (
    <View style={styles.boostCard}>
      <View style={[styles.boostIcon, { backgroundColor: item.color }]}>
        <Zap size={24} color="#FFFFFF" />
      </View>
      <View style={styles.boostContent}>
        <Text style={styles.boostTitle}>{item.title}</Text>
        <Text style={styles.boostDescription}>{item.description}</Text>
        <Text style={styles.boostDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity style={[styles.boostButton, { backgroundColor: item.color }]}>
        <Text style={styles.boostPrice}>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Trophy size={32} color="#E53935" />
            <Text style={styles.statText}>8 Badges Earned</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
            Badges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'boosts' && styles.activeTab]}
          onPress={() => setActiveTab('boosts')}
        >
          <Text style={[styles.tabText, activeTab === 'boosts' && styles.activeTabText]}>
            Boosts
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'badges' ? (
        <FlatList
          key={`badges-${activeTab}`}
          data={badges}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.badgeRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.badgesList}
          renderItem={({ item }) => <BadgeCard item={item} />}
        />
      ) : (
        <FlatList
          key={`boosts-${activeTab}`}
          data={boosts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.boostsList}
          renderItem={({ item }) => <BoostCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E53935',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  badgesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  badgeRow: {
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: (width - 52) / 2,
    aspectRatio: 0.8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unearnedBadge: {
    backgroundColor: '#F3F4F6',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unearnedIcon: {
    backgroundColor: '#D1D5DB',
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 12,
  },
  unearnedText: {
    color: '#6B7280',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  earnedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earnedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  boostsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  boostCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  boostIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  boostContent: {
    flex: 1,
  },
  boostTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  boostDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  boostDuration: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  boostButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  boostPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});