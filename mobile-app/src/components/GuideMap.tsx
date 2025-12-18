import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Navigation } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Place, getPlaceIcon, PlaceType } from '../services/mockLocationsData';

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
  const mapRef = useRef<MapView>(null);
  const markerScale = useSharedValue(1);

  const defaultRegion: Region = {
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
});

