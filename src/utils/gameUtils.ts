import {
    over18CongratulationMessages,
    over18CorrectFeedback,
    over18InsultMessages,
    over18WrongFeedback,
    under18CongratulationMessages,
    under18CorrectFeedback,
    under18InsultMessages,
    under18WrongFeedback,
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

// Immediate feedback messages shown after each answer
export function getRandomMessage(
  isCorrect: boolean,
  ageGroup: AgeGroup
): string {
  let messages: string[];

  if (ageGroup === 'over18') {
    messages = isCorrect ? over18CorrectFeedback : over18WrongFeedback;
  } else {
    messages = isCorrect ? under18CorrectFeedback : under18WrongFeedback;
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Final game result messages shown at the end
export function getGameResultMessage(
  correctCount: number,
  ageGroup: AgeGroup,
  won: boolean
): string {
  let messages: string[];

  if (ageGroup === 'over18') {
    messages = won ? over18CongratulationMessages : over18InsultMessages;
  } else {
    messages = won ? under18CongratulationMessages : under18InsultMessages;
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
