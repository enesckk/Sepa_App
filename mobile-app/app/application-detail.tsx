import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, MessageSquare } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getApplicationById, addApplicationComment, Application, API_CONFIG } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';
import { OptimizedImage } from '../src/components/OptimizedImage';

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

export default function ApplicationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const app = await getApplicationById(id!);
      setApplication(app);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Başvuru yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[ApplicationDetailScreen] Load error:', apiError);
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir yorum yazın');
      return;
    }

    try {
      setSubmittingComment(true);
      const updated = await addApplicationComment(id!, comment.trim());
      setApplication(updated);
      setComment('');
      Alert.alert('Başarılı', 'Yorumunuz eklendi');
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Yorum eklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[ApplicationDetailScreen] Add comment error:', apiError);
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Başvuru bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusDisplay = getStatusDisplay(application.status);
  const formattedDate = new Date(application.created_at).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Başvuru Detayı</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusDisplay.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusDisplay.color }]}>
            {statusDisplay.text}
          </Text>
        </View>

        {/* Reference Number */}
        {application.reference_number && (
          <Text style={styles.referenceNumber}>
            Referans No: {application.reference_number}
          </Text>
        )}

        {/* Type */}
        <Text style={styles.typeText}>{getTypeDisplay(application.type)}</Text>

        {/* Subject */}
        <Text style={styles.subjectText}>{application.subject}</Text>

        {/* Date */}
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>

        {/* Location */}
        {application.location && (
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{application.location}</Text>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.descriptionText}>{application.description}</Text>
        </View>

        {/* Image */}
        {application.image_url && (
          <View style={styles.section}>
            <OptimizedImage
              source={
                application.image_url.startsWith('http')
                  ? application.image_url
                  : `${API_CONFIG.BASE_URL.replace('/api', '')}${application.image_url}`
              }
              style={styles.image}
              contentFit="cover"
              showLoading={true}
            />
          </View>
        )}

        {/* Admin Response */}
        {application.admin_response && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yanıt</Text>
            <View style={styles.responseBox}>
              <Text style={styles.responseText}>{application.admin_response}</Text>
              {application.admin_response_date && (
                <Text style={styles.responseDate}>
                  {new Date(application.admin_response_date).toLocaleDateString('tr-TR')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* User Comment */}
        {application.user_comment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yorumunuz</Text>
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{application.user_comment}</Text>
              {application.user_comment_date && (
                <Text style={styles.commentDate}>
                  {new Date(application.user_comment_date).toLocaleDateString('tr-TR')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Add Comment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yorum Ekle</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Yorumunuzu yazın..."
            placeholderTextColor={Colors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Pressable
            style={[styles.submitButton, submittingComment && styles.submitButtonDisabled]}
            onPress={handleAddComment}
            disabled={submittingComment || !comment.trim()}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Yorum Gönder</Text>
            )}
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
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  referenceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  responseBox: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  responseText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  responseDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  commentBox: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  commentDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  commentInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

