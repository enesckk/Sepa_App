import React, { useEffect, useRef, useState } from 'react';
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
  PanResponder,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Story, mockStories } from '../services/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 saniye

interface StoryViewerProps {
  visible: boolean;
  initialStoryIndex: number;
  onClose: () => void;
  onViewed: (storyId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  initialStoryIndex,
  onClose,
  onViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1); // Başlangıçta görünür
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // initialStoryIndex değiştiğinde currentIndex'i güncelle
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialStoryIndex);
      progress.value = 0;
    }
  }, [initialStoryIndex, visible]);

  const currentStory = mockStories[currentIndex];

  // Progress bar animasyonu - hemen başlat
  useEffect(() => {
    if (visible && !isPaused && currentStory) {
      // Hemen başlat, gecikme yok
      progress.value = 0;
      // Kısa bir delay sonra başlat (render tamamlansın)
      const timer = setTimeout(() => {
        progress.value = withTiming(1, { duration: STORY_DURATION }, (finished) => {
          if (finished) {
            runOnJS(handleNext)();
          }
        });
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [visible, currentIndex, isPaused]);

  // Hikayeyi izlenmiş olarak işaretle
  useEffect(() => {
    if (visible && currentStory) {
      onViewed(currentStory.id);
    }
  }, [visible, currentIndex]);

  // Modal açılış/kapanış animasyonu - hızlı açılış
  useEffect(() => {
    if (visible) {
      // Hemen görünür yap, animasyon yok
      opacity.value = 1;
      translateX.value = 0;
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateX.value = withSpring(SCREEN_WIDTH, { damping: 20, stiffness: 100 });
    }
  }, [visible]);

  const handleNext = () => {
    progress.value = 0; // Hemen sıfırla
    if (currentIndex < mockStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    progress.value = 0; // Hemen sıfırla
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onClose();
  };


  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!currentStory) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: opacity.value }]} />
        
        <Pressable 
          style={styles.content}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            if (locationX < SCREEN_WIDTH / 3) {
              handlePrevious();
            } else if (locationX > (SCREEN_WIDTH * 2) / 3) {
              handleNext();
            } else {
              setIsPaused(!isPaused);
            }
          }}
        >
          <Animated.View style={[styles.contentInner, animatedContainerStyle]}>
            {/* Progress Bars */}
            <View style={styles.progressContainer}>
              {mockStories.map((_, index) => (
                <View key={index} style={styles.progressBarBackground}>
                  {index === currentIndex && (
                    <Animated.View style={[styles.progressBar, progressBarStyle]} />
                  )}
                  {index < currentIndex && (
                    <View style={[styles.progressBar, { width: '100%' }]} />
                  )}
                </View>
              ))}
            </View>

            {/* Story Image */}
            <Image
              source={{ uri: currentStory.image }}
              style={styles.storyImage}
              resizeMode="cover"
            />

            {/* Story Info Overlay */}
            <View style={styles.infoOverlay}>
              <Text style={styles.storyTitle}>{currentStory.title}</Text>
              <Text style={styles.storyDescription}>{currentStory.description}</Text>
            </View>

            {/* Navigation Hints */}
            <View style={styles.leftTouchArea}>
              <ChevronLeft size={40} color="rgba(255, 255, 255, 0.3)" />
            </View>
            <View style={styles.rightTouchArea}>
              <ChevronRight size={40} color="rgba(255, 255, 255, 0.3)" />
            </View>

            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={Colors.surface} />
            </Pressable>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 8,
    gap: 4,
    zIndex: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 2,
  },
  storyImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 5,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  storyDescription: {
    fontSize: 16,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    zIndex: 2,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

