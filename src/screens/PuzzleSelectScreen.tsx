import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserHeader } from '@/components/user-header';
import { isReflectivePuzzleType, PuzzleType } from '@/types/game';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PuzzleSelectScreenProps {
  onSelectType: (type: PuzzleType) => void;
  onViewHistory: () => void;
  userName: string;
  onEditProfile: () => void;
}

interface CategoryMeta {
  type: PuzzleType;
  emoji: string;
  label: string;
  desc: string;
  color: string;
}

const CATEGORIES: CategoryMeta[] = [
  { type: 'math', emoji: '🧮', label: 'Math', desc: 'Numbers, patterns, and sneaky logic', color: '#007AFF' },
  { type: 'word', emoji: '🧩', label: 'Word', desc: 'Riddles and brain teasers', color: '#50C878' },
  { type: 'philosophy', emoji: '🧘', label: 'Philosophy', desc: 'Existential questions. No right answers.', color: '#8A2BE2' },
  { type: 'socialmedia', emoji: '📱', label: 'Social Media', desc: 'A brutally honest mirror', color: '#E91E63' },
  { type: 'ai', emoji: '🤖', label: 'AI Literacy', desc: 'Agentic AI, LLMs, and you', color: '#00897B' },
];

export function PuzzleSelectScreen({ onSelectType, onViewHistory, userName, onEditProfile }: PuzzleSelectScreenProps) {
  const [selectedType, setSelectedType] = useState<PuzzleType>('math');
  const selected = CATEGORIES.find((c) => c.type === selectedType)!;
  const reflective = isReflectivePuzzleType(selectedType);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <UserHeader name={userName} onEdit={onEditProfile} />

          <ThemedText type="title" style={styles.heading}>
            🎯 Choose Your Puzzle
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subheading}>
            {reflective ? 'No right or wrong here. Just be honest.' : 'You need 3 correct answers out of 5 to win!'}
          </ThemedText>

          <View style={styles.categoryList}>
            {CATEGORIES.map((category) => {
              const isActive = category.type === selectedType;
              return (
                <TouchableOpacity
                  key={category.type}
                  style={[
                    styles.categoryCard,
                    isActive && { borderColor: category.color, backgroundColor: `${category.color}1A` },
                  ]}
                  onPress={() => setSelectedType(category.type)}
                >
                  <ThemedText style={styles.categoryEmoji}>{category.emoji}</ThemedText>
                  <View style={styles.categoryTextWrap}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.categoryLabel, isActive && { color: category.color }]}
                    >
                      {category.label}
                    </ThemedText>
                    <ThemedText style={styles.categoryDesc}>{category.desc}</ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: selected.color }]}
            onPress={() => onSelectType(selectedType)}
          >
            <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
              🚀 Start Game →
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={onViewHistory}
          >
            <ThemedText style={styles.historyButtonText}>
              📊 My History
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
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  heading: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  categoryList: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: 12,
    opacity: 0.7,
  },
  startButton: {
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
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  historyButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  historyButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
