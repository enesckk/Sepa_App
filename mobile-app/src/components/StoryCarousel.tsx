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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_SIZE = 72;
const STORY_ACTIVE_SIZE = 80;
const STORY_SPACING = 16;

interface StoryItemProps {
  story: {
    id: string;
    image: string;
    title: string;
    description: string;
  };
  index: number;
  animatedValue: SharedValue<number>;
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
        <View style={styles.storyCircleWrapper}>
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
        </View>
        <Text style={styles.storyTitle} numberOfLines={1}>
          {story.title}
        </Text>
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
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    });
    
    setSelectedStory(isSelected ? null : storyId);
  };

  return (
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
            onPress={handleStoryPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
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
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: -0.2,
  },
});

