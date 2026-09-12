import { originalPack } from './content.original';
import { canonPack } from './content.canon';
import type { ContentId, ContentPackId } from './types';

const packs = {
  original: originalPack,
  canon: canonPack,
} as const;

export function resolveContent(packId: ContentPackId, id: ContentId): string {
  return packs[packId][id];
}

const TOKEN_PATTERN = /\{\{([a-zA-Z0-9_.]+)\}\}/g;

// Replaces {{content.id}} tokens inside event/UI text with the active pack's value.
export function resolveTemplate(packId: ContentPackId, text: string): string {
  return text.replace(TOKEN_PATTERN, (match, id: string) => {
    const pack = packs[packId] as Record<string, string>;
    return pack[id] ?? match;
  });
}
