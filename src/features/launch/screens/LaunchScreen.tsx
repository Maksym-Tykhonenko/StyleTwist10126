import React, {useEffect, useRef} from 'react';
import {Animated, Image, StatusBar, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useStore} from '../../../store';
import {colors} from '../../../theme';
import {styles as s} from '../../../ui/AppUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Launch'>;

export default function LaunchScreen({navigation}: Props) {
  const {onboardingDone, hydrated} = useStore();
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 1100, useNativeDriver: true}),
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, {toValue: 1.12, duration: 850, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0.72, duration: 850, useNativeDriver: true}),
      ])),
    ]).start();
  }, [fade, pulse]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const timeout = setTimeout(() => navigation.replace(onboardingDone ? 'Tabs' : 'Onboarding'), 4000);
    return () => clearTimeout(timeout);
  }, [hydrated, navigation, onboardingDone]);

  return (
    <View style={s.launch}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.View style={[s.launchGlow, {transform: [{scale: pulse}]}]} />
      <Animated.View style={[s.launchLogoWrap, {opacity: fade}]}>
        <Image source={require('../../../assets/ui/MarcoAvatar.png')} style={s.launchLogo} />
        <Text style={s.brand}>STYLE TWIST</Text>
        <Text style={s.brandTag}>YOUR PERSONAL FASHION MENTOR</Text>
      </Animated.View>
      <View style={s.waveRow}>
        {[0.35, 0.7, 1, 0.55, 0.3].map((height, index) => (
          <Animated.View key={index} style={[s.wave, {height: 8 + height * 28, opacity: pulse}]} />
        ))}
      </View>
    </View>
  );
}
