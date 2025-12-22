import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { mockStories } from '../services/mockData';
import { Colors } from '../constants/colors';
import { StoryViewer } from './StoryViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_SIZE = 64; // Instagram benzeri daha küçük
const STORY_ACTIVE_SIZE = 72;
const STORY_SPACING = 12; // Daha kompakt

import { Story } from '../services/mockData';

interface StoryItemProps {
  story: Story;
  index: number;
  animatedValue: SharedValue<number>;
  isSelected: boolean;
  isViewed: boolean;
  onPress: (index: number, storyId: string) => void;
}

const StoryItem: React.FC<StoryItemProps> = ({
  story,
  index,
  animatedValue,
  isSelected,
  isViewed,
  onPress,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animatedValue.value,
      [0, 1],
      [1, STORY_ACTIVE_SIZE / STORY_SIZE]
    );
    
    return {
      transform: [{ scale }],
    };
  });

  return (
    <Pressable
      onPress={() => onPress(index, story.id)}
      style={styles.storyWrapper}
    >
      <Animated.View style={[styles.storyContainer, animatedStyle]}>
        <View style={styles.storyCircleWrapper}>
          {!isViewed ? (
            // İzlenmemiş hikaye - renkli gradient border
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.storyGradientBorder}
            >
              <View style={styles.storyCircle}>
                <Image
                  source={{ uri: story.image }}
                  style={styles.storyImage}
                />
              </View>
            </LinearGradient>
          ) : (
            // İzlenmiş hikaye - gri border
            <View style={[styles.storyGradientBorder, styles.viewedBorder]}>
              <View style={styles.storyCircle}>
                <Image
                  source={{ uri: story.image }}
                  style={[styles.storyImage, styles.viewedImage]}
                />
              </View>
            </View>
          )}
        </View>
        <Text style={[styles.storyTitle, isViewed && styles.viewedTitle]} numberOfLines={1}>
          {story.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const StoryCarousel: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(
    new Set(mockStories.filter(s => s.isViewed).map(s => s.id))
  );
  const [viewerVisible, setViewerVisible] = useState(false);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);
  const animatedValues = useRef(
    mockStories.map(() => useSharedValue(0))
  ).current;

  const handleStoryPress = (index: number, storyId: string) => {
    // Viewer'ı hemen aç - animasyon yok
    setInitialStoryIndex(index);
    setViewerVisible(true);
    
    // Hızlı feedback animasyonu
    animatedValues[index].value = withSpring(0.95, {
      damping: 15,
      stiffness: 400,
      mass: 0.5,
    });
    
    // Hemen geri dön
    setTimeout(() => {
      animatedValues[index].value = withSpring(0, {
        damping: 15,
        stiffness: 400,
        mass: 0.5,
      });
    }, 100);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
  };

  const handleStoryViewed = (storyId: string) => {
    if (!viewedStories.has(storyId)) {
      setViewedStories(prev => new Set([...prev, storyId]));
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          style={styles.carousel}
        >
          {mockStories.map((story, index) => (
            <StoryItem
              key={story.id}
              story={story}
              index={index}
              animatedValue={animatedValues[index]}
              isSelected={selectedStory === story.id}
              isViewed={viewedStories.has(story.id)}
              onPress={handleStoryPress}
            />
          ))}
        </ScrollView>
      </View>

      {/* Story Viewer Modal */}
      <StoryViewer
        visible={viewerVisible}
        initialStoryIndex={initialStoryIndex}
        onClose={handleCloseViewer}
        onViewed={handleStoryViewed}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: STORY_SPACING,
  },
  storyWrapper: {
    alignItems: 'center',
    marginRight: STORY_SPACING,
  },
  storyContainer: {
    alignItems: 'center',
    width: STORY_SIZE + 24,
  },
  storyCircleWrapper: {
    width: STORY_SIZE + 4,
    height: STORY_SIZE + 4,
    borderRadius: (STORY_SIZE + 4) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyGradientBorder: {
    width: STORY_SIZE + 4,
    height: STORY_SIZE + 4,
    borderRadius: (STORY_SIZE + 4) / 2,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCircle: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: -0.2,
    maxWidth: STORY_SIZE + 8,
  },
  viewedBorder: {
    borderWidth: 2.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  viewedImage: {
    opacity: 0.7,
  },
  viewedTitle: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

