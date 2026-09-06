import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PuzzleType } from '@/types/game';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PuzzleSelectScreenProps {
  onSelectType: (type: PuzzleType) => void;
  onBack: () => void;
}

export function PuzzleSelectScreen({ onSelectType, onBack }: PuzzleSelectScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.heading}>
          Choose Puzzle Type
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subheading}>
          You need 3 correct answers out of 5 to win!
        </ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectType('math')}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            🧮 Math Puzzles
          </ThemedText>
          <ThemedText style={styles.buttonDesc}>
            Solve numerical problems
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.wordButton]}
          onPress={() => onSelectType('word')}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            📝 Word Puzzles
          </ThemedText>
          <ThemedText style={styles.buttonDesc}>
            Answer questions and trivia
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <ThemedText style={styles.backButtonText}>
            ← Back
          </ThemedText>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  heading: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  wordButton: {
    backgroundColor: '#50C878',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 8,
    fontWeight: '700',
  },
  buttonDesc: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
