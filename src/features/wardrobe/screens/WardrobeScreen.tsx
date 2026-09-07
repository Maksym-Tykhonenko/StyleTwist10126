import React, {useState} from 'react';
import {Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {categories, Category, Clothing} from '../../../data/clothing';
import {useStore} from '../../../store';
import {colors} from '../../../theme';
import {Button, Header, MotionPressable, Screen, styles as s} from '../../../ui/AppUI';

const categoryFacts: Record<Category, {occasion: string; silhouette: string; season: string; avoidWith: string}> = {
  Hats: {
    occasion: 'Great for finishing outfits, travel days, casual city looks and statement styling.',
    silhouette: 'Works best when the headwear balance matches the structure of your outerwear and shoes.',
    season: 'Most useful in transitional weather, colder months or sunny day styling depending on fabric.',
    avoidWith: 'Avoid stacking too many statement accessories around the face at the same time.',
  },
  Tops: {
    occasion: 'Useful across daily wear, office styling, layered looks and polished casual outfits.',
    silhouette: 'The top usually controls visual balance, so fit through shoulders and torso matters most.',
    season: 'Can be adapted year-round by changing layers, texture and sleeve weight.',
    avoidWith: 'Avoid combining it with bottoms that fight for equal visual attention unless the look is intentionally bold.',
  },
  Outerwear: {
    occasion: 'Best for commute, layering, travel, office dressing and building a stronger outfit identity.',
    silhouette: 'Outerwear defines the whole outline, so it should complement the width and length of the base layers.',
    season: 'Most powerful in autumn, winter and spring transitions when layering adds depth.',
    avoidWith: 'Avoid mixing it with too many bulky elements below unless you want a deliberately oversized silhouette.',
  },
  Bottoms: {
    occasion: 'A strong base for casual, smart casual and elevated dressing depending on fabric and cut.',
    silhouette: 'The rise, taper and break decide how polished or relaxed the final outfit feels.',
    season: 'Can shift across all seasons by changing fabric weight and the openness of the footwear.',
    avoidWith: 'Avoid pairing with tops of similar volume unless you are intentionally building a wide silhouette.',
  },
  Shoes: {
    occasion: 'Shoes set the formality level and usually decide whether a look reads casual or refined.',
    silhouette: 'They should visually anchor the pants length and echo the structure of the outfit above.',
    season: 'Best selected with weather, sole weight and fabric texture in mind.',
    avoidWith: 'Avoid mixing highly formal shoes with very athletic clothing unless you are styling contrast on purpose.',
  },
};

export default function WardrobeScreen() {
  const {clothes, addClothing, deleteClothing} = useStore();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [adding, setAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Clothing | null>(null);
  const [category, setCategory] = useState<Category>('Tops');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uri, setUri] = useState<string>();
  const visible = filter === 'All' ? clothes : clothes.filter(item => item.category === filter);

  const choosePhoto = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1});
    setUri(result.assets?.[0]?.uri);
  };

  const submit = () => {
    if (!uri || !name.trim() || !description.trim()) {
      return;
    }
    addClothing({
      category,
      name: name.trim(),
      description: description.trim(),
      image: {uri},
      styleNotes: {
        worksWith: ['Clean basics', 'Neutral layers', 'Simple shoes'],
        bestFor: ['Custom styling', 'Personal wardrobe', 'Everyday looks'],
        colors: ['Black', 'White', 'Grey', 'Navy'],
        stylingTip: 'Use this piece as a building block and repeat one color from it somewhere else in the outfit for a more intentional look.',
      },
    });
    setAdding(false);
    setName('');
    setDescription('');
    setUri(undefined);
  };

  return (
    <Screen>
      <Header eyebrow="COLLECTION" title="My Wardrobe" action={<Pressable onPress={() => setAdding(true)} style={s.add}><Text style={s.addText}>＋</Text></Pressable>} />
      <View style={s.stats}>
        <View style={s.stat}><Text style={s.statValue}>{clothes.length}</Text><Text style={s.micro}>ITEMS</Text></View>
        <View style={s.stat}><Text style={[s.statValue, {color: colors.emerald}]}>{categories.length}</Text><Text style={s.micro}>CATEGORIES</Text></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {(['All', ...categories] as const).map(value => <MotionPressable key={value} onPress={() => setFilter(value)} style={[s.chip, filter === value && s.chipActive]} pressScale={0.94}><Text style={[s.chipText, filter === value && s.chipTextActive]}>{value}</Text></MotionPressable>)}
      </ScrollView>
      <View style={s.wardrobeGrid}>
        {visible.map(item => (
          <MotionPressable key={item.id} style={s.clothingCard} pressScale={0.975} onPress={() => setSelectedItem(item)}>
            <Image source={item.image} style={s.clothingImage} />
            <View style={s.clothingCopy}>
              <Text style={s.micro}>{item.category.toUpperCase()}</Text>
              <Text numberOfLines={1} style={s.cardTitle}>{item.name}</Text>
              <Text numberOfLines={2} style={s.cardDescription}>{item.description}</Text>
              {item.custom && <Pressable onPress={() => Alert.alert('Delete item?', item.name, [{text: 'Cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deleteClothing(item.id)}])} style={s.deleteSmall}><Text style={s.deleteText}>Delete</Text></Pressable>}
            </View>
          </MotionPressable>
        ))}
      </View>
      <Modal transparent visible={selectedItem !== null} animationType="slide" onRequestClose={() => setSelectedItem(null)}>
        <View style={s.modalShade}>
          <Pressable style={s.modalBackdrop} onPress={() => setSelectedItem(null)} />
          <View style={s.sheet}>
            {selectedItem && (
              <>
                <View style={s.sheetHandle} />
                <View style={s.sheetHeader}>
                  <View style={s.flex}>
                    <Text style={s.inputLabel}>{selectedItem.category.toUpperCase()}</Text>
                    <Text style={s.title}>{selectedItem.name}</Text>
                  </View>
                  <Pressable onPress={() => setSelectedItem(null)} style={s.close}><Text style={s.closeText}>×</Text></Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image source={selectedItem.image} style={s.detailClothingImage} />
                  <View style={s.detailFacts}>
                    <View style={s.detailFactCard}>
                      <Text style={s.micro}>CATEGORY</Text>
                      <Text style={s.cardTitle}>{selectedItem.category}</Text>
                    </View>
                    <View style={s.detailFactCard}>
                      <Text style={s.micro}>BEST SEASON</Text>
                      <Text style={s.cardTitle}>{categoryFacts[selectedItem.category].season}</Text>
                    </View>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>About this piece</Text>
                    <Text style={s.body}>{selectedItem.description}</Text>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>When to wear it</Text>
                    <Text style={s.body}>{categoryFacts[selectedItem.category].occasion}</Text>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Best styles</Text>
                    <View style={s.detailTags}>
                      {selectedItem.styleNotes.bestFor.map(value => (
                        <View key={value} style={s.detailTag}>
                          <Text style={s.detailTagText}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Pairs well with</Text>
                    <Text style={s.body}>{selectedItem.styleNotes.worksWith.join(' · ')}</Text>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Silhouette guidance</Text>
                    <Text style={s.body}>{categoryFacts[selectedItem.category].silhouette}</Text>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Best colors to choose</Text>
                    <View style={s.detailTags}>
                      {selectedItem.styleNotes.colors.map(value => (
                        <View key={value} style={s.colorTag}>
                          <Text style={s.detailTagText}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>What to avoid</Text>
                    <Text style={s.body}>{categoryFacts[selectedItem.category].avoidWith}</Text>
                  </View>
                  <View style={s.tipCard}>
                    <Text style={s.eyebrow}>STYLING TIP</Text>
                    <Text style={s.body}>{selectedItem.styleNotes.stylingTip}</Text>
                  </View>
                  <View style={s.detailBottomSpacer} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal transparent visible={adding} animationType="slide" onRequestClose={() => setAdding(false)}>
        <KeyboardAvoidingView style={s.modalShadeCenter} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.formSheet}>
            <View style={s.sheetHeader}><Text style={s.title}>Add Clothing</Text><Pressable onPress={() => setAdding(false)} style={s.close}><Text style={s.closeText}>×</Text></Pressable></View>
            <ScrollView>
              <Text style={s.inputLabel}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
                {categories.map(value => <MotionPressable key={value} onPress={() => setCategory(value)} style={[s.chip, category === value && s.chipActive]} pressScale={0.94}><Text style={[s.chipText, category === value && s.chipTextActive]}>{value}</Text></MotionPressable>)}
              </ScrollView>
              <Text style={s.inputLabel}>ADD A PHOTO</Text>
              <MotionPressable onPress={choosePhoto} style={s.photoPicker} pressScale={0.98}>{uri ? <Image source={{uri}} style={s.photoPreview} /> : <Text style={s.photoIcon}>▧＋</Text>}</MotionPressable>
              <Text style={s.inputLabel}>CLOTHING NAME</Text>
              <TextInput value={name} onChangeText={setName} placeholder="e.g. Navy Wool Blazer" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>SHORT DESCRIPTION</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Fit, fabric and key details" placeholderTextColor={colors.muted} style={s.input} />
              <Button disabled={!uri || !name.trim() || !description.trim()} label="Add to Wardrobe" onPress={submit} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
