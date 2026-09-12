import { useGameStore } from '../state/gameStore';
import { resolveContent, resolveTemplate } from './contentProvider';
import type { ContentId } from './types';

export function useContent() {
  const pack = useGameStore((state) => state.contentPack);
  return {
    t: (id: ContentId) => resolveContent(pack, id),
    tt: (text: string) => resolveTemplate(pack, text),
    pack,
  };
}
