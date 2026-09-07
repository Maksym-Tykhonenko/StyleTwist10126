import React from 'react';
import {Alert, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '../../../store';
import {Button, Header, Mentor, Screen, styles as s} from '../../../ui/AppUI';
import {colors} from '../../../theme';

export default function QuizHomeScreen() {
  const navigation = useNavigation<any>();
  const {attempts, clearAttempts} = useStore();
  const best = attempts.length ? Math.max(...attempts.map(item => item.score)) * 20 : 0;
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length * 20) : 0;

  return (
    <Screen>
      <Header eyebrow="TEST YOUR KNOWLEDGE" title="Fashion Style Quiz" />
      <Mentor text="Ready to test your eye? I’ll show you five outfits and you identify the style. You have 15 seconds per question. Let’s find out how sharp your fashion sense really is." />
      <View style={s.quizFacts}>
        {['5 Questions', '15s Each', '10+ Styles', 'All Categories'].map(value => <View key={value} style={s.quizFact}><Text style={s.cardTitle}>{value}</Text></View>)}
      </View>
      {attempts.length > 0 && <>
        <Text style={s.inputLabel}>YOUR STATISTICS</Text>
        <View style={s.stats}>
          <View style={s.stat}><Text style={s.statValue}>{best}%</Text><Text style={s.micro}>BEST SCORE</Text></View>
          <View style={s.stat}><Text style={[s.statValue, {color: colors.emerald}]}>{average}%</Text><Text style={s.micro}>AVERAGE</Text></View>
        </View>
        <Text style={s.inputLabel}>RECENT ATTEMPTS</Text>
        {attempts.slice(0, 3).map(item => <View key={item.id} style={s.attempt}><Text style={s.body}>{new Date(item.date).toLocaleDateString()}</Text><Text style={s.goldText}>{item.score}/5 · {item.duration}s</Text></View>)}
        <Button secondary label="Reset Quiz Progress" onPress={() => Alert.alert('Reset quiz progress?', 'This will remove your quiz statistics and recent attempts.', [{text: 'Cancel'}, {text: 'Reset', style: 'destructive', onPress: clearAttempts}])} />
      </>}
      <Button label={attempts.length ? '↻  Play Again' : '▶  Start Quiz'} onPress={() => navigation.navigate('QuizPlay')} />
    </Screen>
  );
}
