import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, Droplet, Wind } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { mockWeatherData } from '../services/mockData';

export const WeatherCard: React.FC = () => {
  const weather = mockWeatherData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sun size={24} color={Colors.warning} />
        <Text style={styles.title}>Hava Durumu</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Droplet size={16} color={Colors.info} />
            <Text style={styles.detailText}>%{weather.humidity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Wind size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{weather.windSpeed} km/s</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    marginTop: 8,
  },
  mainInfo: {
    marginBottom: 12,
  },
  temperature: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 50,
  },
  condition: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

