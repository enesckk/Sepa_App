import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Bill } from '../services/mockBillsData';
import { billTypes } from '../services/mockBillsData';
import { SupportButton } from './SupportButton';
import { Colors } from '../constants/colors';

interface SupportListProps {
  bills: Bill[];
  onSupport: (billId: string) => void;
}

export const SupportList: React.FC<SupportListProps> = ({ bills, onSupport }) => {
  if (bills.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>Askıda fatura bulunmuyor</Text>
        <Text style={styles.emptySubtext}>
          İlk faturayı siz bırakabilirsiniz
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {bills.map((bill) => {
        const billType = billTypes[bill.type];
        return (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billHeader}>
              <Text style={styles.billIcon}>{billType.icon}</Text>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>
                  {bill.firstName} {bill.lastName}
                </Text>
                <Text style={styles.billSubscriber}>
                  Abone No: {bill.subscriberNumber}
                </Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>{bill.amount} ₺</Text>
              </View>
            </View>
            {bill.supportedBy && bill.supportedBy > 0 && (
              <Text style={styles.supportCount}>
                {bill.supportedBy} kişi destekledi
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <SupportButton
                onPress={() => onSupport(bill.id)}
                disabled={bill.status === 'supported'}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  billCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  billIcon: {
    fontSize: 32,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  billSubscriber: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  amountContainer: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  supportCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 8,
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
});

