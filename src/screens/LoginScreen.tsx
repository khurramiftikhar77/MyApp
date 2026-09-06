import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { birthYearJokes, nicknameJokes } from '@/data/messages';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginScreenProps {
  onLogin: (nickname: string, birthYear: number) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [nicknameReaction, setNicknameReaction] = useState('');
  const [birthYearReaction, setBirthYearReaction] = useState('');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    if (text.trim().length > 0) {
      const randomJoke = nicknameJokes[Math.floor(Math.random() * nicknameJokes.length)];
      setNicknameReaction(randomJoke);
    } else {
      setNicknameReaction('');
    }
  };

  const handleBirthYearChange = (text: string) => {
    setBirthYear(text);
    if (text.trim().length === 4 && /^\d+$/.test(text)) {
      const randomJoke = birthYearJokes[Math.floor(Math.random() * birthYearJokes.length)];
      setBirthYearReaction(randomJoke);
    } else {
      setBirthYearReaction('');
    }
  };

  const handleLogin = () => {
    if (nickname.trim() && birthYear.trim() && /^\d{4}$/.test(birthYear)) {
      onLogin(nickname.trim(), parseInt(birthYear));
    }
  };

  const isFormValid = nickname.trim().length > 0 && /^\d{4}$/.test(birthYear) && disclaimerAccepted;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!showForm ? (
          <View style={styles.disclaimerContainer}>
            <ThemedText type="title" style={styles.disclaimerTitle}>
              ⚠️ Strong Language Alert
            </ThemedText>

            <View style={styles.disclaimerBox}>
              <ThemedText style={styles.disclaimerText}>
                This game contains explicit language, harsh feedback, and sarcasm. Your eyes and feelings may be violated.
              </ThemedText>
            </View>

            <View style={styles.detailsBox}>
              <ThemedText type="defaultSemiBold" style={styles.detailsTitle}>
                What to Expect:
              </ThemedText>
              <View style={styles.bulletPoint}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.bulletText}>Colorful language and insults</ThemedText>
              </View>
              <View style={styles.bulletPoint}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.bulletText}>Sarcastic feedback on every answer</ThemedText>
              </View>
              <View style={styles.bulletPoint}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.bulletText}>Harsh truths about your intelligence</ThemedText>
              </View>
              <View style={styles.bulletPoint}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.bulletText}>Zero political correctness</ThemedText>
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, disclaimerAccepted && styles.checkboxChecked]}
                onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
              >
                {disclaimerAccepted && <ThemedText style={styles.checkmark}>✓</ThemedText>}
              </TouchableOpacity>
              <ThemedText style={styles.checkboxLabel}>
                I understand and accept the carnage
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, !disclaimerAccepted && styles.buttonDisabled]}
              onPress={() => setShowForm(true)}
              disabled={!disclaimerAccepted}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Let's Begin
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <ThemedText type="title" style={styles.formTitle}>
              Who Are You?
            </ThemedText>

            <ThemedText type="subtitle" style={styles.formSubtitle}>
              (We don't want any permissions, just your brain)
            </ThemedText>

            <View style={styles.inputSection}>
              <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
                Your Nickname
              </ThemedText>
              <TextInput
                style={styles.input}
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
                style={styles.input}
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
                Enter the Arena
              </ThemedText>
            </TouchableOpacity>

            <ThemedText type="small" style={styles.note}>
              Your progress will be tracked. No personal data stored.
            </ThemedText>
          </View>
        )}
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
  disclaimerContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  disclaimerTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 28,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  disclaimerText: {
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
  continueButton: {
    backgroundColor: '#50C878',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
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
  note: {
    textAlign: 'center',
    color: '#999',
  },
});
