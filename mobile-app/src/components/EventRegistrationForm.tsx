import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { User, Phone, Mail, CreditCard, FileText } from 'lucide-react-native';

interface EventRegistrationFormProps {
  onSubmit: (data: EventRegistrationData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  requiresPersonalInfo?: boolean;
}

export interface EventRegistrationData {
  first_name: string;
  last_name: string;
  tc_no: string;
  phone: string;
  email: string;
  notes?: string;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  requiresPersonalInfo = true,
}) => {
  const [formData, setFormData] = useState<EventRegistrationData>({
    first_name: '',
    last_name: '',
    tc_no: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventRegistrationData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventRegistrationData, string>> = {};

    if (requiresPersonalInfo) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'Ad zorunludur';
      }

      if (!formData.last_name.trim()) {
        newErrors.last_name = 'Soyad zorunludur';
      }

      if (!formData.tc_no.trim()) {
        newErrors.tc_no = 'TC Kimlik Numarası zorunludur';
      } else if (formData.tc_no.length !== 11 || !/^\d+$/.test(formData.tc_no)) {
        newErrors.tc_no = 'TC Kimlik Numarası 11 haneli olmalıdır';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefon numarası zorunludur';
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Geçerli bir telefon numarası girin';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'E-posta adresi zorunludur';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta adresi girin';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof EventRegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Başvuru Formu</Text>
        <Text style={styles.subtitle}>
          Etkinliğe katılmak için aşağıdaki bilgileri doldurun
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, errors.first_name && styles.inputError]}
                placeholder="Ad *"
                placeholderTextColor={Colors.textSecondary}
                value={formData.first_name}
                onChangeText={(value) => updateField('first_name', value)}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
            {errors.first_name && (
              <Text style={styles.errorText}>{errors.first_name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, errors.last_name && styles.inputError]}
                placeholder="Soyad *"
                placeholderTextColor={Colors.textSecondary}
                value={formData.last_name}
                onChangeText={(value) => updateField('last_name', value)}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>
            {errors.last_name && (
              <Text style={styles.errorText}>{errors.last_name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <CreditCard size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, errors.tc_no && styles.inputError]}
                placeholder="TC Kimlik No *"
                placeholderTextColor={Colors.textSecondary}
                value={formData.tc_no}
                onChangeText={(value) => {
                  // Only allow numbers and max 11 digits
                  const numericValue = value.replace(/\D/g, '').slice(0, 11);
                  updateField('tc_no', numericValue);
                }}
                keyboardType="number-pad"
                maxLength={11}
                editable={!isLoading}
              />
            </View>
            {errors.tc_no && (
              <Text style={styles.errorText}>{errors.tc_no}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Phone size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Telefon *"
                placeholderTextColor={Colors.textSecondary}
                value={formData.phone}
                onChangeText={(value) => {
                  // Format phone number (remove non-digits, add spaces)
                  const numericValue = value.replace(/\D/g, '');
                  updateField('phone', numericValue);
                }}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!isLoading}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="E-posta *"
                placeholderTextColor={Colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FileText size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ek Notlar (Opsiyonel)"
                placeholderTextColor={Colors.textSecondary}
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
          </View>

          <Text style={styles.requiredNote}>* Zorunlu alanlar</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
    minHeight: 56,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
    paddingBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  requiredNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

