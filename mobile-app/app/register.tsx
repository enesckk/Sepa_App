import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { register } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';
import { useApp } from '../src/contexts/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    mahalle: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Uyarı', 'Lütfen adınızı girin');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir email adresi girin');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Uyarı', 'Lütfen telefon numaranızı girin');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Uyarı', 'Şifreler eşleşmiyor');
      return;
    }

    try {
      setLoading(true);
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        mahalle: formData.mahalle.trim() || undefined,
      });

      // API response format: { success: true, data: { user, tokens } }
      // apiClient returns response.data, so we get { user, tokens }
      if (response.user && response.tokens) {
        setUser(response.user);
        
        Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!', [
          {
            text: 'Tamam',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } else {
        Alert.alert('Hata', 'Kayıt başarısız. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      const apiError = parseApiError(error);
      Alert.alert('Kayıt Hatası', apiError.message || 'Kayıt olurken bir hata oluştu');
      if (__DEV__) {
        console.error('[RegisterScreen] Register error:', apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Şehitkamil Belediyesi'ne katılın</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mahalle (Opsiyonel)"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.mahalle}
                  onChangeText={(value) => updateField('mahalle', value)}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPassword ? 'Gizle' : 'Göster'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={Colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeButtonText}>
                    {showConfirmPassword ? 'Gizle' : 'Göster'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                  <ArrowRight size={20} color={Colors.surface} />
                </>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.footerLink}>Giriş Yap</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    marginTop: 8,
    gap: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});

