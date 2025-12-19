import React, { useState } from 'react';
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
import { ArrowLeft, Search, Filter } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

type ApplicationStatus = 'all' | 'pending' | 'in-progress' | 'completed';

interface Application {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  location?: string;
}

export default function MyApplicationsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<ApplicationStatus>('all');
  const [applications] = useState<Application[]>([
    {
      id: 'APP-001',
      type: 'Çevre',
      description: 'Park alanında çöp birikmesi var',
      status: 'pending',
      createdAt: '2024-12-15',
      location: 'Merkez Mahallesi',
    },
    {
      id: 'APP-002',
      type: 'Altyapı',
      description: 'Yol çukuru var, düzeltilmesi gerekiyor',
      status: 'in-progress',
      createdAt: '2024-12-10',
      location: 'Yenişehir Mahallesi',
    },
    {
      id: 'APP-003',
      type: 'Çevre',
      description: 'Ağaç budama talebi',
      status: 'completed',
      createdAt: '2024-12-05',
      location: 'Güney Mahallesi',
    },
  ]);

  const filteredApplications = applications.filter((app) => {
    if (selectedFilter === 'all') return true;
    return app.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'in-progress':
        return Colors.blue;
      case 'completed':
        return Colors.green;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'in-progress':
        return 'İşlemde';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  const filters: { id: ApplicationStatus; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'pending', label: 'Beklemede' },
    { id: 'in-progress', label: 'İşlemde' },
    { id: 'completed', label: 'Tamamlandı' },
  ];

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
        <Text style={styles.headerTitle}>Başvurularım</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Search size={20} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <Pressable
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Applications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredApplications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Başvuru bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all'
                ? 'Henüz başvuru yapmadınız'
                : 'Bu filtreye uygun başvuru bulunamadı'}
            </Text>
          </View>
        ) : (
          filteredApplications.map((app) => (
            <Pressable
              key={app.id}
              style={styles.applicationCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.applicationId}>{app.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(app.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(app.status) },
                      ]}
                    >
                      {getStatusText(app.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.dateText}>{app.createdAt}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.typeText}>{app.type}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {app.description}
                </Text>
                {app.location && (
                  <Text style={styles.locationText}>📍 {app.location}</Text>
                )}
              </View>
            </Pressable>
          ))
        )}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  applicationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applicationId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardBody: {
    gap: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

