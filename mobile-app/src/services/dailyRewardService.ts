import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_REWARD_KEY = '@daily_reward_last_date';
const DAILY_REWARD_AMOUNT = 50; // Her gün 50 Gölbucks

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Son günlük ödülün alındığı tarihi kontrol eder
 * @returns Bugün ödül alınmışsa true, alınmamışsa false
 */
export const hasClaimedDailyRewardToday = async (): Promise<boolean> => {
  try {
    const lastDate = await AsyncStorage.getItem(DAILY_REWARD_KEY);
    if (!lastDate) {
      return false;
    }
    return lastDate === getTodayDateString();
  } catch (error) {
    if (__DEV__) {
      console.error('Error checking daily reward:', error);
    }
    return false;
  }
};

/**
 * Günlük ödülü kaydeder (bugünün tarihini saklar)
 */
export const claimDailyReward = async (): Promise<void> => {
  try {
    const today = getTodayDateString();
    await AsyncStorage.setItem(DAILY_REWARD_KEY, today);
  } catch (error) {
    if (__DEV__) {
      console.error('Error claiming daily reward:', error);
    }
  }
};

/**
 * Günlük ödül miktarını döndürür
 */
export const getDailyRewardAmount = (): number => {
  return DAILY_REWARD_AMOUNT;
};

/**
 * Son ödül alınan tarihi döndürür
 */
export const getLastRewardDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(DAILY_REWARD_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting last reward date:', error);
    }
    return null;
  }
};

