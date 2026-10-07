import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useStore} from '../../../store';
import {useAppNavigation} from '../../../navigation/hooks';
import {Button, Header, Mentor, Screen, styles as s} from '../../../ui/AppUI';
import {colors} from '../../../theme';
import {QUIZ_QUESTION_COUNT, QUIZ_SECONDS_PER_QUESTION} from '../../../data/quiz';
import {computeQuizProgress} from '../progress';

const streakLabel = (days: number) => (days === 1 ? '1 day' : `${days} days`);

export default function QuizHomeScreen() {
  const navigation = useAppNavigation();
  const {attempts, clearAttempts} = useStore();
  const progress = computeQuizProgress(attempts);

  const facts = [
    `${QUIZ_QUESTION_COUNT} Questions`,
    `${QUIZ_SECONDS_PER_QUESTION}s Each`,
    '10+ Styles',
    'All Categories',
  ];

  return (
    <Screen>
      <Header eyebrow="TRAIN YOUR FASHION EYE" title="Fashion Style Quiz" />

      <View style={[s.tipCard, progress.playedToday ? local.doneBanner : local.readyBanner]}>
        <Text style={s.eyebrow}>DAILY CHALLENGE</Text>
        <Text style={s.cardTitle}>
          {progress.playedToday ? '✓ Completed for today' : 'Ready — keep your streak alive'}
        </Text>
        <Text style={s.body}>
          {progress.playedToday
            ? 'Nice. Come back tomorrow to extend your streak and climb the levels.'
            : 'Play one round today so your streak keeps growing. It only takes a minute.'}
        </Text>
      </View>

      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={s.statValue}>🔥 {progress.currentStreak}</Text>
          <Text style={s.micro}>DAY STREAK</Text>
        </View>
        <View style={s.stat}>
          <Text style={[s.statValue, {color: colors.emerald}]}>{progress.bestStreak}</Text>
          <Text style={s.micro}>BEST STREAK ({streakLabel(progress.bestStreak)})</Text>
        </View>
      </View>

      <View style={local.levelCard}>
        <View style={s.adviceMeta}>
          <Text style={s.cardTitle}>{progress.level.name}</Text>
          <Text style={s.goldText}>{progress.xp} XP</Text>
        </View>
        <View style={local.levelTrack}>
          <View style={[local.levelFill, {width: `${Math.round(progress.levelProgress * 100)}%`}]} />
        </View>
        <Text style={s.micro}>
          {progress.nextLevel
            ? `${progress.xpToNextLevel} XP to ${progress.nextLevel.name}`
            : 'Top level reached — you have mastered the style codes.'}
        </Text>
      </View>

      <Mentor text="Each round shows you five outfits to identify. Play daily to build a streak, earn XP and climb from Explorer to Style Icon." />

      <View style={s.quizFacts}>
        {facts.map(value => (
          <View key={value} style={s.quizFact}>
            <Text style={s.cardTitle}>{value}</Text>
          </View>
        ))}
      </View>

      {attempts.length > 0 && (
        <>
          <Text style={s.inputLabel}>YOUR STATISTICS</Text>
          <View style={s.stats}>
            <View style={s.stat}>
              <Text style={s.statValue}>{progress.bestScorePct}%</Text>
              <Text style={s.micro}>BEST SCORE</Text>
            </View>
            <View style={s.stat}>
              <Text style={[s.statValue, {color: colors.emerald}]}>{progress.averagePct}%</Text>
              <Text style={s.micro}>AVERAGE</Text>
            </View>
          </View>
          <Text style={s.inputLabel}>RECENT ATTEMPTS</Text>
          {attempts.slice(0, 3).map(item => (
            <View key={item.id} style={s.attempt}>
              <Text style={s.body}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={s.goldText}>{item.score}/{QUIZ_QUESTION_COUNT} · {item.duration}s</Text>
            </View>
          ))}
          <Button
            secondary
            label="Reset Quiz Progress"
            onPress={() =>
              Alert.alert('Reset quiz progress?', 'This will remove your streak, XP and recent attempts.', [
                {text: 'Cancel'},
                {text: 'Reset', style: 'destructive', onPress: clearAttempts},
              ])
            }
          />
        </>
      )}

      <Button
        label={progress.playedToday ? '↻  Play Again' : '▶  Start Daily Challenge'}
        onPress={() => navigation.navigate('QuizPlay')}
      />
    </Screen>
  );
}

const local = StyleSheet.create({
  readyBanner: {backgroundColor: '#1B180F', borderColor: `${colors.gold}55`},
  doneBanner: {backgroundColor: '#09201C', borderColor: '#0E4B3C'},
  levelCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 15,
    gap: 10,
  },
  levelTrack: {height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden'},
  levelFill: {height: 8, borderRadius: 4, backgroundColor: colors.gold},
});
