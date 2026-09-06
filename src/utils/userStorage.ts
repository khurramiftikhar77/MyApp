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

let storageReady = false;

// Initialize storage
export async function initializeStorage(): Promise<void> {
  try {
    // Test if storage is accessible
    await AsyncStorage.getItem(STORAGE_KEY);
    storageReady = true;
    console.log('AsyncStorage initialized successfully');
  } catch (error) {
    console.warn('AsyncStorage initialization warning:', error);
    storageReady = true; // Set to true even if there's an error to prevent blocking
  }
}

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
    if (!storageReady) {
      await initializeStorage();
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error saving user:', error);
    // Don't throw - allow app to continue even if storage fails
    return user;
  }
}

export async function getUser(): Promise<UserProfile | null> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Error getting user:', error);
    // Return null on error instead of throwing
    return null;
  }
}

export async function updateUserInfo(nickname: string, birthYear: number): Promise<UserProfile> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    const existing = await getUser();
    const user: UserProfile = existing
      ? { ...existing, nickname, birthYear }
      : {
          nickname,
          birthYear,
          gamesPlayed: 0,
          totalCorrect: 0,
          totalWrong: 0,
          averageScore: 0,
          lastPlayed: '',
          createdAt: new Date().toISOString(),
        };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.warn('Error updating user info:', error);
    return { nickname, birthYear, gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, averageScore: 0, lastPlayed: '', createdAt: new Date().toISOString() };
  }
}

export async function updateUserProgress(correctCount: number, totalQuestions: number): Promise<void> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
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
    console.warn('Error updating user progress:', error);
    // Don't throw - allow app to continue
  }
}

export async function clearUser(): Promise<void> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Error clearing user:', error);
    // Don't throw - allow app to continue
  }
}
