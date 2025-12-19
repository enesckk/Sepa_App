import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
}

interface AutoPlayCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number; // default: 3000ms
  onSearchPress?: () => void;
}

export const AutoPlayCarousel: React.FC<AutoPlayCarouselProps> = ({
  items,
  autoPlayInterval = 3000,
  onSearchPress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, items.length, autoPlayInterval]);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.scrollView}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.slide}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              {/* Dark Overlay */}
              <View style={styles.overlay} />
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Search Bar Overlay */}
      <TouchableOpacity
        onPress={onSearchPress}
        activeOpacity={0.8}
        style={styles.searchBar}
      >
        <Search size={20} color={Colors.textSecondary} strokeWidth={2} />
        <Text style={styles.searchText}>Şehitkamil'de ara...</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 200,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  searchBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 8,
    height: 8,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

