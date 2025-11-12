/**
 * Game State Management - Svelte stores
 * Central state for the entire game
 */

import { writable, derived } from 'svelte/store';
import type {
	GameState,
	Card,
	GridPosition,
	AcePosition,
	JokerPosition,
	RoyalPosition
} from '$lib/types';
import { createShuffledDeck } from '$lib/utils/deck';
import {
	setupFirstNineCards,
	killRoyalsFromPosition,
	getRoyalPlacementPosition,
	getArmorPlacementPosition,
	canPlaceNumberedCard,
	checkGameWon,
	checkGameLost,
	countLivingRoyals
} from '$lib/utils/game-logic';

/**
 * Initialize a new game state
 */
function createInitialGameState(): GameState {
	const deck = createShuffledDeck();
	const { cardsInPlay, remainingDeck } = setupFirstNineCards(deck);

	return {
		deck: remainingDeck,
		cardsInPlay,
		jokerInUse: null,
		jokerSourceStack: null,
		aceInUse: null,
		isSetupPhase: true,
		setupPhaseReplaceMode: false,
		alternativeRoyalPositions: [],
		gameStatus: 'setup'
	};
}

// Main game state store
export const gameState = writable<GameState>(createInitialGameState());

// Derived stores for computed values
export const isGameOver = derived(
	gameState,
	($state) => $state.gameStatus === 'won' || $state.gameStatus === 'lost'
);

export const livingRoyalsCount = derived(gameState, ($state) =>
	countLivingRoyals($state.cardsInPlay)
);

export const topDeckCard = derived(gameState, ($state) => $state.deck[0] ?? null);

export const hasJokerActive = derived(gameState, ($state) => $state.jokerInUse !== null);

export const hasAceActive = derived(gameState, ($state) => $state.aceInUse !== null);

// Action: Restart the game
export function restartGame() {
	gameState.set(createInitialGameState());
}

// Action: Enable card replacement mode during setup
export function enableReplaceMode() {
	gameState.update((state) => ({
		...state,
		setupPhaseReplaceMode: true
	}));
}

// Action: Complete setup phase (either by replacing card or skipping)
export function completeSetup(replaceCard: boolean, position?: GridPosition) {
	gameState.update((state) => {
		if (!replaceCard || !position) {
			// Skip replacement
			return {
				...state,
				isSetupPhase: false,
				setupPhaseReplaceMode: false,
				gameStatus: 'playing'
			};
		}

		// Replace the card (based on legacy funcPlaceNormalCard logic)
		const card = state.cardsInPlay[position][0];
		if (!card) return state;

		const newDeck = [...state.deck];
		const lastCard = newDeck.pop(); // Save last card
		newDeck.push(card); // Add replaced card to deck

		// Cycle through deck until we find a numbered card (value < 11, not A, not Joker)
		while (
			newDeck.length > 0 &&
			((typeof newDeck[0].value === 'number' && newDeck[0].value >= 11) ||
				newDeck[0].value === 'A' ||
				newDeck[0].value === 'Joker')
		) {
			const cycledCard = newDeck.shift()!;
			newDeck.push(cycledCard);
		}

		// Take the numbered card from top
		const newCard = newDeck.shift()!;

		// Add the last card back to bottom of deck
		if (lastCard) {
			newDeck.push(lastCard);
		}

		const newCardsInPlay = {
			...state.cardsInPlay,
			[position]: [newCard]
		};

		return {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay,
			isSetupPhase: false,
			setupPhaseReplaceMode: false,
			gameStatus: 'playing'
		};
	});
}

// Action: Draw and place a numbered card on grid
export function placeNumberedCard(position: GridPosition) {
	gameState.update((state) => {
		const card = state.deck[0];
		if (!card) return state;

		// Legacy condition check: deck must have cards, all royals must be placed, card must be numbered
		if (
			state.deck.length === 0 ||
			state.cardsInPlay.royalsToBePlaced.length > 0 ||
			typeof card.value !== 'number' ||
			card.value >= 11
		) {
			return state; // Cannot place
		}

		// Check if placement is valid
		if (!canPlaceNumberedCard(card, state.cardsInPlay[position])) {
			return state; // Invalid placement
		}

		// Place the card
		const newDeck = state.deck.slice(1);
		const newCardsInPlay = {
			...state.cardsInPlay,
			[position]: [card, ...state.cardsInPlay[position]]
		};

		// Check for royal kills
		const updatedCardsInPlay = killRoyalsFromPosition(position, newCardsInPlay);

		// Check win/loss conditions
		const won = checkGameWon(updatedCardsInPlay);
		const lost = checkGameLost(newDeck, updatedCardsInPlay);

		return {
			...state,
			deck: newDeck,
			cardsInPlay: updatedCardsInPlay,
			gameStatus: won ? 'won' : lost ? 'lost' : 'playing'
		};
	});
}

// Action: Show alternatives for royal placement (or place if only one option)
export function placeRoyalCard() {
	gameState.update((state) => {
		// Check royalsToBePlaced first
		let royal: Card | null = null;

		if (state.cardsInPlay.royalsToBePlaced.length > 0) {
			royal = state.cardsInPlay.royalsToBePlaced[0];
		} else if (state.deck.length > 0) {
			const topCard = state.deck[0];
			if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
				royal = topCard;
			}
		}

		if (!royal) return state;

		// Find placement position(s)
		const positions = getRoyalPlacementPosition(royal, state.cardsInPlay);
		if (positions.length === 0) return state; // No valid position

		// If only one position, place immediately
		if (positions.length === 1) {
			return placeRoyalAtPosition(state, positions[0]);
		}

		// Multiple positions: show alternatives for player to choose
		return {
			...state,
			alternativeRoyalPositions: positions
		};
	});
}

// Action: Place royal at a specific position (used when player chooses)
export function selectRoyalPosition(position: RoyalPosition) {
	gameState.update((state) => {
		// Verify this is a valid alternative
		if (!state.alternativeRoyalPositions.includes(position)) {
			return state;
		}

		return placeRoyalAtPosition(state, position);
	});
}

// Helper: Actually place the royal at a position
function placeRoyalAtPosition(state: GameState, position: RoyalPosition): GameState {
	let royal: Card | null = null;
	let sourceIsRoyalStack = false;

	if (state.cardsInPlay.royalsToBePlaced.length > 0) {
		royal = state.cardsInPlay.royalsToBePlaced[0];
		sourceIsRoyalStack = true;
	} else if (state.deck.length > 0) {
		const topCard = state.deck[0];
		if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
			royal = topCard;
		}
	}

	if (!royal) return state;

	// Place the royal
	let newDeck = state.deck;
	let newRoyalsToBePlaced = state.cardsInPlay.royalsToBePlaced;

	if (sourceIsRoyalStack) {
		newRoyalsToBePlaced = newRoyalsToBePlaced.slice(1);
	} else {
		newDeck = newDeck.slice(1);
	}

	const newCardsInPlay = {
		...state.cardsInPlay,
		[position]: [royal],
		royalsToBePlaced: newRoyalsToBePlaced
	};

	return {
		...state,
		deck: newDeck,
		cardsInPlay: newCardsInPlay,
		alternativeRoyalPositions: [] // Clear alternatives
	};
}

// Action: Place an armor card (automatically placed on lowest-value royal)
export function placeArmorCard() {
	gameState.update((state) => {
		const card = state.deck[0];
		if (!card) return state;

		// Find armor placement position
		const position = getArmorPlacementPosition(card, state.cardsInPlay);
		if (!position) return state; // Can't place armor (game might be lost)

		// Place the armor
		const newDeck = state.deck.slice(1);
		const newCardsInPlay = {
			...state.cardsInPlay,
			[position]: [card]
		};

		return {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay
		};
	});
}

// Action: Activate an ace
export function activateAce(position: AcePosition) {
	gameState.update((state) => {
		const ace = state.cardsInPlay[position][0];
		if (!ace || ace.value !== 'A') return state;

		// Toggle ace activation
		return {
			...state,
			aceInUse: state.aceInUse === position ? null : position
		};
	});
}

// Action: Use ace to remove a stack
export function useAce(stackPosition: GridPosition) {
	gameState.update((state) => {
		if (!state.aceInUse) return state;

		const stack = state.cardsInPlay[stackPosition];
		if (stack.length === 0) return state;

		// Add stack to bottom of deck
		const newDeck = [...state.deck, ...stack];

		// Remove the used ace
		const newCardsInPlay = {
			...state.cardsInPlay,
			[stackPosition]: [],
			[state.aceInUse]: []
		};

		return {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay,
			aceInUse: null
		};
	});
}

// Action: Activate a joker
export function activateJoker(position: JokerPosition) {
	gameState.update((state) => {
		const joker = state.cardsInPlay[position][0];
		if (!joker || joker.value !== 'Joker') return state;

		// Deactivate if already active
		if (state.jokerInUse !== null) {
			return {
				...state,
				jokerInUse: null,
				jokerSourceStack: null
			};
		}

		// Activate joker (wait for stack selection)
		return state;
	});
}

// Action: Select source stack for joker move
export function selectJokerSource(position: GridPosition) {
	gameState.update((state) => {
		if (state.jokerSourceStack === position) {
			// Deselect
			return {
				...state,
				jokerSourceStack: null
			};
		}

		// Select source
		return {
			...state,
			jokerSourceStack: position
		};
	});
}

// Action: Move card using joker
export function useJoker(targetPosition: GridPosition) {
	gameState.update((state) => {
		if (!state.jokerSourceStack) return state;

		const sourceStack = state.cardsInPlay[state.jokerSourceStack];
		const targetStack = state.cardsInPlay[targetPosition];

		if (sourceStack.length === 0) return state;

		const cardToMove = sourceStack[0];

		// Check if move is valid (card can be placed on target)
		if (!canPlaceNumberedCard(cardToMove, targetStack)) {
			return state; // Invalid move
		}

		// Move the card
		const newCardsInPlay = {
			...state.cardsInPlay,
			[state.jokerSourceStack]: sourceStack.slice(1),
			[targetPosition]: [cardToMove, ...targetStack]
		};

		// Remove the used joker
		const jokerPos = state.jokerInUse;
		if (jokerPos) {
			newCardsInPlay[jokerPos] = [];
		}

		return {
			...state,
			cardsInPlay: newCardsInPlay,
			jokerInUse: null,
			jokerSourceStack: null
		};
	});
}

// Action: Cycle deck to find next royal (when no royals on board)
export function cycleDeckForRoyal() {
	gameState.update((state) => {
		const livingRoyals = countLivingRoyals(state.cardsInPlay);
		if (livingRoyals > 0) return state; // Royals exist, don't cycle

		// Find next royal in deck
		const cycledCards: Card[] = [];
		let foundRoyal = false;
		let newDeck = [...state.deck];

		while (newDeck.length > 0 && !foundRoyal) {
			const card = newDeck.shift()!;

			if (card.value === 11 || card.value === 12 || card.value === 13) {
				// Found a royal, put it at the front
				newDeck.unshift(card);
				foundRoyal = true;
			} else {
				// Not a royal, add to cycled cards
				cycledCards.push(card);
			}
		}

		// Add cycled cards to bottom of deck
		newDeck = [...newDeck, ...cycledCards];

		return {
			...state,
			deck: newDeck
		};
	});
}
