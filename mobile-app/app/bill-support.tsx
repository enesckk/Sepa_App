import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TabBar, TabType } from '../src/components/TabBar';
import { BillForm } from '../src/components/BillForm';
import { SupportList } from '../src/components/SupportList';
import { SupportButton } from '../src/components/SupportButton';
import { SubmitButton } from '../src/components/SubmitButton';
import { GolbucksEarned } from '../src/components/GolbucksEarned';
import { SuccessSnackbar } from '../src/components/SuccessSnackbar';
import { Colors } from '../src/constants/colors';
import { mockBills, Bill } from '../src/services/mockBillsData';

export default function BillSupportScreen() {
  const router = useRouter();
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
    setBills(bills.map((bill) =>
      bill.id === billId
        ? { ...bill, supportedBy: (bill.supportedBy || 0) + 1 }
        : bill
    ));
    setShowReward(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Askıda Fatura</Text>
        <Text style={styles.headerSubtitle}>
          Faturanızı askıya bırakın veya başkalarına destek olun
        </Text>
        </View>
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'leave' ? (
          <>
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
              disabled={!firstName.trim() || !lastName.trim() || !subscriberNumber.trim() || !amount.trim()}
            />
          </>
        ) : (
          <SupportList
            bills={bills.filter((bill) => bill.status === 'pending')}
            onSupport={handleSupport}
          />
        )}
      </ScrollView>

      <GolbucksEarned
        visible={showReward}
        amount={10}
        onComplete={() => setShowReward(false)}
      />

      <SuccessSnackbar
        visible={showSuccess}
        message="Faturanız askıya bırakıldı"
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    flex: 1,
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
  },
});

