import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getBirthYearJoke, nicknameJokes } from '@/data/messages';
import { pickUniqueMessage } from '@/utils/gameUtils';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

interface LoginScreenProps {
  onLogin: (nickname: string, birthYear: number) => void;
  isEditing?: boolean;
  initialNickname?: string;
  initialBirthYear?: number;
  onCancel?: () => void;
}

export function LoginScreen({ onLogin, isEditing = false, initialNickname = '', initialBirthYear, onCancel }: LoginScreenProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [birthYear, setBirthYear] = useState(initialBirthYear ? String(initialBirthYear) : '');
  const [nicknameReaction, setNicknameReaction] = useState('');
  const [birthYearReaction, setBirthYearReaction] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const usedNicknameJokes = useRef(new Set<string>());

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
    if (text.trim().length === 4 && /^\d+$/.test(text)) {
      setBirthYearReaction(getBirthYearJoke(parseInt(text, 10)));
    } else {
      setBirthYearReaction('');
    }
  };

  const handleLogin = () => {
    if (nickname.trim() && birthYear.trim() && /^\d{4}$/.test(birthYear)) {
      onLogin(nickname.trim(), parseInt(birthYear));
    }
  };

  const isFormValid = nickname.trim().length > 0 && /^\d{4}$/.test(birthYear);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
            <ThemedText type="title" style={styles.formTitle}>
              {isEditing ? 'Edit Your Info' : 'Who Are You?'}
            </ThemedText>

            <ThemedText type="subtitle" style={styles.formSubtitle}>
              (We don't want any permissions, just your brain)
            </ThemedText>

            <View style={styles.inputSection}>
              <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
                Your Nickname
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? '#fff' : '#000',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                ]}
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
                Birth Year
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? '#fff' : '#000',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                ]}
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
            </View>

            <TouchableOpacity
              style={[styles.loginButton, !isFormValid && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={!isFormValid}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                {isEditing ? 'Save Changes' : 'Enter the Arena'}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
