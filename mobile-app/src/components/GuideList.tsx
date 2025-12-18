import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { GuideListItem } from './GuideListItem';
import { Colors } from '../constants/colors';
import { Place } from '../services/mockLocationsData';

interface GuideListProps {
  places: Place[];
  onPlacePress: (place: Place) => void;
  onShowOnMap: (place: Place) => void;
  onToggleFavorite?: (placeId: string) => void;
}

export const GuideList: React.FC<GuideListProps> = ({
  places,
  onPlacePress,
  onShowOnMap,
  onToggleFavorite,
}) => {
  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📍</Text>
        <Text style={styles.emptyText}>Bu kategoride mekân bulunamadı</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <GuideListItem
          place={item}
          onPress={onPlacePress}
          onShowOnMap={onShowOnMap}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

