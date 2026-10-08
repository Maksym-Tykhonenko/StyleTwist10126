import React, { useEffect, useState, useRef } from 'react';
import { DarkTheme, NavigationContainer,  StackActions,
  useNavigationContainerRef, } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ArticleScreen from '../features/journal/screens/ArticleScreen';
import LaunchScreen from '../features/launch/screens/LaunchScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import QuizPlayScreen from '../features/quiz/screens/QuizPlayScreen';
import QuizResultScreen from '../features/quiz/screens/QuizResultScreen';
import WardrobeInsightsScreen from '../features/wardrobe/screens/WardrobeInsightsScreen';
import {StoreProvider} from '../store';
import {colors} from '../theme';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();


function Navigation() {
  

  return (
    <NavigationContainer
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Tabs" component={MainTabs} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="WardrobeInsights" component={WardrobeInsightsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Navigation />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
