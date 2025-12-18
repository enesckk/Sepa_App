import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Survey } from '../services/mockSurveysData';

interface SurveyCardProps {
  survey: Survey;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText size={24} color={Colors.primary} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+{survey.reward} Gölbucks</Text>
        </View>
      </View>
      <Text style={styles.title}>{survey.title}</Text>
      <Text style={styles.description}>{survey.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

