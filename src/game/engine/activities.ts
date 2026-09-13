import type { Character } from './character';
import { currentStage } from './character';
import { applyDelta, type StatDelta } from '../data/stats';
import { activities } from '../data/activities';
import type { ActionResult } from './economy';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function doActivity(character: Character, activityId: string): ActionResult {
  const def = activities.find((a) => a.id === activityId);
  if (!def) return { character, message: 'Esa actividad no existe.' };

  const uses = character.activityUses[activityId] ?? 0;
  if (uses >= def.maxPerYear) {
    return { character, message: 'Ya hiciste esto suficientes veces este año.' };
  }
  if (def.civilianOnly && currentStage(character) !== 'civilian') {
    return { character, message: 'Esto solo está disponible en la vida civil.' };
  }
  if (def.sorcererOnly && !character.isSorcerer) {
    return { character, message: 'Esto solo está disponible para hechiceros.' };
  }
  if (def.cost && character.stats.money < def.cost) {
    return { character, message: 'No tenés suficiente dinero.' };
  }

  let effects: StatDelta = {};
  let message = '';

  switch (activityId) {
    case 'gym':
      effects = { physical: randInt(3, 6) };
      message = 'Entrenaste en el gimnasio.';
      break;
    case 'train_technique':
      effects = { technique: randInt(3, 6), cursedEnergy: randInt(1, 3) };
      message = 'Entrenaste el control de tu técnica maldita.';
      break;
    case 'study':
      effects = { intelligence: randInt(3, 6) };
      message = 'Estudiaste un rato.';
      break;
    case 'meditate':
      effects = character.isSorcerer
        ? { cursedEnergy: randInt(3, 6) }
        : { mentalHealth: randInt(3, 6) };
      message = 'Meditaste en silencio.';
      break;
    case 'therapist':
      effects = { mentalHealth: randInt(8, 14), money: -(def.cost ?? 0) };
      message = 'Fuiste a terapia. Te sentís mejor.';
      break;
    case 'doctor':
      effects = { health: randInt(10, 18), money: -(def.cost ?? 0) };
      message = 'Fuiste al médico para un chequeo.';
      break;
    case 'social_media':
      effects = { charisma: randInt(2, 4), fame: randInt(3, 6) };
      message = 'Publicaste algo que tuvo bastante repercusión.';
      break;
    case 'petty_crime': {
      if (Math.random() < 0.7) {
        const gain = randInt(10, 40);
        effects = { money: gain };
        message = `Conseguiste $${gain} de forma poco legal.`;
      } else {
        effects = { mentalHealth: -6, reputation: -3 };
        message = 'Te agarraron. No salió nada bien.';
      }
      break;
    }
    default:
      return { character, message: '' };
  }

  const next: Character = {
    ...character,
    stats: applyDelta(character.stats, effects),
    activityUses: { ...character.activityUses, [activityId]: uses + 1 },
  };
  return { character: next, message };
}
