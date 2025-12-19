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
import { BlurView } from 'expo-blur';
import { Search } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  gradient?: string[]; // Optional gradient colors for fallback
}

interface AutoPlayCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number; // default: 5000ms
  onSearchPress?: () => void;
}

export const AutoPlayCarousel: React.FC<AutoPlayCarouselProps> = ({
  items,
  autoPlayInterval = 5000,
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
            {/* Background Gradient (fallback if image fails) */}
            {item.gradient && (
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.imageBackground}
              resizeMode="cover"
              imageStyle={styles.imageStyle}
            >
              {/* Gradient Overlay - top and bottom for better text readability */}
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
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

      {/* Floating Search Bar with Şehitkamil Logo */}
      {onSearchPress && (
        <TouchableOpacity
          onPress={onSearchPress}
          activeOpacity={0.9}
          style={styles.searchBarContainer}
        >
          <BlurView intensity={95} tint="light" style={styles.searchBarBlur}>
            <View style={styles.searchBar}>
              {/* Şehitkamil Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>Ş</Text>
                </View>
                <Text style={styles.logoName}>Şehitkamil</Text>
              </View>
              
              {/* Search Input */}
              <View style={styles.searchInputContainer}>
                <Search size={18} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.searchText}>Uygulamada ara...</Text>
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
      )}

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
    height: 280,
    position: 'relative',
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    opacity: 0.9,
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
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.surface,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
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
    backgroundColor: Colors.surface,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  searchBarContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  searchBarBlur: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchBar: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  logoName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
  },
  searchText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
});

