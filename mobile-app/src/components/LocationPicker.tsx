import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface LocationPickerProps {
  location: string;
  onLocationChange: (location: string) => void;
  onUseGPS?: () => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
  onUseGPS,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <MapPin size={18} color={Colors.primary} />
        <Text style={styles.label}>Konum</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={onLocationChange}
          placeholder="Adres veya konum bilgisi girin"
          placeholderTextColor={Colors.textSecondary}
        />
        {onUseGPS && (
          <Pressable style={styles.gpsButton} onPress={onUseGPS}>
            <Navigation size={18} color={Colors.primary} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gpsButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

