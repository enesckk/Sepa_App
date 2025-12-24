import React, { useEffect, useState } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { X, MapPin, Calendar, Clock, Users, QrCode } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Event } from '../services/mockEventsData';
import { EventRegistrationForm, EventRegistrationData } from './EventRegistrationForm';
import { SubmitButton } from './SubmitButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

interface EventDetailModalProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  onRegister: (eventId: string, personalInfo?: EventRegistrationData) => void;
  isRegistered?: boolean;
  showQRCode?: boolean;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  event,
  onClose,
  onRegister,
  isRegistered = false,
  showQRCode = false,
}) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<EventRegistrationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translateY = useSharedValue(MODAL_HEIGHT);
  const opacity = useSharedValue(0);
  const qrScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
      if (showQRCode) {
        qrScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }
    } else {
      translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 300 });
      qrScale.value = withSpring(0, { damping: 15, stiffness: 150 });
    }
  }, [visible, showQRCode]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const qrAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qrScale.value }],
    opacity: qrScale.value,
  }));

  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${days[date.getDay()]}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      konser: 'Konser',
      tiyatro: 'Tiyatro',
      spor: 'Spor',
      kultur: 'Kültür',
      egitim: 'Eğitim',
      sosyal: 'Sosyal',
    };
    return labels[category] || category;
  };

  // Check if event requires personal information (trips usually do)
  const requiresPersonalInfo = event?.title?.toLowerCase().includes('gezi') || 
                                event?.title?.toLowerCase().includes('gezisi') ||
                                event?.category === 'kultur';

  const handleRegister = () => {
    if (!isRegistered) {
      if (requiresPersonalInfo) {
        setShowRegistrationForm(true);
      } else {
        onRegister(event.id);
      }
    }
  };

  const handleFormSubmit = async (data: EventRegistrationData) => {
    setIsSubmitting(true);
    try {
      setRegistrationData(data);
      onRegister(event.id, data);
      setShowRegistrationForm(false);
    } catch (error) {
      Alert.alert('Hata', 'Başvuru yapılırken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowRegistrationForm(false);
    setRegistrationData(null);
  };

  useEffect(() => {
    if (!visible) {
      setShowRegistrationForm(false);
      setRegistrationData(null);
    }
  }, [visible]);

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
        </View>

        {showRegistrationForm ? (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Pressable onPress={handleFormCancel} style={styles.backButton}>
                <X size={24} color={Colors.text} />
              </Pressable>
              <Text style={styles.formTitle}>Başvuru Formu</Text>
            </View>
            <EventRegistrationForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
              requiresPersonalInfo={requiresPersonalInfo}
            />
            <View style={styles.formFooter}>
              <SubmitButton
                onPress={() => {
                  // Form will handle submission via onSubmit
                }}
                disabled={isSubmitting}
                title={isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {event.image_url && (
              <Image source={{ uri: event.image_url }} style={styles.image} />
            )}

            <View style={styles.content}>
            <View style={styles.badges}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {getCategoryLabel(event.category)}
                </Text>
              </View>
              {event.isFree && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>ÜCRETSİZ</Text>
                </View>
              )}
              {event.isFamilyFriendly && (
                <View style={styles.familyBadge}>
                  <Text style={styles.familyText}>👨‍👩‍👧‍👦 Aile Dostu</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Calendar size={20} color={Colors.primary} />
                <Text style={styles.infoText}>{formatDate(event.date)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.infoText}>{event.time}</Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={20} color={Colors.primary} />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Users size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  {event.registered}/{event.capacity} kişi kayıtlı
                </Text>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>

            {showQRCode && isRegistered && (
              <Animated.View style={[styles.qrSection, qrAnimatedStyle]}>
                <Text style={styles.sectionTitle}>Biletiniz</Text>
                <View style={styles.qrContainer}>
                  <QrCode size={120} color={Colors.text} />
                  <Text style={styles.qrText}>QR Kod: {event.id.toUpperCase()}</Text>
                  <Text style={styles.qrSubtext}>
                    Etkinlik girişinde bu kodu gösterin
                  </Text>
                </View>
              </Animated.View>
            )}

            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>📍 Harita Konumu</Text>
              <View style={styles.mapImage}>
                <MapPin size={40} color={Colors.textSecondary} />
                <Text style={styles.mapPlaceholderText}>
                  {event.location}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        )}

        {!showRegistrationForm && (
          <View style={styles.footer}>
          {!isRegistered && (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>
                Etkinliğe Katıl (+{event.golbucksReward} Gölbucks)
              </Text>
            </TouchableOpacity>
          )}
          {isRegistered && (
            <View style={styles.registeredBadge}>
              <Text style={styles.registeredText}>
                🎉 Etkinliğe Katıldınız!
              </Text>
            </View>
          )}
        </View>
        )}
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
    justifyContent: 'flex-end',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  freeBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  freeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.surface,
  },
  familyBadge: {
    backgroundColor: Colors.info,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  familyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 32,
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
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  qrSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    letterSpacing: 2,
  },
  qrSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  mapPlaceholder: {
    marginTop: 8,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  mapImage: {
    height: 150,
    backgroundColor: Colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
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
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  registeredBadge: {
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  registeredText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  formFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});

