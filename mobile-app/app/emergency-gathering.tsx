import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, Navigation } from 'lucide-react-native';
import { GuideMap } from '../src/components/GuideMap';
import { GuideList } from '../src/components/GuideList';
import { PlaceDetailModal } from '../src/components/PlaceDetailModal';
import { LocationPermissionPrompt } from '../src/components/LocationPermissionPrompt';
import { Colors } from '../src/constants/colors';
import {
  mockEmergencyGatheringAreas,
  EmergencyGatheringArea,
} from '../src/services/mockEmergencyGatheringData';

// Convert EmergencyGatheringArea to Place format for compatibility
const convertToPlace = (area: EmergencyGatheringArea) => ({
  id: area.id,
  name: area.name,
  description: area.description,
  type: 'facility' as const,
  latitude: area.latitude,
  longitude: area.longitude,
  address: area.address,
  phone: area.contactPhone,
  features: area.features,
  distance: area.distance,
  isFavorite: area.isFavorite,
  images: area.images,
});

export default function EmergencyGatheringScreen() {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState<EmergencyGatheringArea | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Request location permission on mount
  useEffect(() => {
    // In real app, use expo-location to request permission
    // For now, we'll use mock location
    const requestLocation = async () => {
      // Mock location - Gaziantep center
      setUserLocation({
        latitude: 37.0662,
        longitude: 37.3833,
      });
    };
    requestLocation();
  }, []);

  const filteredAreas = useMemo(() => {
    let areas = [...mockEmergencyGatheringAreas];

    // Calculate distances if user location is available
    if (userLocation) {
      areas = areas.map((area) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          area.latitude,
          area.longitude
        );
        return { ...area, distance };
      }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Add favorite status
    return areas.map((area) => ({
      ...area,
      isFavorite: favorites.has(area.id),
    }));
  }, [userLocation, favorites]);

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

  const handleMarkerPress = (place: any) => {
    const area = mockEmergencyGatheringAreas.find((a) => a.id === place.id);
    if (area) {
      setSelectedArea(area);
      setModalVisible(true);
    }
  };

  const handleAreaPress = (area: EmergencyGatheringArea) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  const handleShowOnMap = (area: EmergencyGatheringArea) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  const handleToggleFavorite = (areaId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(areaId)) {
        newFavorites.delete(areaId);
      } else {
        newFavorites.add(areaId);
      }
      return newFavorites;
    });
  };

  const handleRequestLocation = () => {
    // Mock location - in real app, use expo-location
    setUserLocation({
      latitude: 37.0662,
      longitude: 37.3833,
    });
    setShowPermissionPrompt(false);
  };

  const handleCenterLocation = () => {
    if (!userLocation) {
      setShowPermissionPrompt(true);
      return;
    }
    // Map will center to user location
  };

  // Convert areas to places for map/list components
  const places = filteredAreas.map(convertToPlace);
  const selectedPlace = selectedArea ? convertToPlace(selectedArea) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerText}>
          <View style={styles.headerTitleRow}>
            <AlertTriangle size={24} color={Colors.error} />
            <Text style={styles.headerTitle}>Afet Toplanma Alanları</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            En yakın acil toplanma alanlarını görüntüleyin
          </Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <AlertTriangle size={20} color={Colors.error} />
        <Text style={styles.infoText}>
          Acil durumlarda en yakın toplanma alanına gidin
        </Text>
      </View>

      {/* Map */}
      <GuideMap
        places={places}
        selectedPlace={selectedPlace}
        onMarkerPress={handleMarkerPress}
        onCenterLocation={handleCenterLocation}
        userLocation={userLocation}
      />

      {/* List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            En Yakın Toplanma Alanları ({filteredAreas.length})
          </Text>
        </View>
        <GuideList
          places={places}
          onPlacePress={(place) => {
            const area = filteredAreas.find((a) => a.id === place.id);
            if (area) handleAreaPress(area);
          }}
          onShowOnMap={(place) => {
            const area = filteredAreas.find((a) => a.id === place.id);
            if (area) handleShowOnMap(area);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      {/* Detail Modal */}
      {selectedArea && (
        <PlaceDetailModal
          visible={modalVisible}
          place={selectedPlace}
          onClose={() => {
            setModalVisible(false);
            setSelectedArea(null);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Location Permission Prompt */}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.error + '15',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.error,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
});

