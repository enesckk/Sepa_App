import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { mockNotices } from '../services/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const NoticeBanner: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % mockNotices.length;
      
      Animated.timing(scrollX, {
        toValue: currentIndex.current,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000); // Change notice every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const translateX = scrollX.interpolate({
    inputRange: [0, mockNotices.length - 1],
    outputRange: [0, -(SCREEN_WIDTH - 40)],
  });

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <AlertCircle size={20} color={Colors.warning} />
        <View style={styles.noticeContainer}>
          <Animated.View
            style={[
              styles.noticeWrapper,
              { transform: [{ translateX }] },
            ]}
          >
            {mockNotices.map((notice, index) => (
              <Text key={index} style={styles.noticeText} numberOfLines={1}>
                {notice}
              </Text>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  noticeContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  noticeWrapper: {
    flexDirection: 'row',
    width: (SCREEN_WIDTH - 40) * mockNotices.length,
  },
  noticeText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    width: SCREEN_WIDTH - 40,
    paddingRight: 20,
  },
});

