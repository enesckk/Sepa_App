import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  Pressable,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Search, Plus } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getMyApplications, Application, GetApplicationsParams } from '../src/services/api';
import { parseApiError, isAuthError } from '../src/utils/errorHandler';
import { useApp } from '../src/contexts/AppContext';

type ApplicationStatus = 'all' | 'pending' | 'in_progress' | 'resolved' | 'rejected';

const getStatusFilter = (status: ApplicationStatus): GetApplicationsParams['status'] | undefined => {
  if (status === 'all') return undefined;
  return status as GetApplicationsParams['status'];
};

const getStatusDisplay = (status: string): { text: string; color: string } => {
  switch (status) {
    case 'pending':
      return { text: 'Beklemede', color: Colors.orange };
    case 'in_progress':
      return { text: 'İşlemde', color: Colors.blue };
    case 'resolved':
      return { text: 'Çözüldü', color: Colors.green };
    case 'rejected':
      return { text: 'Reddedildi', color: '#EF4444' };
    case 'closed':
      return { text: 'Kapandı', color: Colors.textSecondary };
    default:
      return { text: status, color: Colors.textSecondary };
  }
};

const getTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    complaint: 'Şikayet',
    request: 'Talep',
    marriage: 'Nikah Başvurusu',
    muhtar_message: 'Muhtara Mesaj',
    other: 'Diğer',
  };
  return typeMap[type] || type;
};

export default function MyApplicationsScreen() {
  const router = useRouter();
  const { logout } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<ApplicationStatus>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setError(null);
      const status = getStatusFilter(selectedFilter);
      const response = await getMyApplications({
        status,
        limit: 50,
        offset: 0,
        sort: 'created_at',
        order: 'DESC',
      });
      setApplications(response.applications);
    } catch (err) {
      const apiError = parseApiError(err);
      
      // If authentication error (401), logout and redirect to login
      // API client interceptor already tried to refresh token, so if we get 401 here,
      // it means refresh failed or refresh token is missing
      if (isAuthError(apiError) && apiError.statusCode === 401) {
        if (__DEV__) {
          console.log('[MyApplicationsScreen] 401 error, logging out and redirecting to login');
        }
        // Logout and redirect to login (don't show error message)
        try {
          await logout();
        } catch (logoutError) {
          if (__DEV__) {
            console.error('[MyApplicationsScreen] Logout error:', logoutError);
          }
        }
        // Navigate to login - use replace to clear navigation stack
        // Use setTimeout to ensure logout state is updated before navigation
        setTimeout(() => {
          router.replace('/login');
        }, 0);
        return;
      }
      
      // For other errors, show error message
      setError(apiError.message || 'Başvurular yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[MyApplicationsScreen] Load error:', apiError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadApplications();
    }, [selectedFilter])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const filteredApplications = applications;

  const filters: { id: ApplicationStatus; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'pending', label: 'Beklemede' },
    { id: 'in_progress', label: 'İşlemde' },
    { id: 'resolved', label: 'Çözüldü' },
    { id: 'rejected', label: 'Reddedildi' },
  ];

  const handleApplicationPress = (application: Application) => {
    router.push(`/application-detail?id=${application.id}`);
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
        <Text style={styles.headerTitle}>Başvurularım</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/create-application')}
          >
            <Plus size={24} color={Colors.primary} />
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hata</Text>
          <Text style={styles.emptySubtext}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadApplications();
            }}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          keyExtractor={(item) => item.id}
          renderItem={({ item: app }) => {
            const statusDisplay = getStatusDisplay(app.status);
            const formattedDate = new Date(app.created_at).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            
            return (
              <Pressable
                style={styles.applicationCard}
                onPress={() => handleApplicationPress(app)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.applicationId}>
                      {app.reference_number || app.id}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusDisplay.color + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusDisplay.color },
                        ]}
                      >
                        {statusDisplay.text}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.typeText}>{getTypeDisplay(app.type)}</Text>
                  <Text style={styles.subjectText} numberOfLines={1}>
                    {app.subject}
                  </Text>
                  <Text style={styles.descriptionText} numberOfLines={2}>
                    {app.description}
                  </Text>
                  {app.location && (
                    <Text style={styles.locationText}>📍 {app.location}</Text>
                  )}
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Başvuru bulunamadı</Text>
              <Text style={styles.emptySubtext}>
                {selectedFilter === 'all'
                  ? 'Henüz başvuru yapmadınız'
                  : 'Bu filtreye uygun başvuru bulunamadı'}
              </Text>
            </View>
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
    marginBottom: 4,
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

