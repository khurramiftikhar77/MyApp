import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DisclaimerScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function DisclaimerScreen({ onAccept, onDecline }: DisclaimerScreenProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.heading}>
          ⚠️ Disclaimer
        </ThemedText>

        <View style={styles.warningBox}>
          <ThemedText type="defaultSemiBold" style={styles.warningTitle}>
            Strong Language Alert
          </ThemedText>
          <ThemedText style={styles.warningText}>
            This game contains strong language, sarcasm, and harsh feedback. The messages vary based on your age and performance.
          </ThemedText>
        </View>

        <View style={styles.detailsBox}>
          <ThemedText type="defaultSemiBold" style={styles.detailsTitle}>
            What You're Getting Into:
          </ThemedText>

          <View style={styles.bulletPoint}>
            <ThemedText style={styles.bullet}>•</ThemedText>
            <ThemedText style={styles.bulletText}>
              Ages 18+: Colorful language, sarcasm, and intense feedback
            </ThemedText>
          </View>

          <View style={styles.bulletPoint}>
            <ThemedText style={styles.bullet}>•</ThemedText>
            <ThemedText style={styles.bulletText}>
              Under 18: Encouraging but still humorous feedback
            </ThemedText>
          </View>

          <View style={styles.bulletPoint}>
            <ThemedText style={styles.bullet}>•</ThemedText>
            <ThemedText style={styles.bulletText}>
              Instant feedback on every answer
            </ThemedText>
          </View>

          <View style={styles.bulletPoint}>
            <ThemedText style={styles.bullet}>•</ThemedText>
            <ThemedText style={styles.bulletText}>
              Cosmic fortune at the end of each game
            </ThemedText>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, accepted && styles.checkboxChecked]}
            onPress={() => setAccepted(!accepted)}
          >
            {accepted && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
          <ThemedText style={styles.checkboxLabel}>
            I understand and accept the content
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.acceptButton, !accepted && styles.buttonDisabled]}
            onPress={onAccept}
            disabled={!accepted}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Let's Go! 🎮
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={onDecline}
          >
            <ThemedText type="defaultSemiBold" style={styles.declineText}>
              Not for me
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
    paddingVertical: 20,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 28,
  },
  warningBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FF6B6B',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsBox: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  detailsTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#007AFF',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    marginRight: 12,
    color: '#007AFF',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#50C878',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  declineButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  declineText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
});
