import { AgeSelectScreen } from '@/screens/AgeSelectScreen';
import { DisclaimerScreen } from '@/screens/DisclaimerScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { PuzzleSelectScreen } from '@/screens/PuzzleSelectScreen';
import { QuizScreen } from '@/screens/QuizScreen';
import { AnsweredQuestion, ResultsScreen } from '@/screens/ResultsScreen';
import { StartScreen } from '@/screens/StartScreen';
import { AgeGroup, Puzzle, PuzzleType } from '@/types/game';
import { getGameResultMessage, getRandomPuzzles } from '@/utils/gameUtils';
import { getUser, saveUser, updateUserInfo, updateUserProgress } from '@/utils/userStorage';
import { useEffect, useState } from 'react';

type GameScreenState =
  | 'disclaimer'
  | 'login'
  | 'ageSelect'
  | 'puzzleSelect'
  | 'playing'
  | 'results'
  | 'editProfile';

export function PuzzleGameComponent() {
  const [showStart, setShowStart] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [puzzleType, setPuzzleType] = useState<PuzzleType | null>(null);
  const [gameState, setGameState] = useState<GameScreenState>('disclaimer');
  const [preEditState, setPreEditState] = useState<GameScreenState>('ageSelect');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [resultMessage, setResultMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user already exists
  useEffect(() => {
    let isMounted = true;
    
    const checkExistingUser = async () => {
      try {
        const existingUser = await getUser();
        if (!isMounted) return;
        
        if (existingUser) {
          setUserLoggedIn(true);
          setUserName(existingUser.nickname);
          setBirthYear(existingUser.birthYear);
          setDisclaimerAccepted(true);
          setGameState('ageSelect');
        } else {
          // No existing user, show disclaimer
          setGameState('disclaimer');
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
        if (isMounted) {
          // On error, show disclaimer to start fresh
          setGameState('disclaimer');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };
    
    // Small delay to ensure AsyncStorage is ready
    const timer = setTimeout(() => {
      checkExistingUser();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setGameState('login');
  };

  const handleDisclaimerDecline = () => {
    setGameState('disclaimer');
  };

  const handleLogin = async (nickname: string, newBirthYear: number) => {
    try {
      await saveUser(nickname, newBirthYear);
    } catch (error) {
      console.error('Login error:', error);
      // Still allow user to proceed even if storage fails
    } finally {
      setUserLoggedIn(true);
      setUserName(nickname);
      setBirthYear(newBirthYear);
      setGameState('ageSelect');
    }
  };

  const handleEditProfile = () => {
    setPreEditState(gameState);
    setGameState('editProfile');
  };

  const handleSaveProfile = async (nickname: string, newBirthYear: number) => {
    try {
      await updateUserInfo(nickname, newBirthYear);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUserName(nickname);
      setBirthYear(newBirthYear);
      setGameState(preEditState);
    }
  };

  const handleCancelEdit = () => {
    setGameState(preEditState);
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
    setAnswers([]);
    setGameState('playing');
  };

  const handleAnswer = (userAnswer: string, isCorrect: boolean) => {
    let newCorrectCount = correctCount;
    if (isCorrect) {
      newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
    }

    const currentPuzzle = puzzles[currentQuestionIndex];
    setAnswers((prev) => [
      ...prev,
      {
        question: currentPuzzle.question,
        userAnswer,
        correctAnswer: currentPuzzle.correctAnswer,
        isCorrect,
      },
    ]);

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
    setAnswers([]);
    setResultMessage('');
    setPuzzleType(null);
    setGameState('puzzleSelect');
  };

  const handleQuitGame = () => {
    setPuzzleType(null);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setAnswers([]);
    setGameState('puzzleSelect');
  };

  const handleBackHome = () => {
    setAgeGroup(null);
    setPuzzleType(null);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setAnswers([]);
    setResultMessage('');
    setGameState('ageSelect');
  };

  if (showStart) {
    return <StartScreen onContinue={() => setShowStart(false)} />;
  }

  // Show nothing while initializing
  if (isInitializing) {
    return null;
  }

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

  if (gameState === 'editProfile') {
    return (
      <LoginScreen
        isEditing
        initialNickname={userName}
        initialBirthYear={birthYear}
        onLogin={handleSaveProfile}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (gameState === 'ageSelect') {
    return <AgeSelectScreen onSelectAge={handleAgeSelect} userName={userName} onEditProfile={handleEditProfile} />;
  }

  if (gameState === 'puzzleSelect') {
    return (
      <PuzzleSelectScreen
        onSelectType={handlePuzzleSelect}
        onBack={handleBackHome}
        userName={userName}
        onEditProfile={handleEditProfile}
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
        userName={userName}
        onAnswer={handleAnswer}
        onQuit={handleQuitGame}
        onEditProfile={handleEditProfile}
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
        answers={answers}
        userName={userName}
        onPlayAgain={handlePlayAgain}
        onBackHome={handleBackHome}
        onEditProfile={handleEditProfile}
      />
    );
  }

  return null;
}
