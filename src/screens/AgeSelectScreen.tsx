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

        <View style={[styles.button, styles.comingSoonButton]}>
          <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.comingSoonText]}>
            Under 18
          </ThemedText>
          <ThemedText style={styles.comingSoonLabel}>Coming Soon</ThemedText>
        </View>

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
    fontSize: 32,
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  adultButton: {
    backgroundColor: '#FF6B6B',
  },
  comingSoonButton: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  comingSoonText: {
    opacity: 0.7,
  },
  comingSoonLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  disclaimer: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
