export type ContentId =
  | 'game.title'
  | 'school.tokyo'
  | 'school.kyoto'
  | 'technique.limitless'
  | 'technique.limitless.ultimate'
  | 'technique.reinforcement'
  | 'technique.reinforcement.ultimate'
  | 'technique.shikigami'
  | 'technique.shikigami.ultimate'
  | 'technique.blood'
  | 'technique.blood.ultimate'
  | 'npc.mentor'
  | 'npc.rival'
  | 'npc.friend'
  | 'npc.upperclassman'
  | 'npc.antagonist'
  | 'npc.curseBoss'
  | 'org.society';

export type ContentPack = Record<ContentId, string>;

export type ContentPackId = 'original' | 'canon';
