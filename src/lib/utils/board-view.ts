/**
 * Board View - pure helpers that decide how each board slot is shown
 */

import type { ArmorPosition, GameState, GridPosition, RoyalPosition } from '#lib/types.js';

// Cards wait while royals need to be placed or the grid cannot take the top card
function isWaiting(state: GameState): boolean {
	return state.cardsInPlay.royalsToBePlaced.length > 0 || !state.canPlaceTopCardOnGrid;
}

// Joker, Ace and view-stack modes keep the whole grid clickable
function isGridMode(state: GameState): boolean {
	return !!state.jokerInUse || !!state.aceInUse || state.viewStackMode;
}

export function isAlternativeRoyal(state: GameState, position: RoyalPosition): boolean {
	return state.alternativeRoyalPositions.includes(position);
}

export function isAlternativeArmor(state: GameState, position: ArmorPosition): boolean {
	return state.alternativeArmorPositions.includes(position);
}

export function shouldDimGridCard(state: GameState, position: GridPosition): boolean {
	if (isGridMode(state)) return false;
	if (isWaiting(state)) return true;

	// If there are alternative positions, dim cards that are NOT in the list
	const alternatives = state.alternativeGridPositions;
	return alternatives.length > 0 && !alternatives.includes(position);
}

// Alternative positions are never dimmed - they need to be clickable
export function shouldDimRoyal(state: GameState, position: RoyalPosition): boolean {
	return !isAlternativeRoyal(state, position) && isWaiting(state);
}

export function shouldDimArmor(state: GameState, position: ArmorPosition): boolean {
	return !isAlternativeArmor(state, position) && isWaiting(state);
}

/**
 * Golden glow on a grid card: every card in setup replace mode,
 * otherwise the positions the drawn card can go to
 */
export function shouldShowGridAlternative(state: GameState, position: GridPosition): boolean {
	if (isGridMode(state)) return false;
	if (state.setupPhaseReplaceMode) return true;
	return state.alternativeGridPositions.includes(position);
}
