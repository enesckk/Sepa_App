import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';

interface NewsItem {
  id: string;
  image: string;
  title: string;
  date: string;
}

interface NewsSectionProps {
  items: NewsItem[];
  onViewAll?: () => void;
  onNewsPress?: (id: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  items,
  onViewAll,
  onNewsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Haberler ve Duyurular</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>Tümünü Gör →</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={292} // 280 card width + 12 gap
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onNewsPress?.(item.id)}
            activeOpacity={0.9}
            style={styles.card}
          >
            {/* Image */}
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Content */}
            <View style={styles.content}>
              <Text
                style={styles.cardTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 280,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
    height: 60,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

