import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TabBar, TabType } from '../src/components/TabBar';
import { SubmitButton } from '../src/components/SubmitButton';
import { SuccessSnackbar } from '../src/components/SuccessSnackbar';
import { Colors } from '../src/constants/colors';
import { createBillSupport, getBillSupports, BillSupport } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';

const getBillTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    electricity: 'Elektrik',
    water: 'Su',
    gas: 'Doğalgaz',
    internet: 'İnternet',
    phone: 'Telefon',
    other: 'Diğer',
  };
  return typeMap[type] || type;
};

const getStatusDisplay = (status: string): { text: string; color: string } => {
  switch (status) {
    case 'pending':
      return { text: 'Beklemede', color: Colors.orange };
    case 'approved':
      return { text: 'Onaylandı', color: Colors.green };
    case 'rejected':
      return { text: 'Reddedildi', color: '#EF4444' };
    case 'paid':
      return { text: 'Ödendi', color: Colors.green };
    case 'cancelled':
      return { text: 'İptal Edildi', color: Colors.textSecondary };
    default:
      return { text: status, color: Colors.textSecondary };
  }
};

export default function BillSupportScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('leave');
  const [bills, setBills] = useState<BillSupport[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form state
  const [billType, setBillType] = useState<'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'other'>('electricity');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === 'support') {
      loadBills();
    }
  }, [activeTab]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await getBillSupports({
        status: 'pending',
        limit: 50,
        offset: 0,
      });
      setBills(response.billSupports);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Faturalar yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[BillSupportScreen] Load error:', apiError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLeaveBill = async () => {
    if (!amount.trim()) {
      Alert.alert('Uyarı', 'Lütfen fatura tutarını girin');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir fatura tutarı girin');
      return;
    }

    try {
      setSubmitting(true);
      await createBillSupport({
        bill_type: billType,
        amount: amountNum,
        description: description.trim() || undefined,
      });
      
      setShowSuccess(true);
      
      // Reset form
      setAmount('');
      setDescription('');
      setBillType('electricity');
      
      // Switch to support tab to see the new bill
      setTimeout(() => {
        setActiveTab('support');
        loadBills();
      }, 1500);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Fatura eklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[BillSupportScreen] Create error:', apiError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBills();
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
        refreshControl={
          activeTab === 'support' ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {activeTab === 'leave' ? (
          <>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fatura Tipi</Text>
                <View style={styles.typeSelector}>
                  {(['electricity', 'water', 'gas', 'internet', 'phone', 'other'] as const).map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeButton,
                        billType === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setBillType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          billType === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {getBillTypeDisplay(type)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fatura Tutarı (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Fatura tutarını girin"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Açıklama (Opsiyonel)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Açıklama yazın..."
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            <SubmitButton
              onPress={handleLeaveBill}
              disabled={!amount.trim() || submitting}
            />
          </>
        ) : (
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
              </View>
            ) : bills.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>Askıda fatura bulunmuyor</Text>
                <Text style={styles.emptySubtext}>
                  İlk faturayı siz bırakabilirsiniz
                </Text>
              </View>
            ) : (
              bills.map((bill) => {
                const statusDisplay = getStatusDisplay(bill.status);
                const formattedDate = new Date(bill.created_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                
                return (
                  <View key={bill.id} style={styles.billCard}>
                    <View style={styles.billHeader}>
                      <View style={styles.billInfo}>
                        <Text style={styles.billType}>{getBillTypeDisplay(bill.bill_type)}</Text>
                        {bill.reference_number && (
                          <Text style={styles.billRef}>Ref: {bill.reference_number}</Text>
                        )}
                      </View>
                      <View style={styles.amountContainer}>
                        <Text style={styles.amount}>{bill.amount.toFixed(2)} ₺</Text>
                      </View>
                    </View>
                    {bill.description && (
                      <Text style={styles.billDescription} numberOfLines={2}>
                        {bill.description}
                      </Text>
                    )}
                    <View style={styles.billFooter}>
                      <View style={[styles.statusBadge, { backgroundColor: statusDisplay.color + '20' }]}>
                        <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                          {statusDisplay.text}
                        </Text>
                      </View>
                      <Text style={styles.billDate}>{formattedDate}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

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
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
    minHeight: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  billCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billInfo: {
    flex: 1,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  billRef: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountContainer: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  billDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  billDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

