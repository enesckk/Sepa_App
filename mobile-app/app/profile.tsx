import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  User,
  Coins,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit,
  ChevronRight,
  FileText,
  Gift,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { useApp } from '../src/contexts';
import { Alert } from 'react-native';
import { getMyApplications, getMyRegistrations, getMyRewards } from '../src/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, golbucks } = useApp();
  const [stats, setStats] = useState({
    applications: 0,
    events: 0,
    rewards: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Load stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        try {
          setLoadingStats(true);
          // Load stats individually with better error handling
          let applicationsCount = 0;
          let eventsCount = 0;
          let rewardsCount = 0;

          try {
            const applicationsResponse = await getMyApplications({ limit: 1, offset: 0 });
            applicationsCount = applicationsResponse.total || 0;
          } catch (error) {
            if (__DEV__) {
              console.error('[ProfileScreen] Error loading applications:', error);
            }
          }

          try {
            const eventsResponse = await getMyRegistrations({ limit: 1, offset: 0 });
            eventsCount = eventsResponse.total || 0;
          } catch (error) {
            if (__DEV__) {
              console.error('[ProfileScreen] Error loading events:', error);
            }
            // Set to 0 on error
            eventsCount = 0;
          }

          try {
            const rewardsResponse = await getMyRewards({ limit: 1, offset: 0 });
            rewardsCount = rewardsResponse.total || 0;
          } catch (error) {
            if (__DEV__) {
              console.error('[ProfileScreen] Error loading rewards:', error);
            }
          }

          setStats({
            applications: applicationsCount,
            events: eventsCount,
            rewards: rewardsCount,
          });
        } catch (error) {
          if (__DEV__) {
            console.error('[ProfileScreen] Error loading stats:', error);
          }
        } finally {
          setLoadingStats(false);
        }
      };

      loadStats();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigate to login screen
              router.replace('/login');
            } catch (error) {
              if (__DEV__) {
                console.error('Logout error:', error);
              }
              // Even if logout fails, navigate to login
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
  }> = ({ icon, title, value }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      <Text style={styles.profileItemValue}>{value}</Text>
    </View>
  );

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Profil</Text>
        <Pressable
          onPress={() => router.push('/edit-profile')}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
        >
          <Edit size={20} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        {user ? (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.avatarText}>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.pointsContainer}>
                <Coins size={20} color={Colors.secondary} />
                <Text style={styles.pointsText}>{golbucks || user.golbucks || 0} Golbucks</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <StatCard
                icon={<Award size={24} color={Colors.primary} />}
                label="Başvurular"
                value={loadingStats ? '...' : stats.applications.toString()}
                color={Colors.primary}
              />
              <StatCard
                icon={<Calendar size={24} color={Colors.secondary} />}
                label="Etkinlikler"
                value={loadingStats ? '...' : stats.events.toString()}
                color={Colors.secondary}
              />
              <StatCard
                icon={<Coins size={24} color={Colors.orange} />}
                label="Ödüller"
                value={loadingStats ? '...' : stats.rewards.toString()}
                color={Colors.orange}
              />
            </View>

            {/* Personal Information */}
            <ProfileSection title="Kişisel Bilgiler">
              <ProfileItem
                icon={<Mail size={18} color={Colors.textSecondary} />}
                title="E-posta"
                value={user.email}
              />
              {user.phone && (
                <ProfileItem
                  icon={<Phone size={18} color={Colors.textSecondary} />}
                  title="Telefon"
                  value={user.phone}
                />
              )}
              {user.mahalle && (
                <ProfileItem
                  icon={<MapPin size={18} color={Colors.textSecondary} />}
                  title="Mahalle"
                  value={user.mahalle}
                />
              )}
              <ProfileItem
                icon={<Calendar size={18} color={Colors.textSecondary} />}
                title="Üyelik Tarihi"
                value={new Date(user.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            </ProfileSection>
          </>
        ) : (
          <View style={styles.profileHeader}>
            <Text style={styles.userName}>Kullanıcı bilgileri yükleniyor...</Text>
          </View>
        )}

        {/* Quick Actions */}
        <ProfileSection title="Hızlı İşlemler">
          <Pressable
            onPress={() => router.push('/my-applications')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primaryLight + '20' }]}>
                <FileText size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionItemTitle}>Başvurularım</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/rewards')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.secondary + '20' }]}>
                <Gift size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.actionItemTitle}>Ödüllerim</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </Pressable>
        </ProfileSection>

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

        {/* Bottom Spacer */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButtonPressed: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  profileItemTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '60%',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionItemPressed: {
    opacity: 0.6,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionItemTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    gap: 12,
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 16,
  },
});

