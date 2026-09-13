import type { Character } from './character';
import { applyDelta } from '../data/stats';
import { createCanonNpc, createChild, createDatingCandidate, type Relationship } from '../data/relationships';

function clampAffinity(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function updateRelationship(character: Character, id: string, updater: (r: Relationship) => Relationship): Character {
  return {
    ...character,
    relationships: character.relationships.map((r) => (r.id === id ? updater(r) : r)),
  };
}

export function ensureCanonNpcs(character: Character): Character {
  if (!character.isSorcerer) return character;
  const existingRoles = new Set(character.relationships.map((r) => r.role));
  const additions: Relationship[] = [];
  if (!existingRoles.has('mentor')) additions.push(createCanonNpc('mentor', 'npc.mentor'));
  if (!existingRoles.has('rival')) additions.push(createCanonNpc('rival', 'npc.rival'));
  if (!existingRoles.has('friend')) additions.push(createCanonNpc('friend', 'npc.friend'));
  if (additions.length === 0) return character;
  return { ...character, relationships: [...character.relationships, ...additions] };
}

export function meetSomeone(character: Character): RelationshipActionResult {
  if (character.relationships.some((r) => r.role === 'partner')) {
    return { character, message: 'Ya estás saliendo con alguien.' };
  }
  const candidate = createDatingCandidate();
  const next: Character = { ...character, relationships: [...character.relationships, candidate] };
  return { character: next, message: `Conociste a ${candidate.name}.` };
}

export type RelationshipActionType = 'talk' | 'hangout' | 'gift' | 'fight' | 'propose' | 'haveChild' | 'breakup';

export interface RelationshipActionResult {
  character: Character;
  message: string;
}

export function relationshipAction(
  character: Character,
  relationshipId: string,
  action: RelationshipActionType,
): RelationshipActionResult {
  const rel = character.relationships.find((r) => r.id === relationshipId);
  if (!rel) return { character, message: 'Esa persona ya no está en tu vida.' };

  const displayName = rel.name || 'esa persona';

  switch (action) {
    case 'talk': {
      const gain = Math.floor(Math.random() * 4) + 2;
      let next = updateRelationship(character, relationshipId, (r) => ({
        ...r,
        affinity: clampAffinity(r.affinity + gain),
      }));
      next = { ...next, stats: applyDelta(next.stats, { charisma: 1 }) };
      return { character: next, message: `Hablaste con ${displayName}.` };
    }
    case 'hangout': {
      if (character.stats.money < 10) {
        return { character, message: 'No tenés suficiente dinero para salir.' };
      }
      const gain = Math.floor(Math.random() * 7) + 8;
      let next = updateRelationship(character, relationshipId, (r) => ({
        ...r,
        affinity: clampAffinity(r.affinity + gain),
      }));
      next = { ...next, stats: applyDelta(next.stats, { money: -10, mentalHealth: 2 }) };
      return { character: next, message: `Saliste con ${displayName}. Se acercaron un poco más.` };
    }
    case 'gift': {
      if (character.stats.money < 25) {
        return { character, message: 'No tenés suficiente dinero para un regalo.' };
      }
      const gain = Math.floor(Math.random() * 7) + 14;
      let next = updateRelationship(character, relationshipId, (r) => ({
        ...r,
        affinity: clampAffinity(r.affinity + gain),
      }));
      next = { ...next, stats: applyDelta(next.stats, { money: -25 }) };
      return { character: next, message: `Le hiciste un regalo a ${displayName}.` };
    }
    case 'fight': {
      const loss = Math.floor(Math.random() * 7) + 12;
      let next = updateRelationship(character, relationshipId, (r) => ({
        ...r,
        affinity: clampAffinity(r.affinity - loss),
      }));
      next = { ...next, stats: applyDelta(next.stats, { physical: 1, mentalHealth: -3 }) };
      return { character: next, message: `Tuviste una pelea con ${displayName}.` };
    }
    case 'propose': {
      if (rel.role !== 'partner' || rel.married) {
        return { character, message: 'Eso no aplica acá.' };
      }
      if (rel.affinity < 75) {
        return { character, message: `${displayName} todavía no está list@ para ese paso.` };
      }
      if (character.stats.money < 50) {
        return { character, message: 'Necesitás al menos $50 para el anillo.' };
      }
      let next = updateRelationship(character, relationshipId, (r) => ({ ...r, married: true }));
      next = {
        ...next,
        stats: applyDelta(next.stats, { money: -50, mentalHealth: 10 }),
        log: [...next.log, { age: next.age, text: `Te casaste con ${displayName}.` }],
      };
      return { character: next, message: `¡Te casaste con ${displayName}!` };
    }
    case 'haveChild': {
      if (rel.role !== 'partner' || !rel.married) {
        return { character, message: 'Necesitás estar casado para eso.' };
      }
      if (character.age < 18) {
        return { character, message: 'Todavía sos muy joven para eso.' };
      }
      if (character.stats.money < 100) {
        return { character, message: 'Necesitás al menos $100 ahorrados.' };
      }
      const child = createChild();
      const next: Character = {
        ...character,
        relationships: [...character.relationships, child],
        stats: applyDelta(character.stats, { money: -100, mentalHealth: 8 }),
        log: [...character.log, { age: character.age, text: `Tuviste un hijo/a: ${child.name}.` }],
      };
      return { character: next, message: `¡Felicitaciones! Tuviste un hijo/a: ${child.name}.` };
    }
    case 'breakup': {
      if (rel.role !== 'partner') {
        return { character, message: 'Eso no aplica acá.' };
      }
      const next: Character = {
        ...character,
        relationships: character.relationships.filter((r) => r.id !== relationshipId),
        stats: applyDelta(character.stats, { mentalHealth: -8 }),
      };
      return { character: next, message: `Terminaste tu relación con ${displayName}.` };
    }
    default:
      return { character, message: '' };
  }
}
