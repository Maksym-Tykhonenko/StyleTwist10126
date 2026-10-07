import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Launch: undefined;
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Article: {id: string};
  QuizPlay: undefined;
  QuizResult: {score: number; duration: number};
  WardrobeInsights: undefined;
};

export type MainTabParamList = {
  Outfit: undefined;
  Wardrobe: undefined;
  Marco: undefined;
  Quiz: undefined;
  Saved: undefined;
  Journal: undefined;
  Trends: undefined;
};
