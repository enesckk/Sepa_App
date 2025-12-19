import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { mockPlaces } from '../services/mockLocationsData';

interface PrayerTimeCardProps {
  onPress?: () => void;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({ onPress }) => {
  // En yakın camiyi bul (mock data'dan)
  const nearestMosque = mockPlaces
    .filter((place) => place.type === 'mosque')
    .sort((a, b) => (a.distance || 9999) - (b.distance || 9999))[0];

  // Mock ezan vakitleri (gerçek uygulamada API'den gelecek)
  const prayerTimes = {
    fajr: '05:30',
    dhuhr: '12:45',
    asr: '15:20',
    maghrib: '18:10',
    isha: '19:45',
  };

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const times = [
      { name: 'İmsak', time: prayerTimes.fajr },
      { name: 'Öğle', time: prayerTimes.dhuhr },
      { name: 'İkindi', time: prayerTimes.asr },
      { name: 'Akşam', time: prayerTimes.maghrib },
      { name: 'Yatsı', time: prayerTimes.isha },
    ];

    for (const prayer of times) {
      if (currentTime < prayer.time) {
        return prayer;
      }
    }
    return { name: 'İmsak', time: prayerTimes.fajr };
  };

  const nextPrayer = getNextPrayer();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.mosqueIcon}>🕌</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Ezan Vakti</Text>
          {nearestMosque && (
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {nearestMosque.name}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.nextPrayerContainer}>
          <Clock size={20} color={Colors.primary} />
          <View style={styles.nextPrayerInfo}>
            <Text style={styles.nextPrayerLabel}>Sıradaki Namaz</Text>
            <View style={styles.nextPrayerTimeRow}>
              <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
              <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 6,
    minWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerPressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mosqueIcon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
    flexShrink: 1,
  },
  content: {
    gap: 0,
  },
  nextPrayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: 0,
  },
  nextPrayerInfo: {
    flex: 1,
    minWidth: 0,
  },
  nextPrayerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  nextPrayerTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  nextPrayerName: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '700',
    flexShrink: 1,
  },
  nextPrayerTime: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    flexShrink: 0,
  },
});

