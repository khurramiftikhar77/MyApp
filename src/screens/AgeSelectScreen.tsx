import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AgeGroup } from '@/types/game';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AgeSelectScreenProps {
  onSelectAge: (age: AgeGroup) => void;
}

export function AgeSelectScreen({ onSelectAge }: AgeSelectScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.heading}>
          Puzzle Challenge
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subheading}>
          How old are you?
        </ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectAge('under18')}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Under 18
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.adultButton]}
          onPress={() => onSelectAge('over18')}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            18 or Older
          </ThemedText>
        </TouchableOpacity>

        <ThemedText type="small" style={styles.disclaimer}>
          This determines the type of messages you'll receive.
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
    alignItems: 'center',
  },
  heading: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  adultButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disclaimer: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
