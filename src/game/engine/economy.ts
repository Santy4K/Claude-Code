import type { Character } from './character';
import { applyDelta } from '../data/stats';
import { getAsset } from '../data/assets';
import { getJobTier, jobLadder } from '../data/jobs';

export interface ActionResult {
  character: Character;
  message: string;
}

export function buyAsset(character: Character, assetId: string): ActionResult {
  const asset = getAsset(assetId);
  if (!asset) return { character, message: 'Ese artículo no existe.' };
  if (character.assets.includes(assetId)) return { character, message: 'Ya tenés ese artículo.' };
  if (character.stats.money < asset.price) return { character, message: 'No te alcanza el dinero.' };

  let next: Character = {
    ...character,
    assets: [...character.assets, assetId],
    stats: applyDelta(character.stats, { money: -asset.price, ...(asset.immediateEffects ?? {}) }),
  };

  if (asset.category === 'tool' && !next.equippedToolId) {
    next = { ...next, equippedToolId: assetId };
  }

  return { character: next, message: `Compraste: ${asset.name}.` };
}

export function sellAsset(character: Character, assetId: string): ActionResult {
  const asset = getAsset(assetId);
  if (!asset || !character.assets.includes(assetId)) {
    return { character, message: 'No tenés ese artículo.' };
  }
  const refund = Math.floor(asset.price / 2);
  const next: Character = {
    ...character,
    assets: character.assets.filter((id) => id !== assetId),
    equippedToolId: character.equippedToolId === assetId ? undefined : character.equippedToolId,
    stats: applyDelta(character.stats, { money: refund }),
  };
  return { character: next, message: `Vendiste ${asset.name} por $${refund}.` };
}

export function equipTool(character: Character, assetId: string): ActionResult {
  const asset = getAsset(assetId);
  if (!asset || asset.category !== 'tool' || !character.assets.includes(assetId)) {
    return { character, message: 'No podés equipar eso.' };
  }
  return { character: { ...character, equippedToolId: assetId }, message: `Equipaste: ${asset.name}.` };
}

export function searchJob(character: Character): ActionResult {
  if (character.job) return { character, message: 'Ya tenés un trabajo.' };
  const next: Character = {
    ...character,
    job: { tierIndex: 0 },
    log: [...character.log, { age: character.age, text: `Conseguiste tu primer trabajo: ${jobLadder[0].title}.` }],
  };
  return { character: next, message: `Conseguiste trabajo de ${jobLadder[0].title}.` };
}

export function requestPromotion(character: Character): ActionResult {
  if (!character.job) return { character, message: 'Primero necesitás un trabajo.' };
  if (character.job.tierIndex >= jobLadder.length - 1) {
    return { character, message: 'Ya llegaste al puesto más alto.' };
  }
  const chance = Math.min(0.85, Math.max(0.1, 0.3 + (character.stats.charisma + character.stats.intelligence) / 200));
  if (Math.random() < chance) {
    const nextTier = character.job.tierIndex + 1;
    const next: Character = {
      ...character,
      job: { tierIndex: nextTier },
      log: [...character.log, { age: character.age, text: `¡Te ascendieron a ${getJobTier(nextTier).title}!` }],
    };
    return { character: next, message: `¡Ascendiste a ${getJobTier(nextTier).title}!` };
  }
  const next: Character = { ...character, stats: applyDelta(character.stats, { mentalHealth: -2 }) };
  return { character: next, message: 'Te rechazaron el ascenso, por ahora.' };
}

export function quitJob(character: Character): ActionResult {
  if (!character.job) return { character, message: 'No tenés trabajo.' };
  return { character: { ...character, job: null }, message: 'Renunciaste a tu trabajo.' };
}

export function payJobSalary(character: Character): Character {
  if (!character.job) return character;
  const tier = getJobTier(character.job.tierIndex);
  return {
    ...character,
    stats: applyDelta(character.stats, { money: tier.salary }),
    log: [...character.log, { age: character.age, text: `Cobraste tu salario de ${tier.title}: $${tier.salary}.` }],
  };
}
