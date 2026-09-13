import type { Character } from './character';
import { jobLadder } from '../data/jobs';

export function computeEpitaph(character: Character): string | null {
  if (character.isSorcerer && character.rank === 'special') return 'Hechicero Legendario';
  if (character.isSorcerer && character.rank === 'grade1') return 'Hechicero de Élite';
  if (character.stats.fame >= 60) return 'Famoso/a';
  if (!character.isSorcerer && character.job && character.job.tierIndex >= jobLadder.length - 1) return 'Magnate';
  if (character.relationships.some((r) => r.role === 'child')) return 'Cabeza de Familia';
  return null;
}
