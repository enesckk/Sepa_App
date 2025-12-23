import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getSurveyById, submitSurvey, Survey, Question, SurveyAnswerSubmission } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';
import { GolbucksEarned } from '../src/components/GolbucksEarned';
import { SuccessSnackbar } from '../src/components/SuccessSnackbar';

export default function SurveyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { answer_text?: string; answer_options?: string[] }>>({});
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadSurvey();
    }
  }, [id]);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const surveyData = await getSurveyById(id!);
      setSurvey(surveyData);
      
      // Load existing answers if survey is completed
      if (surveyData.isCompleted) {
        // Answers already loaded in survey data
      }
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Anket yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[SurveyDetailScreen] Load error:', apiError);
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, questionType: Question['type'], value: string | string[]) => {
    if (questionType === 'single_choice' || questionType === 'yes_no') {
      setAnswers({
        ...answers,
        [questionId]: { answer_options: Array.isArray(value) ? value : [value] },
      });
    } else if (questionType === 'multiple_choice') {
      const currentOptions = answers[questionId]?.answer_options || [];
      const optionValue = Array.isArray(value) ? value[0] : value;
      
      if (currentOptions.includes(optionValue)) {
        setAnswers({
          ...answers,
          [questionId]: { answer_options: currentOptions.filter((opt) => opt !== optionValue) },
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: { answer_options: [...currentOptions, optionValue] },
        });
      }
    } else {
      // text, number, rating
      setAnswers({
        ...answers,
        [questionId]: { answer_text: String(value) },
      });
    }
  };

  const handleSubmit = async () => {
    if (!survey) return;

    // Validate required questions
    const requiredQuestions = survey.questions.filter((q) => q.is_required);
    for (const question of requiredQuestions) {
      const answer = answers[question.id];
      if (!answer || (!answer.answer_text && (!answer.answer_options || answer.answer_options.length === 0))) {
        Alert.alert('Uyarı', `Lütfen "${question.text}" sorusunu cevaplayın`);
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Prepare answers for submission
      const submissionAnswers: SurveyAnswerSubmission[] = survey.questions
        .filter((q) => {
          const answer = answers[q.id];
          return answer && (answer.answer_text || (answer.answer_options && answer.answer_options.length > 0));
        })
        .map((q) => {
          const answer = answers[q.id];
          return {
            question_id: q.id,
            answer_text: answer?.answer_text,
            answer_options: answer?.answer_options,
          };
        });

      if (submissionAnswers.length === 0) {
        Alert.alert('Uyarı', 'Lütfen en az bir soru cevaplayın');
        return;
      }

      const result = await submitSurvey(id!, submissionAnswers);

      if (result.isCompleted && result.golbucksReward > 0) {
        setRewardAmount(result.golbucksReward);
        setShowReward(true);
        setShowSuccess(true);
        
        // Reload survey to get updated completion status
        await loadSurvey();
      } else {
        Alert.alert('Başarılı', 'Cevaplarınız kaydedildi');
        await loadSurvey();
      }
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Anket gönderilirken bir hata oluştu');
      if (__DEV__) {
        console.error('[SurveyDetailScreen] Submit error:', apiError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!survey) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Anket bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = survey.isCompleted || false;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Anket</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Survey Info */}
        <View style={styles.surveyCard}>
          <View style={styles.surveyHeader}>
            <Text style={styles.surveyTitle}>{survey.title}</Text>
            {survey.golbucks_reward > 0 && (
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>+{survey.golbucks_reward} Gölbucks</Text>
              </View>
            )}
          </View>
          {survey.description && (
            <Text style={styles.surveyDescription}>{survey.description}</Text>
          )}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Check size={16} color={Colors.success} />
              <Text style={styles.completedText}>Tamamlandı</Text>
            </View>
          )}
        </View>

        {/* Questions */}
        {survey.questions && survey.questions.length > 0 ? (
          <View style={styles.questionsContainer}>
            {survey.questions.map((question, index) => {
              const answer = answers[question.id];
              const isAnswered = answer && (answer.answer_text || (answer.answer_options && answer.answer_options.length > 0));

              return (
                <View key={question.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Soru {index + 1}</Text>
                    {question.is_required && (
                      <Text style={styles.requiredBadge}>Zorunlu</Text>
                    )}
                  </View>
                  <Text style={styles.questionText}>{question.text}</Text>

                  {/* Answer Input */}
                  {question.type === 'single_choice' || question.type === 'yes_no' ? (
                    <View style={styles.optionsContainer}>
                      {question.options?.map((option, optIndex) => {
                        const isSelected = answer?.answer_options?.includes(option) || false;
                        return (
                          <Pressable
                            key={optIndex}
                            style={[styles.option, isSelected && styles.optionSelected]}
                            onPress={() => handleAnswerChange(question.id, question.type, option)}
                          >
                            <View style={[styles.radio, isSelected && styles.radioSelected]}>
                              {isSelected && <View style={styles.radioInner} />}
                            </View>
                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                              {option}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : question.type === 'multiple_choice' ? (
                    <View style={styles.optionsContainer}>
                      {question.options?.map((option, optIndex) => {
                        const isSelected = answer?.answer_options?.includes(option) || false;
                        return (
                          <Pressable
                            key={optIndex}
                            style={[styles.option, isSelected && styles.optionSelected]}
                            onPress={() => handleAnswerChange(question.id, question.type, option)}
                          >
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                              {isSelected && <Check size={14} color={Colors.surface} />}
                            </View>
                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                              {option}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : question.type === 'text' ? (
                    <TextInput
                      style={styles.textInput}
                      value={answer?.answer_text || ''}
                      onChangeText={(text) => handleAnswerChange(question.id, question.type, text)}
                      placeholder="Cevabınızı yazın..."
                      placeholderTextColor={Colors.textSecondary}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  ) : question.type === 'number' ? (
                    <TextInput
                      style={styles.textInput}
                      value={answer?.answer_text || ''}
                      onChangeText={(text) => handleAnswerChange(question.id, question.type, text)}
                      placeholder="Sayı girin..."
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="numeric"
                    />
                  ) : question.type === 'rating' ? (
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((rating) => {
                        const isSelected = answer?.answer_text === String(rating);
                        return (
                          <Pressable
                            key={rating}
                            style={[styles.ratingButton, isSelected && styles.ratingButtonSelected]}
                            onPress={() => handleAnswerChange(question.id, question.type, String(rating))}
                          >
                            <Text style={[styles.ratingText, isSelected && styles.ratingTextSelected]}>
                              {rating}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bu ankette soru bulunmuyor</Text>
          </View>
        )}

        {/* Submit Button */}
        {!isCompleted && (
          <Pressable
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Anketi Gönder</Text>
            )}
          </Pressable>
        )}
      </ScrollView>

      <GolbucksEarned
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  surveyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  surveyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  rewardBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  surveyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  questionsContainer: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingTextSelected: {
    color: Colors.surface,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

