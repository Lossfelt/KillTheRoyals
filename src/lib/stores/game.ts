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
	RoyalPosition,
	CardsInPlay
} from '$lib/types';
import { isRoyalValue } from '$lib/types';
import { createShuffledDeck } from '$lib/utils/deck';
import {
	setupFirstNineCards,
	killRoyalsFromPosition,
	getRoyalPlacementPosition,
	getArmorPlacementPosition,
	canPlaceNumberedCard,
	canPlaceCardOnGrid,
	checkGameWon,
	checkGameLost,
	countLivingRoyals,
	isRoyalDead,
	isEmptyCard,
	createUsedCard
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
		canPlaceTopCardOnGrid: true, // During setup, this is not applicable yet
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

/**
 * Helper: Determine game status based on current state
 * Returns 'won', 'lost', or the current status
 */
function determineGameStatus(
	currentStatus: GameState['gameStatus'],
	deck: Card[],
	cardsInPlay: CardsInPlay
): GameState['gameStatus'] {
	// Only check during active gameplay
	if (currentStatus !== 'playing') {
		return currentStatus;
	}

	// Check win/loss conditions
	const won = checkGameWon(cardsInPlay);

	// Calculate if top card can be placed on grid
	let canPlaceTopCardOnGrid = true;
	const topCard = deck[0];
	if (topCard) {
		canPlaceTopCardOnGrid = canPlaceCardOnGrid(topCard, cardsInPlay);
	}

	const lost = checkGameLost(deck, cardsInPlay, canPlaceTopCardOnGrid);

	if (won) return 'won';
	if (lost) return 'lost';
	return 'playing';
}

/**
 * Helper: Update whether the top card can be placed on grid
 * This should be called after any card placement or deck change
 */
function updateCanPlaceTopCardOnGrid(state: GameState): GameState {
	const stateWithRoyalReady = ensureNextRoyalAvailable(state);
	const topCard = stateWithRoyalReady.deck[0];

	// If no card in deck, or in setup phase, keep as true
	if (!topCard || stateWithRoyalReady.isSetupPhase) {
		return { ...stateWithRoyalReady, canPlaceTopCardOnGrid: true };
	}

	// Check if top card can be placed on grid
	const canPlace = canPlaceCardOnGrid(topCard, stateWithRoyalReady.cardsInPlay);

	return { ...stateWithRoyalReady, canPlaceTopCardOnGrid: canPlace };
}

function ensureNextRoyalAvailable(state: GameState): GameState {
	if (
		state.isSetupPhase ||
		state.gameStatus !== 'playing' ||
		state.cardsInPlay.royalsToBePlaced.length > 0 ||
		countLivingRoyals(state.cardsInPlay) > 0 ||
		state.deck.length === 0
	) {
		return state;
	}

	const topCard = state.deck[0];
	if (topCard && isRoyalValue(topCard.value)) {
		return state;
	}

	const deckHasRoyal = state.deck.some((card) => isRoyalValue(card.value));
	if (!deckHasRoyal) {
		return state;
	}

	const newDeck = [...state.deck];
	const cycledCards: Card[] = [];

	while (newDeck.length > 0) {
		const card = newDeck.shift()!;
		if (isRoyalValue(card.value)) {
			newDeck.unshift(card);
			break;
		}
		cycledCards.push(card);
	}

	return {
		...state,
		deck: [...newDeck, ...cycledCards]
	};
}

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

		// Determine game status
		const gameStatus = determineGameStatus(state.gameStatus, newDeck, updatedCardsInPlay);

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: updatedCardsInPlay,
			gameStatus
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
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

	// Validate that the position is safe to place a royal
	const currentCard = state.cardsInPlay[position][0];
	if (currentCard && !isEmptyCard(currentCard)) {
		// Position is occupied by a real card
		if (isRoyalDead(currentCard)) {
			// Cannot place a royal on a dead royal
			console.warn(`Cannot place royal at ${position}: position contains a dead royal`);
			return state;
		}
		// Position is occupied by another card (shouldn't happen in normal gameplay)
		console.warn(`Cannot place royal at ${position}: position is occupied`);
		return state;
	}

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

	// Determine game status
	const gameStatus = determineGameStatus(state.gameStatus, newDeck, newCardsInPlay);

	const newState = {
		...state,
		deck: newDeck,
		cardsInPlay: newCardsInPlay,
		alternativeRoyalPositions: [], // Clear alternatives
		gameStatus
	};

	// Update whether top card can be placed on grid
	return updateCanPlaceTopCardOnGrid(newState);
}

// Action: Place an armor card (automatically placed on lowest-value royal)
export function placeArmorCard() {
	gameState.update((state) => {
		const card = state.deck[0];
		if (!card) return state;

		// Aces and Jokers should never be armor - they go to special positions
		if (card.value === 'A' || card.value === 'Joker') {
			console.error('Attempted to place Ace or Joker as armor');
			return state;
		}

		// Find armor placement position
		const position = getArmorPlacementPosition(card, state.cardsInPlay);
		if (!position) return state; // Can't place armor (game might be lost)

		// Place the armor
		const newDeck = state.deck.slice(1);
		const newCardsInPlay = {
			...state.cardsInPlay,
			[position]: [card]
		};

		// Determine game status (important: armor can make deck empty!)
		const gameStatus = determineGameStatus(state.gameStatus, newDeck, newCardsInPlay);

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay,
			gameStatus
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
	});
}

// Action: Place a Joker from deck to its slot
export function placeJokerFromDeck() {
	gameState.update((state) => {
		const card = state.deck[0];
		if (!card || card.value !== 'Joker') return state;

		// Find first empty joker slot
		let targetPosition: JokerPosition | null = null;
		if (!state.cardsInPlay.joker1[0]) {
			targetPosition = 'joker1';
		} else if (!state.cardsInPlay.joker2[0]) {
			targetPosition = 'joker2';
		}

		if (!targetPosition) {
			console.warn('No empty joker slot available');
			return state; // Both joker slots occupied
		}

		// Place the joker
		const newDeck = state.deck.slice(1);
		const newCardsInPlay = {
			...state.cardsInPlay,
			[targetPosition]: [card]
		};

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
	});
}

// Action: Place an Ace from deck to its slot
export function placeAceFromDeck() {
	gameState.update((state) => {
		const card = state.deck[0];
		if (!card || card.value !== 'A') return state;

		// Find first empty ace slot
		let targetPosition: AcePosition | null = null;
		if (!state.cardsInPlay.ace1[0]) {
			targetPosition = 'ace1';
		} else if (!state.cardsInPlay.ace2[0]) {
			targetPosition = 'ace2';
		} else if (!state.cardsInPlay.ace3[0]) {
			targetPosition = 'ace3';
		} else if (!state.cardsInPlay.ace4[0]) {
			targetPosition = 'ace4';
		}

		if (!targetPosition) {
			console.warn('No empty ace slot available');
			return state; // All ace slots occupied
		}

		// Place the ace
		const newDeck = state.deck.slice(1);
		const newCardsInPlay = {
			...state.cardsInPlay,
			[targetPosition]: [card]
		};

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
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

		// Mark the ace as used (flip to card back)
		const newCardsInPlay = {
			...state.cardsInPlay,
			[stackPosition]: [],
			[state.aceInUse]: [createUsedCard()]
		};

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay,
			aceInUse: null
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
	});
}

// Action: Activate a joker
export function activateJoker(position: JokerPosition) {
	gameState.update((state) => {
		const joker = state.cardsInPlay[position][0];
		if (!joker || joker.value !== 'Joker') return state;

		// Toggle joker activation
		return {
			...state,
			jokerInUse: state.jokerInUse === position ? null : position,
			jokerSourceStack: null // Clear source when toggling
		};
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
		let newCardsInPlay = {
			...state.cardsInPlay,
			[state.jokerSourceStack]: sourceStack.slice(1),
			[targetPosition]: [cardToMove, ...targetStack]
		};

		// Mark the joker as used (flip to card back)
		const jokerPos = state.jokerInUse;
		if (jokerPos) {
			newCardsInPlay[jokerPos] = [createUsedCard()];
		}

		// Check for royal kills from the target position
		newCardsInPlay = killRoyalsFromPosition(targetPosition, newCardsInPlay);

		// Determine game status
		const gameStatus = determineGameStatus(state.gameStatus, state.deck, newCardsInPlay);

		const newState = {
			...state,
			cardsInPlay: newCardsInPlay,
			jokerInUse: null,
			jokerSourceStack: null,
			gameStatus
		};

		// Update whether top card can be placed on grid
		return updateCanPlaceTopCardOnGrid(newState);
	});
}

// Helper: Cycle deck to find next royal (when no royals on board)
function cycleDeckForRoyal() {
	gameState.update((state) => ensureNextRoyalAvailable(state));
}
