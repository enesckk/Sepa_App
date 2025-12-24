import React from 'react';
import { View, Image, StyleSheet, ImageStyle, ViewStyle, Text } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

// Logo dosyasını güvenli bir şekilde yükle
let logoSource: any = null;
try {
  logoSource = require('../../assets/images/sehitkamil-logo.png');
} catch (error) {
  // Logo dosyası bulunamazsa null kalır
  console.warn('Logo dosyası bulunamadı. Placeholder kullanılıyor.');
}

export const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 40,
  style,
  imageStyle,
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      {logoSource ? (
        <Image
          source={logoSource}
          style={[styles.image, { width, height }, imageStyle]}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.placeholder, { width, height }]}>
          <Text style={styles.placeholderText}>Şehitkamil</Text>
        </View>
      )}
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
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

