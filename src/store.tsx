import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ImageSourcePropType} from 'react-native';
import {Clothing, initialClothes} from './data/clothing';

export type SavedAdvice = {id: string; question: string; answer: string; date: string};
export type SavedOutfit = {id: string; date: string; items: Clothing[]; score?: number};
export type QuizAttempt = {id: string; date: string; score: number; duration: number};
export type PlannerStatus = 'draft' | 'ready' | 'worn';
export type PlannedLook = {
  id: string;
  title: string;
  occasion: string;
  date: string;
  notes: string;
  items: Clothing[];
  checklist: string[];
  completedChecklist: string[];
  status: PlannerStatus;
};
export type TripPlan = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  duration: number;
  vibe: string;
  notes: string;
  capsuleItems: Clothing[];
  dailyLooks: Array<{day: number; focus: string; itemIds: string[]}>;
  packingChecklist: string[];
  packedChecklist: string[];
};

type Store = {
  hydrated: boolean;
  clothes: Clothing[];
  saved: SavedAdvice[];
  savedOutfits: SavedOutfit[];
  favorites: string[];
  attempts: QuizAttempt[];
  plannedLooks: PlannedLook[];
  tripPlans: TripPlan[];
  onboardingDone: boolean;
  addClothing: (value: Omit<Clothing, 'id' | 'custom'>) => void;
  deleteClothing: (id: string) => void;
  saveAdvice: (question: string, answer: string) => void;
  deleteAdvice: (id: string) => void;
  saveOutfit: (items: Clothing[], score?: number) => void;
  deleteSavedOutfit: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addAttempt: (score: number, duration: number) => void;
  clearAttempts: () => void;
  addPlannedLook: (value: Omit<PlannedLook, 'id'>) => void;
  updatePlannedLookStatus: (id: string, status: PlannerStatus) => void;
  togglePlannedLookChecklist: (id: string, item: string) => void;
  deletePlannedLook: (id: string) => void;
  addTripPlan: (value: Omit<TripPlan, 'id'>) => void;
  toggleTripPackedItem: (id: string, item: string) => void;
  deleteTripPlan: (id: string) => void;
  finishOnboarding: () => void;
};

const Context = createContext<Store | null>(null);
const key = '@style_twist_state_v1';

export function StoreProvider({children}: {children: React.ReactNode}) {
  const [hydrated, setHydrated] = useState(false);
  const [clothes, setClothes] = useState(initialClothes);
  const [saved, setSaved] = useState<SavedAdvice[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [plannedLooks, setPlannedLooks] = useState<PlannedLook[]>([]);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then(value => {
      if (value) {
        const parsed = JSON.parse(value) as {
          clothes?: Array<Omit<Clothing, 'image'> & {uri?: string}>;
          saved?: SavedAdvice[];
          savedOutfits?: SavedOutfit[];
          favorites?: string[];
          attempts?: QuizAttempt[];
          plannedLooks?: PlannedLook[];
          tripPlans?: TripPlan[];
          onboardingDone?: boolean;
        };
        if (parsed.clothes) {
          const custom = parsed.clothes.filter(item => item.custom && item.uri).map(item => ({
            ...item,
            image: {uri: item.uri as string} as ImageSourcePropType,
          }));
          setClothes([...initialClothes, ...custom]);
        }
        setSaved(parsed.saved ?? []);
        setSavedOutfits(parsed.savedOutfits ?? []);
        setFavorites(parsed.favorites ?? []);
        setAttempts(parsed.attempts ?? []);
        setPlannedLooks(parsed.plannedLooks ?? []);
        setTripPlans(parsed.tripPlans ?? []);
        setOnboardingDone(parsed.onboardingDone ?? false);
      }
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const customClothes = clothes.filter(item => item.custom).map(item => ({
      ...item,
      image: undefined,
      uri: typeof item.image === 'object' && 'uri' in item.image ? item.image.uri : undefined,
    }));
    AsyncStorage.setItem(key, JSON.stringify({clothes: customClothes, saved, savedOutfits, favorites, attempts, plannedLooks, tripPlans, onboardingDone}));
  }, [attempts, clothes, favorites, hydrated, onboardingDone, plannedLooks, saved, savedOutfits, tripPlans]);

  const value = useMemo<Store>(() => ({
    hydrated,
    clothes,
    saved,
    savedOutfits,
    favorites,
    attempts,
    plannedLooks,
    tripPlans,
    onboardingDone,
    addClothing: item => setClothes(current => [...current, {...item, id: `custom-${Date.now()}`, custom: true}]),
    deleteClothing: id => setClothes(current => current.filter(item => item.id !== id || !item.custom)),
    saveAdvice: (question, answer) => setSaved(current => current.some(item => item.question === question && item.answer === answer) ? current : [{id: `${Date.now()}`, question, answer, date: new Date().toISOString()}, ...current]),
    deleteAdvice: id => setSaved(current => current.filter(item => item.id !== id)),
    saveOutfit: (items, score) => setSavedOutfits(current => {
      const ids = items.map(item => item.id).sort().join('|');
      return current.some(outfit => outfit.items.map(item => item.id).sort().join('|') === ids)
        ? current
        : [{id: `${Date.now()}`, date: new Date().toISOString(), items, score}, ...current];
    }),
    deleteSavedOutfit: id => setSavedOutfits(current => current.filter(item => item.id !== id)),
    toggleFavorite: id => setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [id, ...current]),
    addAttempt: (score, duration) => setAttempts(current => [{id: `${Date.now()}`, date: new Date().toISOString(), score, duration}, ...current]),
    clearAttempts: () => setAttempts([]),
    addPlannedLook: value => setPlannedLooks(current => [{...value, id: `${Date.now()}`}, ...current].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
    updatePlannedLookStatus: (id, status) => setPlannedLooks(current => current.map(item => item.id === id ? {...item, status} : item)),
    togglePlannedLookChecklist: (id, item) => setPlannedLooks(current => current.map(look => {
      if (look.id !== id) {
        return look;
      }
      const completedChecklist = look.completedChecklist.includes(item)
        ? look.completedChecklist.filter(value => value !== item)
        : [...look.completedChecklist, item];
      return {...look, completedChecklist};
    })),
    deletePlannedLook: id => setPlannedLooks(current => current.filter(item => item.id !== id)),
    addTripPlan: value => setTripPlans(current => [{...value, id: `${Date.now()}`}, ...current].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())),
    toggleTripPackedItem: (id, item) => setTripPlans(current => current.map(plan => {
      if (plan.id !== id) {
        return plan;
      }
      const packedChecklist = plan.packedChecklist.includes(item)
        ? plan.packedChecklist.filter(value => value !== item)
        : [...plan.packedChecklist, item];
      return {...plan, packedChecklist};
    })),
    deleteTripPlan: id => setTripPlans(current => current.filter(item => item.id !== id)),
    finishOnboarding: () => setOnboardingDone(true),
  }), [attempts, clothes, favorites, hydrated, onboardingDone, plannedLooks, saved, savedOutfits, tripPlans]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useStore = () => {
  const value = useContext(Context);
  if (!value) {
    throw new Error('StoreProvider is missing');
  }
  return value;
};
