import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AgeGroup, Puzzle } from '@/types/game';
import { getRandomMessage } from '@/utils/gameUtils';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { timeoutMessages } from '@/data/messages';

interface QuizScreenProps {
  puzzle: Puzzle;
  questionNumber: number;
  totalQuestions: number;
  correctCount: number;
  ageGroup: AgeGroup;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export function QuizScreen({
  puzzle,
  questionNumber,
  totalQuestions,
  correctCount,
  ageGroup,
  onAnswer,
}: QuizScreenProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean; isTimeout?: boolean } | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [timedOut, setTimedOut] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      const timeoutMessage = timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)];
      setFeedback({ message: timeoutMessage, isCorrect: false, isTimeout: true });
    }
  }, [timedOut, feedback]);

  const handleTimeout = () => {
    setTimedOut(true);
    const timeoutMessage = timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)];
    setFeedback({ message: timeoutMessage, isCorrect: false, isTimeout: true });
    setShowingFeedback(true);
  };

  const handleSubmit = () => {
    if (userAnswer.trim() && !showingFeedback) {
      const isCorrect = userAnswer.toLowerCase().trim() === puzzle.correctAnswer.toLowerCase().trim();
      const message = getRandomMessage(isCorrect, ageGroup);
      setFeedback({ message, isCorrect });
      setShowingFeedback(true);
    }
  };

  const handleNext = () => {
    onAnswer(userAnswer.trim(), timedOut ? false : feedback?.isCorrect || false);
    setUserAnswer('');
    setFeedback(null);
    setShowingFeedback(false);
    setTimedOut(false);
    setTimeRemaining(20);
  };

  const timerColor = timeRemaining <= 5 ? '#FF6B6B' : '#007AFF';
  const timerBackgroundColor = timeRemaining <= 5 ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 122, 255, 0.1)';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="subtitle" style={styles.progress}>
            Question {questionNumber} of {totalQuestions}
          </ThemedText>
          <View style={[styles.timerBox, { backgroundColor: timerBackgroundColor }]}>
            <ThemedText style={[styles.timer, { color: timerColor }]}>
              ⏱️ {timeRemaining}s
            </ThemedText>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <ThemedText style={styles.score}>
            ✓ Correct: {correctCount}/3
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
              feedback.isCorrect && !feedback.isTimeout
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <ThemedText style={styles.feedbackEmoji}>
              {feedback.isTimeout ? '⏰ TIMEOUT!' : feedback.isCorrect ? '✅ CORRECT!' : '❌ WRONG!'}
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
              {puzzle.type === 'math'
                ? 'Enter the numerical answer'
                : 'Enter your answer (not case-sensitive)'}
            </ThemedText>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  progress: {
    textAlign: 'center',
    flex: 1,
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
