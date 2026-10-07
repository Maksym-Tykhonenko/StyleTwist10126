import {categories, Clothing} from '../../data/clothing';

export type TodaysLook = {
  dateKey: string;
  focus: string;
  note: string;
  items: Clothing[];
};

const focuses = [
  'Clean & Confident',
  'Smart Casual Edge',
  'Quiet Luxury',
  'Weekend Ease',
  'Modern Classic',
  'Textured Neutrals',
  'Effortless Polish',
];

const notes = [
  'A balanced, intentional look for today. Keep the palette controlled and let one piece lead.',
  'Lean into fit over flash — sharp proportions make this combination read expensive.',
  'Repeat one tone from your shoes in a small detail and the whole look clicks together.',
  'Relaxed but considered. Perfect when you want to look sharp without overthinking it.',
  'A dependable, timeless pairing. Add a watch or belt to finish it cleanly.',
];

/** Stable per-day seed so the look is identical all day and rotates each date. */
const seedFromDate = (dateKey: string) => {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % 2147483647;
  }
  return hash;
};

export const todaysDateKey = (date: Date = new Date()) =>
  date.toISOString().slice(0, 10);

/**
 * Picks one piece per category from the wardrobe, deterministically seeded by
 * the date, so every user sees a fresh "look of the day" that is stable until
 * midnight. Returns null until the wardrobe can fill the full look.
 */
export function getTodaysLook(clothes: Clothing[], date: Date = new Date()): TodaysLook | null {
  const dateKey = todaysDateKey(date);
  const seed = seedFromDate(dateKey);

  const items = categories
    .map((category, index) => {
      const options = clothes.filter(item => item.category === category);
      if (options.length === 0) {
        return undefined;
      }
      return options[(seed + index * 7) % options.length];
    })
    .filter(Boolean) as Clothing[];

  if (items.length < categories.length) {
    return null;
  }

  return {
    dateKey,
    focus: focuses[seed % focuses.length],
    note: notes[seed % notes.length],
    items,
  };
}
