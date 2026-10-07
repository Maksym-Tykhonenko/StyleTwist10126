import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from './types';

/**
 * Navigation available to screens rendered inside the bottom tabs.
 * They can jump to a sibling tab (MainTabParamList) and also push onto
 * the root stack (Article, QuizPlay, …), so the prop is composite.
 */
export type AppNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/** Typed replacement for the former `useNavigation<any>()`. */
export const useAppNavigation = () => useNavigation<AppNavigation>();
