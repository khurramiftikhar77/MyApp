import { AgeSelectScreen } from '@/screens/AgeSelectScreen';
import { DisclaimerScreen } from '@/screens/DisclaimerScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { PuzzleSelectScreen } from '@/screens/PuzzleSelectScreen';
import { QuizScreen } from '@/screens/QuizScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { AgeGroup, Puzzle, PuzzleType } from '@/types/game';
import { getGameResultMessage, getRandomPuzzles } from '@/utils/gameUtils';
import { getUser, saveUser, updateUserProgress } from '@/utils/userStorage';
import { useEffect, useState } from 'react';

export function PuzzleGameComponent() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [puzzleType, setPuzzleType] = useState<PuzzleType | null>(null);
  const [gameState, setGameState] = useState<
    'disclaimer' | 'login' | 'ageSelect' | 'puzzleSelect' | 'playing' | 'results'
  >('disclaimer');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [resultMessage, setResultMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);

  // Check if user already exists
  useEffect(() => {
    const checkExistingUser = async () => {
      const existingUser = await getUser();
      if (existingUser) {
        setUserLoggedIn(true);
        setUserName(existingUser.nickname);
        setDisclaimerAccepted(true);
        setGameState('ageSelect');
      }
    };
    checkExistingUser();
  }, []);

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setGameState('login');
  };

  const handleDisclaimerDecline = () => {
    setGameState('disclaimer');
  };

  const handleLogin = async (nickname: string, birthYear: number) => {
    try {
      await saveUser(nickname, birthYear);
      setUserLoggedIn(true);
      setUserName(nickname);
      setGameState('ageSelect');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleAgeSelect = (age: AgeGroup) => {
    setAgeGroup(age);
    setGameState('puzzleSelect');
  };

  const handlePuzzleSelect = (type: PuzzleType) => {
    setPuzzleType(type);
    const newPuzzles = getRandomPuzzles(type, 5);
    setPuzzles(newPuzzles);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setGameState('playing');
  };

  const handleAnswer = (userAnswer: string, isCorrect: boolean) => {
    let newCorrectCount = correctCount;
    if (isCorrect) {
      newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
    }

    const totalAnswered = currentQuestionIndex + 1;
    const wrongCount = totalAnswered - newCorrectCount;
    const gameOver = totalAnswered === 5 || newCorrectCount === 3 || wrongCount === 3;

    if (gameOver) {
      const won = newCorrectCount >= 3;
      setHasWon(won);
      const message = getGameResultMessage(newCorrectCount, ageGroup!, won);
      setResultMessage(message);
      setGameState('results');
      
      // Update user progress
      updateUserProgress(newCorrectCount, 5);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setResultMessage('');
    setPuzzleType(null);
    setGameState('puzzleSelect');
  };

  const handleBackHome = () => {
    setAgeGroup(null);
    setPuzzleType(null);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setResultMessage('');
    setGameState('ageSelect');
  };

  if (!disclaimerAccepted) {
    return (
      <DisclaimerScreen
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
      />
    );
  }

  if (!userLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (gameState === 'ageSelect') {
    return <AgeSelectScreen onSelectAge={handleAgeSelect} />;
  }

  if (gameState === 'puzzleSelect') {
    return (
      <PuzzleSelectScreen
        onSelectType={handlePuzzleSelect}
        onBack={handleBackHome}
      />
    );
  }

  if (gameState === 'playing' && puzzles.length > 0 && ageGroup) {
    return (
      <QuizScreen
        puzzle={puzzles[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={5}
        correctCount={correctCount}
        ageGroup={ageGroup}
        onAnswer={handleAnswer}
      />
    );
  }

  if (gameState === 'results' && ageGroup) {
    return (
      <ResultsScreen
        correctCount={correctCount}
        totalQuestions={5}
        message={resultMessage}
        isWin={hasWon}
        ageGroup={ageGroup}
        onPlayAgain={handlePlayAgain}
        onBackHome={handleBackHome}
      />
    );
  }

  return null;
}
