import React, {useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useStore} from '../../../store';
import {Button, Mentor, Screen, styles as s} from '../../../ui/AppUI';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

export default function QuizResultScreen({route, navigation}: Props) {
  const {addAttempt} = useStore();
  const recorded = useRef(false);

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      addAttempt(route.params.score, route.params.duration);
    }
  }, [addAttempt, route.params.duration, route.params.score]);

  const percent = route.params.score * 20;

  return (
    <Screen scroll={false}>
      <View style={s.center}>
        <Text style={s.resultStar}>★</Text>
        <Text style={s.resultTitle}>{percent >= 80 ? 'Style Authority' : percent >= 60 ? 'Style Apprentice' : 'Style Explorer'}</Text>
        <Text style={s.muted}>QUIZ COMPLETE</Text>
        <View style={s.resultRing}><Text style={s.resultPercent}>{percent}%</Text><Text style={s.micro}>ACCURACY</Text></View>
        <View style={s.resultStats}>
          <View style={s.resultStat}><Text style={s.online}>{route.params.score}</Text><Text style={s.micro}>CORRECT</Text></View>
          <View style={s.resultStat}><Text style={s.deleteText}>{5 - route.params.score}</Text><Text style={s.micro}>WRONG</Text></View>
          <View style={s.resultStat}><Text style={s.goldText}>{route.params.duration}s</Text><Text style={s.micro}>TIME</Text></View>
        </View>
        <Mentor text={percent >= 80 ? 'Excellent eye. You read silhouette and styling signals with confidence.' : 'Good effort. Keep studying proportions, textures and the small details that define a style.'} />
        <Button label="↻  Play Again" onPress={() => navigation.replace('QuizPlay')} />
        <Button secondary label="Back Home" onPress={() => navigation.reset({index: 0, routes: [{name: 'Tabs', state: {index: 5, routes: [{name: 'Outfit'}, {name: 'Wardrobe'}, {name: 'Marco'}, {name: 'Saved'}, {name: 'Journal'}, {name: 'Trends'}]}}]})} />
      </View>
    </Screen>
  );
}
