/**
 * Card Motion - pure diff of two game states into card moves to animate
 * The board animates each move from the source slot to the target slot.
 */

import type { Card, GameState } from '#lib/types.js';
import { ROYAL_ARMOR_PAIRS } from '#lib/types.js';
import { GRID_POSITIONS } from './game-logic.js';

export interface CardMove {
	from: string;
	to: string;
	heavy: boolean; // Kings land with a thud
}

const SPECIAL_SLOTS = ['joker1', 'joker2', 'ace1', 'ace2', 'ace3', 'ace4'] as const;
const ROYAL_SLOTS = ROYAL_ARMOR_PAIRS.map((pair) => pair.royal);
const ARMOR_SLOTS = ROYAL_ARMOR_PAIRS.map((pair) => pair.armor);

const TARGET_SLOTS: readonly string[] = [
	'deck',
	'pending',
	...GRID_POSITIONS,
	...ROYAL_SLOTS,
	...ARMOR_SLOTS,
	...SPECIAL_SLOTS
];
// Slots a card can be moved out of
const SOURCE_SLOTS: readonly string[] = ['deck', 'pending', ...GRID_POSITIONS];

// More moves than this in one change means a restart or new deal, not a move
const MAX_MOVES = 3;

/**
 * Top card of any slot, including the deck and the pile of royals waiting to be placed
 */
function topAt(state: GameState, slot: string): Card | undefined {
	if (slot === 'deck') return state.deck[0];
	if (slot === 'pending') return state.cardsInPlay.royalsToBePlaced[0];
	return state.cardsInPlay[slot as keyof GameState['cardsInPlay']]?.[0];
}

// Real cards only: dead royals and used specials are markers, not cards that travel
function keyOf(card: Card | undefined): string | null {
	if (!card || card.value === 'DEAD' || card.value === 'USED') return null;
	return `${card.value}-${card.suit}`;
}

/**
 * List the cards that moved from one visible slot to another between two states
 */
export function findCardMoves(previous: GameState, next: GameState): CardMove[] {
	const sources = new Map<string, string>();
	for (const slot of SOURCE_SLOTS) {
		const key = keyOf(topAt(previous, slot));
		if (key) sources.set(key, slot);
	}

	const moves: CardMove[] = [];
	for (const slot of TARGET_SLOTS) {
		const card = topAt(next, slot);
		const key = keyOf(card);
		if (!key || key === keyOf(topAt(previous, slot))) continue;

		const from = sources.get(key);
		if (from && from !== slot) {
			const heavy = card?.value === 13 && (ROYAL_SLOTS as string[]).includes(slot);
			moves.push({ from, to: slot, heavy });
		}
	}

	return moves.length > MAX_MOVES ? [] : moves;
}
