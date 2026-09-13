import type { ContentId } from '../content/types';

export type RelationRole = 'parent' | 'sibling' | 'friend' | 'rival' | 'mentor' | 'partner' | 'child';

export interface Relationship {
  id: string;
  name: string;
  role: RelationRole;
  affinity: number;
  married?: boolean;
  contentId?: ContentId;
}

const firstNames = [
  'Haru', 'Sora', 'Kenji', 'Aoi', 'Ren', 'Yui', 'Riku', 'Nana', 'Kaito', 'Mio',
  'Yuma', 'Hina', 'Sato', 'Emi', 'Taro', 'Nozomi', 'Ken', 'Airi', 'Daiki', 'Saki',
];

const surnames = [
  'Tanaka', 'Suzuki', 'Kobayashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kato', 'Mori', 'Shimizu',
];

function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomFullName(): string {
  return `${randomFrom(firstNames)} ${randomFrom(surnames)}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Date.now().toString(36)}`;
}

export function createStarterFamily(): Relationship[] {
  const family: Relationship[] = [
    { id: nextId('parent'), name: randomFullName(), role: 'parent', affinity: randomInt(55, 85) },
    { id: nextId('parent'), name: randomFullName(), role: 'parent', affinity: randomInt(55, 85) },
  ];
  const siblingCount = randomInt(0, 2);
  for (let i = 0; i < siblingCount; i++) {
    family.push({ id: nextId('sibling'), name: randomFullName(), role: 'sibling', affinity: randomInt(40, 80) });
  }
  return family;
}

export function createCanonNpc(role: 'friend' | 'rival' | 'mentor', contentId: ContentId): Relationship {
  return { id: nextId(role), name: '', role, affinity: 50, contentId };
}

export function createDatingCandidate(): Relationship {
  return { id: nextId('partner'), name: randomFullName(), role: 'partner', affinity: randomInt(20, 40) };
}

export function createChild(): Relationship {
  return { id: nextId('child'), name: randomFrom(firstNames), role: 'child', affinity: 85 };
}
