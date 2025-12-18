import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { X, MapPin, Phone, Clock, Navigation, Heart } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Place, getPlaceIcon } from '../services/mockLocationsData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

interface PlaceDetailModalProps {
  visible: boolean;
  place: Place | null;
  onClose: () => void;
  onToggleFavorite?: (placeId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  visible,
  place,
  onClose,
  onToggleFavorite,
}) => {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleOpenMaps = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    if (!place?.phone) return;
    Linking.openURL(`tel:${place.phone}`);
  };

  if (!place) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.modal, modalAnimatedStyle]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </Pressable>
          {onToggleFavorite && (
            <Pressable
              onPress={() => onToggleFavorite(place.id)}
              style={styles.favoriteButton}
            >
              <Heart
                size={24}
                color={place.isFavorite ? Colors.error : Colors.textSecondary}
                fill={place.isFavorite ? Colors.error : 'none'}
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {place.images && place.images.length > 0 && (
            <Image source={{ uri: place.images[0] }} style={styles.image} />
          )}

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.icon}>{getPlaceIcon(place.type)}</Text>
              <Text style={styles.title}>{place.name}</Text>
            </View>

            <Text style={styles.description}>{place.description}</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <MapPin size={20} color={Colors.primary} />
                <Text style={styles.infoText}>{place.address}</Text>
              </View>

              {place.phone && (
                <Pressable style={styles.infoRow} onPress={handleCall}>
                  <Phone size={20} color={Colors.primary} />
                  <Text style={styles.infoText}>{place.phone}</Text>
                </Pressable>
              )}

              {place.workingHours && (
                <View style={styles.infoRow}>
                  <Clock size={20} color={Colors.primary} />
                  <Text style={styles.infoText}>{place.workingHours}</Text>
                </View>
              )}
            </View>

            {place.features && place.features.length > 0 && (
              <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>Özellikler</Text>
                <View style={styles.featuresContainer}>
                  {place.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {place.images && place.images.length > 1 && (
              <View style={styles.gallerySection}>
                <Text style={styles.sectionTitle}>Fotoğraflar</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {place.images.slice(1).map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.galleryImage}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleOpenMaps}
          >
            <Navigation size={20} color={Colors.surface} />
            <Text style={styles.navigationButtonText}>Yol Tarifi Al</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  gallerySection: {
    marginBottom: 24,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    resizeMode: 'cover',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
});

