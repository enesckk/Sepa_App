import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { AutoPlayCarousel } from '../../src/components/AutoPlayCarousel';
import { StoryCarousel } from '../../src/components/StoryCarousel';
import { WeatherCard } from '../../src/components/WeatherCard';
import { PrayerTimeCard } from '../../src/components/PrayerTimeCard';
import { QuickAccessCards } from '../../src/components/QuickAccessCards';
import { NewsSection } from '../../src/components/NewsSection';
import { Colors } from '../../src/constants/colors';

// Şehitkamil Belediyesi Destek Programları ve Hizmetler
// Carousel görselleri - Şehitkamil Belediyesi'nin sosyal destek programları
const CAROUSEL_DATA = [
  {
    id: '1',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/emekli-mutluluk-fonu.jpg',
    title: 'EMEKLİ MUTLULUK FONU',
  },
  {
    id: '2',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/ulasim-destegi.jpg',
    title: 'EVDEN OKULA OKULDAN EVE',
  },
  {
    id: '3',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/desteklerimizle-yaninizdayiz.jpg',
    title: 'DESTEKLERİMİZLE YANINIZDAYIZ',
  },
  {
    id: '4',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/guclu-kadin-mutlu-aile.jpg',
    title: 'GÜÇLÜ KADIN MUTLU AİLE',
  },
  {
    id: '5',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/29-ekim-ankara.jpg',
    title: '29 EKİM ANKARA ÇIKARMASI',
  },
  {
    id: '6',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/antika-pazari.jpg',
    title: 'ŞEHİTKAMİL ANTİKA PAZARI',
  },
  {
    id: '7',
    image: 'https://www.sehitkamil.bel.tr/Uploads/Images/daha-temiz-sehitkamil.jpg',
    title: 'DAHA TEMİZ ŞEHİTKAMİL',
  },
];

// Şehitkamil Belediyesi Haberler ve Duyurular
// Kaynak: https://www.sehitkamil.bel.tr/
const NEWS_DATA = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    title: 'BAŞKAN YILMAZ\'DAN ANLAMLI ZİYARET',
    date: '18.12.2025',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    title: 'BAŞKAN YILMAZ, PAZARDA VATANDAŞ VE ESNAFLA BULUŞTU',
    date: '16.12.2025',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    title: 'ŞEHİTKAMİL\'DE ULAŞIM AĞI GÜÇLENİYOR',
    date: '15.12.2025',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    title: 'ŞEHİTKAMİL BELEDİYESPOR\'DAN GOL ŞOV: 7-0',
    date: '15.12.2025',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(320);

  const handleProfilePress = () => {
    if (__DEV__) {
      console.log('[v0] Profile pressed');
    }
    router.push('/profile');
  };

  const handleSettingsPress = () => {
    if (__DEV__) {
      console.log('[v0] Settings pressed');
    }
    router.push('/settings');
  };

  const handleSearchPress = () => {
    if (__DEV__) {
      console.log('[v0] Search pressed');
    }
    // TODO: Navigate to search screen when created
  };

  const handleViewAllNews = () => {
    if (__DEV__) {
      console.log('[v0] View all news pressed');
    }
    // TODO: Navigate to all news screen when created
  };

  const handleNewsPress = (id: string) => {
    if (__DEV__) {
      console.log('[v0] News pressed:', id);
    }
    // TODO: Navigate to news detail screen when created
  };

  const handlePrayerTimePress = () => {
    if (__DEV__) {
      console.log('[v0] Prayer time pressed - Navigating to city guide with mosque filter');
    }
    // Navigate to city guide with mosque filter
    router.push('/city-guide?type=mosque');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <Header
        points={userPoints}
        onProfilePress={handleProfilePress}
        onSettingsPress={handleSettingsPress}
      />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Auto-Play Carousel with Integrated Search Bar */}
        <AutoPlayCarousel
          items={CAROUSEL_DATA}
          autoPlayInterval={5000}
          onSearchPress={handleSearchPress}
        />

        {/* Story Carousel */}
        <StoryCarousel />

        {/* Weather and Prayer Time Cards - Side by Side */}
        <View style={styles.weatherPrayerContainer}>
          <WeatherCard />
          <PrayerTimeCard
            onPress={handlePrayerTimePress}
          />
        </View>

        {/* Quick Access Panel */}
        <QuickAccessCards />

        {/* News Section */}
        <NewsSection
          items={NEWS_DATA}
          onViewAll={handleViewAllNews}
          onNewsPress={handleNewsPress}
        />

        {/* Bottom Spacer for Tab Navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  weatherPrayerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 16,
  },
});
