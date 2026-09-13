export interface JobTier {
  title: string;
  salary: number;
}

export const jobLadder: JobTier[] = [
  { title: 'Cajero', salary: 40 },
  { title: 'Empleado administrativo', salary: 70 },
  { title: 'Supervisor', salary: 110 },
  { title: 'Gerente', salary: 170 },
  { title: 'Director', salary: 260 },
];

export function getJobTier(tierIndex: number): JobTier {
  return jobLadder[Math.max(0, Math.min(jobLadder.length - 1, tierIndex))];
}
