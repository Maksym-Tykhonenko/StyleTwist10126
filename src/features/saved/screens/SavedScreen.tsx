import React, {useMemo, useState} from 'react';
import {Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, Text, TextInput, View} from 'react-native';
import {Clothing} from '../../../data/clothing';
import {PlannedLook, TripPlan, useStore} from '../../../store';
import {colors} from '../../../theme';
import {Button, Header, Mentor, Screen, styles as s} from '../../../ui/AppUI';

type ViewMode = 'Planner' | 'Trips' | 'Library';
type LibraryMode = 'All' | 'Looks' | 'Advice';
type PlannerTemplate = {id: string; title: string; occasion: string; notes: string; checklist: string[]};
type TripTemplate = {id: string; title: string; vibe: string; duration: number; focus: string[]};

const plannerTemplates: PlannerTemplate[] = [
  {
    id: 'work',
    title: 'Office Power Look',
    occasion: 'Workday',
    notes: 'Build a polished outfit that can carry meetings, coffee runs and evening plans.',
    checklist: ['Steam key pieces', 'Add one structured layer', 'Prepare shoes and bag'],
  },
  {
    id: 'weekend',
    title: 'Weekend City Look',
    occasion: 'Weekend',
    notes: 'Keep the outfit relaxed but intentional, with one focal item.',
    checklist: ['Check weather layer', 'Add comfortable shoes', 'Prepare one accent accessory'],
  },
  {
    id: 'event',
    title: 'Dinner / Event Look',
    occasion: 'Event',
    notes: 'Aim for clean lines, elevated texture and a stronger finishing piece.',
    checklist: ['Lay out full look', 'Check fit in mirror', 'Pack backup outerwear'],
  },
];

const tripTemplates: TripTemplate[] = [
  {id: 'city', title: 'City Capsule', vibe: 'City Break', duration: 3, focus: ['Arrival', 'Museum day', 'Dinner night']},
  {id: 'work', title: 'Work Travel Capsule', vibe: 'Business Trip', duration: 4, focus: ['Travel day', 'Meeting look', 'Client dinner', 'Return day']},
  {id: 'summer', title: 'Summer Escape Capsule', vibe: 'Beach Escape', duration: 5, focus: ['Arrival', 'Beach day', 'Resort lunch', 'Sunset dinner', 'Travel back']},
];

const occasionKeywords: Record<string, string[]> = {
  Workday: ['Oxford', 'Polo', 'Blazer', 'Chino', 'Trousers', 'Loafers', 'Oxford Dress'],
  Weekend: ['TShirt', 'T-Shirt', 'Denim', 'Bomber', 'Sneakers', 'Cargo', 'Bucket', 'Cap'],
  Event: ['Blazer', 'Trench', 'Dress', 'Loafers', 'Boots', 'Fedora', 'Shirt'],
  'City Break': ['Shirt', 'T-Shirt', 'Denim', 'Sneakers', 'Bomber', 'Trench', 'Cap'],
  'Business Trip': ['Oxford', 'Blazer', 'Trousers', 'Loafers', 'Trench', 'Polo'],
  'Beach Escape': ['Linen', 'Shorts', 'Sneakers', 'Cap', 'Bucket', 'Shirt'],
};

const fallbackChecklist = ['Confirm full outfit', 'Prepare footwear', 'Set aside accessories'];
const tripPackingCore = ['Pack charger and grooming kit', 'Add weather backup layer', 'Prepare one versatile pair of shoes'];

const categories: Clothing['category'][] = ['Hats', 'Tops', 'Outerwear', 'Bottoms', 'Shoes'];

const normalizeDate = (value: string) => (value ? value : new Date().toISOString().slice(0, 10));

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

const isUpcoming = (value: string) => new Date(`${value}T23:59:59`).getTime() >= Date.now();

const getSuggestedItems = (occasion: string, clothes: Clothing[]) => {
  const keywords = occasionKeywords[occasion] ?? [];
  return categories.flatMap(category => {
    const items = clothes.filter(item => item.category === category);
    const preferred = items.find(item =>
      keywords.some(keyword => `${item.name} ${item.description}`.toLowerCase().includes(keyword.toLowerCase())),
    );
    return preferred ? [preferred] : items[0] ? [items[0]] : [];
  });
};

const getTripCapsuleItems = (vibe: string, clothes: Clothing[]) => {
  const suggested = getSuggestedItems(vibe, clothes);
  const extraTop = clothes.find(item => item.category === 'Tops' && !suggested.some(piece => piece.id === item.id));
  const extraBottom = clothes.find(item => item.category === 'Bottoms' && !suggested.some(piece => piece.id === item.id));
  return [...suggested, ...(extraTop ? [extraTop] : []), ...(extraBottom ? [extraBottom] : [])];
};

const buildDailyLooks = (duration: number, focus: string[], items: Clothing[]) =>
  Array.from({length: duration}, (_, index) => ({
    day: index + 1,
    focus: focus[index] ?? `Day ${index + 1}`,
    itemIds: items.filter((_, itemIndex) => itemIndex % Math.max(duration, 2) !== index % Math.max(duration, 2) || itemIndex < 3).map(item => item.id),
  }));

const buildShareMessage = (look: PlannedLook) =>
  `${look.title}\n${look.occasion} · ${formatDate(look.date)}\n\n${look.items.map(item => `${item.category}: ${item.name}`).join('\n')}\n\nNotes: ${look.notes}`;

const buildTripShareMessage = (trip: TripPlan) =>
  `${trip.title}\n${trip.destination} · ${formatDate(trip.startDate)} · ${trip.duration} days\n\nCapsule:\n${trip.capsuleItems
    .map(item => `${item.category}: ${item.name}`)
    .join('\n')}\n\nNotes: ${trip.notes}`;

export default function SavedScreen() {
  const {
    clothes,
    saved,
    savedOutfits,
    plannedLooks,
    tripPlans,
    deleteAdvice,
    deleteSavedOutfit,
    addPlannedLook,
    updatePlannedLookStatus,
    togglePlannedLookChecklist,
    deletePlannedLook,
    addTripPlan,
    toggleTripPackedItem,
    deleteTripPlan,
  } = useStore();
  const [view, setView] = useState<ViewMode>('Planner');
  const [search, setSearch] = useState('');
  const [libraryMode, setLibraryMode] = useState<LibraryMode>('All');
  const [addingPlan, setAddingPlan] = useState(false);
  const [addingTrip, setAddingTrip] = useState(false);
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState('Workday');
  const [date, setDate] = useState('2026-08-22');
  const [notes, setNotes] = useState('');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(savedOutfits[0]?.id ?? null);
  const [tripTitle, setTripTitle] = useState('');
  const [tripDestination, setTripDestination] = useState('');
  const [tripDate, setTripDate] = useState('2026-08-22');
  const [tripDuration, setTripDuration] = useState('4');
  const [tripVibe, setTripVibe] = useState('Business Trip');
  const [tripNotes, setTripNotes] = useState('');

  const query = search.toLowerCase();
  const filteredOutfits = savedOutfits.filter(item =>
    item.items.some(piece => `${piece.category} ${piece.name} ${piece.description}`.toLowerCase().includes(query)),
  );
  const filteredAdvice = saved.filter(item => `${item.question} ${item.answer}`.toLowerCase().includes(query));
  const upcomingLooks = plannedLooks.filter(item => isUpcoming(item.date));
  const readyLooks = plannedLooks.filter(item => item.status === 'ready').length;
  const wornLooks = plannedLooks.filter(item => item.status === 'worn').length;
  const completionRate = plannedLooks.length
    ? Math.round(
        plannedLooks.reduce(
          (total, look) => total + (look.completedChecklist.length / Math.max(look.checklist.length, 1)) * 100,
          0,
        ) / plannedLooks.length,
      )
    : 0;
  const packedTrips = tripPlans.filter(
    trip => trip.packedChecklist.length === trip.packingChecklist.length && trip.packingChecklist.length > 0,
  ).length;
  const totalTripDays = tripPlans.reduce((total, trip) => total + trip.duration, 0);

  const plannerSuggestions = useMemo(
    () =>
      plannerTemplates.map(template => ({
        ...template,
        items: getSuggestedItems(template.occasion, clothes),
      })),
    [clothes],
  );

  const tripSuggestions = useMemo(
    () =>
      tripTemplates.map(template => ({
        ...template,
        capsuleItems: getTripCapsuleItems(template.vibe, clothes),
      })),
    [clothes],
  );

  const selectedSavedOutfit = savedOutfits.find(item => item.id === selectedOutfitId);

  const createPlan = (template?: PlannerTemplate) => {
    const selectedItems =
      template?.occasion
        ? getSuggestedItems(template.occasion, clothes)
        : selectedSavedOutfit?.items ?? getSuggestedItems(occasion, clothes);
    if (selectedItems.length === 0) {
      return;
    }

    addPlannedLook({
      title: (template?.title ?? title).trim() || `${occasion} Look`,
      occasion: template?.occasion ?? occasion,
      date: normalizeDate(date),
      notes: (template?.notes ?? notes).trim() || 'Prepared inside Style Planner for a smoother getting-ready routine.',
      items: selectedItems,
      checklist: template?.checklist ?? fallbackChecklist,
      completedChecklist: [],
      status: 'draft',
    });
    setAddingPlan(false);
    setTitle('');
    setNotes('');
  };

  const createTrip = (template?: TripTemplate) => {
    const vibe = template?.vibe ?? tripVibe;
    const duration = Math.max(Number(template?.duration ?? tripDuration) || 1, 1);
    const capsuleItems = getTripCapsuleItems(vibe, clothes);
    if (capsuleItems.length === 0) {
      return;
    }
    const dailyLooks = buildDailyLooks(duration, template?.focus ?? [], capsuleItems);
    const packingChecklist = [...capsuleItems.map(item => `Pack ${item.name}`), ...tripPackingCore];

    addTripPlan({
      title: (template?.title ?? tripTitle).trim() || `${vibe} Capsule`,
      destination: tripDestination.trim() || 'Upcoming trip',
      startDate: normalizeDate(tripDate),
      duration,
      vibe,
      notes: (tripNotes || 'Capsule plan built to reuse a compact set of versatile pieces across the trip.').trim(),
      capsuleItems,
      dailyLooks,
      packingChecklist,
      packedChecklist: [],
    });
    setAddingTrip(false);
    setTripTitle('');
    setTripDestination('');
    setTripNotes('');
  };

  const emptyLibrary =
    libraryMode === 'All'
      ? filteredOutfits.length === 0 && filteredAdvice.length === 0
      : libraryMode === 'Looks'
        ? filteredOutfits.length === 0
        : filteredAdvice.length === 0;

  return (
    <Screen>
      <Header
        eyebrow="STYLE PLANNER"
        title="Saved & Planned"
        action={
          <View style={s.headerActions}>
            <Pressable onPress={() => setAddingTrip(true)} style={[s.add, s.addSecondary]}>
              <Text style={s.addMiniText}>Trip</Text>
            </Pressable>
            <Pressable onPress={() => setAddingPlan(true)} style={s.add}>
              <Text style={s.addText}>＋</Text>
            </Pressable>
          </View>
        }
      />

      <View style={s.switchRow}>
        {(['Planner', 'Trips', 'Library'] as const).map(value => (
          <Pressable key={value} onPress={() => setView(value)} style={[s.switchTab, view === value && s.switchTabActive]}>
            <Text style={[s.switchTabText, view === value && s.switchTabTextActive]}>{value}</Text>
          </Pressable>
        ))}
      </View>

      {view === 'Planner' ? (
        <>
          <View style={s.metrics}>
            <View style={s.metric}><Text style={s.cardTitle}>{upcomingLooks.length}</Text><Text style={s.micro}>UPCOMING LOOKS</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{readyLooks}</Text><Text style={s.micro}>READY TO WEAR</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{completionRate}%</Text><Text style={s.micro}>PREP COMPLETION</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{wornLooks}</Text><Text style={s.micro}>LOOKS WORN</Text></View>
          </View>

          <Mentor text="Use Planner to prepare outfits ahead of time, track readiness and turn your wardrobe into a repeatable styling system instead of one-off decisions." compact />

          <Text style={s.inputLabel}>QUICK START TEMPLATES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.plannerTemplatesRow}>
            {plannerSuggestions.map(template => (
              <View key={template.id} style={s.templateCard}>
                <Text style={s.adviceTag}>{template.occasion.toUpperCase()}</Text>
                <Text style={s.cardTitle}>{template.title}</Text>
                <Text style={s.cardDescription}>{template.notes}</Text>
                <Text style={s.micro}>{template.items.length} pieces suggested from your wardrobe</Text>
                <Button compact label="Create Plan" onPress={() => createPlan(template)} />
              </View>
            ))}
          </ScrollView>

          {plannedLooks.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>✦</Text>
              <Text style={s.cardTitle}>No planned looks yet</Text>
              <Text style={s.body}>Create a plan for work, weekend or an event and StyleTwist will keep the whole outfit prep in one place.</Text>
            </View>
          ) : (
            plannedLooks.map(look => {
              const progress = `${look.completedChecklist.length}/${Math.max(look.checklist.length, 1)}`;
              return (
                <View key={look.id} style={s.planCard}>
                  <View style={s.planHeader}>
                    <View style={s.flex}>
                      <Text style={s.adviceTag}>{look.occasion.toUpperCase()}</Text>
                      <Text style={s.title}>{look.title}</Text>
                      <Text style={s.body}>{formatDate(look.date)} · {look.notes}</Text>
                    </View>
                    <View style={[s.planStatusPill, look.status === 'ready' && s.planStatusReady, look.status === 'worn' && s.planStatusWorn]}>
                      <Text style={[s.planStatusText, look.status === 'ready' && s.planStatusTextReady, look.status === 'worn' && s.planStatusTextWorn]}>{look.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedPreviewRow}>
                    {look.items.map(piece => (
                      <View key={`${look.id}-${piece.id}`} style={s.planPreviewItem}>
                        <Image source={piece.image} style={s.savedPreviewImage} />
                        <Text numberOfLines={1} style={s.micro}>{piece.name}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <View style={s.planChecklistCard}>
                    <View style={s.adviceMeta}>
                      <Text style={s.cardTitle}>Prep checklist</Text>
                      <Text style={s.goldText}>{progress}</Text>
                    </View>
                    {look.checklist.map(item => {
                      const done = look.completedChecklist.includes(item);
                      return (
                        <Pressable key={item} onPress={() => togglePlannedLookChecklist(look.id, item)} style={[s.checkRow, done && s.checkRowDone]}>
                          <Text style={[s.checkIndicator, done && s.checkIndicatorDone]}>{done ? '✓' : '○'}</Text>
                          <Text style={[s.cardDescription, done && s.checkLabelDone]}>{item}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={s.planActions}>
                    <Button compact secondary={look.status === 'ready'} label={look.status === 'ready' ? 'Marked Ready' : 'Set Ready'} onPress={() => updatePlannedLookStatus(look.id, 'ready')} />
                    <Button compact secondary={look.status === 'worn'} label={look.status === 'worn' ? 'Logged as Worn' : 'Mark Worn'} onPress={() => updatePlannedLookStatus(look.id, 'worn')} />
                  </View>

                  <View style={s.adviceActions}>
                    <Pressable onPress={() => Share.share({message: buildShareMessage(look)})}><Text style={s.goldText}>Share Plan ↗</Text></Pressable>
                    <Pressable onPress={() => Alert.alert('Delete plan?', 'This style plan will be permanently removed.', [{text: 'Cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deletePlannedLook(look.id)}])}>
                      <Text style={s.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </>
      ) : view === 'Trips' ? (
        <>
          <View style={s.metrics}>
            <View style={s.metric}><Text style={s.cardTitle}>{tripPlans.length}</Text><Text style={s.micro}>TRIP CAPSULES</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{packedTrips}</Text><Text style={s.micro}>FULLY PACKED</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{totalTripDays}</Text><Text style={s.micro}>PLANNED DAYS</Text></View>
            <View style={s.metric}><Text style={s.cardTitle}>{tripPlans.reduce((sum, trip) => sum + trip.capsuleItems.length, 0)}</Text><Text style={s.micro}>CURATED ITEMS</Text></View>
          </View>

          <Mentor text="Trip Capsule turns your wardrobe into a compact travel system: fewer pieces, more repeated combinations, and a clear packing flow before you leave." compact accent={colors.blue} />

          <Text style={s.inputLabel}>TRIP CAPSULE STARTERS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.plannerTemplatesRow}>
            {tripSuggestions.map(template => (
              <View key={template.id} style={s.templateCard}>
                <Text style={[s.adviceTag, s.tripTag]}>{template.vibe.toUpperCase()}</Text>
                <Text style={s.cardTitle}>{template.title}</Text>
                <Text style={s.cardDescription}>{template.duration} days · {template.capsuleItems.length} capsule pieces suggested from your wardrobe.</Text>
                <Button compact label="Build Capsule" onPress={() => createTrip(template)} />
              </View>
            ))}
          </ScrollView>

          {tripPlans.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>◈</Text>
              <Text style={s.cardTitle}>No trip capsules yet</Text>
              <Text style={s.body}>Build a travel capsule with day-by-day looks and a packing checklist from your existing wardrobe.</Text>
            </View>
          ) : (
            tripPlans.map(trip => (
              <View key={trip.id} style={s.tripCard}>
                <View style={s.planHeader}>
                  <View style={s.flex}>
                    <Text style={[s.adviceTag, s.tripTag]}>{trip.vibe.toUpperCase()}</Text>
                    <Text style={s.title}>{trip.title}</Text>
                    <Text style={s.body}>{trip.destination} · {formatDate(trip.startDate)} · {trip.duration} days</Text>
                  </View>
                  <View style={s.tripCounter}>
                    <Text style={s.tripCounterValue}>{trip.packedChecklist.length}/{trip.packingChecklist.length}</Text>
                    <Text style={s.micro}>PACKED</Text>
                  </View>
                </View>

                <Text style={s.cardDescription}>{trip.notes}</Text>

                <Text style={s.inputLabel}>CAPSULE PIECES</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedPreviewRow}>
                  {trip.capsuleItems.map(piece => (
                    <View key={`${trip.id}-${piece.id}`} style={s.planPreviewItem}>
                      <Image source={piece.image} style={s.savedPreviewImage} />
                      <Text numberOfLines={1} style={s.micro}>{piece.name}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={s.tripDaysCard}>
                  <Text style={s.cardTitle}>Day-by-day styling map</Text>
                  {trip.dailyLooks.map(day => (
                    <View key={`${trip.id}-${day.day}`} style={s.tripDayRow}>
                      <Text style={s.tripDayBadge}>Day {day.day}</Text>
                      <View style={s.flex}>
                        <Text style={s.cardTitle}>{day.focus}</Text>
                        <Text style={s.cardDescription}>
                          {day.itemIds
                            .map(itemId => trip.capsuleItems.find(item => item.id === itemId)?.name)
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={s.planChecklistCard}>
                  <View style={s.adviceMeta}>
                    <Text style={s.cardTitle}>Packing checklist</Text>
                    <Text style={s.goldText}>{trip.packedChecklist.length}/{trip.packingChecklist.length}</Text>
                  </View>
                  {trip.packingChecklist.map(item => {
                    const done = trip.packedChecklist.includes(item);
                    return (
                      <Pressable key={item} onPress={() => toggleTripPackedItem(trip.id, item)} style={[s.checkRow, done && s.checkRowDone]}>
                        <Text style={[s.checkIndicator, done && s.checkIndicatorDone]}>{done ? '✓' : '○'}</Text>
                        <Text style={[s.cardDescription, done && s.checkLabelDone]}>{item}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={s.adviceActions}>
                  <Pressable onPress={() => Share.share({message: buildTripShareMessage(trip)})}><Text style={s.goldText}>Share Capsule ↗</Text></Pressable>
                  <Pressable onPress={() => Alert.alert('Delete trip?', 'This trip capsule will be permanently removed.', [{text: 'Cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deleteTripPlan(trip.id)}])}>
                    <Text style={s.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </>
      ) : (
        <>
          <TextInput value={search} onChangeText={setSearch} placeholder="⌕  Search saved items..." placeholderTextColor={colors.muted} style={s.input} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
            {(['All', 'Looks', 'Advice'] as const).map(value => (
              <Pressable key={value} onPress={() => setLibraryMode(value)} style={[s.chip, libraryMode === value && s.chipActive]}>
                <Text style={[s.chipText, libraryMode === value && s.chipTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </ScrollView>
          {emptyLibrary ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>◇</Text>
              <Text style={s.cardTitle}>Nothing saved in this category</Text>
              <Text style={s.body}>Save looks from Outfit Builder or save Marco’s answers inside chat.</Text>
            </View>
          ) : (
            <>
              {(libraryMode === 'All' || libraryMode === 'Looks') && filteredOutfits.map(item => (
                <View key={item.id} style={s.adviceCard}>
                  <View style={s.adviceMeta}><Text style={s.adviceTag}>SAVED LOOK</Text><Text style={s.micro}>{new Date(item.date).toLocaleDateString()}</Text></View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedPreviewRow}>
                    {item.items.map(piece => <Image key={piece.id} source={piece.image} style={s.savedPreviewImage} />)}
                  </ScrollView>
                  <Text style={s.cardTitle}>{item.items.map(piece => piece.name).join(' · ')}</Text>
                  <Text style={s.body}>{item.items.map(piece => piece.category).join(' · ')}{item.score ? ` · Score ${item.score}/100` : ''}</Text>
                  <View style={s.adviceActions}>
                    <Pressable onPress={() => Share.share({message: `Saved Look\n\n${item.items.map(piece => `${piece.category}: ${piece.name}`).join('\n')}${item.score ? `\n\nScore: ${item.score}/100` : ''}`})}><Text style={s.goldText}>Share Look ↗</Text></Pressable>
                    <Pressable onPress={() => Alert.alert('Delete Look?', 'This saved outfit will be permanently removed.', [{text: 'Cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deleteSavedOutfit(item.id)}])}><Text style={s.deleteText}>Delete</Text></Pressable>
                  </View>
                </View>
              ))}
              {(libraryMode === 'All' || libraryMode === 'Advice') && filteredAdvice.map(item => (
                <View key={item.id} style={s.adviceCard}>
                  <View style={s.adviceMeta}><Text style={s.adviceTag}>CHAT ADVICE</Text><Text style={s.micro}>{new Date(item.date).toLocaleDateString()}</Text></View>
                  <Text style={s.cardTitle}>“{item.question}”</Text>
                  <Text style={s.body}>{item.answer}</Text>
                  <View style={s.adviceActions}>
                    <Pressable onPress={() => Share.share({message: `${item.question}\n\n${item.answer}`})}><Text style={s.goldText}>Share Advice ↗</Text></Pressable>
                    <Pressable onPress={() => Alert.alert('Delete Advice?', 'This saved answer will be permanently removed.', [{text: 'Cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deleteAdvice(item.id)}])}><Text style={s.deleteText}>Delete</Text></Pressable>
                  </View>
                </View>
              ))}
            </>
          )}
        </>
      )}

      <Modal transparent visible={addingPlan} animationType="slide" onRequestClose={() => setAddingPlan(false)}>
        <KeyboardAvoidingView style={s.modalShadeCenter} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.formSheet}>
            <View style={s.sheetHeader}>
              <Text style={s.title}>Create Style Plan</Text>
              <Pressable onPress={() => setAddingPlan(false)} style={s.close}><Text style={s.closeText}>×</Text></Pressable>
            </View>
            <ScrollView>
              <Text style={s.inputLabel}>PLAN TITLE</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Monday client look" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>OCCASION</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
                {['Workday', 'Weekend', 'Event'].map(value => (
                  <Pressable key={value} onPress={() => setOccasion(value)} style={[s.chip, occasion === value && s.chipActive]}>
                    <Text style={[s.chipText, occasion === value && s.chipTextActive]}>{value}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={s.inputLabel}>DATE</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="2026-08-22" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>SOURCE LOOK</Text>
              {savedOutfits.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.plannerTemplatesRow}>
                  {savedOutfits.map(item => (
                    <Pressable key={item.id} onPress={() => setSelectedOutfitId(item.id)} style={[s.savedOutfitSelect, selectedOutfitId === item.id && s.savedOutfitSelectActive]}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedPreviewRow}>
                        {item.items.slice(0, 3).map(piece => <Image key={piece.id} source={piece.image} style={s.savedOutfitThumb} />)}
                      </ScrollView>
                      <Text numberOfLines={2} style={s.cardDescription}>{item.items.map(piece => piece.name).join(' · ')}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : (
                <View style={s.tipCard}><Text style={s.body}>No saved outfits yet. Planner will auto-build a look from your wardrobe for the selected occasion.</Text></View>
              )}
              <Text style={s.inputLabel}>NOTES</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder="Dress code, weather notes, accessories..." placeholderTextColor={colors.muted} style={[s.input, s.inputMultiline]} multiline />
              <Button label="Create Plan" onPress={() => createPlan()} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent visible={addingTrip} animationType="slide" onRequestClose={() => setAddingTrip(false)}>
        <KeyboardAvoidingView style={s.modalShadeCenter} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.formSheet}>
            <View style={s.sheetHeader}>
              <Text style={s.title}>Create Trip Capsule</Text>
              <Pressable onPress={() => setAddingTrip(false)} style={s.close}><Text style={s.closeText}>×</Text></Pressable>
            </View>
            <ScrollView>
              <Text style={s.inputLabel}>TRIP TITLE</Text>
              <TextInput value={tripTitle} onChangeText={setTripTitle} placeholder="e.g. Milan work trip" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>DESTINATION</Text>
              <TextInput value={tripDestination} onChangeText={setTripDestination} placeholder="City or destination" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>TRAVEL VIBE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
                {['Business Trip', 'City Break', 'Beach Escape'].map(value => (
                  <Pressable key={value} onPress={() => setTripVibe(value)} style={[s.chip, tripVibe === value && s.chipActive]}>
                    <Text style={[s.chipText, tripVibe === value && s.chipTextActive]}>{value}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={s.inputLabel}>START DATE</Text>
              <TextInput value={tripDate} onChangeText={setTripDate} placeholder="2026-08-22" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>DURATION IN DAYS</Text>
              <TextInput value={tripDuration} onChangeText={setTripDuration} keyboardType="number-pad" placeholder="4" placeholderTextColor={colors.muted} style={s.input} />
              <Text style={s.inputLabel}>NOTES</Text>
              <TextInput value={tripNotes} onChangeText={setTripNotes} placeholder="Dress code, season, meeting schedule..." placeholderTextColor={colors.muted} style={[s.input, s.inputMultiline]} multiline />
              <Button label="Create Trip Capsule" onPress={() => createTrip()} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
