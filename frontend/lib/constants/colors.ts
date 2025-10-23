// Shared color palette for the FemPunk NüShu platform
// This ensures consistency across all components that use colors

export interface ColorDefinition {
  id: string;
  hex: string;
  name: string;
  nameEn: string;
  category: 'red' | 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'brown' | 'gray';
  available: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
}

// Complete color palette (64 colors as specified in design)
export const COLOR_PALETTE: ColorDefinition[] = [
  // Reds (女书红系)
  { 
    id: 'red-1', 
    hex: '#FF6B9D', 
    name: '女书红', 
    nameEn: 'NuShu Red',
    category: 'red', 
    available: true, 
    rarity: 'legendary' 
  },
  { 
    id: 'red-2', 
    hex: '#FF4757', 
    name: '朱砂红', 
    nameEn: 'Cinnabar Red',
    category: 'red', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'red-3', 
    hex: '#FF3838', 
    name: '胭脂红', 
    nameEn: 'Rouge Red',
    category: 'red', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'red-4', 
    hex: '#FF6B35', 
    name: '橘红', 
    nameEn: 'Orange Red',
    category: 'red', 
    available: true, 
    rarity: 'common' 
  },
  
  // Pinks (粉色系)
  { 
    id: 'pink-1', 
    hex: '#FF9FF3', 
    name: '桃花粉', 
    nameEn: 'Peach Blossom',
    category: 'pink', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'pink-2', 
    hex: '#F368E0', 
    name: '牡丹粉', 
    nameEn: 'Peony Pink',
    category: 'pink', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'pink-3', 
    hex: '#FF8CC8', 
    name: '樱花粉', 
    nameEn: 'Cherry Blossom',
    category: 'pink', 
    available: true, 
    rarity: 'common' 
  },
  { 
    id: 'pink-4', 
    hex: '#FFB8D6', 
    name: '荷花粉', 
    nameEn: 'Lotus Pink',
    category: 'pink', 
    available: true, 
    rarity: 'common' 
  },
  
  // Purples (紫色系)
  { 
    id: 'purple-1', 
    hex: '#7A2EFF', 
    name: '紫罗兰', 
    nameEn: 'Violet',
    category: 'purple', 
    available: true, 
    rarity: 'legendary' 
  },
  { 
    id: 'purple-2', 
    hex: '#9B59B6', 
    name: '薰衣草', 
    nameEn: 'Lavender',
    category: 'purple', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'purple-3', 
    hex: '#8E44AD', 
    name: '葡萄紫', 
    nameEn: 'Grape Purple',
    category: 'purple', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'purple-4', 
    hex: '#6C5CE7', 
    name: '丁香紫', 
    nameEn: 'Lilac Purple',
    category: 'purple', 
    available: true, 
    rarity: 'common' 
  },
  
  // Blues (蓝色系)
  { 
    id: 'blue-1', 
    hex: '#3742FA', 
    name: '靛蓝', 
    nameEn: 'Indigo Blue',
    category: 'blue', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'blue-2', 
    hex: '#2F3542', 
    name: '墨蓝', 
    nameEn: 'Ink Blue',
    category: 'blue', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'blue-3', 
    hex: '#40739E', 
    name: '青蓝', 
    nameEn: 'Cyan Blue',
    category: 'blue', 
    available: true, 
    rarity: 'common' 
  },
  { 
    id: 'blue-4', 
    hex: '#487EB0', 
    name: '天蓝', 
    nameEn: 'Sky Blue',
    category: 'blue', 
    available: true, 
    rarity: 'common' 
  },
  
  // Greens (绿色系)
  { 
    id: 'green-1', 
    hex: '#1EE11F', 
    name: '翠绿', 
    nameEn: 'Emerald Green',
    category: 'green', 
    available: true, 
    rarity: 'legendary' 
  },
  { 
    id: 'green-2', 
    hex: '#2ED573', 
    name: '竹绿', 
    nameEn: 'Bamboo Green',
    category: 'green', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'green-3', 
    hex: '#7BED9F', 
    name: '薄荷绿', 
    nameEn: 'Mint Green',
    category: 'green', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'green-4', 
    hex: '#70A1FF', 
    name: '青绿', 
    nameEn: 'Teal Green',
    category: 'green', 
    available: true, 
    rarity: 'common' 
  },
  
  // Yellows & Golds (黄金色系)
  { 
    id: 'yellow-1', 
    hex: '#FFD700', 
    name: '女书金', 
    nameEn: 'NuShu Gold',
    category: 'yellow', 
    available: true, 
    rarity: 'legendary' 
  },
  { 
    id: 'yellow-2', 
    hex: '#FFA502', 
    name: '橙黄', 
    nameEn: 'Orange Yellow',
    category: 'yellow', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'yellow-3', 
    hex: '#FFFA65', 
    name: '柠檬黄', 
    nameEn: 'Lemon Yellow',
    category: 'yellow', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'yellow-4', 
    hex: '#FFDD59', 
    name: '鹅黄', 
    nameEn: 'Pale Yellow',
    category: 'yellow', 
    available: true, 
    rarity: 'common' 
  },
  
  // Oranges (橙色系)
  { 
    id: 'orange-1', 
    hex: '#FF6348', 
    name: '朱橘', 
    nameEn: 'Vermillion Orange',
    category: 'orange', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'orange-2', 
    hex: '#FF7675', 
    name: '珊瑚橙', 
    nameEn: 'Coral Orange',
    category: 'orange', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'orange-3', 
    hex: '#FDCB6E', 
    name: '杏橙', 
    nameEn: 'Apricot Orange',
    category: 'orange', 
    available: true, 
    rarity: 'common' 
  },
  { 
    id: 'orange-4', 
    hex: '#E17055', 
    name: '赭橙', 
    nameEn: 'Ochre Orange',
    category: 'orange', 
    available: true, 
    rarity: 'common' 
  },
  
  // Browns & Earth Tones (棕土色系)
  { 
    id: 'brown-1', 
    hex: '#8B4513', 
    name: '赭石', 
    nameEn: 'Ochre Brown',
    category: 'brown', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'brown-2', 
    hex: '#A0522D', 
    name: '棕褐', 
    nameEn: 'Sienna Brown',
    category: 'brown', 
    available: true, 
    rarity: 'common' 
  },
  { 
    id: 'brown-3', 
    hex: '#CD853F', 
    name: '沙褐', 
    nameEn: 'Sandy Brown',
    category: 'brown', 
    available: true, 
    rarity: 'common' 
  },
  { 
    id: 'brown-4', 
    hex: '#DEB887', 
    name: '米褐', 
    nameEn: 'Beige Brown',
    category: 'brown', 
    available: true, 
    rarity: 'common' 
  },
  
  // Grays & Blacks (灰黑色系)
  { 
    id: 'gray-1', 
    hex: '#1A1A1A', 
    name: '墨色', 
    nameEn: 'Ink Black',
    category: 'gray', 
    available: true, 
    rarity: 'legendary' 
  },
  { 
    id: 'gray-2', 
    hex: '#2F3640', 
    name: '炭灰', 
    nameEn: 'Charcoal Gray',
    category: 'gray', 
    available: true, 
    rarity: 'rare' 
  },
  { 
    id: 'gray-3', 
    hex: '#57606F', 
    name: '石灰', 
    nameEn: 'Stone Gray',
    category: 'gray', 
    available: true, 
    rarity: 'uncommon' 
  },
  { 
    id: 'gray-4', 
    hex: '#747D8C', 
    name: '银灰', 
    nameEn: 'Silver Gray',
    category: 'gray', 
    available: true, 
    rarity: 'common' 
  },
];

// Helper functions
export function getColorById(colorId: string): ColorDefinition | null {
  return COLOR_PALETTE.find(color => color.id === colorId) || null;
}

export function getColorByHex(hex: string): ColorDefinition | null {
  return COLOR_PALETTE.find(color => color.hex.toLowerCase() === hex.toLowerCase()) || null;
}

export function getColorsByCategory(category: ColorDefinition['category']): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => color.category === category);
}

export function getColorsByRarity(rarity: ColorDefinition['rarity']): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => color.rarity === rarity);
}

export function getAvailableColors(): ColorDefinition[] {
  return COLOR_PALETTE.filter(color => color.available);
}

// Color mapping for backward compatibility
export const COLOR_HEX_MAP: Record<string, string> = Object.fromEntries(
  COLOR_PALETTE.map(color => [color.id, color.hex])
);

// Rarity-based pricing multipliers (for future use)
export const RARITY_MULTIPLIERS = {
  common: 1.0,
  uncommon: 1.5,
  rare: 2.0,
  legendary: 3.0,
} as const;

// Category-based grouping for UI
export const COLOR_CATEGORIES = [
  { id: 'red', name: '红色系', nameEn: 'Reds' },
  { id: 'pink', name: '粉色系', nameEn: 'Pinks' },
  { id: 'purple', name: '紫色系', nameEn: 'Purples' },
  { id: 'blue', name: '蓝色系', nameEn: 'Blues' },
  { id: 'green', name: '绿色系', nameEn: 'Greens' },
  { id: 'yellow', name: '黄色系', nameEn: 'Yellows' },
  { id: 'orange', name: '橙色系', nameEn: 'Oranges' },
  { id: 'brown', name: '棕色系', nameEn: 'Browns' },
  { id: 'gray', name: '灰色系', nameEn: 'Grays' },
] as const;