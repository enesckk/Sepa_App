import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Navigation, MapPin } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Place, getPlaceIcon, PlaceType } from '../services/mockLocationsData';

// Conditional import for react-native-maps (only works in Development Build)
let MapView: any = null;
let Marker: any = null;
type RegionType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// Check if we're in Expo Go - use try-catch to avoid PlatformConstants error
let isExpoGo = true;
try {
  // Try to access expo-constants safely
  const Constants = require('expo-constants');
  isExpoGo = Constants?.executionEnvironment === 'storeClient' || !Constants?.executionEnvironment;
} catch (e) {
  // If expo-constants fails, assume Expo Go
  isExpoGo = true;
}

// Try to import Maps only if not in Expo Go
if (!isExpoGo) {
  try {
    const MapsModule = require('react-native-maps');
    MapView = MapsModule.default;
    Marker = MapsModule.Marker;
  } catch (e) {
    // Maps not available
    if (__DEV__) {
      console.log('react-native-maps not available, using fallback');
    }
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.4;

interface GuideMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onMarkerPress: (place: Place) => void;
  onCenterLocation?: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export const GuideMap: React.FC<GuideMapProps> = ({
  places,
  selectedPlace,
  onMarkerPress,
  onCenterLocation,
  userLocation,
}) => {
  const mapRef = useRef<any>(null);
  const markerScale = useSharedValue(1);

  const defaultRegion: RegionType = {
    latitude: 37.0662,
    longitude: 37.3833,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [selectedPlace]);

  const handleCenterLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
      markerScale.value = withSpring(1.2, { damping: 10, stiffness: 200 });
      setTimeout(() => {
        markerScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }, 300);
    }
  };

  const getMarkerColor = (type: PlaceType): string => {
    const colors: Record<PlaceType, string> = {
      mosque: Colors.primary,
      pharmacy: Colors.error,
      facility: Colors.info,
      wedding: '#FF6B9D',
    };
    return colors[type];
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markerScale.value }],
  }));

  // Expo Go fallback - show placeholder instead of map
  if (isExpoGo || !MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <MapPin size={48} color={Colors.primary} />
          <Text style={styles.placeholderTitle}>Harita Görünümü</Text>
          <Text style={styles.placeholderText}>
            Harita özelliği Expo Go'da desteklenmiyor.{'\n'}
            Development Build kullanarak haritayı görüntüleyebilirsiniz.
          </Text>
          <View style={styles.placeList}>
            {places.slice(0, 3).map((place) => (
              <Pressable
                key={place.id}
                style={[
                  styles.placeItem,
                  selectedPlace?.id === place.id && styles.placeItemSelected,
                ]}
                onPress={() => onMarkerPress(place)}
              >
                <Text style={styles.placeIcon}>{getPlaceIcon(place.type)}</Text>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <Text style={styles.placeAddress} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Development Build - show actual map
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={defaultRegion}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
        provider="google"
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => onMarkerPress(place)}
            pinColor={getMarkerColor(place.type)}
          >
            <Animated.View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(place.type) },
                selectedPlace?.id === place.id && animatedStyle,
              ]}
            >
              <Text style={styles.markerIcon}>{getPlaceIcon(place.type)}</Text>
            </Animated.View>
          </Marker>
        ))}
      </MapView>

      {onCenterLocation && userLocation && (
        <Pressable
          style={styles.centerButton}
          onPress={handleCenterLocation}
        >
          <Navigation size={20} color={Colors.surface} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: MAP_HEIGHT,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  markerIcon: {
    fontSize: 20,
  },
  centerButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.surface,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  placeList: {
    width: '100%',
    gap: 12,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '10',
  },
  placeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

