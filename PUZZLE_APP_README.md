# Puzzle Challenge App

A fun, age-gated puzzle game built with Expo React Native. The app challenges users to solve puzzles and delivers personalized, humorous messages based on their performance and age group.

## Features

✨ **Age-Gated Experience**
- Two separate paths: Under 18 and 18+
- Each age group gets age-appropriate messages
- 18+ version features colorful language and sarcastic commentary
- Under 18 version provides encouraging, fun feedback

🧮 **Two Puzzle Types**
- **Math Puzzles**: Numerical problems ranging from basic arithmetic to algebra
- **Word Puzzles**: Trivia and knowledge-based questions
- Toggle between puzzle types before each game

🎮 **Game Mechanics**
- 5 questions per game
- Need 3 correct answers to win
- Questions are randomized from a pool of 50+ puzzles per type
- Instant feedback on answers
- Game ends when you get 3 correct, 3 wrong, or complete all 5 questions

💬 **Dynamic Messages**
- **100+ Congratulation Messages**: Funny, sarcastic, and encouraging
- **100+ Insult Messages**: Witty and playful for wrong answers
- Messages vary based on:
  - Correct or incorrect answer
  - Age group (18+ or Under 18)
  - Completely random selection each time

📱 **Cross-Platform**
- Native iOS and Android support via Expo
- Responsive design works on all screen sizes
- Web support included

## Project Structure

```
src/
├── app/
│   └── index.tsx                 # Main app entry point
├── components/
│   └── puzzle-game.tsx           # Main game orchestrator
├── screens/
│   ├── AgeSelectScreen.tsx       # Age selection
│   ├── PuzzleSelectScreen.tsx    # Puzzle type selection
│   ├── QuizScreen.tsx            # Quiz gameplay
│   └── ResultsScreen.tsx         # Results & messages
├── data/
│   ├── messages.ts               # All congratulations & insult messages
│   └── puzzles.ts                # Math & word puzzle database
├── utils/
│   └── gameUtils.ts              # Game logic & utilities
└── types/
    └── game.ts                   # TypeScript interfaces
```

## Game Flow

1. **Age Selection** → Choose Under 18 or 18+
2. **Puzzle Type Selection** → Choose Math or Word puzzles
3. **Quiz** → Answer 5 questions (or until you get 3 correct/wrong)
4. **Results** → See score and receive personalized message
5. **Play Again** → Choose new puzzle type or go back home

## Message Content

### For 18+ Users:
- Celebrates intelligence and critical thinking
- Jokes about AI replacing humans and social media addiction
- Insults include encouragement to focus on education over distractions
- Full of personality and sarcasm

### For Under 18 Users:
- Encouraging and supportive messages
- Friendly jokes about TikTok and studies
- Wrong answer messages suggest focusing on education
- Age-appropriate humor throughout

## Running the App

### Development
```bash
npm start
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## Tech Stack

- **Framework**: Expo 57.0.20
- **Language**: TypeScript
- **UI Framework**: React Native
- **Navigation**: Expo Router
- **React Version**: 19.2.3

## Game Mechanics Details

- **Win Condition**: 3 or more correct answers out of 5
- **Loss Condition**: 3 wrong answers before reaching 5 questions, or less than 3 correct
- **Answer Matching**: Case-insensitive, whitespace trimmed
- **Puzzle Selection**: Random shuffle from available puzzle pool each game
- **Message Display**: Random selection from 100+ appropriate messages

## Customization

### Adding More Messages
Edit `src/data/messages.ts` and add to any of these arrays:
- `over18CongratulationMessages`
- `over18InsultMessages`
- `under18CongratulationMessages`
- `under18InsultMessages`

### Adding More Puzzles
Edit `src/data/puzzles.ts` and add to:
- `mathPuzzles` array
- `wordPuzzles` array

### Styling
All screens use the `ThemedText` and `ThemedView` components which respect the light/dark theme setting. Modify individual screen styles in each screen's `StyleSheet.create()` at the bottom.

## Deployment

To publish to Android and iOS:

1. **Android**:
   ```bash
   npm run android
   eas build --platform android
   eas submit --platform android
   ```

2. **iOS**:
   ```bash
   npm run ios
   eas build --platform ios
   eas submit --platform ios
   ```

First-time deployment requires Expo account setup and credential management.

## Features for Future Enhancement

- Difficulty levels (Easy, Medium, Hard)
- Leaderboard/Score tracking
- Achievement badges
- Custom puzzle creation
- Multiplayer mode
- Sound effects and animations
- Daily challenges
- Streak counter

---

**Have fun solving puzzles! 🧠**
