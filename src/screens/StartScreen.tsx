import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { startTaglines } from '@/data/messages';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface StartScreenProps {
  onContinue: () => void;
}

const HIGHLIGHTS = [
  { emoji: '🧮', text: 'Math puzzles that mix arithmetic with actual brain-bending logic' },
  { emoji: '🧩', text: "Mind-bending word riddles, not boring trivia" },
  { emoji: '🔥', text: 'Brutally honest feedback on every single answer' },
  { emoji: '🔮', text: 'A cosmic fortune teller judges your soul at the end' },
];

export function StartScreen({ onContinue }: StartScreenProps) {
  const [tagline] = useState(() => startTaglines[Math.floor(Math.random() * startTaglines.length)]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.emojiRow}>🎮🔥🧠</ThemedText>

        <ThemedText type="title" style={styles.title}>
          What the Fun!
        </ThemedText>

        <ThemedText style={styles.tagline}>{tagline}</ThemedText>

        <View style={styles.highlightsBox}>
          {HIGHLIGHTS.map((item) => (
            <View key={item.text} style={styles.highlightRow}>
              <ThemedText style={styles.highlightEmoji}>{item.emoji}</ThemedText>
              <ThemedText style={styles.highlightText}>{item.text}</ThemedText>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onContinue}>
          <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
            Enter If You Dare →
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.footerJoke}>No refunds on your ego.</ThemedText>
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
  emojiRow: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 15,
    fontStyle: 'italic',
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 380,
  },
  highlightsBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 32,
    gap: 14,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  highlightEmoji: {
    fontSize: 20,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footerJoke: {
    fontSize: 12,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
