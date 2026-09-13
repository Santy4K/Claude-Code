import { events, type EventOption, type LifeEvent } from '../data/events';
import { applyDelta } from '../data/stats';
import { rankForScore, rankScore } from '../data/ranks';
import { currentStage, type Character } from './character';
import { payJobSalary } from './economy';
import { ensureCanonNpcs } from './relationshipActions';

function pickWeighted(pool: LifeEvent[]): LifeEvent {
  const totalWeight = pool.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of pool) {
    roll -= event.weight ?? 1;
    if (roll <= 0) return event;
  }
  return pool[pool.length - 1];
}

export function getAvailableEvent(character: Character): LifeEvent | null {
  const stage = currentStage(character);
  const pool = events.filter((event) => {
    if (!event.stages.includes(stage)) return false;
    if (character.age < event.minAge || character.age > event.maxAge) return false;
    if (event.once && character.usedEventIds.includes(event.id)) return false;
    if (event.requiresFlags?.some((flag) => !character.flags[flag])) return false;
    if (event.excludesFlags?.some((flag) => character.flags[flag])) return false;
    return true;
  });
  if (pool.length === 0) return null;
  return pickWeighted(pool);
}

function naturalDeathChance(character: Character): number {
  const { age, stats } = character;
  if (age < 55) return 0.001;
  const ageFactor = (age - 55) / 40; // ramps up after 55
  const healthFactor = (100 - stats.physical) / 200 + (100 - stats.mentalHealth) / 300;
  return Math.min(0.6, Math.max(0, ageFactor * 0.35 + healthFactor));
}

export interface AgeUpResult {
  character: Character;
  event: LifeEvent | null;
  died: boolean;
}

export function ageUp(character: Character): AgeUpResult {
  if (!character.alive || character.retired) {
    return { character, event: null, died: false };
  }

  const nextAge = character.age + 1;
  let next: Character = { ...character, age: nextAge, log: [...character.log], activityUses: {} };
  next = payJobSalary(next);

  if (Math.random() < naturalDeathChance(next)) {
    next = {
      ...next,
      alive: false,
      deathCause: 'Falleciste de causas naturales.',
      log: [...next.log, { age: nextAge, text: 'Falleciste de causas naturales.' }],
    };
    return { character: next, event: null, died: true };
  }

  const event = getAvailableEvent(next);
  if (!event) {
    next = {
      ...next,
      log: [...next.log, { age: nextAge, text: 'Pasó un año tranquilo.' }],
    };
  }

  return { character: next, event, died: false };
}

const EXAM_PASS_THRESHOLD = 45;

function resolveExam(character: Character): Character {
  const { stats } = character;
  const score =
    stats.physical * 0.25 +
    stats.intelligence * 0.3 +
    stats.cursedEnergy * 0.35 +
    stats.luck * 0.1 +
    (Math.random() * 20 - 10);

  if (score >= EXAM_PASS_THRESHOLD) {
    const promoted: Character = {
      ...character,
      isSorcerer: true,
      flags: { ...character.flags, exam_passed: true },
      log: [
        ...character.log,
        { age: character.age, text: '¡Aprobaste el examen de ingreso! Ahora sos estudiante de hechicería.' },
      ],
    };
    return ensureCanonNpcs(promoted);
  }

  return {
    ...character,
    flags: { ...character.flags, exam_failed: true },
    log: [
      ...character.log,
      { age: character.age, text: 'No lograste aprobar el examen. Vas a seguir un camino de vida civil.' },
    ],
  };
}

export function applyEventOption(character: Character, event: LifeEvent, option: EventOption): Character {
  let next: Character = { ...character };

  if (option.effects) {
    next.stats = applyDelta(next.stats, option.effects);
  }

  if (option.setFlags) {
    next.flags = { ...next.flags };
    for (const flag of option.setFlags) {
      next.flags[flag] = true;
    }
  }

  if (event.once) {
    next.usedEventIds = [...next.usedEventIds, event.id];
  }

  next.log = [...next.log, { age: next.age, text: option.resultText }];

  if (event.id === 'exam_invite' && option.setFlags?.includes('taking_exam')) {
    next = resolveExam(next);
  }

  if (option.death) {
    next.alive = false;
    next.deathCause = option.deathCause ?? 'Falleciste en una misión.';
    next.log = [...next.log, { age: next.age, text: next.deathCause }];
  }

  if (option.retire) {
    next.retired = true;
    next.log = [...next.log, { age: next.age, text: 'Te retiraste en paz.' }];
  }

  if (next.isSorcerer) {
    const score = rankScore(next.stats.technique, next.stats.cursedEnergy, next.stats.reputation);
    const newRank = rankForScore(score);
    if (newRank.id !== next.rank) {
      next.rank = newRank.id;
      next.log = [...next.log, { age: next.age, text: `¡Ascendiste a ${newRank.label}!` }];
    }
  }

  return next;
}

export function needsTechniqueSelection(character: Character): boolean {
  return character.isSorcerer && !character.techniqueId;
}
