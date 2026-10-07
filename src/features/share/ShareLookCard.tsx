import React, {forwardRef} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Clothing} from '../../data/clothing';
import {colors} from '../../theme';
import {titleFont} from '../../ui/AppUI';

export type ShareLookData = {
  items: Clothing[];
  title: string;
  subtitle?: string;
  score?: number;
  caption?: string;
};

/**
 * Branded, fixed-width look card captured to an image for social sharing.
 * Rendered off-screen by `useLookShare`; it is not part of the normal layout.
 */
const ShareLookCard = forwardRef<View, ShareLookData>(
  ({items, title, subtitle, score, caption}, ref) => {
    return (
      <View ref={ref} collapsable={false} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={require('../../assets/ui/MarcoAvatar.png')} style={styles.avatar} />
            <View>
              <Text style={styles.brand}>STYLE TWIST</Text>
              <Text style={styles.brandTag}>PERSONAL FASHION MENTOR</Text>
            </View>
          </View>
          {typeof score === 'number' && (
            <View style={styles.scoreRing}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.grid}>
          {items.map(item => (
            <View key={item.id} style={styles.tile}>
              <Image source={item.image} style={styles.tileImage} />
              <Text numberOfLines={1} style={styles.tileCategory}>
                {item.category.toUpperCase()}
              </Text>
              <Text numberOfLines={1} style={styles.tileName}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>

        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        <Text style={styles.footer}>Styled with Style Twist</Text>
      </View>
    );
  },
);

ShareLookCard.displayName = 'ShareLookCard';

export default ShareLookCard;

export const SHARE_CARD_WIDTH = 360;

const styles = StyleSheet.create({
  card: {
    width: SHARE_CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 14,
  },
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  brandRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  avatar: {width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: colors.gold},
  brand: {color: '#F0CF79', fontSize: 16, letterSpacing: 3, fontFamily: titleFont, fontWeight: '700'},
  brandTag: {color: colors.muted, fontSize: 8, letterSpacing: 2, marginTop: 2},
  scoreRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {color: colors.gold, fontSize: 20, fontWeight: '800'},
  scoreMax: {color: colors.muted, fontSize: 8},
  title: {color: colors.text, fontSize: 22, lineHeight: 26, fontFamily: titleFont, fontWeight: '700'},
  subtitle: {color: colors.muted, fontSize: 12, marginTop: -8},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  tile: {
    width: (SHARE_CARD_WIDTH - 40 - 16) / 3,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  tileImage: {width: '100%', height: 92, resizeMode: 'cover', backgroundColor: '#EAEAEA', marginBottom: 6},
  tileCategory: {color: colors.gold, fontSize: 8, letterSpacing: 1, paddingHorizontal: 8},
  tileName: {color: colors.text, fontSize: 11, fontWeight: '600', paddingHorizontal: 8},
  caption: {color: '#CCC9D0', fontSize: 12, lineHeight: 18, fontStyle: 'italic'},
  footer: {color: colors.muted, fontSize: 10, letterSpacing: 1, textAlign: 'center'},
});
