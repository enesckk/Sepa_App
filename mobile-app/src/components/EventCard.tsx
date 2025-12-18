import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Event } from '../services/mockEventsData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onRegister,
  isRegistered = false,
}) => {
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleButtonPress = () => {
    if (!isRegistered) {
      buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
      setTimeout(() => {
        buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
        onRegister(event.id);
      }, 100);
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${days[date.getDay()]}`;
  };

  return (
    <Pressable
      onPress={() => onPress(event)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        <Image source={{ uri: event.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
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
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.infoRow}>
            <Calendar size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.capacityRow}>
              <Users size={16} color={Colors.textSecondary} />
              <Text style={styles.capacityText}>
                {event.registered}/{event.capacity} kişi
              </Text>
            </View>

            <Pressable
              onPress={handleButtonPress}
              disabled={isRegistered}
            >
              <Animated.View
                style={[
                  styles.registerButton,
                  isRegistered && styles.registerButtonDisabled,
                  buttonAnimatedStyle,
                ]}
              >
                <Text
                  style={[
                    styles.registerButtonText,
                    isRegistered && styles.registerButtonTextDisabled,
                  ]}
                >
                  {isRegistered ? 'Katıldınız ✓' : 'Kayıt Ol'}
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomBar} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  freeBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.success,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
  },
  registerButtonTextDisabled: {
    color: Colors.surface,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#A5D6A7',
  },
});

