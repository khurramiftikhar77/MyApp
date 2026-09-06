export type AgeGroup = 'under18' | 'over18';
export type PuzzleType = 'math' | 'word';
export type GameStatus = 'ageSelect' | 'puzzleSelect' | 'playing' | 'results';

export interface Puzzle {
  id: string;
  question: string;
  correctAnswer: string;
  type: PuzzleType;
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
