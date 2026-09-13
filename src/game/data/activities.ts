export interface ActivityDef {
  id: string;
  label: string;
  description: string;
  cost?: number;
  maxPerYear: number;
  civilianOnly?: boolean;
  sorcererOnly?: boolean;
}

export const activities: ActivityDef[] = [
  { id: 'gym', label: 'Gimnasio', description: 'Entrená tu cuerpo.', maxPerYear: 2 },
  {
    id: 'train_technique',
    label: 'Entrenar técnica',
    description: 'Practicás el control de tu técnica maldita.',
    maxPerYear: 2,
    sorcererOnly: true,
  },
  { id: 'study', label: 'Estudiar', description: 'Metete de lleno en los libros.', maxPerYear: 2 },
  { id: 'meditate', label: 'Meditar', description: 'Buscá calma y control interior.', maxPerYear: 2 },
  { id: 'therapist', label: 'Terapeuta', description: 'Hablar de lo que te pasa ayuda.', cost: 15, maxPerYear: 2 },
  { id: 'doctor', label: 'Médico', description: 'Un chequeo general.', cost: 20, maxPerYear: 2 },
  { id: 'social_media', label: 'Redes sociales', description: 'Mostrale al mundo quién sos.', maxPerYear: 2 },
  {
    id: 'petty_crime',
    label: 'Changa al margen de la ley',
    description: 'Dinero rápido, con riesgo de que salga mal.',
    maxPerYear: 2,
    civilianOnly: true,
  },
];
