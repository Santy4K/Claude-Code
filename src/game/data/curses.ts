export type CurseTier = 'facil' | 'media' | 'dificil' | 'especial';

export interface CurseTemplate {
  id: string;
  name: string;
  tier: CurseTier;
  hp: number;
  attack: number;
  defense: number;
  reward: { money: [number, number]; reputation: number; techniqueXp: number };
}

export const curseTemplates: CurseTemplate[] = [
  {
    id: 'stray_curse',
    name: 'Maldición errante',
    tier: 'facil',
    hp: 40,
    attack: 6,
    defense: 2,
    reward: { money: [10, 25], reputation: 3, techniqueXp: 4 },
  },
  {
    id: 'cursed_corpse',
    name: 'Cadáver maldito',
    tier: 'facil',
    hp: 55,
    attack: 8,
    defense: 3,
    reward: { money: [15, 30], reputation: 4, techniqueXp: 5 },
  },
  {
    id: 'grade2_curse',
    name: 'Maldición de Segundo Grado',
    tier: 'media',
    hp: 85,
    attack: 12,
    defense: 6,
    reward: { money: [30, 55], reputation: 7, techniqueXp: 8 },
  },
  {
    id: 'grade1_curse',
    name: 'Maldición de Primer Grado',
    tier: 'dificil',
    hp: 130,
    attack: 18,
    defense: 10,
    reward: { money: [60, 100], reputation: 12, techniqueXp: 12 },
  },
  {
    id: 'special_curse',
    name: 'Maldición de Grado Especial',
    tier: 'especial',
    hp: 200,
    attack: 26,
    defense: 14,
    reward: { money: [120, 220], reputation: 22, techniqueXp: 20 },
  },
];

// Flagship narrative encounters, triggered directly from story events rather
// than the mission board. Their rewards are zeroed because the triggering
// event's own option effects already grant the narrative payoff.
export const narrativeCurseTemplates: CurseTemplate[] = [
  {
    id: 'special_grade_boss',
    name: 'Maldición de Grado Especial',
    tier: 'especial',
    hp: 160,
    attack: 22,
    defense: 12,
    reward: { money: [0, 0], reputation: 0, techniqueXp: 0 },
  },
  {
    id: 'antagonist_boss',
    name: 'La maldición que todos temen',
    tier: 'especial',
    hp: 240,
    attack: 30,
    defense: 16,
    reward: { money: [0, 0], reputation: 0, techniqueXp: 0 },
  },
];

export function getCurseTemplate(id: string): CurseTemplate | undefined {
  return curseTemplates.find((c) => c.id === id) ?? narrativeCurseTemplates.find((c) => c.id === id);
}
