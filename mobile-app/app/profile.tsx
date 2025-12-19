import React from 'react';
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
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

// Mock user data
const mockUserData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  phone: '+90 532 123 45 67',
  address: 'Şehitkamil, Gaziantep',
  memberSince: '2023-01-15',
  totalPoints: 1250,
  level: 5,
  completedApplications: 12,
  participatedEvents: 8,
  earnedRewards: 5,
  avatar: 'https://via.placeholder.com/120/2E7D32/FFFFFF?text=AY',
};

export default function ProfileScreen() {
  const router = useRouter();

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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: mockUserData.avatar }}
              style={styles.avatar}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{mockUserData.level}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{mockUserData.name}</Text>
          <View style={styles.pointsContainer}>
            <Coins size={20} color={Colors.secondary} />
            <Text style={styles.pointsText}>{mockUserData.totalPoints} Golbucks</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={<Award size={24} color={Colors.primary} />}
            label="Başvurular"
            value={mockUserData.completedApplications}
            color={Colors.primary}
          />
          <StatCard
            icon={<Calendar size={24} color={Colors.secondary} />}
            label="Etkinlikler"
            value={mockUserData.participatedEvents}
            color={Colors.secondary}
          />
          <StatCard
            icon={<Coins size={24} color={Colors.orange} />}
            label="Ödüller"
            value={mockUserData.earnedRewards}
            color={Colors.orange}
          />
        </View>

        {/* Personal Information */}
        <ProfileSection title="Kişisel Bilgiler">
          <ProfileItem
            icon={<Mail size={18} color={Colors.textSecondary} />}
            title="E-posta"
            value={mockUserData.email}
          />
          <ProfileItem
            icon={<Phone size={18} color={Colors.textSecondary} />}
            title="Telefon"
            value={mockUserData.phone}
          />
          <ProfileItem
            icon={<MapPin size={18} color={Colors.textSecondary} />}
            title="Adres"
            value={mockUserData.address}
          />
          <ProfileItem
            icon={<Calendar size={18} color={Colors.textSecondary} />}
            title="Üyelik Tarihi"
            value={new Date(mockUserData.memberSince).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        </ProfileSection>

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
            onPress={() => router.push('/rewards')}
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
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  levelText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '700',
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
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 16,
  },
});

