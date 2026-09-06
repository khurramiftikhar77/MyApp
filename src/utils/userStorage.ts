import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuzzleType } from '@/types/game';

export interface UserProfile {
  nickname: string;
  birthYear: number;
  weight?: number;
  isNormalHuman?: boolean;
  gamesPlayed: number;
  totalCorrect: number;
  totalWrong: number;
  averageScore: number;
  lastPlayed: string;
  createdAt: string;
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  puzzleType: PuzzleType;
  correctCount: number;
  totalQuestions: number;
  won: boolean;
}

const STORAGE_KEY = '@puzzle_game_user';
const GAMES_KEY = '@puzzle_game_sessions';
const MAX_HISTORY_ENTRIES = 50;

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

export async function saveUser(
  nickname: string,
  birthYear: number,
  weight?: number,
  isNormalHuman?: boolean
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const user: UserProfile = {
    nickname,
    birthYear,
    weight,
    isNormalHuman,
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

export async function updateUserInfo(
  nickname: string,
  birthYear: number,
  weight?: number,
  isNormalHuman?: boolean
): Promise<UserProfile> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    const existing = await getUser();
    const user: UserProfile = existing
      ? { ...existing, nickname, birthYear, weight, isNormalHuman }
      : {
          nickname,
          birthYear,
          weight,
          isNormalHuman,
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
    return { nickname, birthYear, weight, isNormalHuman, gamesPlayed: 0, totalCorrect: 0, totalWrong: 0, averageScore: 0, lastPlayed: '', createdAt: new Date().toISOString() };
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

export async function recordGameResult(
  puzzleType: PuzzleType,
  correctCount: number,
  totalQuestions: number,
  won: boolean
): Promise<void> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    const history = await getGameHistory();
    const entry: GameHistoryEntry = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      puzzleType,
      correctCount,
      totalQuestions,
      won,
    };
    const updated = [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Error recording game result:', error);
  }
}

export async function getGameHistory(): Promise<GameHistoryEntry[]> {
  try {
    if (!storageReady) {
      await initializeStorage();
    }
    const data = await AsyncStorage.getItem(GAMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Error getting game history:', error);
    return [];
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
