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
import { LinearGradient } from 'expo-linear-gradient';
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
              {/* Gradient Overlay - sadece altta */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']}
                style={styles.overlay}
              />
              {item.title && (
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              )}
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
        <View style={styles.searchIconContainer}>
          <Search size={20} color={Colors.primary} strokeWidth={2.5} />
        </View>
        <Text style={styles.searchText}>Uygulamada ara...</Text>
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
    height: 240,
    position: 'relative',
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 240,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.surface,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  searchIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  searchText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
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

