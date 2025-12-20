import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Eye, Plus } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  mediaUrl: string;
  timestamp: string;
  viewed: boolean;
  viewerCount: number;
}

const mockStories: Story[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Emma',
    userPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaUrl: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '2h ago',
    viewed: false,
    viewerCount: 24,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Alex',
    userPhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaUrl: 'https://images.pexels.com/photos/1394841/pexels-photo-1394841.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '5h ago',
    viewed: false,
    viewerCount: 18,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Sophie',
    userPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '8h ago',
    viewed: true,
    viewerCount: 42,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'James',
    userPhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '12h ago',
    viewed: true,
    viewerCount: 31,
  },
];

export default function StoriesScreen() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStoryPress = (story: Story, index: number) => {
    setSelectedStory(story);
    setCurrentIndex(index);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  const StoryCircle = ({ story, index }: { story: Story; index: number }) => (
    <TouchableOpacity
      style={styles.storyCircle}
      onPress={() => handleStoryPress(story, index)}
    >
      <View style={[styles.storyRing, !story.viewed && styles.storyRingUnseen]}>
        <Image source={{ uri: story.userPhoto }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {story.userName}
      </Text>
    </TouchableOpacity>
  );

  const StoryViewer = () => {
    if (!selectedStory) return null;

    return (
      <Modal
        visible={!!selectedStory}
        animationType="fade"
        onRequestClose={closeStory}
      >
        <View style={styles.storyViewerContainer}>
          <Image
            source={{ uri: selectedStory.mediaUrl }}
            style={styles.storyMedia}
            resizeMode="cover"
          />

          <View style={styles.storyOverlay}>
            <View style={styles.storyHeader}>
              <View style={styles.progressBarContainer}>
                {mockStories.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: index <= currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.storyUserInfo}>
                <Image
                  source={{ uri: selectedStory.userPhoto }}
                  style={styles.storyUserPhoto}
                />
                <View style={styles.storyUserDetails}>
                  <Text style={styles.storyUserName}>{selectedStory.userName}</Text>
                  <Text style={styles.storyTimestamp}>{selectedStory.timestamp}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeStory}>
                  <X size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.storyFooter}>
              <View style={styles.viewerInfo}>
                <Eye size={16} color="#FFFFFF" />
                <Text style={styles.viewerCount}>{selectedStory.viewerCount} views</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stories</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      >
        <TouchableOpacity style={styles.addStoryCircle}>
          <View style={styles.addStoryButton}>
            <Plus size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.storyName}>Your Story</Text>
        </TouchableOpacity>

        {mockStories.map((story, index) => (
          <StoryCircle key={story.id} story={story} index={index} />
        ))}
      </ScrollView>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Stories</Text>
        <View style={styles.recentGrid}>
          {mockStories.slice(0, 6).map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.recentCard}
              onPress={() => handleStoryPress(story, mockStories.indexOf(story))}
            >
              <Image source={{ uri: story.mediaUrl }} style={styles.recentImage} />
              <View style={styles.recentOverlay}>
                <Image source={{ uri: story.userPhoto }} style={styles.recentUserPhoto} />
                <Text style={styles.recentUserName}>{story.userName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <StoryViewer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  addStoryCircle: {
    alignItems: 'center',
    marginRight: 12,
  },
  addStoryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E10600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  storyCircle: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyRing: {
    padding: 3,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  storyRingUnseen: {
    borderColor: '#E10600',
  },
  storyImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  storyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    maxWidth: 80,
    textAlign: 'center',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recentCard: {
    width: (width - 52) / 2,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentUserPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  recentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  storyViewerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  storyMedia: {
    width: width,
    height: height,
  },
  storyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  storyHeader: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
  },
  storyUserDetails: {
    flex: 1,
  },
  storyUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storyTimestamp: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  closeButton: {
    padding: 8,
  },
  storyFooter: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  viewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
