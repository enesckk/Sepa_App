import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { useApp } from '../src/contexts';
import { updateProfile, updatePassword } from '../src/services/api/users';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  mahalle: string;
  avatar?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser, refreshUser } = useApp();
  const [userData, setUserData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    mahalle: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load user data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setUserData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          mahalle: user.mahalle || '',
          avatar: user.avatar || undefined,
        });
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, [user])
  );

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenemedi');
      return;
    }

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

    try {
      // Update profile via API
      const updatedUser = await updateProfile({
        name: userData.name.trim(),
        email: userData.email.trim() !== user?.email ? userData.email.trim() : undefined,
        phone: userData.phone.trim(),
        mahalle: userData.mahalle.trim() || undefined,
      });

      // Update global state
      setUser(updatedUser);
      await refreshUser();

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Profil güncellenirken bir hata oluştu';
      Alert.alert('Hata', errorMessage);
      if (__DEV__) {
        console.error('[EditProfileScreen] Update profile error:', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwordData.currentPassword.trim()) {
      Alert.alert('Hata', 'Lütfen mevcut şifrenizi girin');
      return;
    }

    if (!passwordData.newPassword.trim()) {
      Alert.alert('Hata', 'Lütfen yeni şifrenizi girin');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      Alert.alert('Başarılı', 'Şifreniz güncellendi', [
        {
          text: 'Tamam',
          onPress: () => {
            setShowPasswordSection(false);
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Şifre güncellenirken bir hata oluştu';
      Alert.alert('Hata', errorMessage);
      if (__DEV__) {
        console.error('[EditProfileScreen] Update password error:', error);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Profil Fotoğrafı',
      'Fotoğraf seçme özelliği yakında eklenecek',
      [{ text: 'Tamam' }]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Kullanıcı bilgileri yüklenemedi</Text>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
            {userData.avatar ? (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
                <Text style={styles.avatarText}>{getAvatarInitials(userData.name)}</Text>
              </View>
            )}
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
            <Text style={styles.hintText}>E-posta adresi giriş için kullanılır</Text>
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
              <Text style={styles.label}>Mahalle</Text>
            </View>
            <TextInput
              style={styles.input}
              value={userData.mahalle}
              onChangeText={(text) => setUserData({ ...userData, mahalle: text })}
              placeholder="Mahallenizi girin"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.formSection}>
          <Pressable
            onPress={() => setShowPasswordSection(!showPasswordSection)}
            style={({ pressed }) => [
              styles.passwordToggleButton,
              pressed && styles.passwordToggleButtonPressed,
            ]}
          >
            <View style={styles.passwordToggleContent}>
              <Lock size={20} color={Colors.primary} />
              <Text style={styles.passwordToggleText}>
                {showPasswordSection ? 'Şifre Güncellemeyi Gizle' : 'Şifre Güncelle'}
              </Text>
            </View>
          </Pressable>

          {showPasswordSection && (
            <View style={styles.passwordSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mevcut Şifre</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, currentPassword: text })
                    }
                    placeholder="Mevcut şifrenizi girin"
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color={Colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={Colors.textSecondary} />
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yeni Şifre</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, newPassword: text })
                    }
                    placeholder="Yeni şifrenizi girin (min. 6 karakter)"
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={Colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={Colors.textSecondary} />
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, confirmPassword: text })
                    }
                    placeholder="Yeni şifrenizi tekrar girin"
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={Colors.textSecondary} />
                    )}
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={handleUpdatePassword}
                disabled={isUpdatingPassword}
                style={({ pressed }) => [
                  styles.passwordUpdateButton,
                  pressed && styles.passwordUpdateButtonPressed,
                  isUpdatingPassword && styles.passwordUpdateButtonDisabled,
                ]}
              >
                <Text style={styles.passwordUpdateButtonText}>
                  {isUpdatingPassword ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </Text>
              </Pressable>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.surface,
  },
  passwordToggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordToggleButtonPressed: {
    opacity: 0.7,
  },
  passwordToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passwordToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  passwordSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
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
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 12,
  },
  passwordUpdateButton: {
    marginTop: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordUpdateButtonPressed: {
    opacity: 0.8,
  },
  passwordUpdateButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.textSecondary,
  },
  passwordUpdateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
});

