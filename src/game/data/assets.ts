import type { StatDelta } from './stats';

export type AssetCategory = 'house' | 'car' | 'clothing' | 'tool';

export interface AssetDef {
  id: string;
  category: AssetCategory;
  name: string;
  description: string;
  price: number;
  immediateEffects?: StatDelta;
  combatBonus?: { attack: number; defense: number };
  prestige?: number;
}

export const assetCatalog: AssetDef[] = [
  {
    id: 'house_apartment',
    category: 'house',
    name: 'Departamento chico',
    description: 'Un lugar propio, aunque sea pequeño.',
    price: 200,
    immediateEffects: { mentalHealth: 3 },
    prestige: 1,
  },
  {
    id: 'house_medium',
    category: 'house',
    name: 'Casa mediana',
    description: 'Suficiente espacio para vos y los tuyos.',
    price: 800,
    immediateEffects: { mentalHealth: 6, charisma: 2 },
    prestige: 2,
  },
  {
    id: 'house_mansion',
    category: 'house',
    name: 'Mansión',
    description: 'El símbolo de que llegaste lejos.',
    price: 3000,
    immediateEffects: { mentalHealth: 10, charisma: 5 },
    prestige: 3,
  },
  {
    id: 'car_used',
    category: 'car',
    name: 'Auto usado',
    description: 'Anda, que ya es bastante.',
    price: 150,
    immediateEffects: { charisma: 2 },
  },
  {
    id: 'car_new',
    category: 'car',
    name: 'Auto nuevo',
    description: 'Todavía tiene ese olor a nuevo.',
    price: 600,
    immediateEffects: { charisma: 4 },
  },
  {
    id: 'car_luxury',
    category: 'car',
    name: 'Auto de lujo',
    description: 'La gente se da vuelta cuando pasás.',
    price: 2000,
    immediateEffects: { charisma: 7, fame: 3 },
  },
  {
    id: 'clothing_casual',
    category: 'clothing',
    name: 'Ropa casual prolija',
    description: 'Simple pero cuidada.',
    price: 40,
    immediateEffects: { charisma: 2 },
  },
  {
    id: 'clothing_formal',
    category: 'clothing',
    name: 'Traje formal',
    description: 'Para las ocasiones importantes.',
    price: 150,
    immediateEffects: { charisma: 5 },
  },
  {
    id: 'clothing_designer',
    category: 'clothing',
    name: 'Ropa de diseñador',
    description: 'Un lujo que se nota.',
    price: 500,
    immediateEffects: { charisma: 9, fame: 2 },
  },
  {
    id: 'tool_basic',
    category: 'tool',
    name: 'Cuchillo maldito',
    description: 'Una herramienta maldita básica pero confiable.',
    price: 100,
    combatBonus: { attack: 4, defense: 0 },
  },
  {
    id: 'tool_amplifier',
    category: 'tool',
    name: 'Amplificador de energía',
    description: 'Canaliza mejor tu energía maldita en combate.',
    price: 400,
    combatBonus: { attack: 2, defense: 4 },
  },
  {
    id: 'tool_relic',
    category: 'tool',
    name: 'Reliquia sellada',
    description: 'Un objeto maldito de un grado muy superior al tuyo.',
    price: 1200,
    combatBonus: { attack: 9, defense: 6 },
  },
];

export function getAsset(id: string): AssetDef | undefined {
  return assetCatalog.find((a) => a.id === id);
}

export function highestOwnedHouse(ownedIds: string[]): AssetDef | null {
  const houses = assetCatalog.filter((a) => a.category === 'house' && ownedIds.includes(a.id));
  if (houses.length === 0) return null;
  return houses.reduce((best, cur) => ((cur.prestige ?? 0) > (best.prestige ?? 0) ? cur : best));
}
