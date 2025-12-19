import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

// Mock user data - In real app, this would come from context/state
const initialUserData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  phone: '+90 532 123 45 67',
  address: 'Şehitkamil, Gaziantep',
  avatar: 'https://via.placeholder.com/120/2E7D32/FFFFFF?text=AY',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(initialUserData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!userData.name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin');
      return;
    }

    if (!userData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');
      return;
    }

    if (!userData.phone.trim()) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    }, 1000);
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Profil Fotoğrafı',
      'Fotoğraf seçme özelliği yakında eklenecek',
      [{ text: 'Tamam' }]
    );
  };

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
        <Text style={styles.headerTitle}>Profili Düzenle</Text>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            isSaving && styles.saveButtonDisabled,
          ]}
        >
          <Save size={20} color={isSaving ? Colors.textSecondary : Colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={handleChangeAvatar}
              style={styles.cameraButton}
            >
              <Camera size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Fotoğrafa dokunarak değiştirebilirsiniz</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Adınızı girin"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Mail size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>E-posta</Text>
            </View>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Phone size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>Telefon</Text>
            </View>
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="Telefon numaranızı girin"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>Adres</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, address: text })}
              placeholder="Adresinizi girin"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButtonLarge,
            pressed && styles.saveButtonLargePressed,
            isSaving && styles.saveButtonLargeDisabled,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Text>
        </Pressable>

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
  saveButton: {
    padding: 8,
    borderRadius: 8,
  },
  saveButtonPressed: {
    opacity: 0.6,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  saveButtonLarge: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonLargePressed: {
    opacity: 0.8,
  },
  saveButtonLargeDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 20 : 16,
  },
});

