export interface Stats {
  physical: number;
  intelligence: number;
  charisma: number;
  luck: number;
  mentalHealth: number;
  money: number;
  cursedEnergy: number;
  technique: number;
  reputation: number;
}

export type StatKey = keyof Stats;

export type StatDelta = Partial<Record<StatKey, number>>;

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function applyDelta(stats: Stats, delta: StatDelta): Stats {
  const next: Stats = { ...stats };
  for (const key of Object.keys(delta) as StatKey[]) {
    const change = delta[key] ?? 0;
    if (key === 'money') {
      next.money = Math.max(0, next.money + change);
    } else {
      next[key] = clampStat(next[key] + change);
    }
  }
  return next;
}

export function randomStartingStats(): Stats {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    physical: rand(20, 60),
    intelligence: rand(20, 60),
    charisma: rand(20, 60),
    luck: rand(10, 70),
    mentalHealth: rand(50, 80),
    money: rand(0, 20),
    cursedEnergy: rand(5, 30),
    technique: 0,
    reputation: 0,
  };
}
