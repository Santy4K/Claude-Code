export type RankId = 'grade4' | 'grade3' | 'grade2' | 'grade1' | 'special';

export interface RankDef {
  id: RankId;
  label: string;
  minScore: number;
}

export const ranks: RankDef[] = [
  { id: 'grade4', label: 'Cuarto Grado', minScore: 0 },
  { id: 'grade3', label: 'Tercer Grado', minScore: 25 },
  { id: 'grade2', label: 'Segundo Grado', minScore: 55 },
  { id: 'grade1', label: 'Primer Grado', minScore: 90 },
  { id: 'special', label: 'Grado Especial', minScore: 130 },
];

export function rankScore(technique: number, cursedEnergy: number, reputation: number): number {
  return technique * 0.6 + cursedEnergy * 0.5 + reputation * 0.5;
}

export function rankForScore(score: number): RankDef {
  let current = ranks[0];
  for (const rank of ranks) {
    if (score >= rank.minScore) current = rank;
  }
  return current;
}
