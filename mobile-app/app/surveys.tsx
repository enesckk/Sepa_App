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
import { SurveyCard } from '../src/components/SurveyCard';
import { AnswerOptions } from '../src/components/AnswerOptions';
import { ProgressBar } from '../src/components/ProgressBar';
import { SubmitButton } from '../src/components/SubmitButton';
import { RewardBadge } from '../src/components/RewardBadge';
import { SuccessSnackbar } from '../src/components/SuccessSnackbar';
import { Colors } from '../src/constants/colors';
import { mockSurveys, Survey } from '../src/services/mockSurveysData';

export default function SurveyScreen() {
  const router = useRouter();
  const [surveys] = useState<Survey[]>(mockSurveys);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [completedSurveys, setCompletedSurveys] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentSurvey = surveys[currentSurveyIndex];
  const isCompleted = completedSurveys.has(currentSurvey?.id || '');
  const isLastQuestion = currentSurveyIndex === surveys.length - 1;
  const answeredQuestions = Object.keys(selectedAnswers).filter(
    (surveyId) => selectedAnswers[surveyId] && selectedAnswers[surveyId].length > 0
  ).length;
  const currentQuestionNumber = currentSurveyIndex + 1;

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

    // Mark current question as answered (but not completed yet)
    const newSelectedAnswers = {
      ...selectedAnswers,
      [currentSurvey.id]: answers,
    };

    // If it's the last question, complete the entire survey and show rewards
    if (isLastQuestion) {
      // Calculate total reward
      const totalReward = surveys.reduce((sum, survey) => {
        return sum + survey.reward;
      }, 0);

      // Mark all surveys as completed
      const allSurveyIds = new Set(surveys.map((s) => s.id));
      setCompletedSurveys(allSurveyIds);
      setSelectedAnswers(newSelectedAnswers);
      
      // Show reward and success message
      setRewardAmount(totalReward);
      setShowReward(true);
      setShowSuccess(true);

      // Show completion message
      setTimeout(() => {
        Alert.alert(
          'Tebrikler!',
          `Tüm anketleri tamamladınız!\n+${totalReward} Gölbucks kazandınız`,
          [{ text: 'Tamam', onPress: () => router.back() }]
        );
      }, 2000);
    } else {
      // Not the last question, just move to next
      setSelectedAnswers(newSelectedAnswers);
      setCurrentSurveyIndex(currentSurveyIndex + 1);
    }
  };

  const completedCount = completedSurveys.size;

  if (!currentSurvey) {
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
            <Text style={styles.headerTitle}>Anketler</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tüm anketler tamamlandı!</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Anketler</Text>
          <Text style={styles.headerSubtitle}>
            Görüşlerinizi paylaşın, puan kazanın
          </Text>
        </View>
      </View>

      <ProgressBar current={currentQuestionNumber} total={surveys.length} />

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
              text={isLastQuestion ? "Anketi Gönder" : "Sonraki Soru"}
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
        message="Anket tamamlandı!"
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

