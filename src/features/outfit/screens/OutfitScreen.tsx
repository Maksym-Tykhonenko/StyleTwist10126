import React, {useState} from 'react';
import {FlatList, Image, Modal, Pressable, Text, View} from 'react-native';
import {categories, Category, Clothing} from '../../../data/clothing';
import {useStore} from '../../../store';
import {Button, Header, Mentor, MotionPressable, Screen, styles as s} from '../../../ui/AppUI';

export default function OutfitScreen() {
  const {clothes, saveOutfit, savedOutfits} = useStore();
  const [selected, setSelected] = useState<Partial<Record<Category, Clothing>>>({});
  const [picker, setPicker] = useState<Category | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [verdict, setVerdict] = useState(false);
  const complete = categories.every(category => selected[category]);
  const selectedItems = categories.map(category => selected[category]).filter(Boolean) as Clothing[];
  const savedIds = selectedItems.map(item => item.id).sort().join('|');
  const outfitSaved = selectedItems.length === categories.length && savedOutfits.some(outfit => outfit.items.map(item => item.id).sort().join('|') === savedIds);

  const evaluate = () => {
    setAnalysing(true);
    setTimeout(() => {
      setAnalysing(false);
      setVerdict(true);
    }, 2200);
  };

  if (analysing) {
    return (
      <Screen scroll={false}>
        <View style={s.center}>
          <View style={s.analysisRing}><Image source={require('../../../assets/ui/MarcoAvatar.png')} style={s.analysisAvatar} /></View>
          <Text style={s.title}>Analysing Your Outfit...</Text>
          <Text style={s.body}>Marco is evaluating your look</Text>
          <Text style={s.loadingDots}>•  •  •</Text>
        </View>
      </Screen>
    );
  }

  if (verdict) {
    return (
      <Screen>
        <Header eyebrow="OUTFIT EVALUATION" title="Marco’s Verdict" />
        <View style={s.scoreCard}>
          <View style={s.score}><Text style={s.scoreValue}>84</Text><Text style={s.micro}>/ 100</Text></View>
          <View><Text style={s.cardTitle}>Excellent Foundation</Text><Text style={s.muted}>Balanced · Modern · Confident</Text></View>
        </View>
        <View style={s.metrics}>
          {['Style 86', 'Color 82', 'Layering 84', 'Balance 83'].map(value => <View key={value} style={s.metric}><Text style={s.cardTitle}>{value}</Text><View style={s.track}><View style={s.trackFill} /></View></View>)}
        </View>
        <Mentor text="The look feels intentional and well balanced. Your strongest move is the clean relationship between the top and shoes. For an even sharper result, repeat one texture or color from the outer layer in a small accessory." />
        <View style={s.tipCard}>
          <Text style={s.eyebrow}>WHAT WORKS</Text>
          <Text style={s.body}>The silhouette stays clean, the palette is controlled, and every layer has a clear purpose.</Text>
        </View>
        <Button secondary={outfitSaved} label={outfitSaved ? '✓  Look Saved' : '◇  Save This Look'} onPress={() => saveOutfit(selectedItems, 84)} />
        <Button label="Build Another Outfit" onPress={() => { setVerdict(false); setSelected({}); }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header eyebrow="STYLE STUDIO" title="Outfit Builder" />
      <Text style={s.body}>Fill all five slots, then let Marco review the complete look.</Text>
      <View style={s.progressRow}>{categories.map(category => <View key={category} style={[s.progress, selected[category] && s.progressActive]} />)}</View>
      <View style={s.outfitGrid}>
        {categories.map(category => {
          const item = selected[category];
          return (
            <MotionPressable key={category} onPress={() => setPicker(category)} style={[s.slot, item && s.slotFilled]} pressScale={0.97}>
              {item ? <Image source={item.image} style={s.slotImage} /> : <Text style={s.slotIcon}>＋</Text>}
              <View style={s.slotCopy}>
                <Text style={s.micro}>{category.toUpperCase()}</Text>
                <Text numberOfLines={1} style={s.cardTitle}>{item?.name ?? `Add ${category}`}</Text>
              </View>
            </MotionPressable>
          );
        })}
      </View>
      {complete && <Button secondary={outfitSaved} label={outfitSaved ? '✓  Look Saved' : '◇  Save This Look'} onPress={() => saveOutfit(selectedItems)} />}
      <Button disabled={!complete} label={complete ? '✦  Evaluate My Outfit' : `Complete All Slots (${Object.keys(selected).length}/5)`} onPress={evaluate} />
      <Modal transparent visible={picker !== null} animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={s.modalShade} onPress={() => setPicker(null)}>
          <Pressable style={s.sheet} onPress={() => undefined}>
            <View style={s.sheetHandle} />
            <Text style={s.title}>Select {picker}</Text>
            <FlatList
              data={clothes.filter(item => item.category === picker)}
              numColumns={2}
              keyExtractor={item => item.id}
              contentContainerStyle={s.pickerList}
              renderItem={({item}) => (
                <MotionPressable style={s.pickerItem} pressScale={0.965} onPress={() => {
                  if (picker) {
                    setSelected(current => ({...current, [picker]: item}));
                  }
                  setPicker(null);
                }}>
                  <Image source={item.image} style={s.pickerImage} />
                  <Text numberOfLines={2} style={s.cardTitle}>{item.name}</Text>
                </MotionPressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
