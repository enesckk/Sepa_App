import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TopTabBar } from '../src/components/TopTabBar';
import { GuideList } from '../src/components/GuideList';
import { GuideMap } from '../src/components/GuideMap';
import { PlaceDetailModal } from '../src/components/PlaceDetailModal';
import { LocationPermissionPrompt } from '../src/components/LocationPermissionPrompt';
import { Colors } from '../src/constants/colors';
import { mockPlaces, Place, PlaceType } from '../src/services/mockLocationsData';

export default function CityGuideScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<PlaceType>('mosque');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredPlaces = useMemo(() => {
    let places = mockPlaces.filter((place) => place.type === selectedTab);
    
    // Calculate distances if user location is available
    if (userLocation) {
      places = places.map((place) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude
        );
        return { ...place, distance };
      }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Add favorite status
    return places.map((place) => ({
      ...place,
      isFavorite: favorites.has(place.id),
    }));
  }, [selectedTab, userLocation, favorites]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const handlePlacePress = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const handleShowOnMap = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const handleToggleFavorite = (placeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  const handleRequestLocation = () => {
    // Mock location - in real app, use expo-location
    setUserLocation({ latitude: 37.0594, longitude: 37.3825 });
    setShowPermissionPrompt(false);
  };

  const handleCenterLocation = () => {
    if (!userLocation) {
      setShowPermissionPrompt(true);
      return;
    }
    // Map will center to user location
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Şehir Rehberi</Text>
        <Text style={styles.headerSubtitle}>
          Yakın mekânları keşfedin
        </Text>
      </View>

      <TopTabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

      <GuideMap
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onMarkerPress={handleMarkerPress}
        onCenterLocation={handleCenterLocation}
        userLocation={userLocation}
      />

      <View style={styles.listContainer}>
        <GuideList
          places={filteredPlaces}
          onPlacePress={handlePlacePress}
          onShowOnMap={handleShowOnMap}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      <PlaceDetailModal
        visible={modalVisible}
        place={selectedPlace}
        onClose={() => {
          setModalVisible(false);
          setSelectedPlace(null);
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      <LocationPermissionPrompt
        visible={showPermissionPrompt}
        onRequestPermission={handleRequestLocation}
        onDismiss={() => setShowPermissionPrompt(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContainer: {
    flex: 1,
  },
});

