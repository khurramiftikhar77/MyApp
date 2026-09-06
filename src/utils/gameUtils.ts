import {
    over18CongratulationMessages,
    over18InsultMessages,
    under18CongratulationMessages,
    under18InsultMessages,
} from '@/data/messages';
import { mathPuzzles, wordPuzzles } from '@/data/puzzles';
import { AgeGroup, Puzzle } from '@/types/game';

export function getRandomPuzzles(type: 'math' | 'word', count: number = 5): Puzzle[] {
  const puzzles = type === 'math' ? mathPuzzles : wordPuzzles;
  const shuffled = [...puzzles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
}

export function getRandomMessage(
  isCorrect: boolean,
  ageGroup: AgeGroup
): string {
  let messages: string[];

  if (ageGroup === 'over18') {
    messages = isCorrect ? over18CongratulationMessages : over18InsultMessages;
  } else {
    messages = isCorrect ? under18CongratulationMessages : under18InsultMessages;
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function getGameResultMessage(
  correctCount: number,
  ageGroup: AgeGroup,
  won: boolean
): string {
  if (won) {
    // Pick a random message from congratulations
    return getRandomMessage(true, ageGroup);
  } else {
    // Pick a random message from insults/encouragement
    return getRandomMessage(false, ageGroup);
  }
}
