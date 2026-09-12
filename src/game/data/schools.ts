import type { ContentId } from '../content/types';

export type SchoolId = 'tokyo' | 'kyoto';

export interface SchoolDef {
  id: SchoolId;
  nameContentId: ContentId;
  description: string;
}

export const schools: SchoolDef[] = [
  {
    id: 'tokyo',
    nameContentId: 'school.tokyo',
    description: 'Prioriza la experiencia de campo temprana y el trabajo en equipo.',
  },
  {
    id: 'kyoto',
    nameContentId: 'school.kyoto',
    description: 'Tradición y disciplina; forma hechiceros de linajes con historia.',
  },
];

export function getSchool(id: SchoolId): SchoolDef {
  const school = schools.find((s) => s.id === id);
  if (!school) throw new Error(`Unknown school: ${id}`);
  return school;
}
