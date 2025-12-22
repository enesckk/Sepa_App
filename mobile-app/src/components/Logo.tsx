import React from 'react';
import { View, Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 40,
  style,
  imageStyle,
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Image
        source={require('../../assets/images/sehitkamil-logo.png')}
        style={[styles.image, { width, height }, imageStyle]}
        resizeMode="contain"
      />
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
});

