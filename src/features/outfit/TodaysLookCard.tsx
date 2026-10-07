import React from 'react';
import {Image, StyleSheet, ScrollView, Text, View} from 'react-native';
import {colors} from '../../theme';
import {Button, styles as s} from '../../ui/AppUI';
import {TodaysLook} from './todaysLook';

type Props = {
  look: TodaysLook;
  onStyle: () => void;
  onShare: () => void;
  sharing?: boolean;
};

/** "Look of the day" hero shown at the top of the Outfit Builder. */
export default function TodaysLookCard({look, onStyle, onShare, sharing}: Props) {
  return (
    <View style={[s.planCard, local.card]}>
      <View style={s.adviceMeta}>
        <Text style={s.adviceTag}>TODAY’S LOOK</Text>
        <Text style={s.micro}>{look.focus.toUpperCase()}</Text>
      </View>
      <Text style={s.title}>Your Look of the Day</Text>
      <Text style={s.body}>{look.note}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedPreviewRow}>
        {look.items.map(item => (
          <View key={item.id} style={s.planPreviewItem}>
            <Image source={item.image} style={s.savedPreviewImage} />
            <Text numberOfLines={1} style={s.micro}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={local.actions}>
        <View style={s.flex}>
          <Button compact label="✦  Style This Look" onPress={onStyle} />
        </View>
        <View style={s.flex}>
          <Button compact secondary label={sharing ? 'Preparing…' : '↗  Share'} onPress={onShare} disabled={sharing} />
        </View>
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  card: {borderColor: `${colors.gold}55`},
  actions: {flexDirection: 'row', gap: 10},
});
