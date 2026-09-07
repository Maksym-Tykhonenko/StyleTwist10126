import {ImageSourcePropType} from 'react-native';

type TrendStory = {
  id: string;
  year: '2026' | '2027';
  title: string;
  label: string;
  image: ImageSourcePropType;
  summary: string;
  direction: string[];
  colors: string[];
  wardrobeMoves: string[];
  stylingNote: string;
};

export const trendStories: TrendStory[] = [
  {
    id: '2026-color-confidence',
    year: '2026',
    title: 'Color Returns With Confidence',
    label: 'NOW',
    image: require('../assets/trend-2026-color-confidence.png'),
    summary:
      '2026 menswear moved away from ultra-safe neutrals and leaned into stronger color stories: cobalt, burgundy, butter yellow, peach accents and richer jewel tones.',
    direction: [
      'Use one vivid accent against a clean neutral base.',
      'Let tailoring stay sharp while color does the talking.',
      'Repeat one strong tone in shoes, knitwear or accessories.',
    ],
    colors: ['Cobalt', 'Burgundy', 'Butter yellow', 'Peach', 'Turquoise'],
    wardrobeMoves: [
      'Swap a black knit for a deep blue or wine version.',
      'Use one colored jacket over monochrome basics.',
      'Keep trousers neutral when the upper half is brighter.',
    ],
    stylingNote:
      'The key is controlled intensity: one bold color looks modern, too many competing shades look chaotic.',
  },
  {
    id: '2026-leaner-silhouette',
    year: '2026',
    title: 'The Silhouette Gets Leaner Again',
    label: 'NOW',
    image: require('../assets/trend-2026-lean-silhouette.png'),
    summary:
      'After several seasons of oversized dominance, 2026 pushed menswear toward a cleaner, leaner line: higher waists, sharper trousers, closer tops and more body-aware tailoring.',
    direction: [
      'Cleaner vertical lines beat extra bulk.',
      'Tops are slightly shorter and more precise.',
      'Trousers feel sharper through the hip and leg.',
    ],
    colors: ['Charcoal', 'Navy', 'Cloud white', 'Black', 'Espresso'],
    wardrobeMoves: [
      'Tailor denim and trousers for a cleaner break.',
      'Choose jackets with clearer shoulder shape.',
      'Use fitted knits under coats instead of bulky layers.',
    ],
    stylingNote:
      'This trend works best when the fit looks intentional, not tight. Think sharpened proportions, not compression.',
  },
  {
    id: '2026-prep-utility-mix',
    year: '2026',
    title: 'Prep 3.0 Meets Utility',
    label: 'NOW',
    image: require('../assets/trend-2026-prep-utility.png'),
    summary:
      'Another strong 2026 direction was the collision of preppy polish and practical gear: polos with cargo-inspired trousers, field layers with refined knitwear, and sporty pieces cleaned up through styling.',
    direction: [
      'Mix polished and practical elements in one outfit.',
      'Use heritage pieces with more modern footwear.',
      'Keep the palette grounded when textures multiply.',
    ],
    colors: ['Olive', 'Navy', 'Stone', 'Cream', 'Rust'],
    wardrobeMoves: [
      'Pair chinos or cargos with refined knit polos.',
      'Use loafers or sleek sneakers to modernize utility pants.',
      'Layer a trench or overshirt over sporty basics.',
    ],
    stylingNote:
      'The mix feels expensive when one half of the outfit is disciplined enough to balance the more relaxed half.',
  },
  {
    id: '2027-expressive-accessories',
    year: '2027',
    title: 'Expressive Accessories Take Over',
    label: 'NEXT',
    image: require('../assets/trend-2027-accessories.png'),
    summary:
      'Spring 2027 previews suggest accessories will become more character-driven: hoop earrings, bolder neck details, sharper eyewear and finishing pieces that define personality faster than logos.',
    direction: [
      'Accessories become identity markers, not afterthoughts.',
      'Jewelry gets more visible but stays curated.',
      'One standout finishing piece can carry a minimal outfit.',
    ],
    colors: ['Silver', 'Gold', 'Onyx', 'Tortoise', 'Deep red'],
    wardrobeMoves: [
      'Add one strong metal accent to a clean outfit.',
      'Use eyewear or neckwear as the visual focal point.',
      'Keep clothing simpler when accessories are more expressive.',
    ],
    stylingNote:
      'This is a forecast based on 2027 runway movement already visible in current coverage, so use it as directional inspiration rather than a fixed rule.',
  },
  {
    id: '2027-playful-layering',
    year: '2027',
    title: 'Layering Gets More Playful',
    label: 'NEXT',
    image: require('../assets/trend-2026-prep-utility.png'),
    summary:
      'Early 2027 signals point toward more playful styling: long shorts, nautical notes, soft drape, visible layering and unexpected texture combinations that feel lighter and more creative.',
    direction: [
      'Styling becomes less rigid and more exploratory.',
      'Longer shorts and airy layers build movement.',
      'Texture and overlap become as important as color.',
    ],
    colors: ['Sea blue', 'Sand', 'Soft grey', 'Cherry red', 'Cream'],
    wardrobeMoves: [
      'Try lighter layers with more visible contrast between lengths.',
      'Use one soft tailoring piece with one casual summer piece.',
      'Build outfits that move instead of staying completely rigid.',
    ],
    stylingNote:
      'This direction is best approached through layering and proportion first, then color second.',
  },
  {
    id: '2027-levity',
    year: '2027',
    title: 'Lightness, Levity, and Smarter Color Pairing',
    label: 'NEXT',
    image: require('../assets/trend-2026-color-confidence.png'),
    summary:
      'The runway mood heading into 2027 suggests more levity: brighter off-shades, clearer color play, less visual heaviness and a wardrobe that feels less severe even when still tailored.',
    direction: [
      'Offbeat color pairings feel fresher than all-black formulas.',
      'Pastels and odd-but-smart combinations keep growing.',
      'Tailoring stays relevant, but the mood softens.',
    ],
    colors: ['Pastel blue', 'Barbie pink accents', 'Camel', 'Power navy', 'Soft violet'],
    wardrobeMoves: [
      'Break up neutrals with one lighter, unexpected accent.',
      'Use pastel accessories before full pastel tailoring.',
      'Keep structure in the outfit but lighten the palette.',
    ],
    stylingNote:
      'This 2027 section is an informed forecast from current runway and editorial reporting, not a guaranteed final-season checklist.',
  },
];

export const trendSources = [
  {
    title: 'Vogue: All the Fall 2026 Men’s Trends',
    url: 'https://www.vogue.com/article/all-the-fall-2026-mens-trends-from-cortina-ready-sweaters-to-paul-poiret-isms-to-prep-30',
  },
  {
    title: 'Vogue: Spring 2026 menswear trend report',
    url: 'https://www.vogue.com/article/spring-2026-menswear-trend-report',
  },
  {
    title: 'Vogue: A new menswear silhouette is emerging',
    url: 'https://www.vogue.com/article/new-menswear-silhouette-slim-skinny',
  },
  {
    title: 'Vogue: Goodbye, ’90s Minimalism—Color Is So Back',
    url: 'https://www.vogue.com/article/goodbye-90s-minimalism-color-is-so-back',
  },
  {
    title: 'Vogue: Fall 2026 color trends',
    url: 'https://www.vogue.com/article/fall-2026-color-trends',
  },
];
