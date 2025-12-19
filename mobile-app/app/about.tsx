import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

export default function AboutScreen() {
  const router = useRouter();
  const appVersion = '1.0.0';

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) => {
      if (__DEV__) {
        console.error('Failed to open URL:', err);
      }
    });
  };

  const AboutSection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const LinkItem: React.FC<{
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
  }> = ({ title, onPress, icon }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.linkItem,
        pressed && styles.linkItemPressed,
      ]}
    >
      <View style={styles.linkItemLeft}>
        {icon && <View style={styles.linkIcon}>{icon}</View>}
        <Text style={styles.linkItemText}>{title}</Text>
      </View>
      <ExternalLink size={16} color={Colors.textSecondary} />
    </Pressable>
  );

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
        <Text style={styles.headerTitle}>Hakkında</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Ş</Text>
          </View>
          <Text style={styles.appName}>Şehitkamil Belediyesi</Text>
          <Text style={styles.appSubtitle}>Mobil Uygulama</Text>
          <Text style={styles.versionText}>Versiyon {appVersion}</Text>
        </View>

        {/* About Section */}
        <AboutSection title="Uygulama Hakkında">
          <Text style={styles.aboutText}>
            Şehitkamil Belediyesi Mobil Uygulaması, vatandaşlarımızın belediye
            hizmetlerine kolayca erişebilmesi için geliştirilmiştir. Uygulama
            ile etkinliklere kayıt olabilir, başvurular yapabilir, anketlere
            katılabilir ve daha birçok hizmete erişebilirsiniz.
          </Text>
        </AboutSection>

        {/* Legal Links */}
        <AboutSection title="Yasal Bilgiler">
          <LinkItem
            title="Gizlilik Politikası"
            onPress={() => handleLinkPress('https://www.sehitkamil.bel.tr/gizlilik')}
          />
          <LinkItem
            title="Kullanım Şartları"
            onPress={() => handleLinkPress('https://www.sehitkamil.bel.tr/kullanim-sartlari')}
          />
        </AboutSection>

        {/* Social Media */}
        <AboutSection title="Sosyal Medya">
          <LinkItem
            title="Facebook"
            icon={<Facebook size={20} color={Colors.primary} />}
            onPress={() => handleLinkPress('https://www.facebook.com/sehitkamilbelediyesi')}
          />
          <LinkItem
            title="Twitter"
            icon={<Twitter size={20} color={Colors.primary} />}
            onPress={() => handleLinkPress('https://www.twitter.com/sehitkamilbel')}
          />
          <LinkItem
            title="Instagram"
            icon={<Instagram size={20} color={Colors.primary} />}
            onPress={() => handleLinkPress('https://www.instagram.com/sehitkamilbelediyesi')}
          />
          <LinkItem
            title="YouTube"
            icon={<Youtube size={20} color={Colors.primary} />}
            onPress={() => handleLinkPress('https://www.youtube.com/sehitkamilbelediyesi')}
          />
        </AboutSection>

        {/* Developer Info */}
        <AboutSection title="Geliştirici">
          <Text style={styles.developerText}>
            Şehitkamil Belediyesi{'\n'}
            Bilgi İşlem Müdürlüğü{'\n'}
            {'\n'}
            © 2024 Şehitkamil Belediyesi{'\n'}
            Tüm hakları saklıdır.
          </Text>
        </AboutSection>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.surface,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkItemPressed: {
    opacity: 0.7,
    backgroundColor: Colors.background,
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkIcon: {
    marginRight: 12,
  },
  linkItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  developerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

