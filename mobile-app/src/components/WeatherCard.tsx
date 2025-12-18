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
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    lineHeight: 56,
  },
  condition: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 20,
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

