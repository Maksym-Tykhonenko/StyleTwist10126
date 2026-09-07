import React, {useEffect, useRef} from 'react';
import {Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme';

export const titleFont = Platform.select({ios: 'Georgia', android: 'serif'});

export function Button({label, onPress, disabled, compact, secondary}: {label: string; onPress: () => void; disabled?: boolean; compact?: boolean; secondary?: boolean}) {
  return (
    <MotionPressable
      disabled={disabled}
      onPress={onPress}
      pressScale={0.94}
      style={({pressed}: {pressed: boolean}) => [
        styles.button,
        compact && styles.buttonCompact,
        secondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text>
    </MotionPressable>
  );
}

export function Header({eyebrow, title, action}: {eyebrow: string; title: string; action?: React.ReactNode}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function Reveal({
  children,
  delay = 0,
  distance = 34,
  duration = 520,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: any;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(distance)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    fade.setValue(0);
    lift.setValue(distance);
    scale.setValue(0.92);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: Math.max(240, duration - 120),
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(lift, {
        toValue: 0,
        delay,
        damping: 16,
        mass: 0.9,
        stiffness: 110,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        damping: 15,
        mass: 0.85,
        stiffness: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, distance, duration, fade, lift, scale]);

  return (
    <Animated.View style={[style, {opacity: fade, transform: [{translateY: lift}, {scale}]}]}>
      {children}
    </Animated.View>
  );
}

export function HeroReveal({children, delay = 0, style}: {children: React.ReactNode; delay?: number; style?: any}) {
  return (
    <Reveal delay={delay} distance={48} duration={620} style={style}>
      {children}
    </Reveal>
  );
}

export function CardReveal({children, delay = 0, style}: {children: React.ReactNode; delay?: number; style?: any}) {
  return (
    <Reveal delay={delay} distance={28} duration={500} style={style}>
      {children}
    </Reveal>
  );
}

export function MotionPressable({
  children,
  style,
  pressScale = 0.96,
  ...props
}: {
  children: React.ReactNode;
  style?: any;
  pressScale?: number;
  [key: string]: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      damping: 18,
      mass: 0.7,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      {...props}
      onPressIn={(event: any) => {
        animateTo(pressScale);
        props.onPressIn?.(event);
      }}
      onPressOut={(event: any) => {
        animateTo(1);
        props.onPressOut?.(event);
      }}
      style={typeof style === 'function' ? style : style}>
      <Animated.View style={{transform: [{scale}]}}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function renderStaggeredChildren(children: React.ReactNode, baseDelay = 90, fill = false) {
  const items = React.Children.toArray(children);
  return items.map((child, index) => {
    if (child === null || child === undefined || typeof child === 'boolean') {
      return child;
    }
    return (
      <CardReveal
        key={index}
        delay={baseDelay + index * 110}
        style={fill && items.length === 1 ? styles.fillReveal : undefined}>
        {child}
      </CardReveal>
    );
  });
}

export function Screen({children, scroll = true}: {children: React.ReactNode; scroll?: boolean}) {
  const {height} = useWindowDimensions();
  const compact = height < 760;
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    fade.setValue(0);
    lift.setValue(30);
    scale.setValue(0.97);
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 280, useNativeDriver: true}),
      Animated.spring(lift, {
        toValue: 0,
        damping: 17,
        mass: 0.9,
        stiffness: 105,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        mass: 0.85,
        stiffness: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift, scale]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.screen, compact && styles.screenCompact]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.reveal, {opacity: fade, transform: [{translateY: lift}, {scale}]}]}>
            {renderStaggeredChildren(children)}
          </Animated.View>
        </ScrollView>
      ) : (
        <Animated.View style={[styles.screenFlex, compact && styles.screenFlexCompact, {opacity: fade, transform: [{translateY: lift}, {scale}]}]}>
          {renderStaggeredChildren(children, 90, true)}
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export function Mentor({text, accent = colors.gold, compact = false}: {text: string; accent?: string; compact?: boolean}) {
  return (
    <View style={[styles.mentor, compact && styles.mentorCompact, {borderColor: `${accent}55`}]}>
      <View style={[styles.avatar, compact && styles.avatarCompact, {borderColor: accent}]}>
        <Image source={require('../assets/ui/MarcoAvatar.png')} style={styles.avatarImage} />
      </View>
      <View style={styles.mentorCopy}>
        <Text style={[styles.mentorName, compact && styles.mentorNameCompact, {color: accent}]}>MARCO · FASHION MENTOR</Text>
        <Text style={[styles.mentorText, compact && styles.mentorTextCompact]}>{text}</Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  screen: {padding: 16, paddingBottom: 34, gap: 14},
  screenCompact: {padding: 12, paddingBottom: 22, gap: 10},
  screenFlex: {flex: 1, padding: 16},
  screenFlexCompact: {padding: 12},
  reveal: {gap: 14},
  fillReveal: {flex: 1},
  text: {color: colors.text},
  body: {color: colors.muted, fontSize: 14, lineHeight: 22},
  muted: {color: colors.muted, fontSize: 12},
  goldText: {color: colors.gold, fontSize: 12, fontWeight: '600'},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2},
  eyebrow: {color: colors.gold, fontSize: 10, letterSpacing: 2, fontWeight: '700', marginBottom: 7},
  title: {color: colors.text, fontSize: 27, fontFamily: titleFont, fontWeight: '700'},
  button: {minHeight: 52, borderRadius: 14, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, marginTop: 4},
  buttonCompact: {minHeight: 40, marginTop: 0},
  buttonSecondary: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  buttonDisabled: {backgroundColor: '#20202A'},
  buttonText: {color: '#09090D', fontSize: 15, fontWeight: '800'},
  buttonTextSecondary: {color: colors.text},
  pressed: {opacity: 0.78, transform: [{scale: 0.99}]},
  launch: {flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'},
  launchGlow: {position: 'absolute', width: 330, height: 330, borderRadius: 165, backgroundColor: '#B27B1530', bottom: -125, shadowColor: colors.gold, shadowOpacity: 1, shadowRadius: 70},
  launchLogoWrap: {alignItems: 'center', gap: 13},
  launchLogo: {width: 230, height: 230, borderRadius: 52},
  brand: {color: '#F0CF79', fontSize: 30, letterSpacing: 8, fontFamily: titleFont, fontWeight: '700', marginTop: 12},
  brandTag: {color: colors.muted, fontSize: 10, letterSpacing: 4},
  waveRow: {position: 'absolute', bottom: 34, height: 44, flexDirection: 'row', alignItems: 'center', gap: 8},
  wave: {width: 3, borderRadius: 2, backgroundColor: colors.gold},
  onboardingSafe: {flex: 1, backgroundColor: colors.background},
  onboardingImage: {flexShrink: 0},
  onboardingImageStyle: {resizeMode: 'cover'},
  onboardingShade: {position: 'absolute', inset: 0, backgroundColor: '#05050A42'},
  onboardingTop: {padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  dots: {flexDirection: 'row', gap: 6, marginLeft: '42%'},
  dot: {height: 6, width: 6, borderRadius: 4, backgroundColor: '#AAA8'},
  skip: {borderWidth: 1, borderColor: '#FFFFFF38', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 8},
  onboardingContent: {flex: 1, padding: 20, paddingTop: 0, paddingBottom: 18, gap: 12},
  onboardingContentCompact: {paddingHorizontal: 16, paddingBottom: 10, gap: 7},
  featureIcon: {width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginTop: -23},
  featureIconCompact: {width: 38, height: 38, borderRadius: 19, marginTop: -19},
  featureIconText: {color: '#111', fontSize: 21, fontWeight: '800'},
  featureIconTextCompact: {fontSize: 17},
  onboardingTitle: {color: colors.text, fontSize: 28, lineHeight: 34, fontFamily: titleFont, fontWeight: '700'},
  onboardingTitleCompact: {fontSize: 23, lineHeight: 27},
  onboardingBodyCompact: {fontSize: 12, lineHeight: 17},
  mentor: {backgroundColor: colors.surface, borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', gap: 12},
  mentorCompact: {borderRadius: 13, padding: 9, gap: 9},
  avatar: {width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: colors.gold, overflow: 'hidden', backgroundColor: '#17110A'},
  avatarCompact: {width: 34, height: 34, borderRadius: 17},
  avatarImage: {width: '100%', height: '100%'},
  mentorCopy: {flex: 1, gap: 5},
  mentorName: {fontSize: 9, letterSpacing: 1.1, fontWeight: '700'},
  mentorNameCompact: {fontSize: 8, letterSpacing: 0.8},
  mentorText: {color: '#CCC9D0', fontSize: 12, lineHeight: 18, fontStyle: 'italic'},
  mentorTextCompact: {fontSize: 10, lineHeight: 14},
  progressRow: {flexDirection: 'row', gap: 6},
  progress: {height: 3, backgroundColor: colors.border, borderRadius: 2, flex: 1},
  progressActive: {backgroundColor: colors.gold},
  outfitGrid: {gap: 9},
  slot: {minHeight: 70, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 13, flexDirection: 'row', alignItems: 'center', overflow: 'hidden'},
  slotFilled: {borderColor: `${colors.gold}66`},
  slotImage: {width: 78, height: 70, resizeMode: 'cover'},
  slotIcon: {width: 70, textAlign: 'center', color: colors.gold, fontSize: 24},
  slotCopy: {paddingHorizontal: 12, flex: 1, gap: 5},
  micro: {color: '#777580', fontSize: 9, letterSpacing: 0.5},
  cardTitle: {color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: '700'},
  cardDescription: {color: colors.muted, fontSize: 11, lineHeight: 16},
  modalShade: {flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end'},
  modalBackdrop: {position: 'absolute', inset: 0},
  modalShadeCenter: {flex: 1, backgroundColor: '#000000AA', justifyContent: 'center'},
  sheet: {backgroundColor: '#0F0F1C', borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: colors.border, maxHeight: '86%', padding: 20, gap: 14, marginBottom: 30},
  formSheet: {backgroundColor: '#0F0F1C', borderRadius: 26, borderWidth: 1, borderColor: colors.border, maxHeight: '82%', padding: 20, gap: 14, marginHorizontal: 18},
  sheetHandle: {width: 40, height: 4, backgroundColor: '#484754', borderRadius: 2, alignSelf: 'center'},
  sheetHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  close: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, justifyContent: 'center', alignItems: 'center'},
  closeText: {color: colors.muted, fontSize: 26, lineHeight: 28},
  pickerList: {paddingVertical: 10},
  pickerItem: {width: '48%', margin: '1%', backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', paddingBottom: 9},
  pickerImage: {width: '100%', height: 130, resizeMode: 'cover', marginBottom: 8},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18},
  analysisRing: {width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: colors.gold, padding: 12, shadowColor: colors.gold, shadowOpacity: 0.5, shadowRadius: 22},
  analysisAvatar: {width: '100%', height: '100%', borderRadius: 55},
  loadingDots: {color: colors.gold, fontSize: 24, letterSpacing: 5},
  scoreCard: {padding: 16, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 16},
  score: {width: 64, height: 64, borderWidth: 4, borderColor: colors.gold, borderRadius: 32, justifyContent: 'center', alignItems: 'center'},
  scoreValue: {color: colors.gold, fontSize: 22, fontWeight: '800'},
  metrics: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  metric: {width: '48.7%', padding: 12, borderRadius: 12, backgroundColor: colors.surface, gap: 9},
  track: {height: 3, backgroundColor: colors.border},
  trackFill: {width: '82%', height: 3, backgroundColor: colors.emerald},
  tipCard: {backgroundColor: '#09201C', borderWidth: 1, borderColor: '#0E4B3C', padding: 14, borderRadius: 14},
  add: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center', shadowColor: colors.gold, shadowOpacity: 0.45, shadowRadius: 16},
  addSecondary: {width: 58, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  addText: {fontSize: 24, color: '#101012'},
  addMiniText: {color: colors.text, fontSize: 11, fontWeight: '700'},
  headerActions: {flexDirection: 'row', gap: 8},
  stats: {flexDirection: 'row', gap: 10},
  stat: {flex: 1, minHeight: 68, backgroundColor: colors.surface, borderRadius: 13, borderWidth: 1, borderColor: colors.border, padding: 12, justifyContent: 'space-between'},
  statValue: {color: colors.gold, fontSize: 20, fontWeight: '800'},
  chips: {gap: 8, paddingVertical: 2},
  chip: {borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
  chipActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  chipText: {color: colors.muted, fontSize: 12},
  chipTextActive: {color: '#111', fontWeight: '700'},
  wardrobeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  clothingCard: {width: '48.5%', backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border},
  clothingImage: {width: '100%', height: 142, resizeMode: 'cover', backgroundColor: '#EAEAEA'},
  clothingCopy: {padding: 10, gap: 6},
  detailClothingImage: {width: '100%', height: 240, resizeMode: 'cover', borderRadius: 18, backgroundColor: '#EAEAEA', marginBottom: 12},
  detailFacts: {flexDirection: 'row', gap: 10, marginBottom: 14},
  detailFactCard: {flex: 1, minHeight: 78, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 12, justifyContent: 'space-between'},
  detailSection: {marginBottom: 14, gap: 8},
  detailTags: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  detailTag: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
  colorTag: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: `${colors.gold}55`, backgroundColor: '#1A1810'},
  detailTagText: {color: colors.text, fontSize: 12, fontWeight: '600'},
  detailBottomSpacer: {height: 30},
  deleteSmall: {borderWidth: 1, borderColor: `${colors.red}55`, borderRadius: 8, padding: 7, alignItems: 'center'},
  deleteText: {color: colors.red, fontSize: 12, fontWeight: '600'},
  inputLabel: {color: '#85838E', fontSize: 10, letterSpacing: 1.4, marginTop: 8, marginBottom: 7},
  photoPicker: {height: 140, borderRadius: 17, overflow: 'hidden', backgroundColor: colors.surfaceAlt, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border},
  photoPreview: {width: '100%', height: '100%', resizeMode: 'cover'},
  photoIcon: {color: '#5D5B68', fontSize: 35},
  input: {height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surfaceAlt, color: colors.text, paddingHorizontal: 14, fontSize: 14},
  inputMultiline: {height: 110, paddingVertical: 14, textAlignVertical: 'top'},
  chatHeader: {height: 68, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10},
  chatIdentity: {flex: 1},
  online: {color: colors.emerald, fontSize: 11, fontWeight: '600'},
  clear: {borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 8},
  chatScroll: {flex: 1},
  chatMessages: {padding: 16, gap: 12},
  bubble: {maxWidth: '83%', borderRadius: 16, padding: 13},
  mentorBubble: {alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border},
  userBubble: {alignSelf: 'flex-end', backgroundColor: '#1B180F', borderWidth: 1, borderColor: `${colors.gold}55`},
  bubbleText: {color: '#D9D6DE', fontSize: 13, lineHeight: 20},
  bubbleActions: {flexDirection: 'row', gap: 7, marginTop: 10},
  miniAction: {paddingHorizontal: 9, paddingVertical: 5, backgroundColor: colors.background, borderRadius: 11},
  savedText: {color: colors.gold, fontSize: 11},
  questionPanel: {maxHeight: 238, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 14, paddingBottom: 10, backgroundColor: '#090912'},
  questionScroll: {maxHeight: 192},
  question: {padding: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 11, marginBottom: 7},
  questionText: {color: '#B7B4BF', fontSize: 11, lineHeight: 15},
  count: {padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface},
  switchRow: {flexDirection: 'row', borderWidth: 1, borderColor: colors.border, borderRadius: 16, backgroundColor: colors.surfaceAlt, padding: 4},
  switchTab: {flex: 1, minHeight: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  switchTabActive: {backgroundColor: colors.gold},
  switchTabText: {color: colors.muted, fontSize: 13, fontWeight: '700'},
  switchTabTextActive: {color: '#111'},
  empty: {alignItems: 'center', paddingVertical: 70, gap: 12},
  emptyIcon: {color: colors.gold, fontSize: 38},
  adviceCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 15, gap: 10},
  adviceMeta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  adviceTag: {color: colors.gold, fontSize: 9, borderWidth: 1, borderColor: `${colors.gold}55`, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5},
  adviceActions: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  savedPreviewRow: {gap: 8},
  savedPreviewImage: {width: 72, height: 72, borderRadius: 12, backgroundColor: '#EAEAEA'},
  trendsYearBlock: {gap: 12},
  trendsYearHeader: {gap: 6, marginTop: 6},
  trendsYearTitle: {color: colors.gold, fontSize: 24, fontFamily: titleFont, fontWeight: '800'},
  trendCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, overflow: 'hidden'},
  trendHero: {height: 220, justifyContent: 'flex-end'},
  trendHeroOverlay: {padding: 16, gap: 8},
  trendHeroTitle: {color: colors.text, fontFamily: titleFont, fontSize: 25, lineHeight: 30, fontWeight: '700'},
  trendCardBody: {padding: 16, gap: 8},
  trendBulletRow: {flexDirection: 'row', gap: 8, alignItems: 'flex-start'},
  trendBullet: {color: colors.gold, fontSize: 14, lineHeight: 22, marginTop: -1},
  trendTipAlt: {backgroundColor: '#101B2A', borderColor: '#20456E'},
  trendSourcesCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 15, gap: 8},
  trendSourceLink: {paddingVertical: 4},
  plannerTemplatesRow: {gap: 10, paddingVertical: 2},
  templateCard: {width: 240, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, gap: 9},
  planCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 15, gap: 12},
  tripCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 15, gap: 12},
  tripTag: {color: colors.blue, borderColor: '#4C7FD255'},
  planHeader: {flexDirection: 'row', gap: 12},
  planStatusPill: {paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt},
  planStatusReady: {backgroundColor: '#17251E', borderColor: '#24533F'},
  planStatusWorn: {backgroundColor: '#121F38', borderColor: '#2D5AAA'},
  planStatusText: {color: colors.muted, fontSize: 10, fontWeight: '700'},
  planStatusTextReady: {color: colors.emerald},
  planStatusTextWorn: {color: colors.blue},
  planPreviewItem: {gap: 6, width: 72},
  planChecklistCard: {borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.surfaceAlt, padding: 12, gap: 9},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4},
  checkRowDone: {opacity: 0.9},
  checkIndicator: {color: colors.muted, fontSize: 14, width: 18},
  checkIndicatorDone: {color: colors.emerald},
  checkLabelDone: {color: colors.text},
  planActions: {flexDirection: 'row', gap: 10},
  tripCounter: {minWidth: 68, minHeight: 68, borderRadius: 16, borderWidth: 1, borderColor: '#3664B8', backgroundColor: '#121F38', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10},
  tripCounterValue: {color: colors.blue, fontSize: 17, fontWeight: '800'},
  tripDaysCard: {borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.surfaceAlt, padding: 12, gap: 10},
  tripDayRow: {flexDirection: 'row', gap: 10, alignItems: 'flex-start'},
  tripDayBadge: {minWidth: 54, color: colors.blue, fontSize: 11, fontWeight: '700', paddingTop: 2},
  savedOutfitSelect: {width: 210, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 10, gap: 9},
  savedOutfitSelectActive: {borderColor: `${colors.gold}88`, backgroundColor: '#1A1810'},
  savedOutfitThumb: {width: 56, height: 56, borderRadius: 10, backgroundColor: '#EAEAEA'},
  row: {flexDirection: 'row', gap: 8},
  squareAction: {width: 34, height: 32, borderRadius: 9, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center'},
  squareDanger: {borderColor: `${colors.red}55`},
  articleCard: {height: 102, borderWidth: 1, borderColor: colors.border, borderRadius: 17, overflow: 'hidden'},
  articleFeatured: {height: 265},
  articleHero: {width: '100%', height: '100%'},
  articleThumb: {width: '100%', height: '100%'},
  articleImage: {borderRadius: 16},
  articleShade: {position: 'absolute', inset: 0, backgroundColor: '#02020766'},
  articleOverlay: {position: 'absolute', left: 16, right: 50, bottom: 15},
  articleLabel: {color: colors.emerald, fontSize: 9, letterSpacing: 1, fontWeight: '700', marginBottom: 7},
  articleHeroTitle: {color: colors.text, fontFamily: titleFont, fontSize: 23, lineHeight: 27, fontWeight: '700'},
  articleTitle: {color: colors.text, fontFamily: titleFont, fontSize: 16, lineHeight: 20, fontWeight: '700'},
  heart: {position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: '#17171CCC', justifyContent: 'center', alignItems: 'center'},
  heartText: {color: colors.text, fontSize: 17},
  heartActive: {color: colors.red, fontSize: 17},
  detailHero: {height: 285},
  back: {position: 'absolute', top: 16, left: 16, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#16161BCC'},
  articleBody: {padding: 20, paddingBottom: 40},
  articleDetailTitle: {color: colors.text, fontFamily: titleFont, fontSize: 29, lineHeight: 35, fontWeight: '700', marginBottom: 13},
  articleLead: {color: '#C0BDC6', fontSize: 16, lineHeight: 26, fontStyle: 'italic', marginBottom: 20},
  articleParagraph: {color: '#BCB9C2', fontSize: 15, lineHeight: 25, marginBottom: 20},
  articleButtons: {flexDirection: 'row', gap: 10},
  flex: {flex: 1},
  quizFacts: {flexDirection: 'row', flexWrap: 'wrap', gap: 9},
  quizFact: {width: '48.6%', height: 58, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 12, justifyContent: 'center', padding: 12},
  attempt: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 12, flexDirection: 'row', justifyContent: 'space-between'},
  quizTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  timer: {width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.emerald, justifyContent: 'center', alignItems: 'center'},
  timerTrack: {height: 3, backgroundColor: colors.border, marginTop: 8},
  timerFill: {height: 3, backgroundColor: colors.emerald},
  quizImage: {height: 320, marginTop: 24},
  quizImageCompact: {height: 260, marginTop: 16},
  quizImageStyle: {borderRadius: 13},
  quizPrompt: {position: 'absolute', left: 16, right: 16, bottom: 18, padding: 16, borderRadius: 16, backgroundColor: '#0B0B12CC', borderWidth: 1, borderColor: '#FFFFFF18'},
  quizPromptCompact: {left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 14},
  quizPromptTag: {color: colors.emerald, fontSize: 10, letterSpacing: 1.6, fontWeight: '700', marginBottom: 8},
  quizPromptTitle: {color: colors.text, fontFamily: titleFont, fontSize: 21, lineHeight: 26, fontWeight: '700'},
  quizPromptTitleCompact: {fontSize: 18, lineHeight: 22},
  options: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14},
  optionsCompact: {gap: 8, marginTop: 10},
  option: {width: '48.5%', height: 54, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12},
  optionCompact: {height: 48, borderRadius: 10, gap: 8},
  optionLetter: {color: '#696773', fontSize: 10},
  resultStar: {fontSize: 52, color: colors.gold},
  resultTitle: {fontFamily: titleFont, color: colors.blue, fontSize: 23, fontWeight: '700'},
  resultRing: {width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: colors.blue, justifyContent: 'center', alignItems: 'center'},
  resultPercent: {color: colors.blue, fontSize: 28, fontWeight: '800'},
  resultStats: {flexDirection: 'row', gap: 9, alignSelf: 'stretch'},
  resultStat: {flex: 1, height: 65, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', gap: 6},
});
