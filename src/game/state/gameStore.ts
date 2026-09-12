import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCharacter, type Character, type Gender } from '../engine/character';
import { ageUp, applyEventOption } from '../engine/lifeSimulator';
import type { LifeEvent, EventOption } from '../data/events';
import type { SchoolId } from '../data/schools';
import type { TechniqueId } from '../data/techniques';
import type { ContentPackId } from '../content/types';

export type Screen =
  | 'menu'
  | 'creation'
  | 'life'
  | 'schoolSelection'
  | 'techniqueSelection'
  | 'endOfLife'
  | 'settings';

interface GameState {
  character: Character | null;
  pendingEvent: LifeEvent | null;
  lastResultText: string | null;
  screen: Screen;
  contentPack: ContentPackId;
  devMenuUnlocked: boolean;

  startNewLife: (name: string, gender: Gender) => void;
  ageUpYear: () => void;
  chooseOption: (option: EventOption) => void;
  chooseSchool: (schoolId: SchoolId) => void;
  chooseTechnique: (techniqueId: TechniqueId) => void;
  goToScreen: (screen: Screen) => void;
  setContentPack: (pack: ContentPackId) => void;
  unlockDevMenu: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: null,
      pendingEvent: null,
      lastResultText: null,
      screen: 'menu',
      contentPack: 'original',
      devMenuUnlocked: false,

      startNewLife: (name, gender) => {
        const character = createCharacter(name, gender);
        set({ character, pendingEvent: null, lastResultText: null, screen: 'life' });
      },

      ageUpYear: () => {
        const { character } = get();
        if (!character) return;
        const result = ageUp(character);
        if (result.died) {
          set({ character: result.character, pendingEvent: null, screen: 'endOfLife' });
          return;
        }
        set({ character: result.character, pendingEvent: result.event, lastResultText: null });
      },

      chooseOption: (option) => {
        const { character, pendingEvent } = get();
        if (!character || !pendingEvent) return;
        const next = applyEventOption(character, pendingEvent, option);
        const goingToEnd = !next.alive || next.retired;
        const needsSchool = next.isSorcerer && !next.schoolId;

        set({
          character: next,
          pendingEvent: null,
          lastResultText: option.resultText,
          screen: goingToEnd ? 'endOfLife' : needsSchool ? 'schoolSelection' : 'life',
        });
      },

      chooseSchool: (schoolId) => {
        const { character } = get();
        if (!character) return;
        const next: Character = {
          ...character,
          schoolId,
          log: [...character.log, { age: character.age, text: 'Elegiste tu escuela de hechicería.' }],
        };
        set({ character: next, screen: 'techniqueSelection' });
      },

      chooseTechnique: (techniqueId) => {
        const { character } = get();
        if (!character) return;
        const next: Character = {
          ...character,
          techniqueId,
          log: [...character.log, { age: character.age, text: 'Elegiste tu técnica maldita.' }],
        };
        set({ character: next, screen: 'life' });
      },

      goToScreen: (screen) => set({ screen }),
      setContentPack: (pack) => set({ contentPack: pack }),
      unlockDevMenu: () => set({ devMenuUnlocked: true }),
    }),
    {
      name: 'jujutsu-life-save',
    },
  ),
);
