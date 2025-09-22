import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Star } from 'lucide-react-native';

interface SmallUserCardProps {
  id: string;
  name: string;
  age: number;
  photo: string;
  isMatch?: boolean;
  isOnline?: boolean;
  onPress?: () => void;
}

export default function SmallUserCard({
  id,
  name,
  age,
  photo,
  isMatch = false,
  isOnline = false,
  onPress,
}: SmallUserCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photo }} style={styles.photo} />
        {isOnline && <View style={styles.onlineIndicator} />}
        {isMatch && (
          <View style={styles.matchBadge}>
            <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.age}>{age}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  matchBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  info: {
    alignItems: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  age: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});