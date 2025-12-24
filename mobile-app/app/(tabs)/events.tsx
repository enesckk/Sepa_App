import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventsTopBar } from '../../src/components/EventsTopBar';
import { FilterBar, FilterType } from '../../src/components/FilterBar';
import { CategoryChipBar } from '../../src/components/CategoryChipBar';
import { EventCard } from '../../src/components/EventCard';
import { EventDetailModal } from '../../src/components/EventDetailModal';
import { GolbucksRewardAnimation } from '../../src/components/GolbucksRewardAnimation';
import { Colors } from '../../src/constants/colors';
import { mockEvents, Event } from '../../src/services/mockEventsData';

export default function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [showQRCode, setShowQRCode] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const filteredEvents = useMemo(() => {
    let filtered = [...mockEvents];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    // Other filters
    if (selectedFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((event) => event.date === today);
    } else if (selectedFilter === 'free') {
      filtered = filtered.filter((event) => event.isFree);
    } else if (selectedFilter === 'family') {
      filtered = filtered.filter((event) => event.isFamilyFriendly);
    }

    return filtered;
  }, [selectedFilter, selectedCategory]);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
    setShowQRCode(registeredEvents.has(event.id));
  };

  const handleRegister = (eventId: string) => {
    const event = mockEvents.find((e) => e.id === eventId);
    if (event && !registeredEvents.has(eventId)) {
      setRegisteredEvents((prev) => new Set([...prev, eventId]));
      setShowQRCode(true);
      setRewardAmount(event.golbucksReward || event.golbucks_reward || 0);
      setShowRewardAnimation(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
    setShowQRCode(false);
  };

  const handleRewardAnimationComplete = () => {
    setShowRewardAnimation(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <EventsTopBar />
      <FilterBar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <CategoryChipBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={handleEventPress}
            onRegister={handleRegister}
            isRegistered={registeredEvents.has(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bu kriterlere uygun etkinlik bulunamadı
            </Text>
          </View>
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />

      <EventDetailModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
        onRegister={handleRegister}
        isRegistered={selectedEvent ? registeredEvents.has(selectedEvent.id) : false}
        showQRCode={showQRCode}
      />

      <GolbucksRewardAnimation
        visible={showRewardAnimation}
        amount={rewardAmount}
        onComplete={handleRewardAnimationComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

