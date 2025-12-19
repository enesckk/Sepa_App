import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Globe,
  User,
  Lock,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            if (__DEV__) {
              console.log('Logout');
            }
            // Navigate to login screen
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Verileri Temizle',
      'Tüm önbellek verileri silinecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => {
            if (__DEV__) {
              console.log('Clear data');
            }
            Alert.alert('Başarılı', 'Veriler temizlendi');
          },
        },
      ]
    );
  };

  const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsItem,
        pressed && styles.settingsItemPressed,
      ]}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent || (onPress && <ChevronRight size={20} color={Colors.textSecondary} />)}
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
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications */}
        <SettingsSection title="Bildirimler">
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.iconContainer}>
                <Bell size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={styles.settingsItemTitle}>Push Bildirimleri</Text>
                <Text style={styles.settingsItemSubtitle}>
                  Etkinlik ve güncellemeler için bildirim al
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.textSecondary}
            />
          </View>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="Dil">
          <SettingsItem
            icon={<Globe size={20} color={Colors.primary} />}
            title="Dil Seçimi"
            subtitle={language === 'tr' ? 'Türkçe' : 'English'}
            onPress={() => {
              setLanguage(language === 'tr' ? 'en' : 'tr');
            }}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Hesap">
          <SettingsItem
            icon={<User size={20} color={Colors.primary} />}
            title="Hesap Bilgileri"
            subtitle="Ad, soyad, telefon, email"
            onPress={() => {
              if (__DEV__) {
                console.log('Account info');
              }
            }}
          />
          <SettingsItem
            icon={<Lock size={20} color={Colors.primary} />}
            title="Şifre Değiştir"
            onPress={() => {
              if (__DEV__) {
                console.log('Change password');
              }
            }}
          />
        </SettingsSection>

        {/* Data */}
        <SettingsSection title="Veri">
          <SettingsItem
            icon={<Trash2 size={20} color={Colors.orange} />}
            title="Verileri Temizle"
            subtitle="Önbellek ve geçici dosyalar"
            onPress={handleClearData}
          />
        </SettingsSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </Pressable>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
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
  settingsItemPressed: {
    opacity: 0.7,
    backgroundColor: Colors.background,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    gap: 8,
  },
  logoutButtonPressed: {
    opacity: 0.7,
    backgroundColor: Colors.error + '10',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
});

