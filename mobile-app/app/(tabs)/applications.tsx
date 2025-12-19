import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IssueTypeSelector } from '../../src/components/IssueTypeSelector';
import { PhotoUpload } from '../../src/components/PhotoUpload';
import { DescriptionInput } from '../../src/components/DescriptionInput';
import { LocationPicker } from '../../src/components/LocationPicker';
import { SubmitButton } from '../../src/components/SubmitButton';
import { SuccessSnackbar } from '../../src/components/SuccessSnackbar';
import { Colors } from '../../src/constants/colors';
import { issueTypes } from '../../src/services/mockApplicationsData';

export default function ApplicationScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleAddPhoto = () => {
    // Mock photo - in real app, use ImagePicker
    const mockPhoto = `https://picsum.photos/400/400?random=${Date.now()}`;
    setPhotos([...photos, mockPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleUseGPS = () => {
    // Mock GPS location
    setLocation('Şehitkamil, Gaziantep (GPS Konumu)');
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Uyarı', 'Lütfen bir kategori seçin');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Uyarı', 'Lütfen açıklama girin');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Uyarı', 'Lütfen konum bilgisi girin');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const id = `APP-${Date.now()}`;
      setApplicationId(id);
      setShowSuccess(true);
      setLoading(false);
      
      // Reset form
      setSelectedType(null);
      setDescription('');
      setLocation('');
      setPhotos([]);
    }, 1500);
  };

  const isFormValid = selectedType && description.trim() && location.trim();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Başvuru Bildir</Text>
        <Text style={styles.headerSubtitle}>
          Şikayet veya talebinizi bize iletin
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IssueTypeSelector
          selectedType={selectedType}
          onSelect={setSelectedType}
          types={issueTypes}
        />

        <DescriptionInput
          value={description}
          onChangeText={setDescription}
          placeholder="Şikayet veya talebinizi detaylı olarak açıklayın..."
        />

        <LocationPicker
          location={location}
          onLocationChange={setLocation}
          onUseGPS={handleUseGPS}
        />

        <PhotoUpload
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
        />

        <SubmitButton
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={loading}
        />
      </ScrollView>

      <SuccessSnackbar
        visible={showSuccess}
        message="Talebiniz alınmıştır"
        subMessage={applicationId ? `Başvuru No: ${applicationId}` : undefined}
        onComplete={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
});

