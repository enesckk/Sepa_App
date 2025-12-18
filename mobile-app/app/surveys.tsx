import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SurveyCard } from '../src/components/SurveyCard';
import { AnswerOptions } from '../src/components/AnswerOptions';
import { ProgressBar } from '../src/components/ProgressBar';
import { SubmitButton } from '../src/components/SubmitButton';
import { RewardBadge } from '../src/components/RewardBadge';
import { SuccessSnackbar } from '../src/components/SuccessSnackbar';
import { Colors } from '../src/constants/colors';
import { mockSurveys, Survey } from '../src/services/mockSurveysData';

export default function SurveyScreen() {
  const [surveys] = useState<Survey[]>(mockSurveys);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [completedSurveys, setCompletedSurveys] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentSurvey = surveys[currentSurveyIndex];
  const isCompleted = completedSurveys.has(currentSurvey?.id || '');

  const handleAnswerSelect = (optionId: string) => {
    if (!currentSurvey) return;

    const currentAnswers = selectedAnswers[currentSurvey.id] || [];

    if (currentSurvey.type === 'single') {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentSurvey.id]: [optionId],
      });
    } else {
      if (currentAnswers.includes(optionId)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentSurvey.id]: currentAnswers.filter((id) => id !== optionId),
        });
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentSurvey.id]: [...currentAnswers, optionId],
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!currentSurvey) return;

    const answers = selectedAnswers[currentSurvey.id] || [];
    if (answers.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir seçenek seçin');
      return;
    }

    setCompletedSurveys(new Set([...completedSurveys, currentSurvey.id]));
    setRewardAmount(currentSurvey.reward);
    setShowReward(true);
    setShowSuccess(true);

    // Move to next survey
    setTimeout(() => {
      const nextIndex = surveys.findIndex(
        (s) => !completedSurveys.has(s.id) && s.id !== currentSurvey.id
      );
      if (nextIndex !== -1) {
        setCurrentSurveyIndex(nextIndex);
      } else {
        // All surveys completed
        Alert.alert('Tebrikler!', 'Tüm anketleri tamamladınız!');
      }
    }, 2000);
  };

  const completedCount = completedSurveys.size;

  if (!currentSurvey) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tüm anketler tamamlandı!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anketler</Text>
        <Text style={styles.headerSubtitle}>
          Görüşlerinizi paylaşın, puan kazanın
        </Text>
      </View>

      <ProgressBar current={completedCount} total={surveys.length} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SurveyCard survey={currentSurvey} />

        {!isCompleted ? (
          <>
            <View style={styles.answersSection}>
              <Text style={styles.sectionTitle}>Seçenekler</Text>
              <AnswerOptions
                options={currentSurvey.options}
                selectedIds={selectedAnswers[currentSurvey.id] || []}
                onSelect={handleAnswerSelect}
                type={currentSurvey.type}
              />
            </View>

            <SubmitButton
              onPress={handleSubmit}
              disabled={(selectedAnswers[currentSurvey.id] || []).length === 0}
              text="Anketi Gönder"
            />
          </>
        ) : (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              ✓ Bu anketi tamamladınız
            </Text>
          </View>
        )}
      </ScrollView>

      <RewardBadge
        visible={showReward}
        amount={rewardAmount}
        onComplete={() => setShowReward(false)}
      />

      <SuccessSnackbar
        visible={showSuccess}
        message="Anket gönderildi!"
        subMessage={`+${rewardAmount} Gölbucks kazandınız`}
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
    paddingVertical: 20,
  },
  answersSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  completedContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.success + '20',
    borderRadius: 12,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
});

