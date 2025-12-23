import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../src/constants/colors';
import { createApplication, CreateApplicationRequest } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';

const APPLICATION_TYPES = [
  { value: 'complaint', label: 'Şikayet' },
  { value: 'request', label: 'Talep' },
  { value: 'marriage', label: 'Nikah Başvurusu' },
  { value: 'muhtar_message', label: 'Muhtara Mesaj' },
  { value: 'other', label: 'Diğer' },
] as const;

export default function CreateApplicationScreen() {
  const router = useRouter();
  const [type, setType] = useState<string>('complaint');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gereklidir');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera erişim izni gereklidir');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleImageAction = () => {
    Alert.alert(
      'Fotoğraf Seç',
      'Fotoğraf eklemek için bir seçenek seçin',
      [
        { text: 'Kamera', onPress: handleTakePhoto },
        { text: 'Galeri', onPress: handlePickImage },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Uyarı', 'Lütfen konu başlığı girin');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Uyarı', 'Lütfen açıklama girin');
      return;
    }

    try {
      setSubmitting(true);
      const data: CreateApplicationRequest = {
        type,
        subject: subject.trim(),
        description: description.trim(),
      };

      if (location.trim()) {
        data.location = location.trim();
      }

      if (latitude !== undefined && longitude !== undefined) {
        data.latitude = latitude;
        data.longitude = longitude;
      }

      const application = await createApplication(
        data,
        photo ? [photo] : undefined
      );

      Alert.alert(
        'Başarılı',
        'Başvurunuz başarıyla oluşturuldu',
        [
          {
            text: 'Tamam',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Başvuru oluşturulurken bir hata oluştu');
      if (__DEV__) {
        console.error('[CreateApplicationScreen] Submit error:', apiError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Yeni Başvuru</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Başvuru Tipi</Text>
          <View style={styles.typeSelector}>
            {APPLICATION_TYPES.map((appType) => (
              <Pressable
                key={appType.value}
                style={[
                  styles.typeButton,
                  type === appType.value && styles.typeButtonActive,
                ]}
                onPress={() => setType(appType.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === appType.value && styles.typeButtonTextActive,
                  ]}
                >
                  {appType.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={styles.label}>Konu Başlığı *</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Başvuru konusunu yazın"
            placeholderTextColor={Colors.textSecondary}
            maxLength={255}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Açıklama *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Detaylı açıklama yazın..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Konum (Opsiyonel)</Text>
          <View style={styles.locationInput}>
            <MapPin size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.locationTextInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Konum bilgisi"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        {/* Photo */}
        <View style={styles.section}>
          <Text style={styles.label}>Fotoğraf (Opsiyonel)</Text>
          {photo ? (
            <View style={styles.photoContainer}>
              <View style={styles.photoPreview}>
                <Text style={styles.photoText}>Fotoğraf seçildi</Text>
                <Pressable
                  style={styles.removePhotoButton}
                  onPress={() => setPhoto(null)}
                >
                  <Text style={styles.removePhotoText}>Kaldır</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.photoButton} onPress={handleImageAction}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Fotoğraf Ekle</Text>
            </Pressable>
          )}
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !subject.trim() || !description.trim()}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <Text style={styles.submitButtonText}>Başvuruyu Gönder</Text>
          )}
        </Pressable>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  typeButtonTextActive: {
    color: Colors.surface,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 120,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primary,
  },
  photoContainer: {
    marginTop: 8,
  },
  photoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoText: {
    fontSize: 14,
    color: Colors.text,
  },
  removePhotoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  removePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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

