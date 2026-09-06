import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserHeader } from '@/components/user-header';
import { AgeGroup } from '@/types/game';
import { getFortuneMessage } from '@/utils/gameUtils';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export interface AnsweredQuestion {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedbackMessage: string;
}

interface ResultsScreenProps {
  correctCount: number;
  totalQuestions: number;
  message: string;
  isWin: boolean;
  isReflective?: boolean;
  ageGroup: AgeGroup;
  answers: AnsweredQuestion[];
  userName: string;
  onPlayAgain: () => void;
  onBackHome: () => void;
  onEditProfile: () => void;
}

export function ResultsScreen({
  correctCount,
  totalQuestions,
  message,
  isWin,
  isReflective = false,
  ageGroup,
  answers,
  userName,
  onPlayAgain,
  onBackHome,
  onEditProfile,
}: ResultsScreenProps) {
  const fortuneMessage = isReflective ? null : getFortuneMessage(ageGroup, isWin);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <UserHeader name={userName} onEdit={onEditProfile} />

        <View style={[styles.resultContainer, isWin && styles.winContainer, isReflective && styles.reflectiveContainer]}>
          <ThemedText type="title" style={styles.resultTitle}>
            {isReflective ? '🪞 Reflection Complete' : isWin ? '🎉 WINNER! 🎉' : '😅 Game Over'}
          </ThemedText>

          {!isReflective && (
            <View style={styles.scoreBox}>
              <ThemedText type="subtitle" style={styles.scoreText}>
                {correctCount} / {totalQuestions} Correct
              </ThemedText>
            </View>
          )}

          <View
            style={[
              styles.messageBox,
              isReflective ? styles.messageBoxReflective : isWin ? styles.messageBoxWin : styles.messageBoxLose,
            ]}
          >
            <ThemedText style={styles.messageText}>{message}</ThemedText>
          </View>

          {fortuneMessage && (
            <View style={styles.fortuneBox}>
              <ThemedText style={styles.fortuneMessage}>{fortuneMessage}</ThemedText>
            </View>
          )}

          <View style={styles.screenshotBox}>
            <ThemedText style={styles.screenshotText}>
              📸 Screenshot this and send it to whoever doubted you
            </ThemedText>
          </View>
        </View>

        <View style={styles.reviewBox}>
          <ThemedText type="defaultSemiBold" style={styles.reviewTitle}>
            📝 Your Answers:
          </ThemedText>
          {answers.map((answer, index) => (
            <View
              key={index}
              style={[
                styles.reviewItem,
                isReflective
                  ? styles.reviewItemReflective
                  : answer.isCorrect
                  ? styles.reviewItemCorrect
                  : styles.reviewItemWrong,
              ]}
            >
              <ThemedText style={styles.reviewQuestion}>
                {index + 1}. {answer.question}
              </ThemedText>
              <ThemedText style={styles.reviewAnswer}>
                {isReflective ? '💭' : answer.isCorrect ? '✅' : '❌'} Your answer: {answer.userAnswer || '(no answer)'}
              </ThemedText>
              {!isReflective && !answer.isCorrect && (
                <ThemedText style={styles.reviewCorrectAnswer}>
                  Correct answer: {answer.correctAnswer}
                </ThemedText>
              )}
              {answer.feedbackMessage && (
                <ThemedText style={styles.reviewFeedback}>
                  💬 "{answer.feedbackMessage}"
                </ThemedText>
              )}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={onPlayAgain}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Play Again
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={onBackHome}
          >
            <ThemedText type="defaultSemiBold" style={styles.homeButtonText}>
              Back to Home
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  winContainer: {
    backgroundColor: 'rgba(80, 200, 120, 0.15)',
    borderColor: 'rgba(80, 200, 120, 0.4)',
  },
  reflectiveContainer: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  resultTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 28,
  },
  scoreBox: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 18,
  },
  messageBox: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  messageBoxWin: {
    backgroundColor: 'rgba(80, 200, 120, 0.15)',
    borderLeftColor: '#50C878',
  },
  messageBoxLose: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderLeftColor: '#FF6B6B',
  },
  messageBoxReflective: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderLeftColor: '#8A2BE2',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  fortuneBox: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2',
  },
  fortuneMessage: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  screenshotBox: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 193, 7, 0.5)',
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
  },
  screenshotText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  reviewBox: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  reviewItem: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  reviewItemCorrect: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderLeftColor: '#50C878',
  },
  reviewItemWrong: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderLeftColor: '#FF6B6B',
  },
  reviewItemReflective: {
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
    borderLeftColor: '#8A2BE2',
  },
  reviewQuestion: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  reviewAnswer: {
    fontSize: 13,
  },
  reviewCorrectAnswer: {
    fontSize: 13,
    marginTop: 2,
    color: '#50C878',
    fontWeight: '600',
  },
  reviewFeedback: {
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
    opacity: 0.75,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  homeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
