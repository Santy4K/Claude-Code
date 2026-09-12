import type { ContentId } from '../content/types';
import type { StatKey } from './stats';

export type TechniqueId = 'limitless' | 'reinforcement' | 'shikigami' | 'blood';

export interface TechniqueDef {
  id: TechniqueId;
  nameContentId: ContentId;
  ultimateNameContentId: ContentId;
  style: string;
  primaryStat: StatKey;
}

export const techniques: TechniqueDef[] = [
  {
    id: 'limitless',
    nameContentId: 'technique.limitless',
    ultimateNameContentId: 'technique.limitless.ultimate',
    style: 'Control de espacio y distancia. Gran defensa, castiga a quien se acerca.',
    primaryStat: 'technique',
  },
  {
    id: 'reinforcement',
    nameContentId: 'technique.reinforcement',
    ultimateNameContentId: 'technique.reinforcement.ultimate',
    style: 'Refuerzo físico brutal para el combate cuerpo a cuerpo.',
    primaryStat: 'physical',
  },
  {
    id: 'shikigami',
    nameContentId: 'technique.shikigami',
    ultimateNameContentId: 'technique.shikigami.ultimate',
    style: 'Invocás sombras y criaturas que pelean por vos desde la distancia.',
    primaryStat: 'intelligence',
  },
  {
    id: 'blood',
    nameContentId: 'technique.blood',
    ultimateNameContentId: 'technique.blood.ultimate',
    style: 'Manipulás sangre maldita como arma cortante y ofensiva.',
    primaryStat: 'physical',
  },
];

export function getTechnique(id: TechniqueId): TechniqueDef {
  const technique = techniques.find((t) => t.id === id);
  if (!technique) throw new Error(`Unknown technique: ${id}`);
  return technique;
}
