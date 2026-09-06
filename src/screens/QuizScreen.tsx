import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserHeader } from '@/components/user-header';
import { AgeGroup, isReflectivePuzzleType, Puzzle, PuzzleOption, PuzzleType } from '@/types/game';
import { checkAnswer, getRandomMessage, pickUniqueMessage } from '@/utils/gameUtils';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { timeoutMessages } from '@/data/messages';

const HURRY_UP_THRESHOLD = 10;

// Word puzzles (and the new MCQ categories, which need reading time) get
// longer than math, where answers are usually quick to type.
function getInitialTime(type: PuzzleType): number {
  return type === 'math' ? 20 : 30;
}

interface QuizScreenProps {
  puzzle: Puzzle;
  questionNumber: number;
  totalQuestions: number;
  correctCount: number;
  ageGroup: AgeGroup;
  userName: string;
  onAnswer: (answer: string, isCorrect: boolean, feedbackMessage: string) => void;
  onQuit: () => void;
  onEditProfile: () => void;
}

export function QuizScreen({
  puzzle,
  questionNumber,
  totalQuestions,
  correctCount,
  ageGroup,
  userName,
  onAnswer,
  onQuit,
  onEditProfile,
}: QuizScreenProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOptionText, setSelectedOptionText] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean; isTimeout?: boolean } | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const initialTime = getInitialTime(puzzle.type);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [timedOut, setTimedOut] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const usedFeedback = useRef(new Set<string>());
  const usedTimeouts = useRef(new Set<string>());
  const isReflective = isReflectivePuzzleType(puzzle.type);
  const isMcq = !!puzzle.options?.length;

  // Timer effect
  useEffect(() => {
    if (showingFeedback || timedOut) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          // Handle timeout through state update
          setTimedOut(true);
          setShowingFeedback(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [showingFeedback, timedOut]);

  // Handle timeout when timedOut state changes
  useEffect(() => {
    if (timedOut && !feedback) {
      const timeoutMessage = pickUniqueMessage(timeoutMessages, usedTimeouts.current);
      setFeedback({ message: timeoutMessage, isCorrect: false, isTimeout: true });
    }
  }, [timedOut, feedback]);

  const handleSubmit = () => {
    if (userAnswer.trim() && !showingFeedback) {
      const isCorrect = checkAnswer(userAnswer, puzzle.correctAnswer);
      const message = getRandomMessage(isCorrect, ageGroup, usedFeedback.current);
      setFeedback({ message, isCorrect });
      setShowingFeedback(true);
    }
  };

  const handleSelectOption = (option: PuzzleOption) => {
    if (showingFeedback || timedOut) return;
    setSelectedOptionText(option.text);
    if (isReflective) {
      setFeedback({ message: option.response || '', isCorrect: true });
    } else {
      const isCorrect = option.isCorrect === true;
      const message = getRandomMessage(isCorrect, ageGroup, usedFeedback.current);
      setFeedback({ message, isCorrect });
    }
    setShowingFeedback(true);
  };

  const handleNext = () => {
    const answerText = isMcq ? selectedOptionText : userAnswer.trim();
    const isCorrect = isReflective ? true : timedOut ? false : feedback?.isCorrect || false;
    onAnswer(answerText, isCorrect, feedback?.message || '');
    setUserAnswer('');
    setSelectedOptionText('');
    setFeedback(null);
    setShowingFeedback(false);
    setTimedOut(false);
    setTimeRemaining(initialTime);
  };

  const isUrgent = timeRemaining <= HURRY_UP_THRESHOLD && timeRemaining > 0;
  const timerColor = isUrgent ? '#FF6B6B' : '#007AFF';
  const timerBackgroundColor = isUrgent ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 122, 255, 0.1)';

  const handleQuit = () => {
    Alert.alert(
      'Quitting already?',
      "Typical. Your progress on this puzzle will be lost. Sure you want to bail?",
      [
        { text: 'Keep playing', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: onQuit },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.content}>
        <UserHeader name={userName} onEdit={onEditProfile} />

        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
            <ThemedText style={styles.quitButtonText}>✕ Quit</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.progress}>
            Question {questionNumber} of {totalQuestions}
          </ThemedText>
          <View style={[styles.timerBox, { backgroundColor: timerBackgroundColor }]}>
            <ThemedText style={[styles.timer, { color: timerColor }]}>
              ⏱️ {timeRemaining}s
            </ThemedText>
          </View>
        </View>

        {isUrgent && !showingFeedback && (
          <ThemedText style={styles.hurryText}>⏰ HURRY THE FUCK UP!</ThemedText>
        )}

        <View style={styles.scoreContainer}>
          <ThemedText style={styles.score}>
            {isReflective ? `🪞 Reflecting: ${questionNumber}/${totalQuestions}` : `✓ Correct: ${correctCount}/3`}
          </ThemedText>
        </View>

        <View style={styles.questionContainer}>
          <ThemedText type="title" style={styles.question}>
            {puzzle.question}
          </ThemedText>
        </View>

        {showingFeedback && feedback ? (
          <View
            style={[
              styles.feedbackBox,
              isReflective
                ? styles.feedbackReflective
                : feedback.isCorrect && !feedback.isTimeout
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <ThemedText style={styles.feedbackEmoji}>
              {isReflective
                ? '💭 NOTED.'
                : feedback.isTimeout
                ? '⏰ TIMEOUT!'
                : feedback.isCorrect
                ? '✅ CORRECT!'
                : '❌ WRONG!'}
            </ThemedText>
            <ThemedText style={styles.feedbackMessage}>{feedback.message}</ThemedText>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <ThemedText type="defaultSemiBold" style={styles.nextButtonText}>
                Next Question →
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : isMcq ? (
          <View style={styles.optionsList}>
            {puzzle.options!.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                ]}
                onPress={() => handleSelectOption(option)}
                disabled={showingFeedback || timedOut}
              >
                <ThemedText style={[styles.optionButtonText, { color: isDark ? '#fff' : '#000' }]}>
                  {option.text}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              placeholder="Your answer..."
              placeholderTextColor="#999"
              value={userAnswer}
              onChangeText={setUserAnswer}
              onSubmitEditing={handleSubmit}
              editable={!showingFeedback && !timedOut}
              keyboardType={puzzle.type === 'math' ? 'number-pad' : 'default'}
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.submitButton, !userAnswer.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!userAnswer.trim() || showingFeedback || timedOut}
            >
              <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Submit Answer
              </ThemedText>
            </TouchableOpacity>

            <ThemedText type="small" style={styles.hint}>
              Enter your answer (not case-sensitive)
            </ThemedText>
          </>
        )}
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quitButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  quitButtonText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '700',
  },
  progress: {
    textAlign: 'center',
    flex: 1,
  },
  hurryText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },
  timerBox: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  timer: {
    fontSize: 14,
    fontWeight: '700',
  },
  scoreContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  score: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  questionContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  question: {
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  hint: {
    textAlign: 'center',
    color: '#999',
  },
  feedbackBox: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(80, 200, 120, 0.2)',
    borderWidth: 2,
    borderColor: '#50C878',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  feedbackReflective: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  optionsList: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackEmoji: {
    fontSize: 28,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  feedbackMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
