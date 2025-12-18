import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { User, Hash, DollarSign } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface BillFormProps {
  firstName: string;
  lastName: string;
  subscriberNumber: string;
  amount: string;
  onFirstNameChange: (text: string) => void;
  onLastNameChange: (text: string) => void;
  onSubscriberNumberChange: (text: string) => void;
  onAmountChange: (text: string) => void;
}

export const BillForm: React.FC<BillFormProps> = ({
  firstName,
  lastName,
  subscriberNumber,
  amount,
  onFirstNameChange,
  onLastNameChange,
  onSubscriberNumberChange,
  onAmountChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <User size={18} color={Colors.primary} />
            <Text style={styles.label}>Ad</Text>
          </View>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={onFirstNameChange}
            placeholder="Adınız"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <User size={18} color={Colors.primary} />
            <Text style={styles.label}>Soyad</Text>
          </View>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={onLastNameChange}
            placeholder="Soyadınız"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Hash size={18} color={Colors.primary} />
          <Text style={styles.label}>Abone No</Text>
        </View>
        <TextInput
          style={styles.input}
          value={subscriberNumber}
          onChangeText={onSubscriberNumberChange}
          placeholder="Abone numaranız"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <DollarSign size={18} color={Colors.primary} />
          <Text style={styles.label}>Fatura Tutarı (₺)</Text>
        </View>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={onAmountChange}
          placeholder="Fatura tutarı"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
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

