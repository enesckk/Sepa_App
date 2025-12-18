import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native';
import { EventsTopBar } from '../components/EventsTopBar';
import { FilterBar, FilterType } from '../components/FilterBar';
import { CategoryChipBar } from '../components/CategoryChipBar';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { GolbucksRewardAnimation } from '../components/GolbucksRewardAnimation';
import { Colors } from '../constants/colors';
import { mockEvents, Event } from '../services/mockEventsData';

export const EventsScreen: React.FC = () => {
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
      setRewardAmount(event.golbucksReward);
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
    <SafeAreaView style={styles.container}>
      <EventsTopBar />
      <FilterBar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <CategoryChipBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bu kriterlere uygun etkinlik bulunamadı
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
              onRegister={handleRegister}
              isRegistered={registeredEvents.has(event.id)}
            />
          ))
        )}
      </ScrollView>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
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

