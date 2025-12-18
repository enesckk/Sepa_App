import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Calendar, Receipt, FileText, Gift } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2; // 2 columns with margins

interface QuickCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

export const QuickAccessCards: React.FC = () => {
  const cards: QuickCard[] = [
    {
      id: '1',
      title: 'Etkinlikler',
      icon: <Calendar size={28} color={Colors.surface} />,
      color: Colors.primary,
      onPress: () => {},
    },
    {
      id: '2',
      title: 'Askıda Fatura',
      icon: <Receipt size={28} color={Colors.surface} />,
      color: Colors.info,
      onPress: () => {},
    },
    {
      id: '3',
      title: 'Başvurularım',
      icon: <FileText size={28} color={Colors.surface} />,
      color: Colors.warning,
      onPress: () => {},
    },
    {
      id: '4',
      title: 'Gölbucks Market',
      icon: <Gift size={28} color={Colors.surface} />,
      color: Colors.success,
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hızlı Erişim</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: card.color },
              pressed && styles.cardPressed,
            ]}
            onPress={card.onPress}
          >
            <View style={styles.iconContainer}>
              {card.icon}
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  iconContainer: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
  },
});

