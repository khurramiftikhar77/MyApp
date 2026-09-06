import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  nickname: string;
  birthYear: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalWrong: number;
  averageScore: number;
  lastPlayed: string;
  createdAt: string;
}

const STORAGE_KEY = '@puzzle_game_user';
const GAMES_KEY = '@puzzle_game_sessions';

export async function saveUser(nickname: string, birthYear: number): Promise<UserProfile> {
  const now = new Date().toISOString();
  const user: UserProfile = {
    nickname,
    birthYear,
    gamesPlayed: 0,
    totalCorrect: 0,
    totalWrong: 0,
    averageScore: 0,
    lastPlayed: '',
    createdAt: now,
  };

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export async function getUser(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUserProgress(correctCount: number, totalQuestions: number): Promise<void> {
  try {
    const user = await getUser();
    if (!user) return;

    const wrongCount = totalQuestions - correctCount;
    user.gamesPlayed += 1;
    user.totalCorrect += correctCount;
    user.totalWrong += wrongCount;
    user.averageScore = Math.round((user.totalCorrect / (user.totalCorrect + user.totalWrong)) * 100);
    user.lastPlayed = new Date().toISOString();

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
}

export async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
}
