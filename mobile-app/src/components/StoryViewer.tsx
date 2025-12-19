import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Story } from '../services/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryViewerProps {
  visible: boolean;
  story: Story | null;
  onClose: () => void;
  onViewed: (storyId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  story,
  onClose,
  onViewed,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && story) {
      // Açılış animasyonu - büyüme efekti
      scale.value = withSequence(
        withSpring(0.8, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      
      // Hikayeyi izlenmiş olarak işaretle
      onViewed(story.id);
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, story]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!story) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar hidden={Platform.OS === 'android'} />
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={28} color={Colors.surface} />
        </Pressable>

        {/* Story Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: story.image }}
            style={styles.storyImage}
            resizeMode="contain"
          />
        </View>

        {/* Story Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.storyTitle}>{story.title}</Text>
          <Text style={styles.storyDescription}>{story.description}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginTop: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  storyDescription: {
    fontSize: 16,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
});

