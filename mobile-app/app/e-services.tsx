import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  FileText,
  Search,
  CreditCard,
  Building,
  MapPin,
  ClipboardList,
  Shield,
  Info,
  Calendar,
  DollarSign,
  Home,
  Settings,
  FileCheck,
  AlertCircle,
  Phone,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

interface EService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'general' | 'property' | 'construction' | 'payment' | 'information';
  route?: string;
  onPress?: () => void;
}

export default function EServicesScreen() {
  const router = useRouter();

  const eServices: EService[] = [
    // Genel Hizmetler
    {
      id: '1',
      title: 'Üye Girişi',
      description: 'E-belediye hesabınıza giriş yapın',
      icon: <Shield size={24} color={Colors.primary} />,
      category: 'general',
      route: '/e-services/login',
    },
    {
      id: '2',
      title: 'Halk Masası',
      description: 'Şikayet, öneri ve talepleriniz',
      icon: <Phone size={24} color={Colors.primary} />,
      category: 'general',
      route: '/e-services/public-desk',
    },
    {
      id: '3',
      title: 'Kent Rehberi',
      description: 'Şehir bilgileri ve rehber',
      icon: <MapPin size={24} color={Colors.primary} />,
      category: 'general',
      route: '/city-guide',
    },
    {
      id: '4',
      title: 'e-Devlet Hizmetleri',
      description: 'e-Devlet entegrasyonu',
      icon: <Building size={24} color={Colors.primary} />,
      category: 'general',
      route: '/e-services/edevlet',
    },
    {
      id: '5',
      title: 'Meclis Gündemi',
      description: 'Belediye meclis gündemleri',
      icon: <FileText size={24} color={Colors.primary} />,
      category: 'general',
      route: '/e-services/council-agenda',
    },
    {
      id: '6',
      title: 'İhaleler',
      description: 'Açık ihaleler ve duyurular',
      icon: <DollarSign size={24} color={Colors.primary} />,
      category: 'general',
      route: '/e-services/tenders',
    },
    
    // Emlak ve Vergi
    {
      id: '7',
      title: 'İmar Durumu Sorgula',
      description: 'Parsel imar durumu sorgulama',
      icon: <Search size={24} color={Colors.secondary} />,
      category: 'property',
      route: '/e-services/zoning-status',
    },
    {
      id: '8',
      title: 'Emlak Vergi Borç Ödeme',
      description: 'Emlak vergisi borç ödeme',
      icon: <CreditCard size={24} color={Colors.secondary} />,
      category: 'property',
      route: '/e-services/property-tax',
    },
    {
      id: '9',
      title: 'Arsa Rayiç Değerleri',
      description: 'Arsa rayiç değer sorgulama',
      icon: <DollarSign size={24} color={Colors.secondary} />,
      category: 'property',
      route: '/e-services/land-values',
    },
    {
      id: '10',
      title: 'Değişen Mahalle ve Sokaklar',
      description: 'Mahalle ve sokak değişiklikleri',
      icon: <MapPin size={24} color={Colors.secondary} />,
      category: 'property',
      route: '/e-services/address-changes',
    },
    {
      id: '11',
      title: 'Değerleme Başvuru',
      description: 'Emlak değerleme başvurusu',
      icon: <FileCheck size={24} color={Colors.secondary} />,
      category: 'property',
      route: '/e-services/valuation',
    },
    
    // Yapı ve İnşaat
    {
      id: '12',
      title: 'Yapı Ruhsatı Harç Talep',
      description: 'Yapı ruhsatı harç talebi',
      icon: <Home size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/building-permit-fee',
    },
    {
      id: '13',
      title: 'Ön İzin Başvuru',
      description: 'Yapı ön izin başvurusu',
      icon: <FileCheck size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/pre-permit',
    },
    {
      id: '14',
      title: 'İş Yeri Ruhsat Ön Başvuru',
      description: 'İş yeri ruhsat ön başvurusu',
      icon: <Building size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/business-permit',
    },
    {
      id: '15',
      title: 'İnşaat Maliyetleri',
      description: 'İnşaat maliyet hesaplama',
      icon: <DollarSign size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/construction-costs',
    },
    {
      id: '16',
      title: 'İskan Keşfi Randevu Talebi',
      description: 'İskan keşfi randevu talebi',
      icon: <Calendar size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/occupancy-inspection',
    },
    {
      id: '17',
      title: 'Yalıtım Başvurusu',
      description: 'Yalıtım başvurusu',
      icon: <Home size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/insulation',
    },
    {
      id: '18',
      title: 'Temel Topraklama Talep Formu',
      description: 'Temel topraklama talep formu',
      icon: <Settings size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/grounding',
    },
    {
      id: '19',
      title: 'Mekanik Proje Keşif Başvurusu',
      description: 'Mekanik proje keşif başvurusu',
      icon: <FileCheck size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/mechanical-inspection',
    },
    {
      id: '20',
      title: 'Asansör Tescil Belgesi',
      description: 'Asansör tescil belgesi',
      icon: <FileText size={24} color={Colors.orange} />,
      category: 'construction',
      route: '/e-services/elevator-registration',
    },
    
    // Ödeme ve Beyan
    {
      id: '21',
      title: 'Beyan Gönderme',
      description: 'Vergi beyanı gönderme',
      icon: <FileText size={24} color={Colors.green} />,
      category: 'payment',
      route: '/e-services/declaration',
    },
    {
      id: '22',
      title: 'Beyan Sorgula',
      description: 'Gönderilen beyanları sorgula',
      icon: <Search size={24} color={Colors.green} />,
      category: 'payment',
      route: '/e-services/declaration-query',
    },
    {
      id: '23',
      title: 'Tahakkuksuz Ödeme',
      description: 'Tahakkuk olmadan ödeme',
      icon: <CreditCard size={24} color={Colors.green} />,
      category: 'payment',
      route: '/e-services/payment-without-assessment',
    },
    {
      id: '24',
      title: 'Tahsilat Sonuçlandırma',
      description: 'Tahsilat işlem sonuçları',
      icon: <DollarSign size={24} color={Colors.green} />,
      category: 'payment',
      route: '/e-services/collection-result',
    },
    
    // Bilgi Edinme
    {
      id: '25',
      title: 'Bireysel Bilgi Edinme',
      description: 'Bireysel bilgi edinme başvurusu',
      icon: <Info size={24} color={Colors.blue} />,
      category: 'information',
      route: '/e-services/info-request-individual',
    },
    {
      id: '26',
      title: 'Kurumsal Bilgi Edinme',
      description: 'Kurumsal bilgi edinme başvurusu',
      icon: <Building size={24} color={Colors.blue} />,
      category: 'information',
      route: '/e-services/info-request-corporate',
    },
  ];

  const categories = [
    { id: 'general', label: 'Genel Hizmetler', color: Colors.primary },
    { id: 'property', label: 'Emlak ve Vergi', color: Colors.secondary },
    { id: 'construction', label: 'Yapı ve İnşaat', color: Colors.orange },
    { id: 'payment', label: 'Ödeme ve Beyan', color: Colors.green },
    { id: 'information', label: 'Bilgi Edinme', color: Colors.blue },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredServices = selectedCategory
    ? eServices.filter((service) => service.category === selectedCategory)
    : eServices;

  const handleServicePress = (service: EService) => {
    if (service.route) {
      router.push(service.route);
    } else if (service.onPress) {
      service.onPress();
    } else {
      // Placeholder - will be implemented
      if (__DEV__) {
        console.log('Service pressed:', service.title);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>E-Belediye Hizmetleri</Text>
          <Text style={styles.headerSubtitle}>
            Elektronik hizmet portalı
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipActive,
          ]}
        >
          <Text
            style={[
              styles.categoryChipText,
              !selectedCategory && styles.categoryChipTextActive,
            ]}
          >
            Tümü
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
              { borderColor: category.color },
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && [
                  styles.categoryChipTextActive,
                  { color: category.color },
                ],
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredServices.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => handleServicePress(service)}
            style={({ pressed }) => [
              styles.serviceCard,
              pressed && styles.serviceCardPressed,
            ]}
          >
            <View style={styles.serviceIconContainer}>
              {service.icon}
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
            <ArrowLeft
              size={20}
              color={Colors.textSecondary}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryScroll: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 2,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  serviceCardPressed: {
    opacity: 0.7,
    backgroundColor: Colors.background,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

