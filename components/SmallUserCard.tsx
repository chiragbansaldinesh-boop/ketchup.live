import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';

interface SmallUserCardProps {
  id: string;
  name: string;
  age: number;
  photo: string;
  isMatch: boolean;
  isOnline: boolean;
  onPress: () => void;
}

export default function SmallUserCard({
  name,
  age,
  photo,
  isMatch,
  isOnline,
  onPress,
}: SmallUserCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photo }} style={styles.image} />
        {isOnline && <View style={styles.onlineIndicator} />}
        {isMatch && (
          <View style={styles.matchBadge}>
            <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}, {age}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    maxWidth: 80,
  },
});
