import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCharacter, type Character, type Gender } from '../engine/character';
import { ageUp, applyEventOption } from '../engine/lifeSimulator';
import type { LifeEvent, EventOption } from '../data/events';
import type { SchoolId } from '../data/schools';
import type { TechniqueId } from '../data/techniques';
import type { ContentPackId } from '../content/types';
import {
  buyAsset as buyAssetFn,
  sellAsset as sellAssetFn,
  equipTool as equipToolFn,
  searchJob as searchJobFn,
  requestPromotion as requestPromotionFn,
  quitJob as quitJobFn,
} from '../engine/economy';
import { doActivity as doActivityFn } from '../engine/activities';
import {
  meetSomeone as meetSomeoneFn,
  relationshipAction as relationshipActionFn,
  type RelationshipActionType,
} from '../engine/relationshipActions';
import { getCurseTemplate } from '../data/curses';
import type { MissionOffer } from '../data/missions';
import {
  startCombat,
  chooseAction as combatChooseActionFn,
  resolveAttackQte,
  resolveDodgeQte,
  applyCombatOutcome,
  type CombatAction,
  type CombatState,
  type QteQuality,
} from '../engine/combat';

export type Screen =
  | 'menu'
  | 'creation'
  | 'life'
  | 'schoolSelection'
  | 'techniqueSelection'
  | 'endOfLife'
  | 'settings'
  | 'centro'
  | 'bienes'
  | 'relaciones'
  | 'actividades'
  | 'combat';

interface GameState {
  character: Character | null;
  pendingEvent: LifeEvent | null;
  lastResultText: string | null;
  screen: Screen;
  contentPack: ContentPackId;
  devMenuUnlocked: boolean;
  actionMessage: string | null;
  combat: CombatState | null;

  startNewLife: (name: string, gender: Gender) => void;
  ageUpYear: () => void;
  chooseOption: (option: EventOption) => void;
  chooseSchool: (schoolId: SchoolId) => void;
  chooseTechnique: (techniqueId: TechniqueId) => void;
  goToScreen: (screen: Screen) => void;
  setContentPack: (pack: ContentPackId) => void;
  unlockDevMenu: () => void;

  buyAsset: (assetId: string) => void;
  sellAsset: (assetId: string) => void;
  equipTool: (assetId: string) => void;
  searchJob: () => void;
  requestPromotion: () => void;
  quitJob: () => void;
  doActivity: (activityId: string) => void;
  meetSomeone: () => void;
  relationshipAction: (relationshipId: string, action: RelationshipActionType) => void;

  startMission: (mission: MissionOffer) => void;
  combatChoose: (action: CombatAction) => void;
  combatResolveAttack: (quality: QteQuality) => void;
  combatResolveDodge: (quality: QteQuality) => void;
  combatContinue: () => void;
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
      actionMessage: null,
      combat: null,

      startNewLife: (name, gender) => {
        const character = createCharacter(name, gender);
        set({ character, pendingEvent: null, lastResultText: null, screen: 'life', actionMessage: null });
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

        if (option.triggersCombat && next.alive) {
          const template = getCurseTemplate(option.triggersCombat);
          if (template) {
            const combat = startCombat(next, template);
            set({
              character: next,
              pendingEvent: null,
              lastResultText: option.resultText,
              combat,
              screen: 'combat',
            });
            return;
          }
        }

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

      goToScreen: (screen) => set({ screen, actionMessage: null }),
      setContentPack: (pack) => set({ contentPack: pack }),
      unlockDevMenu: () => set({ devMenuUnlocked: true }),

      buyAsset: (assetId) => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = buyAssetFn(character, assetId);
        set({ character: next, actionMessage: message });
      },
      sellAsset: (assetId) => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = sellAssetFn(character, assetId);
        set({ character: next, actionMessage: message });
      },
      equipTool: (assetId) => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = equipToolFn(character, assetId);
        set({ character: next, actionMessage: message });
      },
      searchJob: () => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = searchJobFn(character);
        set({ character: next, actionMessage: message });
      },
      requestPromotion: () => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = requestPromotionFn(character);
        set({ character: next, actionMessage: message });
      },
      quitJob: () => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = quitJobFn(character);
        set({ character: next, actionMessage: message });
      },
      doActivity: (activityId) => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = doActivityFn(character, activityId);
        set({ character: next, actionMessage: message });
      },
      meetSomeone: () => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = meetSomeoneFn(character);
        set({ character: next, actionMessage: message });
      },
      relationshipAction: (relationshipId, action) => {
        const { character } = get();
        if (!character) return;
        const { character: next, message } = relationshipActionFn(character, relationshipId, action);
        set({ character: next, actionMessage: message });
      },

      startMission: (mission) => {
        const { character } = get();
        if (!character) return;
        const template = getCurseTemplate(mission.curseId);
        if (!template) return;
        const combat = startCombat(character, template);
        set({ combat, screen: 'combat' });
      },
      combatChoose: (action) => {
        const { character, combat } = get();
        if (!character || !combat) return;
        set({ combat: combatChooseActionFn(combat, action, character) });
      },
      combatResolveAttack: (quality) => {
        const { character, combat } = get();
        if (!character || !combat) return;
        set({ combat: resolveAttackQte(combat, quality, character) });
      },
      combatResolveDodge: (quality) => {
        const { character, combat } = get();
        if (!character || !combat) return;
        set({ combat: resolveDodgeQte(combat, quality, character) });
      },
      combatContinue: () => {
        const { character, combat } = get();
        if (!character || !combat) return;
        const { character: updated } = applyCombatOutcome(character, combat);
        const goingToEnd = !updated.alive;
        set({ character: updated, combat: null, screen: goingToEnd ? 'endOfLife' : 'life' });
      },
    }),
    {
      name: 'jujutsu-life-save',
    },
  ),
);
