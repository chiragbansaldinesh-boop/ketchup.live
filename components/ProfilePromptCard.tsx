import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';

interface ProfilePromptCardProps {
  prompt: string;
  answer: string;
  onLike: () => void;
}

export default function ProfilePromptCard({ prompt, answer, onLike }: ProfilePromptCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Text style={styles.answer}>{answer}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={onLike}>
        <Heart size={24} color="#E10600" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  prompt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E10600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  answer: {
    fontSize: 18,
    color: '#374151',
    lineHeight: 26,
    paddingRight: 40,
  },
  likeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
});
