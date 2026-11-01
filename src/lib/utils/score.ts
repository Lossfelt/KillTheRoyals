/**
 * Score helpers - shared by the status bar and the game over screen
 */

import type { CardsInPlay, SpecialPosition } from '#lib/types.js';
import { ROYAL_ARMOR_PAIRS } from '#lib/types.js';
import { isRoyalDead } from './game-logic.js';

const SPECIAL_POSITIONS: readonly SpecialPosition[] = [
	'joker1',
	'joker2',
	'ace1',
	'ace2',
	'ace3',
	'ace4'
];

export const TOTAL_ROYALS = 12;

/**
 * Score: start at 6 and lose 1 for each Joker or Ace that has been used (0-6)
 */
export function calculateScore(cardsInPlay: CardsInPlay): number {
	const used = SPECIAL_POSITIONS.filter((pos) => cardsInPlay[pos][0]?.value === 'USED').length;
	return SPECIAL_POSITIONS.length - used;
}

/**
 * Number of royals killed so far
 */
export function countKilledRoyals(cardsInPlay: CardsInPlay): number {
	return ROYAL_ARMOR_PAIRS.filter(({ royal }) => isRoyalDead(cardsInPlay[royal][0])).length;
}
