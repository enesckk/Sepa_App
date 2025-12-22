import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Coins } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Logo } from './Logo';

interface HeaderProps {
  userName?: string;
  points: number;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  points = 0,
  onProfilePress,
  onSettingsPress,
}) => {
  return (
    <BlurView intensity={80} tint="light" style={styles.blurContainer}>
      <View style={styles.container}>
        {/* Sol: Profile + Settings */}
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.7}
            style={styles.profileButton}
          >
            <User size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSettingsPress}
            activeOpacity={0.7}
            style={styles.settingsButton}
          >
            <Settings size={24} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Orta: Logo */}
        <View style={styles.centerContainer}>
          <Logo width={140} height={32} />
        </View>

        {/* Sağ: Points with Gradient */}
        <LinearGradient
          colors={['#FFF7ED', '#FFEDD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pointsGradient}
        >
          <Coins size={20} color={Colors.secondary} strokeWidth={2.5} />
          <Text style={styles.pointsText}>{points}</Text>
        </LinearGradient>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  container: {
    minHeight: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
  },
});

