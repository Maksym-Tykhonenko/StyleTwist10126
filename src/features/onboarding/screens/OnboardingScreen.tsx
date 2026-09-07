import React, {useState} from 'react';
import {ImageBackground, Pressable, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../navigation/types';
import {useStore} from '../../../store';
import {colors} from '../../../theme';
import {onboardingSlides} from '../../../data/onboarding';
import {Button, Mentor, Reveal, styles as s} from '../../../ui/AppUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({navigation}: Props) {
  const [page, setPage] = useState(0);
  const {height} = useWindowDimensions();
  const {finishOnboarding} = useStore();
  const item = onboardingSlides[page];
  const compact = height < 750;
  const imageHeight = height * (compact ? 0.42 : 0.46);

  const finish = () => {
    finishOnboarding();
    navigation.replace('Tabs');
  };

  return (
    <SafeAreaView style={s.onboardingSafe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Reveal delay={20} distance={22}>
        <ImageBackground source={item.image} style={[s.onboardingImage, {height: imageHeight}]} imageStyle={s.onboardingImageStyle}>
          <View style={s.onboardingShade} />
          <View style={s.onboardingTop}>
            <View style={s.dots}>{onboardingSlides.map((_, index) => <View key={index} style={[s.dot, index === page && {backgroundColor: item.accent, width: 20}]} />)}</View>
            <Pressable onPress={finish} style={s.skip}><Text style={s.muted}>Skip</Text></Pressable>
          </View>
        </ImageBackground>
      </Reveal>
      <Reveal delay={120} distance={24} style={[s.onboardingContent, compact && s.onboardingContentCompact]}>
        <View style={[s.featureIcon, compact && s.featureIconCompact, {backgroundColor: item.accent}]}>
          <Text style={[s.featureIconText, compact && s.featureIconTextCompact]}>{item.icon}</Text>
        </View>
        <Reveal delay={180} distance={16}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={[s.onboardingTitle, compact && s.onboardingTitleCompact]}>{item.title}</Text>
        </Reveal>
        <Reveal delay={240} distance={16}>
          <Text numberOfLines={3} adjustsFontSizeToFit style={[s.body, compact && s.onboardingBodyCompact]}>{item.text}</Text>
        </Reveal>
        <Reveal delay={300} distance={18}>
          <Mentor compact={compact} text={page === 0 ? 'Ready to begin? Together, we’ll transform how you think about style - one outfit at a time.' : 'I’ll stay beside you with concise, honest guidance built around your choices.'} accent={item.accent} />
        </Reveal>
        <Reveal delay={360} distance={18}>
          <Button compact={compact} label={page === onboardingSlides.length - 1 ? 'Enter Style Twist  ->' : 'Continue  ->'} onPress={() => page === onboardingSlides.length - 1 ? finish() : setPage(page + 1)} />
        </Reveal>
      </Reveal>
    </SafeAreaView>
  );
}
