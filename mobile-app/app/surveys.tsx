import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getSurveys, Survey } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';

export default function SurveyScreen() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSurveys = async () => {
    try {
      setError(null);
      const response = await getSurveys();
      const surveysList = response?.surveys || [];
      setSurveys(surveysList);
      
      if (__DEV__) {
        console.log('[SurveyScreen] Loaded surveys:', surveysList.length);
      }
    } catch (err) {
      const apiError = parseApiError(err);
      const errorMessage = apiError.message || 'Anketler yüklenirken bir hata oluştu';
      setError(errorMessage);
      
      // In dev mode, show more details
      if (__DEV__) {
        console.error('[SurveyScreen] Load error:', {
          message: errorMessage,
          error: apiError,
          fullError: err,
        });
      }
      
      // Set empty array on error so UI doesn't break
      setSurveys([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadSurveys();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadSurveys();
  };

  const handleSurveyPress = (survey: Survey) => {
    router.push(`/survey-detail?id=${survey.id}`);
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
          <Text style={styles.headerTitle}>Anketler</Text>
          <Text style={styles.headerSubtitle}>
            Görüşlerinizi paylaşın, puan kazanın
          </Text>
        </View>
      </View>

      {/* Surveys List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                loadSurveys();
              }}
            >
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </Pressable>
          </View>
        ) : surveys.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aktif anket bulunmuyor</Text>
            <Text style={styles.emptySubtext}>
              Yeni anketler eklendiğinde burada görünecek
            </Text>
          </View>
        ) : (
          surveys.map((survey) => {
            const isCompleted = survey.isCompleted || false;
            const questionCount = survey.questions?.length || 0;

            return (
              <Pressable
                key={survey.id}
                style={styles.surveyCard}
                onPress={() => handleSurveyPress(survey)}
              >
                <View style={styles.surveyHeader}>
                  <View style={styles.surveyHeaderLeft}>
                    <Text style={styles.surveyTitle}>{survey.title}</Text>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Check size={14} color={Colors.success} />
                        <Text style={styles.completedText}>Tamamlandı</Text>
                      </View>
                    )}
                  </View>
                  {survey.golbucks_reward > 0 && (
                    <View style={styles.rewardBadge}>
                      <Text style={styles.rewardText}>+{survey.golbucks_reward}</Text>
                    </View>
                  )}
                </View>
                {survey.description && (
                  <Text style={styles.surveyDescription} numberOfLines={2}>
                    {survey.description}
                  </Text>
                )}
                <View style={styles.surveyFooter}>
                  <Text style={styles.questionCount}>
                    {questionCount} {questionCount === 1 ? 'soru' : 'soru'}
                  </Text>
                  {survey.expires_at && (
                    <Text style={styles.expiresText}>
                      Bitiş: {new Date(survey.expires_at).toLocaleDateString('tr-TR')}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 16,
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
  surveyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  surveyHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  rewardBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  surveyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  surveyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  questionCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  expiresText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

