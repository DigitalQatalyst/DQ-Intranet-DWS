/**
 * Unified reaction type definitions for Viva Engage-style reactions
 */

export type ReactionType =
  | 'like'
  | 'love'
  | 'celebrate'
  | 'applause'
  | 'clap'
  | 'wow'
  | 'surprised'
  | 'sad'
  | 'helpful'
  | 'insightful';

/**
 * Single source of truth for reaction configuration
 * Maps reaction types to their emoji and label
 */
export const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string }> = {
  like: { emoji: '👍', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' },
  celebrate: { emoji: '😄', label: 'Haha' },
  applause: { emoji: '🎉', label: 'Celebrate' },
  clap: { emoji: '👏', label: 'Applaud' },
  wow: { emoji: '😮', label: 'Wow' },
  surprised: { emoji: '😮', label: 'Surprised' },
  sad: { emoji: '😢', label: 'Sad' },
  helpful: { emoji: '👍', label: 'Helpful' },
  insightful: { emoji: '💡', label: 'Insightful' }
};

/**
 * Map emoji to reaction type (for emoji picker)
 */
export const EMOJI_TO_TYPE: Record<string, ReactionType> = {
  '👍': 'like',
  '❤️': 'love',
  '😄': 'celebrate',
  '🎉': 'applause',
  '👏': 'clap',
  '😮': 'wow',
  '😢': 'sad',
  '😡': 'sad',
  '😊': 'celebrate',
  '🎊': 'applause',
  '🔥': 'celebrate',
  '💯': 'celebrate',
  '👌': 'like',
  '🙌': 'clap',
  '😍': 'love',
  '😂': 'celebrate',
  '😱': 'surprised',
  '😲': 'surprised'
};

/**
 * Map Viva reactions to database reaction types (for backward compatibility)
 * Database only supports: 'like' | 'helpful' | 'insightful'
 */
export const REACTION_TO_DB_TYPE: Record<ReactionType, 'like' | 'helpful' | 'insightful'> = {
  like: 'like',
  love: 'like',
  celebrate: 'helpful',
  applause: 'helpful',
  clap: 'helpful',
  wow: 'insightful',
  surprised: 'insightful',
  sad: 'like',
  helpful: 'helpful',
  insightful: 'insightful'
};

/**
 * Quick reactions for hover popup
 */
export const QUICK_REACTIONS: Array<{ type: ReactionType; emoji: string; label: string }> = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'celebrate', emoji: '😄', label: 'Haha' },
  { type: 'applause', emoji: '🎉', label: 'Celebrate' },
  { type: 'clap', emoji: '👏', label: 'Applaud' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' }
];

/**
 * Get emoji for a reaction type
 * @throws Error if type is not in REACTION_CONFIG
 */
export function getReactionEmoji(type: ReactionType): string {
  const config = REACTION_CONFIG[type];
  if (!config) {
    throw new Error(`Invalid reaction type: ${type}`);
  }
  return config.emoji;
}

/**
 * Get label for a reaction type
 * @throws Error if type is not in REACTION_CONFIG
 */
export function getReactionLabel(type: ReactionType): string {
  const config = REACTION_CONFIG[type];
  if (!config) {
    throw new Error(`Invalid reaction type: ${type}`);
  }
  return config.label;
}

/**
 * Get reaction type from emoji
 */
export function getReactionTypeFromEmoji(emoji: string): ReactionType | null {
  return EMOJI_TO_TYPE[emoji] || null;
}

