import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { TopBar } from '../components/TopBar';
import { StoryCarousel } from '../components/StoryCarousel';
import { WeatherCard } from '../components/WeatherCard';
import { QuickAccessCards } from '../components/QuickAccessCards';
import { NoticeBanner } from '../components/NoticeBanner';
import { BottomNavBar } from '../components/BottomNavBar';
import { Colors } from '../constants/colors';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar location="Şehitkamil, Gaziantep" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StoryCarousel />
        
        <WeatherCard />
        
        <QuickAccessCards />
        
        <NoticeBanner />
        
        {/* Spacer for bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      <BottomNavBar currentRoute="Home" />
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
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});

