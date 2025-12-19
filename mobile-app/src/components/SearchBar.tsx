import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Search } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface SearchBarProps {
  onPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.searchBarContainer}
      >
        <BlurView intensity={95} tint="light" style={styles.searchBarBlur}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconContainer}>
              <Search size={20} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.searchText}>Uygulamada ara...</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchBarContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchBarBlur: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchBar: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 0,
  },
  searchIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  searchText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});

