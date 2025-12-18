import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface TopBarProps {
  location?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  location = 'Şehitkamil, Gaziantep' 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>ŞB</Text>
        </View>
        <Text style={styles.belediyeName}>Şehitkamil Belediyesi</Text>
      </View>
      
      <View style={styles.locationContainer}>
        <MapPin size={18} color={Colors.primary} />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  belediyeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

