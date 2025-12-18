import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MapPin, Navigation, Heart } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Place, getPlaceIcon } from '../services/mockLocationsData';

interface GuideListItemProps {
  place: Place;
  onPress: (place: Place) => void;
  onShowOnMap: (place: Place) => void;
  onToggleFavorite?: (placeId: string) => void;
}

export const GuideListItem: React.FC<GuideListItemProps> = ({
  place,
  onPress,
  onShowOnMap,
  onToggleFavorite,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <Pressable
      onPress={() => onPress(place)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>{getPlaceIcon(place.type)}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={styles.description} numberOfLines={1}>
                {place.description}
              </Text>
            </View>
            {place.type === 'facility' && onToggleFavorite && (
              <Pressable
                onPress={() => onToggleFavorite(place.id)}
                style={styles.favoriteButton}
              >
                <Heart
                  size={20}
                  color={place.isFavorite ? Colors.error : Colors.textSecondary}
                  fill={place.isFavorite ? Colors.error : 'none'}
                />
              </Pressable>
            )}
          </View>

          {place.distance && (
            <View style={styles.distanceContainer}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.distance}>{formatDistance(place.distance)}</Text>
            </View>
          )}

          {place.features && place.features.length > 0 && (
            <View style={styles.featuresContainer}>
              {place.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={styles.mapButton}
            onPress={() => onShowOnMap(place)}
          >
            <Navigation size={16} color={Colors.primary} />
            <Text style={styles.mapButtonText}>Haritada Göster</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  favoriteButton: {
    padding: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});

