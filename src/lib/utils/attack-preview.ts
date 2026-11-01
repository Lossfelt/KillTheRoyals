/**
 * Attack Preview - pure helpers for showing what a move will shoot
 * Used by the board to preview kills before a move and to animate kills after it
 */

import type {
	ArmorPosition,
	AttackMapping,
	BoardPosition,
	Card,
	CardsInPlay,
	GameState,
	GridPosition,
	RoyalPosition
} from '#lib/types.js';
import { ATTACK_MAPPINGS } from '#lib/types.js';
import {
	GRID_POSITIONS,
	canPlaceNumberedCard,
	evaluateAttacksFromPosition,
	getArmorPositionForRoyal,
	isRoyalDead,
	type AttackResult
} from './game-logic.js';

/**
 * A card about to be placed, and the grid positions it may go to
 */
interface PendingMove {
	card: Card;
	source: GridPosition | null; // Set when a joker moves a card between stacks
	targets: readonly GridPosition[];
}

/**
 * Line of fire from a grid position to the royal it would kill
 */
export interface AimLine {
	shooter: GridPosition;
	royal: RoyalPosition;
}

export interface AttackPreview {
	killCounts: Partial<Record<GridPosition, number>>; // Royals each target would kill
	targeted: BoardPosition[]; // Royals and armor the hovered move would kill
	aiming: GridPosition[]; // Hovered position and the payload cards it fires
	lines: AimLine[]; // Lines of fire for the hovered move
}

/**
 * A royal that died in the last state change, and the cards that shot it
 */
export interface KillEvent {
	royal: RoyalPosition;
	armor: ArmorPosition;
	shooter: GridPosition;
	payloadPositions: readonly [GridPosition, GridPosition];
}

export const EMPTY_PREVIEW: AttackPreview = { killCounts: {}, targeted: [], aiming: [], lines: [] };

/**
 * List the royals that would die if a card were placed on a grid position
 * @param source - Stack the card is moved from (joker moves), or null when drawn from the deck
 */
export function previewKills(
	card: Card,
	target: GridPosition,
	cardsInPlay: CardsInPlay,
	source: GridPosition | null = null
): AttackResult[] {
	if (source === target) return [];
	if (!canPlaceNumberedCard(card, cardsInPlay[target])) return [];

	const hypothetical: CardsInPlay = {
		...cardsInPlay,
		[target]: [card, ...cardsInPlay[target]]
	};
	if (source) {
		hypothetical[source] = cardsInPlay[source].slice(1);
	}

	return evaluateAttacksFromPosition(target, hypothetical).filter((attack) => attack.kills);
}

/**
 * Find the move the player is about to make, if any
 */
function getPendingMove(state: GameState): PendingMove | null {
	if (state.isSetupPhase || state.viewStackMode || state.aceInUse) return null;

	if (state.jokerInUse) {
		const source = state.jokerSourceStack;
		const card = source ? state.cardsInPlay[source][0] : undefined;
		if (!source || !card) return null;

		const targets = GRID_POSITIONS.filter(
			(pos) => pos !== source && canPlaceNumberedCard(card, state.cardsInPlay[pos])
		);
		return { card, source, targets };
	}

	const card = state.deck[0];
	if (!card || state.alternativeGridPositions.length === 0) return null;
	return { card, source: null, targets: state.alternativeGridPositions };
}

/**
 * Build the board preview: kill counts on every target, details for the hovered one
 */
export function buildAttackPreview(state: GameState, hovered: GridPosition | null): AttackPreview {
	const move = getPendingMove(state);
	if (!move) return EMPTY_PREVIEW;

	const preview: AttackPreview = { killCounts: {}, targeted: [], aiming: [], lines: [] };

	for (const target of move.targets) {
		const kills = previewKills(move.card, target, state.cardsInPlay, move.source);
		if (kills.length > 0) preview.killCounts[target] = kills.length;

		if (target !== hovered) continue;
		for (const kill of kills) {
			preview.targeted.push(kill.royal);
			if (state.cardsInPlay[kill.armor][0]) preview.targeted.push(kill.armor);
			preview.aiming.push(...kill.payloadPositions);
			preview.lines.push({ shooter: target, royal: kill.royal });
		}
		if (kills.length > 0) preview.aiming.push(target);
	}

	return preview;
}

/**
 * Compare two board states and list the royals that were killed in between
 */
export function findKillEvents(previous: CardsInPlay, next: CardsInPlay): KillEvent[] {
	const events: KillEvent[] = [];
	const entries = Object.entries(ATTACK_MAPPINGS) as [GridPosition, readonly AttackMapping[]][];

	for (const [shooter, attacks] of entries) {
		for (const attack of attacks) {
			const before = previous[attack.royal][0];
			if (!before || isRoyalDead(before) || !isRoyalDead(next[attack.royal][0])) continue;

			events.push({
				royal: attack.royal,
				armor: getArmorPositionForRoyal(attack.royal),
				shooter,
				payloadPositions: attack.payloadPositions
			});
		}
	}

	return events;
}
