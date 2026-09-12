import type { StatDelta } from './stats';

export type LifeStage = 'child' | 'teen' | 'civilian' | 'sorcerer';

export interface EventOption {
  label: string;
  resultText: string;
  effects?: StatDelta;
  setFlags?: string[];
  death?: boolean;
  deathCause?: string;
  retire?: boolean;
}

export interface LifeEvent {
  id: string;
  minAge: number;
  maxAge: number;
  stages: LifeStage[];
  requiresFlags?: string[];
  excludesFlags?: string[];
  once?: boolean;
  weight?: number;
  text: string;
  options: EventOption[];
}

export const events: LifeEvent[] = [
  // ---- Childhood (0-10) ----
  {
    id: 'child_shadows',
    minAge: 3,
    maxAge: 5,
    stages: ['child'],
    once: true,
    text: 'Empezaste a ver sombras que se mueven solas cuando nadie más las nota.',
    options: [
      {
        label: 'Ignorarlo y no contarle a nadie',
        resultText: 'Aprendiste a guardarte lo que ves. Te sentís un poco más solo.',
        effects: { mentalHealth: -2 },
      },
      {
        label: 'Contárselo a tus padres',
        resultText: 'Te escucharon con paciencia. Te sentiste acompañado.',
        effects: { mentalHealth: 2, charisma: 1 },
      },
    ],
  },
  {
    id: 'child_lost_forest',
    minAge: 5,
    maxAge: 7,
    stages: ['child'],
    once: true,
    text: 'Te perdiste en un parque y un desconocido de anteojos raros te ayudó a volver a casa, riéndose todo el camino.',
    options: [
      {
        label: 'Preguntarle su nombre',
        resultText: 'Te dijo que ya se iban a volver a ver. No mentía.',
        effects: { luck: 2 },
        setFlags: ['met_mentor'],
      },
      {
        label: 'Salir corriendo apenas llegaste a tu calle',
        resultText: 'Preferiste no pensar más en el asunto.',
        effects: { mentalHealth: 1 },
      },
    ],
  },
  {
    id: 'child_sports',
    minAge: 6,
    maxAge: 9,
    stages: ['child'],
    once: true,
    text: 'En la escuela primaria tenés que elegir en qué actividad meterte.',
    options: [
      {
        label: 'Deportes',
        resultText: 'Volvés a casa agotado pero cada vez más fuerte.',
        effects: { physical: 4 },
      },
      {
        label: 'Club de lectura',
        resultText: 'Devorás libros de historias imposibles.',
        effects: { intelligence: 4 },
      },
      {
        label: 'Dibujo y arte',
        resultText: 'Hacés amigos entre clase y clase.',
        effects: { charisma: 3 },
      },
    ],
  },
  {
    id: 'child_nightmare',
    minAge: 7,
    maxAge: 10,
    stages: ['child'],
    once: true,
    text: 'Una pesadilla recurrente con una criatura deforme te persigue noche tras noche.',
    options: [
      {
        label: 'Dormir con la luz prendida',
        resultText: 'Las noches se hacen un poco más largas.',
        effects: { mentalHealth: -3 },
      },
      {
        label: 'Enfrentar la pesadilla en el sueño',
        resultText: 'Despertás con una sensación extraña de calma.',
        effects: { mentalHealth: 1, cursedEnergy: 3 },
      },
    ],
  },
  {
    id: 'child_amulet',
    minAge: 8,
    maxAge: 10,
    stages: ['child'],
    once: true,
    text: 'Encontraste un amuleto extraño enterrado en el patio de tu casa.',
    options: [
      {
        label: 'Quedártelo',
        resultText: 'Lo guardás como un tesoro personal.',
        effects: { luck: 3 },
        setFlags: ['has_amulet'],
      },
      {
        label: 'Enterrarlo de nuevo',
        resultText: 'Preferís no arriesgarte.',
        effects: { mentalHealth: 1 },
      },
    ],
  },
  {
    id: 'child_bully',
    minAge: 9,
    maxAge: 10,
    stages: ['child'],
    once: true,
    text: 'Un compañero más grande te empezó a molestar todos los días a la salida.',
    options: [
      {
        label: 'Plantarte y defenderte',
        resultText: 'Te llevaste un par de golpes, pero no volvió a molestarte.',
        effects: { physical: 3, mentalHealth: -1 },
      },
      {
        label: 'Hablar con él y resolverlo con calma',
        resultText: 'Terminaron llevándose bien.',
        effects: { charisma: 3 },
      },
    ],
  },

  // ---- Teen / normal school (11-14) ----
  {
    id: 'teen_club',
    minAge: 11,
    maxAge: 12,
    stages: ['teen'],
    once: true,
    text: 'Empezaste la secundaria. Es momento de elegir un club.',
    options: [
      {
        label: 'Club deportivo',
        resultText: 'Tu resistencia mejora semana a semana.',
        effects: { physical: 4 },
      },
      {
        label: 'Club de ciencias',
        resultText: 'Te destacás resolviendo problemas complejos.',
        effects: { intelligence: 4 },
      },
      {
        label: 'Consejo estudiantil',
        resultText: 'Aprendés a hablar frente a otros sin miedo.',
        effects: { charisma: 4 },
      },
    ],
  },
  {
    id: 'teen_witness_curse',
    minAge: 12,
    maxAge: 13,
    stages: ['teen'],
    once: true,
    text: 'Viste algo horrible: una sombra deforme atacó a alguien en un callejón y luego desapareció como si nunca hubiera estado ahí.',
    options: [
      {
        label: 'Convencerte de que fue una alucinación',
        resultText: 'Intentás seguir con tu vida normal, aunque algo cambió en vos.',
        effects: { mentalHealth: -4 },
      },
      {
        label: 'Investigar por tu cuenta qué fue eso',
        resultText: 'No encontrás respuestas, pero no podés dejar de pensarlo.',
        effects: { mentalHealth: -2, intelligence: 2 },
        setFlags: ['saw_curse'],
      },
    ],
  },
  {
    id: 'teen_family_tragedy',
    minAge: 13,
    maxAge: 14,
    stages: ['teen'],
    once: true,
    requiresFlags: ['saw_curse'],
    text: 'Un familiar cercano murió en circunstancias que la policía no pudo explicar.',
    options: [
      {
        label: 'Guardarte el dolor y seguir adelante',
        resultText: 'Algo en vos se endurece.',
        effects: { mentalHealth: -8, physical: 2 },
        setFlags: ['family_tragedy'],
      },
      {
        label: 'Buscar consuelo en tu familia',
        resultText: 'El dolor no desaparece, pero no estás solo.',
        effects: { mentalHealth: -4, charisma: 2 },
        setFlags: ['family_tragedy'],
      },
    ],
  },
  {
    id: 'teen_self_training',
    minAge: 13,
    maxAge: 14,
    stages: ['teen'],
    once: true,
    text: 'Empezaste a entrenar artes marciales por tu cuenta, casi como si tu cuerpo lo pidiera.',
    options: [
      {
        label: 'Entrenar todos los días',
        resultText: 'Tu cuerpo responde cada vez mejor.',
        effects: { physical: 5, mentalHealth: 1 },
      },
      {
        label: 'Entrenar solo los fines de semana',
        resultText: 'Vas progresando de a poco.',
        effects: { physical: 2 },
      },
    ],
  },
  {
    id: 'teen_detected',
    minAge: 14,
    maxAge: 14,
    stages: ['teen'],
    once: true,
    text: 'Un adulto de traje impecable se te acercó después de clase. Dijo sentir "algo" en vos que casi nadie tiene, y te habló de un mundo oculto de hechiceros y maldiciones.',
    options: [
      {
        label: 'Escuchar con atención',
        resultText: 'Te dejó una tarjeta con una dirección y una fecha de examen.',
        effects: { cursedEnergy: 5 },
        setFlags: ['detected_by_society'],
      },
      {
        label: 'Desconfiar y alejarte',
        resultText: 'Te fuiste sin mirar atrás, aunque la curiosidad no te suelta.',
        effects: { mentalHealth: 1 },
      },
    ],
  },

  // ---- Entrance exam (15) ----
  {
    id: 'exam_invite',
    minAge: 15,
    maxAge: 16,
    stages: ['teen'],
    once: true,
    text: 'Recibís una invitación formal para rendir el examen de ingreso a una escuela de hechiceros.',
    options: [
      {
        label: 'Presentarte al examen',
        resultText: 'Es hora de la verdad.',
        setFlags: ['taking_exam'],
      },
      {
        label: 'Rechazar y quedarte con una vida normal',
        resultText: 'Elegiste el camino conocido. Quizás algún día te arrepientas.',
        setFlags: ['declined_exam'],
      },
    ],
  },

  // ---- Sorcerer life (15+) ----
  {
    id: 'sorc_first_mission',
    minAge: 15,
    maxAge: 18,
    stages: ['sorcerer'],
    once: true,
    text: 'Tu primera misión oficial: exorcizar una maldición menor que ronda una escuela abandonada.',
    options: [
      {
        label: 'Ir directo y confiar en tu fuerza',
        resultText: 'Fue más difícil de lo esperado, pero volviste de una pieza.',
        effects: { physical: 2, cursedEnergy: 2, reputation: 3 },
      },
      {
        label: 'Planificar el enfrentamiento con cuidado',
        resultText: 'La preparación dio sus frutos.',
        effects: { intelligence: 2, technique: 3, reputation: 3 },
      },
    ],
  },
  {
    id: 'sorc_mentor_training',
    minAge: 15,
    maxAge: 30,
    stages: ['sorcerer'],
    weight: 2,
    text: 'Tenés la oportunidad de entrenar con {{npc.mentor}}.',
    options: [
      {
        label: 'Aceptar cada consejo sin cuestionar',
        resultText: 'Tu técnica mejora más rápido de lo que esperabas.',
        effects: { technique: 5, cursedEnergy: 3 },
      },
      {
        label: 'Entrenar a tu manera, ignorando parte de los consejos',
        resultText: 'Avanzás más lento, pero a tu propio estilo.',
        effects: { technique: 2, mentalHealth: 1 },
      },
    ],
  },
  {
    id: 'sorc_rivalry',
    minAge: 15,
    maxAge: 25,
    stages: ['sorcerer'],
    once: true,
    text: '{{npc.rival}} te reta a un entrenamiento uno contra uno para ver quién es más fuerte.',
    options: [
      {
        label: 'Aceptar el desafío',
        resultText: 'La rivalidad te empuja a mejorar.',
        effects: { physical: 2, technique: 2, reputation: 2 },
      },
      {
        label: 'Rechazar la pelea',
        resultText: 'Preferís no entrar en ese juego.',
        effects: { mentalHealth: 1 },
      },
    ],
  },
  {
    id: 'sorc_teamwork',
    minAge: 15,
    maxAge: 30,
    stages: ['sorcerer'],
    weight: 2,
    text: 'Te asignan una misión en equipo junto a {{npc.friend}}.',
    options: [
      {
        label: 'Coordinar bien la estrategia',
        resultText: 'El trabajo en equipo funcionó a la perfección.',
        effects: { charisma: 2, reputation: 3, money: 5 },
      },
      {
        label: 'Actuar cada uno por su cuenta',
        resultText: 'La misión salió bien, aunque con roces entre ustedes.',
        effects: { reputation: 1, mentalHealth: -1 },
      },
    ],
  },
  {
    id: 'sorc_special_grade_encounter',
    minAge: 16,
    maxAge: 30,
    stages: ['sorcerer'],
    once: true,
    requiresFlags: [],
    text: 'Te cruzás por accidente con {{npc.curseBoss}}, una maldición de grado especial. Es muchísimo más fuerte que vos.',
    options: [
      {
        label: 'Huir apenas puedas',
        resultText: 'Escapaste por muy poco. El miedo te acompaña varios días.',
        effects: { mentalHealth: -6, luck: 2 },
        setFlags: ['survived_special_grade'],
      },
      {
        label: 'Plantarte y resistir para proteger a otros',
        resultText: 'Saliste malherido, pero lograste salvar a los civiles cercanos.',
        effects: { physical: -8, mentalHealth: -3, reputation: 8, cursedEnergy: 4 },
        setFlags: ['survived_special_grade'],
      },
    ],
  },
  {
    id: 'sorc_overwork',
    minAge: 17,
    maxAge: 35,
    stages: ['sorcerer'],
    weight: 2,
    text: 'Llevás semanas encadenando misiones sin descanso.',
    options: [
      {
        label: 'Seguir aceptando misiones',
        resultText: 'El cansancio empieza a pasarte factura.',
        effects: { mentalHealth: -6, money: 10, reputation: 2 },
      },
      {
        label: 'Tomarte unos días de descanso',
        resultText: 'Volvés con la cabeza despejada.',
        effects: { mentalHealth: 6, money: -3 },
      },
    ],
  },
  {
    id: 'sorc_day_off',
    minAge: 15,
    maxAge: 40,
    stages: ['sorcerer'],
    weight: 2,
    text: 'Tenés un día libre entre misiones.',
    options: [
      {
        label: 'Salir a comer con tus compañeros',
        resultText: 'Un buen descanso entre tanta locura.',
        effects: { charisma: 2, mentalHealth: 3, money: -3 },
      },
      {
        label: 'Quedarte entrenando en soledad',
        resultText: 'Aprovechaste el tiempo para mejorar tu técnica.',
        effects: { technique: 2, mentalHealth: -1 },
      },
    ],
  },
  {
    id: 'sorc_upperclassman_advice',
    minAge: 15,
    maxAge: 22,
    stages: ['sorcerer'],
    once: true,
    text: '{{npc.upperclassman}}, una hechicera de un grado superior, te ofrece consejos sobre el uso de herramientas malditas.',
    options: [
      {
        label: 'Aprender todo lo que puedas',
        resultText: 'Sumaste herramientas útiles a tu arsenal.',
        effects: { technique: 3, intelligence: 2 },
      },
      {
        label: 'Confiar solo en tu propia técnica',
        resultText: 'Preferís forjar tu propio camino.',
        effects: { mentalHealth: 1, cursedEnergy: 2 },
      },
    ],
  },
  {
    id: 'sorc_antagonist_confrontation',
    minAge: 20,
    maxAge: 45,
    stages: ['sorcerer'],
    once: true,
    requiresFlags: ['survived_special_grade'],
    text: 'Rumores confirmados: {{npc.antagonist}} despertó de nuevo, y esta vez el camino se cruza directamente con el tuyo.',
    options: [
      {
        label: 'Enfrentarlo de lleno, sin apoyo',
        resultText: 'Fue la pelea más dura de tu vida. Sobreviviste por muy poco.',
        effects: { physical: -15, mentalHealth: -10, cursedEnergy: 10, reputation: 20 },
      },
      {
        label: 'Coordinar con otros hechiceros antes de actuar',
        resultText: 'La estrategia conjunta marcó la diferencia.',
        effects: { physical: -8, reputation: 15, charisma: 3 },
      },
    ],
  },
  {
    id: 'sorc_retirement_offer',
    minAge: 30,
    maxAge: 50,
    stages: ['sorcerer'],
    once: true,
    text: 'Después de tantos años, te ofrecen un puesto tranquilo formando a la próxima generación, lejos del combate.',
    options: [
      {
        label: 'Aceptar el retiro',
        resultText: 'Colgaste tu técnica en el mejor momento posible.',
        retire: true,
      },
      {
        label: 'Seguir en el frente de batalla',
        resultText: 'No estás listo para dejarlo todavía.',
        effects: { mentalHealth: 2 },
      },
    ],
  },

  // ---- Civilian path (no sorcerer) ----
  {
    id: 'civ_first_job',
    minAge: 18,
    maxAge: 20,
    stages: ['civilian'],
    once: true,
    text: 'Terminaste la escuela y es hora de conseguir tu primer trabajo.',
    options: [
      {
        label: 'Buscar algo estable, aunque sea aburrido',
        resultText: 'Conseguiste un trabajo de oficina tranquilo.',
        effects: { money: 10, mentalHealth: -1 },
      },
      {
        label: 'Perseguir lo que realmente te apasiona',
        resultText: 'El camino es incierto, pero te sentís vivo.',
        effects: { charisma: 3, mentalHealth: 3, money: -2 },
      },
    ],
  },
  {
    id: 'civ_promotion',
    minAge: 21,
    maxAge: 40,
    stages: ['civilian'],
    weight: 2,
    text: 'Tu esfuerzo en el trabajo no pasó desapercibido.',
    options: [
      {
        label: 'Pedir un ascenso',
        resultText: 'Te lo ganaste con creces.',
        effects: { money: 15, charisma: 1 },
      },
      {
        label: 'Mantener un perfil bajo',
        resultText: 'Preferís la tranquilidad antes que la presión.',
        effects: { mentalHealth: 2 },
      },
    ],
  },
  {
    id: 'civ_relationship',
    minAge: 20,
    maxAge: 35,
    stages: ['civilian'],
    once: true,
    text: 'Conociste a alguien que te hace sentir que la vida "normal" no está tan mal después de todo.',
    options: [
      {
        label: 'Comprometerte con esa relación',
        resultText: 'Formaste una familia lejos de las maldiciones.',
        effects: { mentalHealth: 6, charisma: 2 },
      },
      {
        label: 'Priorizar tu independencia',
        resultText: 'Preferís seguir tu camino sin ataduras.',
        effects: { money: 3 },
      },
    ],
  },
  {
    id: 'civ_curse_encounter',
    minAge: 20,
    maxAge: 50,
    stages: ['civilian'],
    once: true,
    text: 'Después de todo, no escapaste del todo de ese mundo: una maldición menor cruzó tu camino.',
    options: [
      {
        label: 'Correr y no mirar atrás',
        resultText: 'El corazón te late a mil, pero estás a salvo.',
        effects: { mentalHealth: -5, luck: 1 },
      },
      {
        label: 'Congelarte del miedo',
        resultText: 'Por suerte alguien más intervino a tiempo.',
        effects: { mentalHealth: -8 },
      },
    ],
  },

  // ---- Universal late life ----
  {
    id: 'late_health_check',
    minAge: 50,
    maxAge: 75,
    stages: ['child', 'teen', 'civilian', 'sorcerer'],
    weight: 2,
    text: 'El paso de los años empieza a notarse en tu cuerpo.',
    options: [
      {
        label: 'Cuidar tu salud de cerca',
        resultText: 'El esfuerzo vale la pena.',
        effects: { physical: 2, money: -5 },
      },
      {
        label: 'Restarle importancia',
        resultText: 'Preferís no pensar demasiado en eso.',
        effects: { physical: -3 },
      },
    ],
  },
  {
    id: 'late_reflection',
    minAge: 60,
    maxAge: 90,
    stages: ['child', 'teen', 'civilian', 'sorcerer'],
    weight: 2,
    text: 'Mirás atrás y pensás en todo el camino recorrido.',
    options: [
      {
        label: 'Sentir orgullo por tu vida',
        resultText: 'Una calma agradable te acompaña.',
        effects: { mentalHealth: 4 },
      },
      {
        label: 'Pensar en lo que pudo haber sido distinto',
        resultText: 'Algo de nostalgia se mezcla con el presente.',
        effects: { mentalHealth: -2 },
      },
    ],
  },
];
