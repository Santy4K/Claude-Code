import { randomStartingStats, type Stats } from '../data/stats';
import type { SchoolId } from '../data/schools';
import type { TechniqueId } from '../data/techniques';
import type { RankId } from '../data/ranks';
import type { LifeStage } from '../data/events';

export interface LogEntry {
  age: number;
  text: string;
}

export type Gender = 'male' | 'female' | 'other';

export interface Character {
  name: string;
  gender: Gender;
  age: number;
  alive: boolean;
  retired: boolean;
  stats: Stats;
  flags: Record<string, true>;
  usedEventIds: string[];
  isSorcerer: boolean;
  schoolId?: SchoolId;
  techniqueId?: TechniqueId;
  rank: RankId;
  deathCause?: string;
  log: LogEntry[];
}

export function createCharacter(name: string, gender: Gender): Character {
  return {
    name,
    gender,
    age: 0,
    alive: true,
    retired: false,
    stats: randomStartingStats(),
    flags: {},
    usedEventIds: [],
    isSorcerer: false,
    rank: 'grade4',
    log: [{ age: 0, text: `${name} nació.` }],
  };
}

export function currentStage(character: Character): LifeStage {
  if (character.isSorcerer) return 'sorcerer';
  if (character.flags.declined_exam || character.age >= 18) return 'civilian';
  if (character.age >= 11) return 'teen';
  return 'child';
}

export function hasFlag(character: Character, flag: string): boolean {
  return Boolean(character.flags[flag]);
}
