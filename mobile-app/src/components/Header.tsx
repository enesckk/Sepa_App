import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { User, Settings, Coins } from 'lucide-react-native';
import { Colors } from '../constants/colors';

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
            <View style={styles.profileIcon}>
              <User size={20} color={Colors.primary} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSettingsPress}
            activeOpacity={0.7}
            style={styles.settingsButton}
          >
            <Settings size={24} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Orta: Logo + App Name */}
        <View style={styles.centerContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Ş</Text>
          </View>
          <Text style={styles.appName}>Şehitkamil</Text>
        </View>

        {/* Sağ: Points */}
        <View style={styles.rightContainer}>
          <Coins size={20} color={Colors.secondary} strokeWidth={2.5} />
          <Text style={styles.pointsText}>{points}</Text>
        </View>
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
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    // Button wrapper
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    // Button wrapper
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
});

