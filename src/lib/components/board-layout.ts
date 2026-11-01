/**
 * Board layout - the 7-column grid of slots, row by row
 * GameBoard renders this list instead of one hand-written Card per slot
 */

import type {
	AcePosition,
	ArmorPosition,
	GridPosition,
	JokerPosition,
	RoyalPosition
} from '#lib/types.js';

export type BoardCell =
	| { kind: 'empty' }
	| { kind: 'break' }
	| { kind: 'pending' } // Royals waiting to be placed
	| { kind: 'deck' }
	| { kind: 'grid'; pos: GridPosition }
	| { kind: 'royal'; pos: RoyalPosition }
	| { kind: 'armor'; pos: ArmorPosition }
	| { kind: 'joker'; pos: JokerPosition }
	| { kind: 'ace'; pos: AcePosition };

const empty: BoardCell = { kind: 'empty' };
const grid = (pos: GridPosition): BoardCell => ({ kind: 'grid', pos });
const royal = (pos: RoyalPosition): BoardCell => ({ kind: 'royal', pos });
const armor = (pos: ArmorPosition): BoardCell => ({ kind: 'armor', pos });

export const BOARD_LAYOUT: readonly BoardCell[] = [
	// Row 1: Upper armors + royals waiting to be placed
	empty,
	empty,
	armor('upperLeftArmor'),
	armor('upperMiddleArmor'),
	armor('upperRightArmor'),
	empty,
	{ kind: 'pending' },

	// Row 2: Upper royals
	empty,
	empty,
	royal('upperLeftRoyal'),
	royal('upperMiddleRoyal'),
	royal('upperRightRoyal'),
	empty,
	empty,

	// Rows 3-5: Side armors and royals around the 3x3 grid
	armor('leftUpperArmor'),
	royal('leftUpperRoyal'),
	grid('upperLeft'),
	grid('upperMiddle'),
	grid('upperRight'),
	royal('rightUpperRoyal'),
	armor('rightUpperArmor'),

	armor('leftMiddleArmor'),
	royal('leftMiddleRoyal'),
	grid('middleLeft'),
	grid('middleMiddle'),
	grid('middleRight'),
	royal('rightMiddleRoyal'),
	armor('rightMiddleArmor'),

	armor('leftBottomArmor'),
	royal('leftBottomRoyal'),
	grid('bottomLeft'),
	grid('bottomMiddle'),
	grid('bottomRight'),
	royal('rightBottomRoyal'),
	armor('rightBottomArmor'),

	// Row 6: Bottom royals
	empty,
	empty,
	royal('bottomLeftRoyal'),
	royal('bottomMiddleRoyal'),
	royal('bottomRightRoyal'),
	empty,
	empty,

	// Row 7: Bottom armors
	empty,
	empty,
	armor('bottomLeftArmor'),
	armor('bottomMiddleArmor'),
	armor('bottomRightArmor'),
	empty,
	empty,

	// Break between board and supply
	{ kind: 'break' },

	// Row 8: Deck + jokers + aces
	{ kind: 'deck' },
	{ kind: 'joker', pos: 'joker1' },
	{ kind: 'joker', pos: 'joker2' },
	{ kind: 'ace', pos: 'ace1' },
	{ kind: 'ace', pos: 'ace2' },
	{ kind: 'ace', pos: 'ace3' },
	{ kind: 'ace', pos: 'ace4' }
];
