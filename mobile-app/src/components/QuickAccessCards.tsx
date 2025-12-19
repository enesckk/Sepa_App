import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckSquare, Trophy, FileText, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2; // 2 columns with margins and gap

interface QuickAccessItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: [string, string];
  onPress: () => void;
}

export const QuickAccessCards: React.FC = () => {
  const quickAccessItems: QuickAccessItem[] = [
    {
      id: '1',
      title: 'Anketler',
      icon: <CheckSquare size={32} color="white" strokeWidth={2.5} />,
      gradient: [Colors.purple, Colors.purpleDark],
      onPress: () => {
        if (__DEV__) {
          console.log('[v0] Anketler pressed');
        }
      },
    },
    {
      id: '2',
      title: 'Oyna Kazan',
      icon: <Trophy size={32} color="white" strokeWidth={2.5} />,
      gradient: [Colors.orange, Colors.orangeDark],
      onPress: () => {
        if (__DEV__) {
          console.log('[v0] Oyna Kazan pressed');
        }
      },
    },
    {
      id: '3',
      title: 'Başvur',
      icon: <FileText size={32} color="white" strokeWidth={2.5} />,
      gradient: [Colors.blue, Colors.blueDark],
      onPress: () => {
        if (__DEV__) {
          console.log('[v0] Başvur pressed');
        }
      },
    },
    {
      id: '4',
      title: 'Gölmarket',
      icon: <ShoppingBag size={32} color="white" strokeWidth={2.5} />,
      gradient: [Colors.green, Colors.greenDark],
      onPress: () => {
        if (__DEV__) {
          console.log('[v0] Gölmarket pressed');
        }
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hızlı Erişim</Text>
      <View style={styles.grid}>
        {quickAccessItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.card,
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              {/* Icon Container */}
              <View style={styles.iconContainer}>
                {item.icon}
              </View>

              {/* Title */}
              <Text style={styles.cardTitle}>{item.title}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '47%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 18,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
});
