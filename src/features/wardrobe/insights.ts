import {categories, Category, Clothing} from '../../data/clothing';

export type CategoryCoverage = {
  category: Category;
  count: number;
  recommended: number;
  /** 0..1 fill ratio toward the recommended minimum. */
  ratio: number;
  met: boolean;
};

export type EssentialStatus = {
  label: string;
  category: Category;
  present: boolean;
};

export type ColorShare = {color: string; count: number};

export type WardrobeInsights = {
  total: number;
  balanceScore: number;
  coverage: CategoryCoverage[];
  essentials: EssentialStatus[];
  missingEssentials: EssentialStatus[];
  topColors: ColorShare[];
  tips: string[];
};

const RECOMMENDED: Record<Category, number> = {
  Hats: 1,
  Tops: 4,
  Outerwear: 3,
  Bottoms: 3,
  Shoes: 3,
};

type EssentialDef = {label: string; category: Category; keywords: string[]};

const ESSENTIALS: EssentialDef[] = [
  {label: 'Crisp white shirt', category: 'Tops', keywords: ['oxford', 'white shirt']},
  {label: 'Plain T-shirt', category: 'Tops', keywords: ['t-shirt', 'tshirt', 'tee']},
  {label: 'Knit sweater', category: 'Tops', keywords: ['knit', 'sweater']},
  {label: 'Tailored blazer', category: 'Outerwear', keywords: ['blazer']},
  {label: 'Versatile jacket', category: 'Outerwear', keywords: ['jacket', 'bomber', 'trench']},
  {label: 'Dark jeans', category: 'Bottoms', keywords: ['jeans', 'denim']},
  {label: 'Tailored trousers', category: 'Bottoms', keywords: ['trousers', 'chino']},
  {label: 'Clean sneakers', category: 'Shoes', keywords: ['sneakers']},
  {label: 'Dress shoes', category: 'Shoes', keywords: ['oxford', 'loafers', 'dress']},
  {label: 'Leather boots', category: 'Shoes', keywords: ['boots']},
];

const matches = (item: Clothing, keywords: string[]) => {
  const haystack = `${item.name} ${item.description}`.toLowerCase();
  return keywords.some(keyword => haystack.includes(keyword));
};

export function computeWardrobeInsights(clothes: Clothing[]): WardrobeInsights {
  const coverage: CategoryCoverage[] = categories.map(category => {
    const count = clothes.filter(item => item.category === category).length;
    const recommended = RECOMMENDED[category];
    return {
      category,
      count,
      recommended,
      ratio: Math.min(1, count / recommended),
      met: count >= recommended,
    };
  });

  const essentials: EssentialStatus[] = ESSENTIALS.map(def => ({
    label: def.label,
    category: def.category,
    present: clothes.some(item => item.category === def.category && matches(item, def.keywords)),
  }));
  const missingEssentials = essentials.filter(essential => !essential.present);

  const colorCounts = new Map<string, number>();
  clothes.forEach(item =>
    item.styleNotes.colors.forEach(color => {
      colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1);
    }),
  );
  const topColors = Array.from(colorCounts.entries())
    .map(([color, count]) => ({color, count}))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const essentialsRatio = essentials.length
    ? essentials.filter(essential => essential.present).length / essentials.length
    : 0;
  const categoriesMetRatio = coverage.length
    ? coverage.filter(entry => entry.met).length / coverage.length
    : 0;
  const balanceScore = Math.round(essentialsRatio * 60 + categoriesMetRatio * 40);

  const tips: string[] = [];
  const weakestCategory = [...coverage].sort((a, b) => a.ratio - b.ratio)[0];
  if (weakestCategory && !weakestCategory.met) {
    tips.push(
      `Your ${weakestCategory.category.toLowerCase()} are the thinnest part of your wardrobe — adding one or two versatile pieces will unlock more complete outfits.`,
    );
  }
  if (missingEssentials.length > 0) {
    tips.push(
      `You are missing ${missingEssentials.length} staple${missingEssentials.length > 1 ? 's' : ''}. Start with the ${missingEssentials[0].label.toLowerCase()} — it pairs with almost everything you already own.`,
    );
  }
  if (topColors.length > 0 && topColors[0].count >= Math.max(3, Math.round(clothes.length / 2))) {
    tips.push(
      `Your palette leans heavily on ${topColors[0].color.toLowerCase()}. One contrasting accent colour would make your looks feel more intentional.`,
    );
  }
  if (tips.length === 0) {
    tips.push('Your wardrobe is well balanced across categories and essentials. Focus on fit and finishing details to level up.');
  }

  return {
    total: clothes.length,
    balanceScore,
    coverage,
    essentials,
    missingEssentials,
    topColors,
    tips,
  };
}
