import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserHeader } from '@/components/user-header';
import { isReflectivePuzzleType, PuzzleType } from '@/types/game';
import { GameHistoryEntry, getGameHistory } from '@/utils/userStorage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface GameHistoryScreenProps {
  userName: string;
  onBack: () => void;
  onEditProfile: () => void;
}

const CATEGORY_META: Record<PuzzleType, { emoji: string; label: string }> = {
  math: { emoji: '🧮', label: 'Math' },
  word: { emoji: '🧩', label: 'Word' },
  philosophy: { emoji: '🧘', label: 'Philosophy' },
  socialmedia: { emoji: '📱', label: 'Social Media' },
  ai: { emoji: '🤖', label: 'AI Literacy' },
};

export function GameHistoryScreen({ userName, onBack, onEditProfile }: GameHistoryScreenProps) {
  const [history, setHistory] = useState<GameHistoryEntry[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    getGameHistory().then((entries) => {
      if (isMounted) setHistory(entries);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const scoredGames = history?.filter((entry) => !isReflectivePuzzleType(entry.puzzleType)) ?? [];
  const wins = scoredGames.filter((entry) => entry.won).length;
  const losses = scoredGames.length - wins;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <UserHeader name={userName} onEdit={onEditProfile} />

        <ThemedText type="title" style={styles.heading}>
          📊 Your Game History
        </ThemedText>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxWin]}>
            <ThemedText style={styles.statNumber}>🏆 {wins}</ThemedText>
            <ThemedText style={styles.statLabel}>Wins</ThemedText>
          </View>
          <View style={[styles.statBox, styles.statBoxLoss]}>
            <ThemedText style={styles.statNumber}>💀 {losses}</ThemedText>
            <ThemedText style={styles.statLabel}>Losses</ThemedText>
          </View>
        </View>

        {history === null ? (
          <ThemedText style={styles.emptyText}>Loading your legacy...</ThemedText>
        ) : history.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No games played yet. Go get roasted at least once. 🔥
          </ThemedText>
        ) : (
          <View style={styles.list}>
            {history.map((entry) => {
              const reflective = isReflectivePuzzleType(entry.puzzleType);
              const meta = CATEGORY_META[entry.puzzleType];
              return (
                <View
                  key={entry.id}
                  style={[
                    styles.entryRow,
                    reflective ? styles.entryRowReflective : entry.won ? styles.entryRowWin : styles.entryRowLoss,
                  ]}
                >
                  <ThemedText style={styles.entryEmoji}>{meta.emoji}</ThemedText>
                  <View style={styles.entryDetails}>
                    <ThemedText style={styles.entryTitle}>
                      {meta.label} {reflective ? 'Reflection' : `Puzzle · ${entry.correctCount}/${entry.totalQuestions}`}
                    </ThemedText>
                    <ThemedText style={styles.entryDate}>
                      {new Date(entry.date).toLocaleDateString()} · {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[
                      styles.entryBadge,
                      reflective ? styles.entryBadgeReflective : entry.won ? styles.entryBadgeWin : styles.entryBadgeLoss,
                    ]}
                  >
                    {reflective ? 'DONE' : entry.won ? 'WON' : 'LOST'}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
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
    paddingVertical: 10,
  },
  heading: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  statBoxWin: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderColor: 'rgba(80, 200, 120, 0.4)',
  },
  statBoxLoss: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  list: {
    width: '100%',
    maxWidth: 400,
    gap: 10,
    marginBottom: 24,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    gap: 12,
  },
  entryRowWin: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderLeftColor: '#50C878',
  },
  entryRowLoss: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderLeftColor: '#FF6B6B',
  },
  entryRowReflective: {
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
    borderLeftColor: '#8A2BE2',
  },
  entryEmoji: {
    fontSize: 22,
  },
  entryDetails: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  entryBadge: {
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  entryBadgeWin: {
    backgroundColor: '#50C878',
    color: 'white',
  },
  entryBadgeLoss: {
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  entryBadgeReflective: {
    backgroundColor: '#8A2BE2',
    color: 'white',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
