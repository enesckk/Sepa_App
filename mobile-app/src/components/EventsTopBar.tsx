import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface EventsTopBarProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
}

export const EventsTopBar: React.FC<EventsTopBarProps> = ({
  onSearchPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Etkinlikler</Text>
      
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onSearchPress}
        >
          <Search size={22} color={Colors.text} />
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onFilterPress}
        >
          <Filter size={22} color={Colors.text} />
        </Pressable>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

