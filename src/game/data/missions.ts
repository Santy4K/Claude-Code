import { curseTemplates, type CurseTier } from './curses';
import type { RankId } from './ranks';

export interface MissionOffer {
  id: string;
  curseId: string;
  title: string;
  description: string;
  tier: CurseTier;
}

const flavors: Record<CurseTier, { title: string; description: string }[]> = {
  facil: [
    { title: 'Ruidos en la escuela abandonada', description: 'Vecinos reportan sonidos extraños de noche.' },
    { title: 'Desapariciones menores', description: 'Un par de mascotas desaparecieron en el barrio.' },
  ],
  media: [
    { title: 'Incidente en el subte', description: 'Pasajeros vieron algo que no debería existir.' },
    { title: 'Maldición en un templo viejo', description: 'El templo lleva décadas cerrado. Algo cambió.' },
  ],
  dificil: [
    { title: 'Ataque en zona residencial', description: 'Hay heridos. La situación es grave.' },
    { title: 'Brote en el hospital', description: 'El personal médico pide ayuda urgente.' },
  ],
  especial: [
    { title: 'Alerta de grado especial', description: 'La Sociedad movilizó a todos los hechiceros disponibles.' },
  ],
};

const rankTierWeight: Record<RankId, Partial<Record<CurseTier, number>>> = {
  grade4: { facil: 6, media: 1 },
  grade3: { facil: 4, media: 3, dificil: 1 },
  grade2: { facil: 2, media: 4, dificil: 2 },
  grade1: { media: 3, dificil: 4, especial: 1 },
  special: { dificil: 3, especial: 4 },
};

function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function pickTier(rank: RankId): CurseTier {
  const weights = rankTierWeight[rank];
  const entries = Object.entries(weights) as [CurseTier, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [tier, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return tier;
  }
  return entries[0][0];
}

let offerCounter = 0;

export function rollMissions(rank: RankId, count = 3): MissionOffer[] {
  const offers: MissionOffer[] = [];
  for (let i = 0; i < count; i++) {
    const tier = pickTier(rank);
    const candidates = curseTemplates.filter((c) => c.tier === tier);
    const curse = randomFrom(candidates.length > 0 ? candidates : curseTemplates);
    const flavor = randomFrom(flavors[tier]);
    offerCounter += 1;
    offers.push({
      id: `mission_${offerCounter}_${Date.now().toString(36)}`,
      curseId: curse.id,
      title: flavor.title,
      description: flavor.description,
      tier,
    });
  }
  return offers;
}
