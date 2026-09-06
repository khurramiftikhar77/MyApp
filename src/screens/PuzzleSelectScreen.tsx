import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserHeader } from '@/components/user-header';
import { PuzzleType } from '@/types/game';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PuzzleSelectScreenProps {
  onSelectType: (type: PuzzleType) => void;
  onBack: () => void;
  userName: string;
  onEditProfile: () => void;
}

export function PuzzleSelectScreen({ onSelectType, onBack, userName, onEditProfile }: PuzzleSelectScreenProps) {
  const [selectedType, setSelectedType] = useState<PuzzleType>('math');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <UserHeader name={userName} onEdit={onEditProfile} />

        <ThemedText type="title" style={styles.heading}>
          Choose Puzzle Type
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subheading}>
          You need 3 correct answers out of 5 to win!
        </ThemedText>

        <View style={styles.toggleTrack}>
          <TouchableOpacity
            style={[styles.toggleOption, selectedType === 'math' && styles.toggleOptionActiveMath]}
            onPress={() => setSelectedType('math')}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.toggleText, selectedType === 'math' && styles.toggleTextActive]}
            >
              🧮 Math
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleOption, selectedType === 'word' && styles.toggleOptionActiveWord]}
            onPress={() => setSelectedType('word')}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.toggleText, selectedType === 'word' && styles.toggleTextActive]}
            >
              📝 Word
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.typeDesc}>
          {selectedType === 'math' ? 'Solve numerical problems' : 'Answer questions and trivia'}
        </ThemedText>

        <TouchableOpacity
          style={[styles.startButton, selectedType === 'word' && styles.startButtonWord]}
          onPress={() => onSelectType(selectedType)}
        >
          <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
            Start Game →
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
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTrack: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleOptionActiveMath: {
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleOptionActiveWord: {
    backgroundColor: '#50C878',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 17,
    opacity: 0.6,
  },
  toggleTextActive: {
    color: 'white',
    opacity: 1,
  },
  typeDesc: {
    marginTop: 16,
    marginBottom: 28,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonWord: {
    backgroundColor: '#50C878',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
