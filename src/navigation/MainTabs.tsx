import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatScreen from '../features/chat/screens/ChatScreen';
import JournalScreen from '../features/journal/screens/JournalScreen';
import OutfitScreen from '../features/outfit/screens/OutfitScreen';
import SavedScreen from '../features/saved/screens/SavedScreen';
import TrendsScreen from '../features/trends/screens/TrendsScreen';
import WardrobeScreen from '../features/wardrobe/screens/WardrobeScreen';
import {colors} from '../theme';
import {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const icons: Record<keyof MainTabParamList, string> = {
  Outfit: '🧍',
  Wardrobe: '👔',
  Marco: '🕶️',
  Saved: '🎒',
  Journal: '📰',
  Trends: '✦',
};

function TabIcon({name, color}: {name: keyof MainTabParamList; color: string}) {
  return <Text style={[styles.icon, {color}]}>{icons[name]}</Text>;
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        animation: 'fade',
        tabBarStyle: styles.bar,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: '#686773',
        tabBarShowLabel: false,
        tabBarIcon: ({color}) => <TabIcon name={route.name} color={color} />,
      })}>
      <Tab.Screen name="Outfit" component={OutfitScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Marco" component={ChatScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Trends" component={TrendsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#090911',
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 82 : 64,
    bottom: 20,
    paddingTop: 6,
  },
  icon: {
    fontSize: 22,
    height: 28,
  },
});
