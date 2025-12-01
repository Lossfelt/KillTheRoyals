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
	ArmorPosition,
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

	const initialState: GameState = {
		deck: cycleDeckToNumberedCard(remainingDeck),
		cardsInPlay,
		jokerInUse: null,
		jokerSourceStack: null,
		aceInUse: null,
		isSetupPhase: true,
		setupPhaseReplaceMode: false,
		alternativeRoyalPositions: [],
		alternativeArmorPositions: [],
		alternativeJokerPositions: [],
		alternativeAcePositions: [],
		alternativeGridPositions: [],
		canPlaceTopCardOnGrid: true, // During setup, this is not applicable yet
		gameStatus: 'setup',
		viewStackMode: false,
		viewingStack: null
	};

	return updateCanPlaceTopCardOnGrid(initialState);
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
 * Also populates alternativeRoyalPositions or alternativeArmorPositions when needed,
 * which triggers position highlighting for player to click directly
 */
function updateCanPlaceTopCardOnGrid(state: GameState): GameState {
	const stateWithRoyalReady = ensureNextRoyalAvailable(state);
	const topCard = stateWithRoyalReady.deck[0];
	const royalsToBePlaced = stateWithRoyalReady.cardsInPlay.royalsToBePlaced;

	// Priority 1: Royals awaiting placement (overrides all other states)
	if (royalsToBePlaced.length > 0) {
		const royalPositions = getRoyalPlacementPosition(royalsToBePlaced[0], stateWithRoyalReady.cardsInPlay);
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: false,
			alternativeArmorPositions: [],
			alternativeRoyalPositions: royalPositions,
			alternativeJokerPositions: [],
			alternativeAcePositions: [],
			alternativeGridPositions: []
		};
	}

	// Priority 2: Setup phase or empty deck - no special positions
	if (stateWithRoyalReady.isSetupPhase || !topCard) {
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: true,
			alternativeArmorPositions: [],
			alternativeRoyalPositions: [],
			alternativeJokerPositions: [],
			alternativeAcePositions: [],
			alternativeGridPositions: []
		};
	}

	// Priority 3: Royal on deck
	if (isRoyalValue(topCard.value)) {
		const royalPositions = getRoyalPlacementPosition(topCard, stateWithRoyalReady.cardsInPlay);
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: false,
			alternativeArmorPositions: [],
			alternativeRoyalPositions: royalPositions,
			alternativeJokerPositions: [],
			alternativeAcePositions: [],
			alternativeGridPositions: []
		};
	}

	// Priority 4: Joker on deck
	if (topCard.value === 'Joker') {
		const jokerPositions: JokerPosition[] = [];
		if (!stateWithRoyalReady.cardsInPlay.joker1[0]) jokerPositions.push('joker1');
		if (!stateWithRoyalReady.cardsInPlay.joker2[0]) jokerPositions.push('joker2');
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: false,
			alternativeArmorPositions: [],
			alternativeRoyalPositions: [],
			alternativeJokerPositions: jokerPositions,
			alternativeAcePositions: [],
			alternativeGridPositions: []
		};
	}

	// Priority 5: Ace on deck
	if (topCard.value === 'A') {
		const acePositions: AcePosition[] = [];
		if (!stateWithRoyalReady.cardsInPlay.ace1[0]) acePositions.push('ace1');
		if (!stateWithRoyalReady.cardsInPlay.ace2[0]) acePositions.push('ace2');
		if (!stateWithRoyalReady.cardsInPlay.ace3[0]) acePositions.push('ace3');
		if (!stateWithRoyalReady.cardsInPlay.ace4[0]) acePositions.push('ace4');
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: false,
			alternativeArmorPositions: [],
			alternativeRoyalPositions: [],
			alternativeJokerPositions: [],
			alternativeAcePositions: acePositions,
			alternativeGridPositions: []
		};
	}

	// Priority 6: Numbered card on deck
	if (typeof topCard.value === 'number' && topCard.value >= 2 && topCard.value <= 10) {
		const validGridPositions = getValidGridPositions(topCard, stateWithRoyalReady.cardsInPlay);

		if (validGridPositions.length > 0) {
			// Highlight valid grid positions
			return {
				...stateWithRoyalReady,
				canPlaceTopCardOnGrid: true,
				alternativeArmorPositions: [],
				alternativeRoyalPositions: [],
				alternativeJokerPositions: [],
				alternativeAcePositions: [],
				alternativeGridPositions: validGridPositions
			};
		}

		// Priority 7: No valid grid positions - needs armor placement
		const armorPositions = getArmorPlacementPosition(topCard, stateWithRoyalReady.cardsInPlay);
		return {
			...stateWithRoyalReady,
			canPlaceTopCardOnGrid: false,
			alternativeArmorPositions: armorPositions,
			alternativeRoyalPositions: [],
			alternativeJokerPositions: [],
			alternativeAcePositions: [],
			alternativeGridPositions: []
		};
	}

	// Should not reach here (Joker/Ace already handled above)
	return {
		...stateWithRoyalReady,
		canPlaceTopCardOnGrid: false,
		alternativeArmorPositions: [],
		alternativeRoyalPositions: [],
		alternativeJokerPositions: [],
		alternativeAcePositions: [],
		alternativeGridPositions: []
	};
}

/**
 * Get all valid grid positions where a numbered card can be placed
 * Returns empty array if card is not a numbered card (2-10)
 * @param card - The card to check
 * @param cardsInPlay - Current cards in play
 * @returns Array of grid positions where the card can be legally placed
 */
function getValidGridPositions(card: Card, cardsInPlay: CardsInPlay): GridPosition[] {
	// Only numbered cards (2-10) can be placed on grid
	if (typeof card.value !== 'number' || card.value < 2 || card.value > 10) {
		return [];
	}

	const allGridPositions: GridPosition[] = [
		'upperLeft',
		'upperMiddle',
		'upperRight',
		'middleLeft',
		'middleMiddle',
		'middleRight',
		'bottomLeft',
		'bottomMiddle',
		'bottomRight'
	];

	// Filter to positions where the card can be placed
	return allGridPositions.filter((pos) => canPlaceNumberedCard(card, cardsInPlay[pos]));
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

/**
 * Helper: Cycle deck until a numbered card (2-10) is on top
 * Used during setup card replacement to show user which card they'll get
 * @param deck - Current deck
 * @returns New deck with numbered card on top
 */
function cycleDeckToNumberedCard(deck: Card[]): Card[] {
	const newDeck = [...deck];

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

	return newDeck;
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
			const newState = {
				...state,
				isSetupPhase: false,
				setupPhaseReplaceMode: false,
				gameStatus: 'playing' as const
			};
			return updateCanPlaceTopCardOnGrid(newState);
		}

		// Replace the card
		const card = state.cardsInPlay[position][0];
		if (!card) return state;

		const newDeck = [...state.deck];

		// Take the numbered card from top (already cycled by enableReplaceMode)
		const newCard = newDeck.shift()!;

		// Add replaced card to bottom of deck
		newDeck.push(card);

		const newCardsInPlay = {
			...state.cardsInPlay,
			[position]: [newCard]
		};

		const newState = {
			...state,
			deck: newDeck,
			cardsInPlay: newCardsInPlay,
			isSetupPhase: false,
			setupPhaseReplaceMode: false,
			gameStatus: 'playing' as const
		};

		return updateCanPlaceTopCardOnGrid(newState);
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

// Action: Place armor at a specific position (player clicks directly on armor position)
// alternativeArmorPositions is populated by updateCanPlaceTopCardOnGrid() when top card needs armor placement
export function selectArmorPosition(position: ArmorPosition) {
	gameState.update((state) => {
		// Verify this is a valid alternative
		if (!state.alternativeArmorPositions.includes(position)) {
			return state;
		}

		return placeArmorAtPosition(state, position);
	});
}

// Helper: Actually place the armor at a position
function placeArmorAtPosition(state: GameState, position: ArmorPosition): GameState {
	const card = state.deck[0];
	if (!card) return state;

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
		alternativeArmorPositions: [], // Clear alternatives
		gameStatus
	};

	// Update whether top card can be placed on grid
	return updateCanPlaceTopCardOnGrid(newState);
}

// Action: Place joker at a specific position (player clicks directly on joker slot)
export function selectJokerPosition(position: JokerPosition) {
	gameState.update((state) => {
		// Verify this is a valid alternative
		if (!state.alternativeJokerPositions.includes(position)) {
			return state;
		}

		return placeJokerAtPosition(state, position);
	});
}

// Helper: Actually place the joker at a position
function placeJokerAtPosition(state: GameState, position: JokerPosition): GameState {
	const card = state.deck[0];
	if (!card || card.value !== 'Joker') return state;

	// Verify position is empty
	if (state.cardsInPlay[position][0]) {
		console.warn(`Cannot place joker at ${position}: position is occupied`);
		return state;
	}

	// Place the joker
	const newDeck = state.deck.slice(1);
	const newCardsInPlay = {
		...state.cardsInPlay,
		[position]: [card]
	};

	// Determine game status
	const gameStatus = determineGameStatus(state.gameStatus, newDeck, newCardsInPlay);

	const newState = {
		...state,
		deck: newDeck,
		cardsInPlay: newCardsInPlay,
		alternativeJokerPositions: [], // Clear alternatives
		gameStatus
	};

	// Update whether top card can be placed on grid
	return updateCanPlaceTopCardOnGrid(newState);
}

// Action: Place ace at a specific position (player clicks directly on ace slot)
export function selectAcePosition(position: AcePosition) {
	gameState.update((state) => {
		// Verify this is a valid alternative
		if (!state.alternativeAcePositions.includes(position)) {
			return state;
		}

		return placeAceAtPosition(state, position);
	});
}

// Helper: Actually place the ace at a position
function placeAceAtPosition(state: GameState, position: AcePosition): GameState {
	const card = state.deck[0];
	if (!card || card.value !== 'A') return state;

	// Verify position is empty
	if (state.cardsInPlay[position][0]) {
		console.warn(`Cannot place ace at ${position}: position is occupied`);
		return state;
	}

	// Place the ace
	const newDeck = state.deck.slice(1);
	const newCardsInPlay = {
		...state.cardsInPlay,
		[position]: [card]
	};

	// Determine game status
	const gameStatus = determineGameStatus(state.gameStatus, newDeck, newCardsInPlay);

	const newState = {
		...state,
		deck: newDeck,
		cardsInPlay: newCardsInPlay,
		alternativeAcePositions: [], // Clear alternatives
		gameStatus
	};

	// Update whether top card can be placed on grid
	return updateCanPlaceTopCardOnGrid(newState);
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

		// Prevent moving card to same position (would cause duplication bug)
		if (state.jokerSourceStack === targetPosition) {
			return state;
		}

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

// Action: Toggle view stack mode
export function toggleViewStackMode() {
	gameState.update((state) => ({
		...state,
		viewStackMode: !state.viewStackMode,
		viewingStack: null // Close any open modal when toggling
	}));
}

// Action: Open stack view modal for a specific position
export function openStackView(position: GridPosition) {
	gameState.update((state) => {
		if (!state.viewStackMode) return state;
		return { ...state, viewingStack: position };
	});
}

// Action: Close stack view modal
export function closeStackView() {
	gameState.update((state) => ({
		...state,
		viewingStack: null
	}));
}
