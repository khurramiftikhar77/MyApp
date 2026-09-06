export type AgeGroup = 'under18' | 'over18';
export type PuzzleType = 'math' | 'word' | 'philosophy' | 'socialmedia' | 'ai';
export type GameStatus = 'puzzleSelect' | 'playing' | 'results';

// Categories with no right/wrong answer - every option just gets its own
// tailored response instead of being graded correct/incorrect.
const REFLECTIVE_PUZZLE_TYPES: PuzzleType[] = ['philosophy', 'socialmedia'];

export function isReflectivePuzzleType(type: PuzzleType): boolean {
  return REFLECTIVE_PUZZLE_TYPES.includes(type);
}

export interface PuzzleOption {
  text: string;
  // Scored MCQ puzzles (e.g. 'ai') mark exactly one option correct.
  isCorrect?: boolean;
  // Reflective puzzles (philosophy, socialmedia) attach a tailored
  // response to every option instead of grading it.
  response?: string;
}

export interface Puzzle {
  id: string;
  question: string;
  // Text-input puzzles (math, word) and scored MCQ puzzles (ai) use this
  // for the correct answer / review display. Empty for reflective puzzles.
  correctAnswer: string;
  type: PuzzleType;
  // Present for MCQ puzzles (philosophy, socialmedia, ai). Absent for
  // free-text puzzles (math, word).
  options?: PuzzleOption[];
}

export interface GameState {
  ageGroup: AgeGroup | null;
  puzzleType: PuzzleType | null;
  status: GameStatus;
  currentQuestionIndex: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentQuestion: Puzzle | null;
  userAnswer: string;
}

export interface Message {
  id: string;
  text: string;
}
