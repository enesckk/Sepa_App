import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
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
  const opacity = useSharedValue(0);
  const isLongPressingRef = useRef(false);
  const progressAnimationRef = useRef<number | null>(null);
  const handleNextRef = useRef<(() => void) | null>(null);
  const handlePreviousRef = useRef<(() => void) | null>(null);

  // initialStoryIndex değiştiğinde currentIndex'i güncelle
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialStoryIndex);
      progress.value = 0;
      setIsPaused(false);
      isLongPressingRef.current = false;
    }
  }, [initialStoryIndex, visible, progress]);

  const currentStory = mockStories[currentIndex];

  const handleClose = useCallback(() => {
    cancelAnimation(progress);
    setIsPaused(false);
    isLongPressingRef.current = false;
    progress.value = 0;
    onClose();
  }, [onClose, progress]);

  const handleNext = useCallback(() => {
    if (isLongPressingRef.current) return;
    
    cancelAnimation(progress);
    progress.value = 0;
    
    if (currentIndex < mockStories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleClose();
    }
  }, [currentIndex, handleClose, progress]);

  const handlePrevious = useCallback(() => {
    if (isLongPressingRef.current) return;
    
    cancelAnimation(progress);
    progress.value = 0;
    
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      handleClose();
    }
  }, [currentIndex, handleClose, progress]);

  // Ref'leri güncelle
  useEffect(() => {
    handleNextRef.current = handleNext;
    handlePreviousRef.current = handlePrevious;
  }, [handleNext, handlePrevious]);

  const handlePause = useCallback(() => {
    if (isLongPressingRef.current) return;
    setIsPaused(true);
    cancelAnimation(progress);
  }, [progress]);

  const handleResume = useCallback(() => {
    if (!isLongPressingRef.current) return;
    setIsPaused(false);
    const currentProgress = progress.value;
    const remaining = (1 - currentProgress) * STORY_DURATION;
    progress.value = withTiming(1, { duration: remaining }, (finished) => {
      if (finished) {
        const nextHandler = handleNextRef.current;
        if (nextHandler) {
          runOnJS(nextHandler)();
        }
      }
    });
  }, [progress]);

  // Progress bar animasyonu
  useEffect(() => {
    if (!visible || !currentStory) {
      progress.value = 0;
      return;
    }

    if (isPaused) {
      cancelAnimation(progress);
      return;
    }

    // Progress'i sıfırla ve başlat
    cancelAnimation(progress);
    progress.value = 0;
    
    progress.value = withTiming(1, { duration: STORY_DURATION }, (finished) => {
      if (finished && !isPaused && !isLongPressingRef.current) {
        const nextHandler = handleNextRef.current;
        if (nextHandler) {
          runOnJS(nextHandler)();
        }
      }
    });

    return () => {
      cancelAnimation(progress);
    };
  }, [visible, currentIndex, isPaused, currentStory, progress]);

  // Hikayeyi izlenmiş olarak işaretle
  useEffect(() => {
    if (visible && currentStory) {
      onViewed(currentStory.id);
    }
  }, [visible, currentIndex, currentStory, onViewed]);

  // Modal açılış/kapanış animasyonu
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, opacity]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Touch handlers - Instagram mantığı
  const handleLeftPress = useCallback(() => {
    if (isLongPressingRef.current) return;
    handlePrevious();
  }, [handlePrevious]);

  const handleRightPress = useCallback(() => {
    if (isLongPressingRef.current) return;
    handleNext();
  }, [handleNext]);

  const handleLongPressStart = useCallback(() => {
    isLongPressingRef.current = true;
    handlePause();
  }, [handlePause]);

  const handleLongPressEnd = useCallback(() => {
    isLongPressingRef.current = false;
    handleResume();
  }, [handleResume]);

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
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        
        <View style={styles.content}>
          {/* Progress Bars - Üstte Instagram gibi */}
          <View style={styles.progressContainer}>
            {mockStories.map((_, index) => (
              <View key={index} style={styles.progressBarBackground}>
                {index < currentIndex && (
                  <View style={[styles.progressBar, styles.progressBarCompleted]} />
                )}
                {index === currentIndex && (
                  <Animated.View style={[styles.progressBar, progressBarStyle]} />
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

          {/* Story Info Overlay - Altta Instagram gibi */}
          <View style={styles.infoOverlay}>
            <View style={styles.infoContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: currentStory.image }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.storyTitle}>{currentStory.title}</Text>
                <Text style={styles.storyDescription}>{currentStory.description}</Text>
              </View>
            </View>
          </View>

          {/* Touch Areas - Instagram mantığı */}
          {/* Sol taraf: Önceki story */}
          <Pressable
            style={styles.leftTouchArea}
            onPress={handleLeftPress}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
            delayLongPress={150}
          />
          
          {/* Orta taraf: Sadece long press (pause) */}
          <Pressable
            style={styles.centerTouchArea}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
            delayLongPress={150}
          />
          
          {/* Sağ taraf: Sonraki story */}
          <Pressable
            style={styles.rightTouchArea}
            onPress={handleRightPress}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
            delayLongPress={150}
          />

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X size={20} color={Colors.surface} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    gap: 4,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  progressBarCompleted: {
    width: '100%',
  },
  storyImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 16,
    zIndex: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.surface,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.surface,
    marginBottom: 2,
  },
  storyDescription: {
    fontSize: 13,
    color: Colors.surface,
    opacity: 0.9,
    lineHeight: 18,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH / 3,
    zIndex: 2,
  },
  centerTouchArea: {
    position: 'absolute',
    left: SCREEN_WIDTH / 3,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH / 3,
    zIndex: 2,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH / 3,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
