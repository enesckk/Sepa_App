import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Header } from '../../src/components/Header';
import { AutoPlayCarousel } from '../../src/components/AutoPlayCarousel';
import { StoryCarousel } from '../../src/components/StoryCarousel';
import { WeatherCard } from '../../src/components/WeatherCard';
import { PrayerTimeCard } from '../../src/components/PrayerTimeCard';
import { QuickAccessCards } from '../../src/components/QuickAccessCards';
import { NewsSection } from '../../src/components/NewsSection';
import { DailyRewardModal } from '../../src/components/DailyRewardModal';
import { Colors } from '../../src/constants/colors';
import {
  hasClaimedDailyRewardToday,
  claimDailyReward,
  getDailyRewardAmount,
} from '../../src/services/dailyRewardService';
import { useGolbucks } from '../../src/contexts';

// Şehitkamil Belediyesi Destek Programları ve Hizmetler
// Carousel görselleri - Şehitkamil Belediyesi'nin sosyal destek programları
// Görseller assets/images/ klasörüne eklendiğinde require() ile kullanılacak
const CAROUSEL_DATA = [
  {
    id: '1',
    // Emekli Mutluluk Fonu - Yeşil gradient arka plan
    image: require('../../assets/images/emekli-mutluluk-fonu.png'),
    title: 'EMEKLİ MUTLULUK FONU',
    gradient: ['#10B981', '#059669'], // Green gradient (fallback)
  },
  {
    id: '2',
    // Ulaşım Desteği - Okul servisi, yeşil-mavi gradient
    image: require('../../assets/images/ulasim-destegi.png'),
    title: 'EVDEN OKULA OKULDAN EVE',
    gradient: ['#3B82F6', '#10B981'], // Blue-Green gradient (fallback)
  },
  {
    id: '3',
    // Desteklerimizle Yanınızdayız - Çoklu destek programları
    image: require('../../assets/images/desteklerimizle-yaninizdayiz.png'),
    title: 'DESTEKLERİMİZLE YANINIZDAYIZ',
    gradient: ['#8B5CF6', '#EC4899'], // Purple-Pink gradient (fallback)
  },
  {
    id: '4',
    // Güçlü Kadın Mutlu Aile - Grup terapileri, pembe-mor gradient
    image: require('../../assets/images/guclu-kadin-mutlu-aile.png'),
    title: 'GÜÇLÜ KADIN MUTLU AİLE',
    gradient: ['#EC4899', '#8B5CF6'], // Pink-Purple gradient (fallback)
  },
  {
    id: '5',
    // 29 Ekim Ankara Çıkarması - Cumhuriyet Bayramı, kırmızı-beyaz gradient
    image: require('../../assets/images/29-ekim-ankara.png'),
    title: '29 EKİM ANKARA ÇIKARMASI',
    gradient: ['#EF4444', '#DC2626'], // Red gradient (fallback)
  },
  {
    id: '6',
    // Şehitkamil Antika Pazarı - Parchment/scroll tasarım, kahverengi-turuncu gradient
    image: require('../../assets/images/antika-pazari.png'),
    title: 'ŞEHİTKAMİL ANTİKA PAZARI',
    gradient: ['#D97706', '#F59E0B'], // Brown-Orange gradient (fallback)
  },
  {
    id: '7',
    // Daha Temiz Şehitkamil - Çöp toplama, yeşil gradient
    image: require('../../assets/images/daha-temiz-sehitkamil.png'),
    title: 'DAHA TEMİZ ŞEHİTKAMİL',
    gradient: ['#10B981', '#059669'], // Green gradient (fallback)
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
  const { golbucks, addGolbucks } = useGolbucks();
  const [userPoints, setUserPoints] = useState(golbucks);
  const [dailyRewardVisible, setDailyRewardVisible] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);

  // Günlük ödül kontrolü - sayfa her açıldığında kontrol et
  useFocusEffect(
    React.useCallback(() => {
      const checkDailyReward = async () => {
        try {
          const hasClaimed = await hasClaimedDailyRewardToday();
          if (!hasClaimed) {
            // Bugün ödül alınmamış, otomatik ödül ver
            const amount = getDailyRewardAmount();
            await claimDailyReward();
            setDailyRewardAmount(amount);
            setUserPoints((prev) => prev + amount);
            // Kısa bir gecikme ile modal göster (sayfa yüklenmesi için)
            setTimeout(() => {
              setDailyRewardVisible(true);
            }, 500);
          }
        } catch (error) {
          if (__DEV__) {
            console.error('Error checking daily reward:', error);
          }
        }
      };

      checkDailyReward();
    }, [])
  );

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

  const handleDailyRewardClose = () => {
    setDailyRewardVisible(false);
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

      {/* Daily Reward Modal */}
      <DailyRewardModal
        visible={dailyRewardVisible}
        amount={dailyRewardAmount}
        onClose={handleDailyRewardClose}
      />
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
