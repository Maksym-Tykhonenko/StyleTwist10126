import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useStore} from '../../../store';
import {colors} from '../../../theme';
import {Header, Mentor, Screen, styles as s} from '../../../ui/AppUI';
import {computeWardrobeInsights} from '../insights';

type Props = NativeStackScreenProps<RootStackParamList, 'WardrobeInsights'>;

const scoreLabel = (score: number) =>
  score >= 80 ? 'Excellent balance' : score >= 60 ? 'Solid foundation' : score >= 40 ? 'Developing' : 'Just getting started';

export default function WardrobeInsightsScreen({navigation}: Props) {
  const {clothes} = useStore();
  const insights = computeWardrobeInsights(clothes);

  return (
    <Screen>
      <Header
        eyebrow="WARDROBE INTELLIGENCE"
        title="Wardrobe Insights"
        action={
          <Pressable onPress={() => navigation.goBack()} style={s.clear}>
            <Text style={s.goldText}>Close</Text>
          </Pressable>
        }
      />

      <View style={s.scoreCard}>
        <View style={s.score}>
          <Text style={s.scoreValue}>{insights.balanceScore}</Text>
          <Text style={s.micro}>/ 100</Text>
        </View>
        <View style={s.flex}>
          <Text style={s.cardTitle}>{scoreLabel(insights.balanceScore)}</Text>
          <Text style={s.muted}>{insights.total} pieces · {insights.missingEssentials.length} staples missing</Text>
        </View>
      </View>

      <Text style={s.inputLabel}>CATEGORY COVERAGE</Text>
      {insights.coverage.map(entry => (
        <View key={entry.category} style={local.coverageRow}>
          <View style={local.coverageHead}>
            <Text style={s.cardTitle}>{entry.category}</Text>
            <Text style={entry.met ? s.goldText : s.muted}>
              {entry.count}/{entry.recommended} {entry.met ? '✓' : ''}
            </Text>
          </View>
          <View style={local.track}>
            <View
              style={[
                local.fill,
                {width: `${Math.round(entry.ratio * 100)}%`, backgroundColor: entry.met ? colors.emerald : colors.gold},
              ]}
            />
          </View>
        </View>
      ))}

      <Text style={s.inputLabel}>ESSENTIAL STAPLES</Text>
      {insights.missingEssentials.length === 0 ? (
        <View style={s.tipCard}>
          <Text style={s.eyebrow}>COMPLETE</Text>
          <Text style={s.body}>You own every core staple. Your wardrobe can handle almost any occasion.</Text>
        </View>
      ) : (
        <View style={s.detailTags}>
          {insights.essentials.map(essential => (
            <View
              key={essential.label}
              style={[s.detailTag, essential.present ? local.tagPresent : local.tagMissing]}>
              <Text style={s.detailTagText}>
                {essential.present ? '✓ ' : '＋ '}
                {essential.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {insights.topColors.length > 0 && (
        <>
          <Text style={s.inputLabel}>YOUR PALETTE</Text>
          <View style={s.detailTags}>
            {insights.topColors.map(entry => (
              <View key={entry.color} style={s.colorTag}>
                <Text style={s.detailTagText}>{entry.color} · {entry.count}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {insights.tips.map(tip => (
        <Mentor key={tip} text={tip} />
      ))}
    </Screen>
  );
}

const local = StyleSheet.create({
  coverageRow: {gap: 7},
  coverageHead: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  track: {height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden'},
  fill: {height: 8, borderRadius: 4},
  tagPresent: {borderColor: `${colors.emerald}66`, backgroundColor: '#0E2A22'},
  tagMissing: {borderColor: `${colors.red}55`, backgroundColor: '#271418'},
});
