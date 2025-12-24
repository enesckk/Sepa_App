import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  imageStyle?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 40,
  style,
  imageStyle,
}) => {
  // Logo dosyası henüz eklenmediği için text placeholder kullanıyoruz
  // Logo dosyası eklendiğinde bu kısım güncellenebilir
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={[styles.placeholder, { width, height }, imageStyle]}>
        <Text style={styles.placeholderText}>Şehitkamil</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
});

