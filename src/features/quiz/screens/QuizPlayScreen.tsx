import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, Text, useWindowDimensions, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {quiz} from '../../../data/quiz';
import {RootStackParamList} from '../../../navigation/types';
import {HeroReveal, MotionPressable, Screen, styles as s} from '../../../ui/AppUI';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizPlay'>;

export default function QuizPlayScreen({navigation}: Props) {
  const {height} = useWindowDimensions();
  const compact = height < 760;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [locked, setLocked] = useState(false);
  const started = useRef(Date.now());

  const next = useCallback((correct: boolean) => {
    if (locked) {
      return;
    }
    setLocked(true);
    const finalScore = score + Number(correct);
    setScore(finalScore);
    setTimeout(() => {
      if (index === quiz.length - 1) {
        navigation.replace('QuizResult', {score: finalScore, duration: Math.round((Date.now() - started.current) / 1000)});
      } else {
        setIndex(value => value + 1);
        setTime(15);
        setLocked(false);
      }
    }, 450);
  }, [index, locked, navigation, score]);

  useEffect(() => {
    const timer = setInterval(() => setTime(value => {
      if (value <= 1) {
        clearInterval(timer);
        next(false);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [index, next]);

  const item = quiz[index];

  return (
    <Screen scroll={false}>
      <View style={s.quizTop}><Text style={s.muted}>Question {index + 1} of 5</Text><View style={s.timer}><Text style={s.online}>{time}</Text></View></View>
      <View style={s.timerTrack}><View style={[s.timerFill, {width: `${time / 15 * 100}%`}]} /></View>
      <HeroReveal delay={120}>
        <ImageBackground source={item.image} style={[s.quizImage, compact && s.quizImageCompact]} imageStyle={s.quizImageStyle}>
          <View style={s.articleShade} />
          <View style={[s.quizPrompt, compact && s.quizPromptCompact]}>
            <Text style={s.quizPromptTag}>STYLE QUIZ</Text>
            <Text style={[s.quizPromptTitle, compact && s.quizPromptTitleCompact]}>What fashion style is shown?</Text>
          </View>
        </ImageBackground>
      </HeroReveal>
      <View style={[s.options, compact && s.optionsCompact]}>
        {item.options.map((option, optionIndex) => (
          <MotionPressable disabled={locked} key={option} onPress={() => next(option === item.answer)} style={[s.option, compact && s.optionCompact]} pressScale={0.95}>
            <Text style={s.optionLetter}>{String.fromCharCode(65 + optionIndex)}</Text>
            <Text style={s.cardTitle}>{option}</Text>
          </MotionPressable>
        ))}
      </View>
    </Screen>
  );
}
