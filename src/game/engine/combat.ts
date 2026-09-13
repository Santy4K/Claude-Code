import type { Character } from './character';
import { applyDelta } from '../data/stats';
import { getAsset } from '../data/assets';
import { getCurseTemplate, type CurseTemplate } from '../data/curses';

export type QteQuality = 'perfect' | 'good' | 'miss';
export type CombatPhase = 'choose' | 'qteAttack' | 'qteDodge' | 'victory' | 'defeat' | 'fled';
export type CombatAction = 'attack' | 'technique' | 'ultimate' | 'block' | 'flee';

export interface CombatEnemy {
  templateId: string;
  name: string;
  hpMax: number;
  hp: number;
  attack: number;
  defense: number;
}

export interface CombatReward {
  money: number;
  reputation: number;
  techniqueXp: number;
}

export interface CombatState {
  enemy: CombatEnemy;
  playerHpMax: number;
  playerHp: number;
  playerEnergyMax: number;
  playerEnergy: number;
  phase: CombatPhase;
  usedUltimate: boolean;
  canUltimate: boolean;
  log: string[];
  pendingAction: CombatAction | null;
  pendingEnemyDamage: number;
  reward: CombatReward | null;
  playerDied: boolean;
}

function equippedToolBonus(character: Character): { attack: number; defense: number } {
  if (!character.equippedToolId) return { attack: 0, defense: 0 };
  const tool = getAsset(character.equippedToolId);
  return tool?.combatBonus ?? { attack: 0, defense: 0 };
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function startCombat(character: Character, template: CurseTemplate): CombatState {
  const tool = equippedToolBonus(character);
  const playerHpMax = Math.round(60 + character.stats.physical * 0.6 + character.stats.health * 0.4);
  const playerEnergyMax = character.isSorcerer ? Math.round(40 + character.stats.cursedEnergy * 0.8) : 0;
  const canUltimate = character.isSorcerer && (character.rank === 'grade1' || character.rank === 'special');

  return {
    enemy: {
      templateId: template.id,
      name: template.name,
      hpMax: template.hp,
      hp: template.hp,
      attack: template.attack,
      defense: template.defense + Math.floor(tool.defense / 3),
    },
    playerHpMax,
    playerHp: playerHpMax,
    playerEnergyMax,
    playerEnergy: playerEnergyMax,
    phase: 'choose',
    usedUltimate: false,
    canUltimate,
    log: [`Un ${template.name} aparece frente a vos.`],
    pendingAction: null,
    pendingEnemyDamage: 0,
    reward: null,
    playerDied: false,
  };
}

function qteMultiplier(quality: QteQuality): number {
  if (quality === 'perfect') return 1.4;
  if (quality === 'good') return 1.0;
  return 0.5;
}

function computeReward(template: CurseTemplate): CombatReward {
  return {
    money: randomRange(template.reward.money[0], template.reward.money[1]),
    reputation: template.reward.reputation,
    techniqueXp: template.reward.techniqueXp,
  };
}

export function chooseAction(state: CombatState, action: CombatAction, character: Character): CombatState {
  if (state.phase !== 'choose') return state;

  if (action === 'block') {
    const tool = equippedToolBonus(character);
    const rawDamage = Math.max(1, state.enemy.attack + randomRange(-2, 2));
    const mitigated = Math.max(1, Math.round(rawDamage * 0.4) - Math.round(tool.defense * 0.3));
    const playerHp = Math.max(0, state.playerHp - mitigated);
    const log = [...state.log, `Bloqueaste el golpe de ${state.enemy.name}. Recibiste ${mitigated} de daño.`];
    if (playerHp <= 0) {
      return { ...state, playerHp, log, phase: 'defeat', playerDied: false };
    }
    return { ...state, playerHp, log, phase: 'choose' };
  }

  if (action === 'flee') {
    const successChance = Math.min(0.85, Math.max(0.1, 0.35 + character.stats.luck / 200));
    if (Math.random() < successChance) {
      return { ...state, phase: 'fled', log: [...state.log, 'Lograste escapar del combate.'] };
    }
    const rawDamage = Math.max(1, Math.round(state.enemy.attack * 0.6));
    const playerHp = Math.max(0, state.playerHp - rawDamage);
    const log = [...state.log, `Intentaste huir pero ${state.enemy.name} te alcanzó. Recibiste ${rawDamage} de daño.`];
    if (playerHp <= 0) {
      return { ...state, playerHp, log, phase: 'defeat', playerDied: false };
    }
    return { ...state, playerHp, log, phase: 'choose' };
  }

  if (action === 'ultimate') {
    if (!state.canUltimate || state.usedUltimate || state.playerEnergy < state.playerEnergyMax * 0.8) {
      return state;
    }
    const damage = Math.round(state.enemy.hpMax * 0.5);
    const hp = Math.max(0, state.enemy.hp - damage);
    const log = [...state.log, `¡Desatás tu técnica definitiva! ${damage} de daño.`];
    if (hp <= 0) {
      const template = getCurseTemplate(state.enemy.templateId);
      return {
        ...state,
        enemy: { ...state.enemy, hp },
        log: [...log, `${state.enemy.name} fue derrotado.`],
        phase: 'victory',
        usedUltimate: true,
        playerEnergy: 0,
        reward: template ? computeReward(template) : { money: 0, reputation: 0, techniqueXp: 0 },
      };
    }
    return {
      ...state,
      enemy: { ...state.enemy, hp },
      log,
      usedUltimate: true,
      playerEnergy: 0,
      pendingAction: 'attack',
      phase: 'qteDodge',
      pendingEnemyDamage: computeEnemyDamage(state),
    };
  }

  if (action === 'technique' && state.playerEnergy < 20) {
    return state;
  }

  return { ...state, pendingAction: action, phase: 'qteAttack' };
}

function computeEnemyDamage(state: CombatState): number {
  return Math.max(1, state.enemy.attack + randomRange(-3, 3));
}

export function resolveAttackQte(state: CombatState, quality: QteQuality, character: Character): CombatState {
  if (state.phase !== 'qteAttack' || !state.pendingAction) return state;
  const tool = equippedToolBonus(character);
  const isTechnique = state.pendingAction === 'technique';

  const base = isTechnique
    ? character.stats.technique * 0.6 + character.stats.cursedEnergy * 0.1 + tool.attack * 0.5
    : character.stats.physical * 0.4 + tool.attack;

  const rawDamage = base * qteMultiplier(quality);
  const damage = Math.max(1, Math.round(rawDamage - state.enemy.defense * 0.5));
  const hp = Math.max(0, state.enemy.hp - damage);
  const energy = isTechnique ? Math.max(0, state.playerEnergy - 20) : state.playerEnergy;

  const qualityLabel = quality === 'perfect' ? '¡Golpe perfecto!' : quality === 'good' ? 'Buen golpe.' : 'Golpe flojo.';
  const log = [...state.log, `${qualityLabel} Hiciste ${damage} de daño.`];

  if (hp <= 0) {
    const template = getCurseTemplate(state.enemy.templateId);
    return {
      ...state,
      enemy: { ...state.enemy, hp },
      playerEnergy: energy,
      log: [...log, `${state.enemy.name} fue derrotado.`],
      phase: 'victory',
      pendingAction: null,
      reward: template ? computeReward(template) : { money: 0, reputation: 0, techniqueXp: 0 },
    };
  }

  return {
    ...state,
    enemy: { ...state.enemy, hp },
    playerEnergy: energy,
    log,
    phase: 'qteDodge',
    pendingAction: null,
    pendingEnemyDamage: computeEnemyDamage(state),
  };
}

export function resolveDodgeQte(state: CombatState, quality: QteQuality, character: Character): CombatState {
  if (state.phase !== 'qteDodge') return state;
  const tool = equippedToolBonus(character);
  const dodgeMultiplier = quality === 'perfect' ? 0 : quality === 'good' ? 0.4 : 1;
  const rawDamage = Math.max(0, state.pendingEnemyDamage - Math.round(tool.defense * 0.3));
  const damage = Math.round(rawDamage * dodgeMultiplier);
  const playerHp = Math.max(0, state.playerHp - damage);

  const label =
    quality === 'perfect'
      ? `¡Esquivaste el ataque de ${state.enemy.name} por completo!`
      : quality === 'good'
        ? `Esquivaste a medias. Recibiste ${damage} de daño.`
        : `No lograste esquivar. Recibiste ${damage} de daño.`;

  const log = [...state.log, label];

  if (playerHp <= 0) {
    return { ...state, playerHp, log, phase: 'defeat' };
  }

  return { ...state, playerHp, log, phase: 'choose', pendingEnemyDamage: 0 };
}

export interface CombatConclusion {
  character: Character;
  summary: string;
}

export function applyCombatOutcome(character: Character, state: CombatState): CombatConclusion {
  if (state.phase === 'victory' && state.reward) {
    const { money, reputation, techniqueXp } = state.reward;
    const damageTaken = state.playerHpMax - state.playerHp;
    const healthPenalty = Math.round((damageTaken / state.playerHpMax) * 20);
    const next: Character = {
      ...character,
      stats: applyDelta(character.stats, {
        money,
        reputation,
        technique: character.isSorcerer ? techniqueXp : 0,
        health: -healthPenalty,
      }),
      log: [
        ...character.log,
        {
          age: character.age,
          text: `Derrotaste a ${state.enemy.name}. Ganaste $${money}${
            reputation ? ` y ${reputation} de reputación` : ''
          }.`,
        },
      ],
    };
    return { character: next, summary: 'Victoria' };
  }

  if (state.phase === 'defeat') {
    const isBrutal = state.enemy.hpMax >= 160;
    const dies = isBrutal && Math.random() < 0.2;
    if (dies) {
      const next: Character = {
        ...character,
        alive: false,
        deathCause: `Caíste luchando contra ${state.enemy.name}.`,
        log: [...character.log, { age: character.age, text: `Caíste luchando contra ${state.enemy.name}.` }],
      };
      return { character: next, summary: 'Derrota fatal' };
    }
    const next: Character = {
      ...character,
      stats: applyDelta(character.stats, { health: -30, mentalHealth: -10, reputation: -5 }),
      log: [
        ...character.log,
        { age: character.age, text: `Fuiste derrotado por ${state.enemy.name} y tuviste que ser rescatado.` },
      ],
    };
    return { character: next, summary: 'Derrota' };
  }

  // fled
  const next: Character = {
    ...character,
    stats: applyDelta(character.stats, { reputation: -1 }),
    log: [...character.log, { age: character.age, text: `Escapaste de un enfrentamiento contra ${state.enemy.name}.` }],
  };
  return { character: next, summary: 'Huida' };
}
