import {ImageSourcePropType} from 'react-native';

export type Category = 'Hats' | 'Tops' | 'Outerwear' | 'Bottoms' | 'Shoes';

export type Clothing = {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: ImageSourcePropType;
  styleNotes: {
    worksWith: string[];
    bestFor: string[];
    colors: string[];
    stylingTip: string;
  };
  custom?: boolean;
};

const asset = (name: string): ImageSourcePropType => {
  const images: Record<string, ImageSourcePropType> = {
    ClassicFedora: require('../assets/clothing/hats/ClassicFedora.png'),
    WoolBeanie: require('../assets/clothing/hats/WoolBeanie.png'),
    BaseballCap: require('../assets/clothing/hats/BaseballCap.png'),
    FlatCap: require('../assets/clothing/hats/FlatCap.png'),
    BucketHat: require('../assets/clothing/hats/BucketHat.png'),
    WhiteOxfordShirt: require('../assets/clothing/tops/WhiteOxfordShirt.png'),
    BasicBlackTShirt: require('../assets/clothing/tops/BasicBlackTShirt.png'),
    ClassicPoloShirt: require('../assets/clothing/tops/ClassicPoloShirt.png'),
    LinenButtonShirt: require('../assets/clothing/tops/LinenButtonShirt.png'),
    KnitCrewSweater: require('../assets/clothing/tops/KnitCrewSweater.png'),
    TailoredBlazer: require('../assets/clothing/outerwear/TailoredBlazer.png'),
    ClassicLeatherJacket: require('../assets/clothing/outerwear/ClassicLeatherJacket.png'),
    DenimTruckerJacket: require('../assets/clothing/outerwear/DenimTruckerJacket.png'),
    TimelessTrenchCoat: require('../assets/clothing/outerwear/TimelessTrenchCoat.png'),
    ModernBomberJacket: require('../assets/clothing/outerwear/ModernBomberJacket.png'),
    SlimFitJeans: require('../assets/clothing/bottoms/SlimFitJeans.png'),
    ClassicChinoPants: require('../assets/clothing/bottoms/ClassicChinoPants.png'),
    TailoredDressTrousers: require('../assets/clothing/bottoms/TailoredDressTrousers.png'),
    UtilityCargoPants: require('../assets/clothing/bottoms/UtilityCargoPants.png'),
    LinenSummerShorts: require('../assets/clothing/bottoms/LinenSummerShorts.png'),
    WhiteLeatherSneakers: require('../assets/clothing/shoes/WhiteLeatherSneakers.png'),
    ClassicLeatherLoafers: require('../assets/clothing/shoes/ClassicLeatherLoafers.png'),
    ChelseaLeatherBoots: require('../assets/clothing/shoes/ChelseaLeatherBoots.png'),
    OxfordDressShoes: require('../assets/clothing/shoes/OxfordDressShoes.png'),
    PerformanceRunningSneakers: require('../assets/clothing/shoes/PerformanceRunningSneakers.png'),
  };
  return images[name];
};

const catalog: Array<[string, Category, string, Clothing['styleNotes']]> = [
  ['ClassicFedora', 'Hats', 'Timeless felt hat with a structured brim.', {worksWith: ['Tailored coats', 'Blazers', 'Chelsea boots'], bestFor: ['Classic', 'Smart casual', 'Refined evening looks'], colors: ['Black', 'Camel', 'Charcoal', 'Burgundy'], stylingTip: 'Use it as the only statement accessory and keep the rest of the look clean and structured.'}],
  ['WoolBeanie', 'Hats', 'Soft knitted beanie for casual outfits.', {worksWith: ['Crew sweaters', 'Bomber jackets', 'Sneakers'], bestFor: ['Casual', 'Streetwear', 'Winter basics'], colors: ['Grey', 'Cream', 'Olive', 'Navy'], stylingTip: 'Best with soft textures and relaxed silhouettes, especially when the palette stays tonal.'}],
  ['BaseballCap', 'Hats', 'Minimal cotton cap for everyday wear.', {worksWith: ['T-shirts', 'Denim jackets', 'Cargo pants'], bestFor: ['Casual', 'Sporty', 'Athleisure'], colors: ['Navy', 'White', 'Black', 'Forest green'], stylingTip: 'Let the cap repeat a tone already present in your shoes or outerwear.'}],
  ['FlatCap', 'Hats', 'Classic tailored cap with a vintage look.', {worksWith: ['Trench coats', 'Wool trousers', 'Loafers'], bestFor: ['Heritage', 'Smart casual', 'Vintage-inspired outfits'], colors: ['Charcoal', 'Brown', 'Olive', 'Taupe'], stylingTip: 'Pair it with textured layers like wool or tweed so it feels intentional instead of costume-like.'}],
  ['BucketHat', 'Hats', 'Relaxed bucket hat for modern streetwear.', {worksWith: ['Overshirts', 'Cargo pants', 'Chunky sneakers'], bestFor: ['Streetwear', 'Weekend', 'Festival looks'], colors: ['Black', 'Khaki', 'Sand', 'Off-white'], stylingTip: 'Works best when the rest of the outfit has a looser silhouette and one sporty element.'}],
  ['WhiteOxfordShirt', 'Tops', 'Crisp button-up shirt for versatile styling.', {worksWith: ['Chinos', 'Blazers', 'Loafers'], bestFor: ['Business casual', 'Classic', 'Minimal'], colors: ['Navy', 'Grey', 'Camel', 'Black'], stylingTip: 'A white Oxford sharpens almost any outfit, especially with darker trousers and clean shoes.'}],
  ['BasicBlackTShirt', 'Tops', 'Soft cotton essential for daily outfits.', {worksWith: ['Jeans', 'Leather jackets', 'Sneakers'], bestFor: ['Minimal', 'Casual', 'Edgy basics'], colors: ['Black', 'Stone', 'Blue denim', 'Olive'], stylingTip: 'Keep the fit sharp and use it as a clean base for outerwear or metallic accessories.'}],
  ['ClassicPoloShirt', 'Tops', 'Smart-casual polo with a clean fit.', {worksWith: ['Chinos', 'Tailored shorts', 'Loafers'], bestFor: ['Preppy', 'Smart casual', 'Resort looks'], colors: ['Navy', 'White', 'Beige', 'Bottle green'], stylingTip: 'Looks strongest tucked or half-tucked with a belt and streamlined shoes.'}],
  ['LinenButtonShirt', 'Tops', 'Lightweight shirt ideal for warm weather.', {worksWith: ['Linen shorts', 'White sneakers', 'Trench on cool evenings'], bestFor: ['Summer', 'Resort', 'Relaxed smart casual'], colors: ['White', 'Sky blue', 'Sand', 'Terracotta'], stylingTip: 'Lean into breathable fabrics and soft neutrals to make the linen texture look premium.'}],
  ['KnitCrewSweater', 'Tops', 'Comfortable crewneck sweater for layering.', {worksWith: ['Oxford shirts', 'Jeans', 'Chelsea boots'], bestFor: ['Layered basics', 'Autumn looks', 'Quiet luxury'], colors: ['Cream', 'Grey', 'Navy', 'Chocolate'], stylingTip: 'Layer it over a collared shirt or under a tailored coat for a polished seasonal outfit.'}],
  ['TailoredBlazer', 'Outerwear', 'Elegant blazer suitable for formal looks.', {worksWith: ['Oxford shirts', 'Dress trousers', 'Loafers'], bestFor: ['Business', 'Formal', 'Elegant smart casual'], colors: ['Navy', 'Charcoal', 'White', 'Muted blue'], stylingTip: 'Anchor the look with sharp trousers and repeat the blazer tone in your shoes or belt.'}],
  ['ClassicLeatherJacket', 'Outerwear', 'Classic leather jacket with modern styling.', {worksWith: ['Black T-shirts', 'Jeans', 'Boots'], bestFor: ['Edgy', 'Urban', 'Night-out outfits'], colors: ['Black', 'White', 'Grey', 'Dark denim'], stylingTip: 'Keep the rest of the outfit simple so the jacket carries the attitude without visual noise.'}],
  ['DenimTruckerJacket', 'Outerwear', 'Casual denim layer for everyday outfits.', {worksWith: ['T-shirts', 'Chinos', 'Sneakers'], bestFor: ['Casual', 'Weekend', 'Workwear-inspired looks'], colors: ['White', 'Black', 'Tan', 'Olive'], stylingTip: 'Avoid too many competing washes and balance denim with clean neutral basics.'}],
  ['TimelessTrenchCoat', 'Outerwear', 'Long timeless coat with refined details.', {worksWith: ['Oxford shirts', 'Knit sweaters', 'Loafers or boots'], bestFor: ['Classic', 'Business casual', 'Transitional weather'], colors: ['Camel', 'White', 'Navy', 'Espresso'], stylingTip: 'Best over layered neutrals with a clean vertical silhouette underneath.'}],
  ['ModernBomberJacket', 'Outerwear', 'Sporty lightweight jacket with ribbed cuffs.', {worksWith: ['Beanies', 'T-shirts', 'Sneakers'], bestFor: ['Street casual', 'Weekend', 'Sporty looks'], colors: ['Black', 'Grey', 'Olive', 'Cream'], stylingTip: 'Pair it with tapered bottoms so the proportions stay modern and not bulky.'}],
  ['SlimFitJeans', 'Bottoms', 'Dark denim jeans with a modern fit.', {worksWith: ['T-shirts', 'Blazers', 'Sneakers or boots'], bestFor: ['Casual', 'Smart casual', 'Night looks'], colors: ['White', 'Black', 'Grey', 'Camel'], stylingTip: 'Dark denim can bridge casual and elevated looks, especially with sharper shoes.'}],
  ['ClassicChinoPants', 'Bottoms', 'Smart casual cotton trousers.', {worksWith: ['Polo shirts', 'Oxford shirts', 'Loafers'], bestFor: ['Office casual', 'Preppy', 'Weekend smart'], colors: ['Navy', 'White', 'Olive', 'Burgundy'], stylingTip: 'Roll the hem lightly with sneakers or keep it clean and pressed with loafers.'}],
  ['TailoredDressTrousers', 'Bottoms', 'Elegant pants for business and formal wear.', {worksWith: ['Blazers', 'Oxford shirts', 'Dress shoes'], bestFor: ['Formal', 'Business', 'Elegant minimal'], colors: ['White', 'Blue', 'Charcoal', 'Black'], stylingTip: 'Use them to create long, clean lines and avoid overly casual tops unless styling intentionally high-low.'}],
  ['UtilityCargoPants', 'Bottoms', 'Functional pants with multiple pockets.', {worksWith: ['Caps', 'Bomber jackets', 'Chunky sneakers'], bestFor: ['Streetwear', 'Utility', 'Casual weekend'], colors: ['Black', 'Olive', 'Stone', 'Grey'], stylingTip: 'Balance the volume with a fitted or cropped top layer so the outfit stays intentional.'}],
  ['LinenSummerShorts', 'Bottoms', 'Breathable shorts for summer outfits.', {worksWith: ['Linen shirts', 'Polos', 'White sneakers or loafers'], bestFor: ['Summer', 'Resort', 'Relaxed city looks'], colors: ['White', 'Sand', 'Sky blue', 'Olive'], stylingTip: 'They look best with airy fabrics and a restrained warm-weather palette.'}],
  ['WhiteLeatherSneakers', 'Shoes', 'Clean sneakers suitable for almost any outfit.', {worksWith: ['Jeans', 'Chinos', 'Bomber jackets', 'T-shirts'], bestFor: ['Minimal', 'Casual', 'Smart casual'], colors: ['Navy', 'Black', 'Grey', 'Beige'], stylingTip: 'Keep them clean and let them brighten darker outfits or balance tailored separates.'}],
  ['ClassicLeatherLoafers', 'Shoes', 'Slip-on shoes with a sophisticated appearance.', {worksWith: ['Chinos', 'Dress trousers', 'Polos'], bestFor: ['Preppy', 'Business casual', 'Elegant summer'], colors: ['Navy', 'Cream', 'Camel', 'Olive'], stylingTip: 'Show a little ankle or a clean trouser break to keep loafers looking modern.'}],
  ['ChelseaLeatherBoots', 'Shoes', 'Sleek ankle boots with elastic side panels.', {worksWith: ['Jeans', 'Trench coats', 'Leather jackets'], bestFor: ['Modern classic', 'Urban', 'Autumn styling'], colors: ['Black', 'Charcoal', 'Camel', 'Dark olive'], stylingTip: 'Use them to sharpen slim trousers or dark denim without adding too much detail.'}],
  ['OxfordDressShoes', 'Shoes', 'Classic lace-up shoes for formal occasions.', {worksWith: ['Dress trousers', 'Blazers', 'Oxford shirts'], bestFor: ['Formal', 'Business', 'Ceremony looks'], colors: ['Charcoal', 'Navy', 'White', 'Burgundy'], stylingTip: 'They work best when the rest of the outfit is crisp, structured and well-fitted.'}],
  ['PerformanceRunningSneakers', 'Shoes', 'Comfortable athletic shoes for casual wear.', {worksWith: ['Joggers', 'Caps', 'Bomber jackets'], bestFor: ['Athleisure', 'Sporty casual', 'Travel looks'], colors: ['Black', 'Grey', 'Electric blue', 'White'], stylingTip: 'Keep the outfit technical or relaxed so the sneakers feel integrated, not random.'}],
];

export const initialClothes: Clothing[] = catalog.map(([name, category, description, styleNotes]) => ({
  id: name,
  name: name.replace(/([a-z])([A-Z])/g, '$1 $2'),
  category,
  description,
  styleNotes,
  image: asset(name),
}));

export const categories: Category[] = ['Hats', 'Tops', 'Outerwear', 'Bottoms', 'Shoes'];
