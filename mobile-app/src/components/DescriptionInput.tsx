import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface DescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const DescriptionInput: React.FC<DescriptionInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Açıklama yazın...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <FileText size={18} color={Colors.primary} />
        <Text style={styles.label}>Açıklama</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
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
});

