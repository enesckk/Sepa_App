import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Home, Calendar, FileText, Gift, Menu } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

interface BottomNavBarProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentRoute = 'Home',
  onNavigate,
}) => {
  const navItems: NavItem[] = [
    {
      id: '1',
      label: 'Ana Sayfa',
      icon: <Home size={24} color={currentRoute === 'Home' ? Colors.primary : Colors.textSecondary} />,
      route: 'Home',
    },
    {
      id: '2',
      label: 'Etkinlik',
      icon: <Calendar size={24} color={currentRoute === 'Events' ? Colors.primary : Colors.textSecondary} />,
      route: 'Events',
    },
    {
      id: '3',
      label: 'Başvuru',
      icon: <FileText size={24} color={currentRoute === 'Applications' ? Colors.primary : Colors.textSecondary} />,
      route: 'Applications',
    },
    {
      id: '4',
      label: 'Ödüller',
      icon: <Gift size={24} color={currentRoute === 'Rewards' ? Colors.primary : Colors.textSecondary} />,
      route: 'Rewards',
    },
    {
      id: '5',
      label: 'Menü',
      icon: <Menu size={24} color={currentRoute === 'Menu' ? Colors.primary : Colors.textSecondary} />,
      route: 'Menu',
    },
  ];

  const handlePress = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
    // Navigation will be handled by navigation library
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.route;
        
        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.navItemPressed,
            ]}
            onPress={() => handlePress(item.route)}
          >
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <Text style={[
              styles.navLabel,
              isActive && styles.navLabelActive,
            ]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  navItemPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

