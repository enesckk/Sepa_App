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
  withSpring,
  runOnJS,
  cancelAnimation,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { X } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Story, mockStories } from '../services/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 saniye
const SWIPE_DOWN_THRESHOLD = 100; // Swipe down için minimum mesafe

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
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isLongPressingRef = useRef(false);
  const handleNextRef = useRef<(() => void) | null>(null);
  const handlePreviousRef = useRef<(() => void) | null>(null);

  // initialStoryIndex değiştiğinde currentIndex'i güncelle
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialStoryIndex);
      progress.value = 0;
      setIsPaused(false);
      isLongPressingRef.current = false;
      translateY.value = 0;
      scale.value = 1;
    }
  }, [initialStoryIndex, visible, progress, translateY, scale]);

  const currentStory = mockStories[currentIndex];

  const handleClose = useCallback(() => {
    cancelAnimation(progress);
    cancelAnimation(translateY);
    cancelAnimation(scale);
    setIsPaused(false);
    isLongPressingRef.current = false;
    progress.value = 0;
    translateY.value = 0;
    scale.value = 1;
    onClose();
  }, [onClose, progress, translateY, scale]);

  const handleNext = useCallback(() => {
    if (isLongPressingRef.current) return;
    
    cancelAnimation(progress);
    progress.value = 0;
    
    if (currentIndex < mockStories.length - 1) {
      // Fade out animasyonu
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentIndex)(prev => prev + 1);
        opacity.value = withTiming(1, { duration: 150 });
      });
    } else {
      handleClose();
    }
  }, [currentIndex, handleClose, progress, opacity]);

  const handlePrevious = useCallback(() => {
    if (isLongPressingRef.current) return;
    
    cancelAnimation(progress);
    progress.value = 0;
    
    if (currentIndex > 0) {
      // Fade out animasyonu
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentIndex)(prev => prev - 1);
        opacity.value = withTiming(1, { duration: 150 });
      });
    } else {
      handleClose();
    }
  }, [currentIndex, handleClose, progress, opacity]);

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
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.95, { duration: 150 });
    }
  }, [visible, opacity, scale]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value },
        { scale: Math.min(scale.value, scaleValue) },
      ],
      opacity: interpolate(
        translateY.value,
        [0, SWIPE_DOWN_THRESHOLD],
        [1, 0.5],
        Extrapolate.CLAMP
      ),
    };
  });

  // Swipe down gesture - Instagram gibi
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        // Sadece aşağı swipe
        translateY.value = event.translationY;
        const scaleValue = interpolate(
          event.translationY,
          [0, SCREEN_HEIGHT],
          [1, 0.8],
          Extrapolate.CLAMP
        );
        scale.value = scaleValue;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_DOWN_THRESHOLD) {
        // Kapat
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
          runOnJS(handleClose)();
        });
        scale.value = withTiming(0.8, { duration: 200 });
      } else {
        // Geri dön
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }
    });

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
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
          
          <Animated.View style={[styles.content, contentStyle]}>
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
                  <Text style={styles.storyTime}>Şimdi</Text>
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
          </Animated.View>
        </View>
      </GestureDetector>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  storyTime: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.7,
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
