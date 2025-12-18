import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import { TabBar, TabType } from '../components/TabBar';
import { BillForm } from '../components/BillForm';
import { SupportList } from '../components/SupportList';
import { SupportButton } from '../components/SupportButton';
import { SubmitButton } from '../components/SubmitButton';
import { GolbucksEarned } from '../components/GolbucksEarned';
import { SuccessSnackbar } from '../components/SuccessSnackbar';
import { Colors } from '../constants/colors';
import { mockBills, Bill } from '../services/mockBillsData';

export const BillSupportScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('leave');
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLeaveBill = () => {
    if (!firstName.trim() || !lastName.trim() || !subscriberNumber.trim() || !amount.trim()) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    const newBill: Bill = {
      id: `BILL-${Date.now()}`,
      firstName,
      lastName,
      subscriberNumber,
      amount: parseFloat(amount),
      type: 'electricity',
      status: 'pending',
      supportedBy: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBills([...bills, newBill]);
    setShowSuccess(true);
    
    // Reset form
    setFirstName('');
    setLastName('');
    setSubscriberNumber('');
    setAmount('');
  };

  const handleSupport = (billId: string) => {
    setSelectedBillId(billId);
    const bill = bills.find((b) => b.id === billId);
    if (bill) {
      setBills(
        bills.map((b) =>
          b.id === billId
            ? { ...b, supportedBy: (b.supportedBy || 0) + 1 }
            : b
        )
      );
      setShowReward(true);
      setShowSuccess(true);
    }
  };

  const isFormValid = firstName.trim() && lastName.trim() && subscriberNumber.trim() && amount.trim();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Askıda Fatura</Text>
        <Text style={styles.headerSubtitle}>
          Faturanızı paylaşın veya ihtiyaç sahiplerine destek olun
        </Text>
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'leave' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BillForm
            firstName={firstName}
            lastName={lastName}
            subscriberNumber={subscriberNumber}
            amount={amount}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onSubscriberNumberChange={setSubscriberNumber}
            onAmountChange={setAmount}
          />

          <SubmitButton
            onPress={handleLeaveBill}
            disabled={!isFormValid}
            text="Faturayı Askıya Bırak"
          />
        </ScrollView>
      ) : (
        <View style={styles.supportContainer}>
          <SupportList bills={bills} onSupport={handleSupport} />
        </View>
      )}

      <GolbucksEarned
        visible={showReward}
        amount={50}
        onComplete={() => setShowReward(false)}
      />

      <SuccessSnackbar
        visible={showSuccess}
        message={
          activeTab === 'leave'
            ? 'Faturanız askıya bırakıldı'
            : 'Destek için teşekkürler!'
        }
        subMessage={
          activeTab === 'support' ? '+50 Gölbucks kazandınız' : undefined
        }
        onComplete={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
};

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
    paddingBottom: 20,
  },
  supportContainer: {
    flex: 1,
  },
});

