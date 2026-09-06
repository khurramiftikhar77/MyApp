import {
    over18CongratulationMessages,
    over18CorrectFeedback,
    over18FortuneInsult,
    over18FortunePraise,
    over18InsultMessages,
    over18WrongFeedback,
    under18CongratulationMessages,
    under18CorrectFeedback,
    under18FortuneTeller,
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

// Picks a random entry from `pool`, avoiding anything already in `used` when possible,
// so the same line doesn't repeat within a single game.
export function pickUniqueMessage(pool: string[], used: Set<string>): string {
  const available = pool.filter((message) => !used.has(message));
  const choices = available.length > 0 ? available : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  used.add(pick);
  return pick;
}

// Immediate feedback messages shown after each answer
export function getRandomMessage(
  isCorrect: boolean,
  ageGroup: AgeGroup,
  used: Set<string>
): string {
  let messages: string[];

  if (ageGroup === 'over18') {
    messages = isCorrect ? over18CorrectFeedback : over18WrongFeedback;
  } else {
    messages = isCorrect ? under18CorrectFeedback : under18WrongFeedback;
  }

  return pickUniqueMessage(messages, used);
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

// Long-form "fortune teller" closing message - praise if you won, a
// philosophical insult if you lost. Under-18 stays encouraging either way.
export function getFortuneMessage(ageGroup: AgeGroup, won: boolean): string {
  if (ageGroup === 'over18') {
    const messages = won ? over18FortunePraise : over18FortuneInsult;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  return under18FortuneTeller[Math.floor(Math.random() * under18FortuneTeller.length)];
}
