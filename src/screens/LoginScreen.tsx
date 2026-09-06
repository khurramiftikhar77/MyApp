import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  getBirthYearJoke,
  nicknameJokes,
  normalHumanNoReactions,
  normalHumanYesReactions,
  overAgeBlockMessages,
  underageBlockMessages,
  weightReactions,
} from '@/data/messages';
import { pickUniqueMessage } from '@/utils/gameUtils';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

const MIN_AGE = 18;
const MAX_AGE = 100;

interface LoginScreenProps {
  onLogin: (nickname: string, birthYear: number, weight?: number, isNormalHuman?: boolean) => void;
  isEditing?: boolean;
  initialNickname?: string;
  initialBirthYear?: number;
  onCancel?: () => void;
}

export function LoginScreen({ onLogin, isEditing = false, initialNickname = '', initialBirthYear, onCancel }: LoginScreenProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [birthYear, setBirthYear] = useState(initialBirthYear ? String(initialBirthYear) : '');
  const [weight, setWeight] = useState('');
  const [isNormalHuman, setIsNormalHuman] = useState<boolean | undefined>(undefined);
  const [nicknameReaction, setNicknameReaction] = useState('');
  const [birthYearReaction, setBirthYearReaction] = useState('');
  const [weightReaction, setWeightReaction] = useState('');
  const [normalHumanReaction, setNormalHumanReaction] = useState('');
  const [ageBlockMessage, setAgeBlockMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const usedNicknameJokes = useRef(new Set<string>());

  const inputStyle = [
    styles.input,
    {
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
  ];

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    if (text.trim().length > 0) {
      setNicknameReaction(pickUniqueMessage(nicknameJokes, usedNicknameJokes.current));
    } else {
      setNicknameReaction('');
    }
  };

  const handleBirthYearChange = (text: string) => {
    setBirthYear(text);
    setAgeBlockMessage('');
    if (text.trim().length === 4 && /^\d+$/.test(text)) {
      setBirthYearReaction(getBirthYearJoke(parseInt(text, 10)));
    } else {
      setBirthYearReaction('');
    }
  };

  const handleWeightChange = (text: string) => {
    setWeight(text);
    setWeightReaction(text.trim().length > 0 ? weightReactions[Math.floor(Math.random() * weightReactions.length)] : '');
  };

  const handleNormalHumanChoice = (choice: boolean) => {
    setIsNormalHuman(choice);
    const pool = choice ? normalHumanYesReactions : normalHumanNoReactions;
    setNormalHumanReaction(pool[Math.floor(Math.random() * pool.length)]);
  };

  const handleLogin = () => {
    if (!nickname.trim() || !birthYear.trim() || !/^\d{4}$/.test(birthYear)) return;

    const age = new Date().getFullYear() - parseInt(birthYear, 10);

    if (age < MIN_AGE) {
      setAgeBlockMessage(underageBlockMessages[Math.floor(Math.random() * underageBlockMessages.length)]);
      return;
    }

    if (age > MAX_AGE) {
      setAgeBlockMessage(overAgeBlockMessages[Math.floor(Math.random() * overAgeBlockMessages.length)]);
      return;
    }

    const parsedWeight = weight.trim() ? parseFloat(weight) : undefined;
    onLogin(nickname.trim(), parseInt(birthYear, 10), parsedWeight, isNormalHuman);
  };

  const isFormValid = nickname.trim().length > 0 && /^\d{4}$/.test(birthYear);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.formTitle}>
            {isEditing ? '✏️ Edit Your Info' : '🕵️ Who Are You?'}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.formSubtitle}>
            (We don't want any permissions, just your brain)
          </ThemedText>

          <View style={styles.inputSection}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              😎 Your Nickname
            </ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="Enter your nickname..."
              placeholderTextColor="#999"
              value={nickname}
              onChangeText={handleNicknameChange}
            />
            {nicknameReaction && (
              <ThemedText style={styles.reaction}>{nicknameReaction}</ThemedText>
            )}
          </View>

          <View style={styles.inputSection}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              🎂 Birth Year
            </ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="YYYY"
              placeholderTextColor="#999"
              value={birthYear}
              onChangeText={handleBirthYearChange}
              keyboardType="number-pad"
              maxLength={4}
            />
            {birthYearReaction && (
              <ThemedText style={styles.reactionBold}>{birthYearReaction}</ThemedText>
            )}
            {ageBlockMessage && (
              <View style={styles.blockBox}>
                <ThemedText style={styles.blockText}>🚫 {ageBlockMessage}</ThemedText>
              </View>
            )}
          </View>

          <View style={styles.inputSection}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              ⚖️ Weight (optional, none of our business really)
            </ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="kg (optional)"
              placeholderTextColor="#999"
              value={weight}
              onChangeText={handleWeightChange}
              keyboardType="number-pad"
              maxLength={3}
            />
            {weightReaction && (
              <ThemedText style={styles.reaction}>{weightReaction}</ThemedText>
            )}
          </View>

          <View style={styles.inputSection}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              🤔 Are You a Normal Human?
            </ThemedText>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleChip, isNormalHuman === true && styles.toggleChipActive]}
                onPress={() => handleNormalHumanChoice(true)}
              >
                <ThemedText
                  style={[styles.toggleChipText, isNormalHuman === true && styles.toggleChipTextActive]}
                >
                  😇 Yes
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleChip, isNormalHuman === false && styles.toggleChipActive]}
                onPress={() => handleNormalHumanChoice(false)}
              >
                <ThemedText
                  style={[styles.toggleChipText, isNormalHuman === false && styles.toggleChipTextActive]}
                >
                  🤪 Not Really
                </ThemedText>
              </TouchableOpacity>
            </View>
            {normalHumanReaction && (
              <ThemedText style={styles.reaction}>{normalHumanReaction}</ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, !isFormValid && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              {isEditing ? '💾 Save Changes' : '🚀 Enter the Arena'}
            </ThemedText>
          </TouchableOpacity>

          {isEditing && onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <ThemedText type="defaultSemiBold" style={styles.cancelButtonText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
          )}

          <ThemedText type="small" style={styles.note}>
            Your progress will be tracked. No personal data stored.
          </ThemedText>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
  },
  formSubtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#007AFF',
  },
  input: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  reaction: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
  reactionBold: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    marginTop: 4,
  },
  blockBox: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  blockText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleChipActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderColor: '#007AFF',
  },
  toggleChipText: {
    fontSize: 15,
    opacity: 0.7,
  },
  toggleChipTextActive: {
    opacity: 1,
    fontWeight: '700',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
  },
  note: {
    textAlign: 'center',
    color: '#999',
  },
});
