import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { mockStories } from '../services/mockData';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_SIZE = 70;
const STORY_ACTIVE_SIZE = 85;
const STORY_SPACING = 12;

interface StoryItemProps {
  story: {
    id: string;
    image: string;
    title: string;
    description: string;
  };
  index: number;
  animatedValue: Animated.SharedValue<number>;
  isSelected: boolean;
  onPress: (index: number, storyId: string) => void;
}

const StoryItem: React.FC<StoryItemProps> = ({
  story,
  index,
  animatedValue,
  isSelected,
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
        <View style={[
          styles.storyCircle,
          isSelected && styles.storyCircleActive
        ]}>
          <Image
            source={{ uri: story.image }}
            style={styles.storyImage}
          />
        </View>
        {isSelected && (
          <View style={styles.storyInfo}>
            <Text style={styles.storyTitle} numberOfLines={1}>
              {story.title}
            </Text>
            <Text style={styles.storyDescription} numberOfLines={2}>
              {story.description}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export const StoryCarousel: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const animatedValues = useRef(
    mockStories.map(() => useSharedValue(0))
  ).current;

  const handleStoryPress = (index: number, storyId: string) => {
    const isSelected = selectedStory === storyId;
    
    animatedValues[index].value = withSpring(isSelected ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
    
    setSelectedStory(isSelected ? null : storyId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Başkan'ın Hikayeleri</Text>
      <View style={styles.carousel}>
        {mockStories.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            index={index}
            animatedValue={animatedValues[index]}
            isSelected={selectedStory === story.id}
            onPress={handleStoryPress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  carousel: {
    flexDirection: 'row',
    gap: STORY_SPACING,
  },
  storyWrapper: {
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: 'center',
  },
  storyCircle: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 3,
    borderColor: Colors.primary,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  storyCircleActive: {
    borderColor: Colors.primaryLight,
    borderWidth: 4,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyInfo: {
    marginTop: 8,
    width: STORY_SIZE + 20,
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  storyDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

