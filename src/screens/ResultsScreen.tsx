import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ResultsScreenProps {
  correctCount: number;
  totalQuestions: number;
  message: string;
  isWin: boolean;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export function ResultsScreen({
  correctCount,
  totalQuestions,
  message,
  isWin,
  onPlayAgain,
  onBackHome,
}: ResultsScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.resultContainer, isWin && styles.winContainer]}>
          <ThemedText type="title" style={styles.resultTitle}>
            {isWin ? '🎉 WINNER! 🎉' : '😅 Game Over'}
          </ThemedText>

          <View style={styles.scoreBox}>
            <ThemedText type="subtitle" style={styles.scoreText}>
              {correctCount} / {totalQuestions} Correct
            </ThemedText>
          </View>

          <View style={styles.messageBox}>
            <ThemedText style={styles.messageText}>{message}</ThemedText>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  winContainer: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
  },
  resultTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 28,
  },
  scoreBox: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 18,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
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
