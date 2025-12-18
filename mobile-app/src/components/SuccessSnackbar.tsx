import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CheckCircle } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface SuccessSnackbarProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  onComplete: () => void;
}

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  visible,
  message,
  subMessage,
  onComplete,
}) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
      
      setTimeout(() => {
        translateY.value = withSpring(100, { damping: 20, stiffness: 100 });
        opacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 3000);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content}>
        <CheckCircle size={24} color={Colors.success} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
          {subMessage && (
            <Text style={styles.subMessage}>{subMessage}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  subMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

