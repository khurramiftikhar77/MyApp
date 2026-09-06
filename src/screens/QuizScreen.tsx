import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface QuizScreenProps {
  puzzle: Puzzle;
  questionNumber: number;
  totalQuestions: number;
  correctCount: number;
  onAnswer: (answer: string) => void;
}

export function QuizScreen({
  puzzle,
  questionNumber,
  totalQuestions,
  correctCount,
  onAnswer,
}: QuizScreenProps) {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      onAnswer(userAnswer.trim());
      setUserAnswer('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.progress}>
          Question {questionNumber} of {totalQuestions}
        </ThemedText>

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

        <TextInput
          style={styles.input}
          placeholder="Your answer..."
          placeholderTextColor="#999"
          value={userAnswer}
          onChangeText={setUserAnswer}
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!userAnswer.trim()}
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
  progress: {
    textAlign: 'center',
    marginBottom: 20,
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
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  hint: {
    textAlign: 'center',
    color: '#999',
  },
});
