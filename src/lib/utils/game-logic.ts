/**
 * Game Logic Utilities - Core game mechanics
 * All functions are pure (no side effects) and return new state
 */

import type {
	Card,
	CardStack,
	CardsInPlay,
	GridPosition,
	RoyalPosition,
	ArmorPosition,
	Payload
} from '$lib/types';
import { ATTACK_MAPPINGS, ROYAL_ARMOR_PAIRS, DEAD_CARD_UNICODE } from '$lib/types';

/**
 * Calculate numeric value from card (handles 'A' and 'Joker')
 */
function getCardNumericValue(card: Card | undefined): number {
	if (!card) return 0;
	if (card.value === 'A') return 1; // Aces have value 1 for combat
	if (card.value === 'Joker') return 0;
	return card.value as number;
}

/**
 * Check if a royal is dead (has card back symbol)
 */
export function isRoyalDead(royal: Card | undefined): boolean {
	return royal?.unicode === DEAD_CARD_UNICODE;
}

/**
 * Check if a card is empty (placeholder card)
 */
export function isEmptyCard(card: Card | undefined): boolean {
	return !card || card.unicode === 'empty' || card.unicode === '';
}

/**
 * Get the armor position for a royal position
 */
function getArmorPositionForRoyal(royal: RoyalPosition): ArmorPosition {
	const pair = ROYAL_ARMOR_PAIRS.find((p) => p.royal === royal);
	if (!pair) throw new Error(`No armor position found for royal: ${royal}`);
	return pair.armor;
}

/**
 * Check if a payload can kill a royal
 * @param payload - Two cards that form the attack
 * @param royal - The royal card being attacked
 * @param armor - Optional armor protecting the royal
 * @returns true if royal is killed
 */
export function canKillRoyal(
	payload: Payload,
	royal: Card,
	armor?: Card
): boolean {
	// Can't kill if royal is already dead
	if (isRoyalDead(royal)) return false;

	// Can't kill with empty payload
	if (isEmptyCard(payload[0]) || isEmptyCard(payload[1])) return false;

	const payloadValue =
		getCardNumericValue(payload[0]) + getCardNumericValue(payload[1]);
	const royalValue = getCardNumericValue(royal);
	const armorValue = armor && !isEmptyCard(armor) ? getCardNumericValue(armor) : 0;
	const totalHealth = royalValue + armorValue;

	// Check if payload is strong enough
	if (payloadValue < totalHealth) return false;

	// Jack (11): Any suit combination works
	if (royal.value === 11) return true;

	// Queen (12): Same color required AND must match royal's color
	if (royal.value === 12) {
		return (
			payload[0].color === payload[1].color &&
			payload[0].color === royal.color
		);
	}

	// King (13): Same suit required AND must match royal's suit
	if (royal.value === 13) {
		return (
			payload[0].suit === payload[1].suit &&
			payload[0].suit === royal.suit
		);
	}

	return false;
}

/**
 * Kill royals that can be killed from a grid position
 * Returns updated cardsInPlay with dead royals marked
 */
export function killRoyalsFromPosition(
	position: GridPosition,
	cardsInPlay: CardsInPlay
): CardsInPlay {
	const newCardsInPlay = { ...cardsInPlay };
	const deadCard: Card = {
		value: 11, // Use Jack value as placeholder for dead card
		suit: 'spades',
		unicode: DEAD_CARD_UNICODE,
		color: 'black'
	};

	// Get attack mappings for this position
	const attacks = ATTACK_MAPPINGS[position];
	if (!attacks || attacks.length === 0) return newCardsInPlay;

	// Try each attack from this position
	for (const attack of attacks) {
		const royal = cardsInPlay[attack.royal][0];
		if (!royal || isRoyalDead(royal)) continue;

		// Get the payload cards from the specified positions
		const card1 = cardsInPlay[attack.payloadPositions[0]][0];
		const card2 = cardsInPlay[attack.payloadPositions[1]][0];

		if (!card1 || !card2 || isEmptyCard(card1) || isEmptyCard(card2)) continue;

		const payload: Payload = [card1, card2];

		// Check armor
		const armorPos = getArmorPositionForRoyal(attack.royal);
		const armor = cardsInPlay[armorPos][0];

		if (canKillRoyal(payload, royal, armor)) {
			// Kill the royal
			newCardsInPlay[attack.royal] = [deadCard, ...newCardsInPlay[attack.royal]];

			// Kill the armor too if it exists
			if (armor && !isEmptyCard(armor)) {
				newCardsInPlay[armorPos] = [deadCard, ...newCardsInPlay[armorPos]];
			}
		}
	}

	return newCardsInPlay;
}

/**
 * Check if a numbered card can be placed on a stack
 */
export function canPlaceNumberedCard(card: Card, targetStack: CardStack): boolean {
	// Empty stack can accept any card
	if (targetStack.length === 0) return true;

	const topCard = targetStack[0];
	if (!topCard || isEmptyCard(topCard)) return true;

	// Can only place on same or lower value
	const cardValue = getCardNumericValue(card);
	const stackValue = getCardNumericValue(topCard);

	return cardValue >= stackValue;
}

/**
 * Get the royal position(s) that a royal card should be placed at
 * Based on game rules:
 * 1. Highest value card of the same suit
 * 2. If no suit match: Highest of same color
 * 3. If no color match: Highest value
 * 4. If tied: Player can choose (returns array with all tied positions)
 */
export function getRoyalPlacementPosition(
	royal: Card,
	cardsInPlay: CardsInPlay
): RoyalPosition[] {
	const royalPositions: RoyalPosition[] = [
		'upperLeftRoyal',
		'upperMiddleRoyal',
		'upperRightRoyal',
		'leftUpperRoyal',
		'leftMiddleRoyal',
		'leftBottomRoyal',
		'rightUpperRoyal',
		'rightMiddleRoyal',
		'rightBottomRoyal',
		'bottomLeftRoyal',
		'bottomMiddleRoyal',
		'bottomRightRoyal'
	];

	// Find empty royal positions
	const emptyPositions = royalPositions.filter(
		(pos) => cardsInPlay[pos].length === 0 || isEmptyCard(cardsInPlay[pos][0])
	);

	if (emptyPositions.length === 0) return [];

	// If only one empty position, use it
	if (emptyPositions.length === 1) return [emptyPositions[0]];

	// For each empty royal position, evaluate the "best" adjacent grid card
	// and rank positions based on: same suit highest value > same color highest > highest value
	type PositionScore = {
		position: RoyalPosition;
		priority: number; // 3 = same suit, 2 = same color, 1 = other
		value: number;
	};

	const positionScores: PositionScore[] = [];

	for (const emptyPos of emptyPositions) {
		// Get adjacent grid positions for this royal position
		const adjacentGrids = getGridPositionsAdjacentToRoyal(emptyPos);

		let bestPriority = 0;
		let bestValue = -1;

		// Find the best adjacent grid card
		for (const gridPos of adjacentGrids) {
			const gridCard = cardsInPlay[gridPos][0];
			if (!gridCard || isEmptyCard(gridCard)) continue;

			const value = getCardNumericValue(gridCard);
			let priority = 1; // other

			if (gridCard.suit === royal.suit) {
				priority = 3; // same suit
			} else if (gridCard.color === royal.color) {
				priority = 2; // same color
			}

			// Update best if this card is better
			if (priority > bestPriority || (priority === bestPriority && value > bestValue)) {
				bestPriority = priority;
				bestValue = value;
			}
		}

		// Record the score for this position
		positionScores.push({
			position: emptyPos,
			priority: bestPriority,
			value: bestValue
		});
	}

	// Sort by priority (descending), then by value (descending)
	positionScores.sort((a, b) => {
		if (a.priority !== b.priority) return b.priority - a.priority;
		return b.value - a.value;
	});

	// Return all positions with the same best score (tied positions)
	const bestScore = positionScores[0];
	const tiedPositions = positionScores
		.filter((score) => score.priority === bestScore.priority && score.value === bestScore.value)
		.map((score) => score.position);

	return tiedPositions;
}

/**
 * Get grid positions adjacent to a royal position
 */
function getGridPositionsAdjacentToRoyal(royalPos: RoyalPosition): GridPosition[] {
	const adjacencyMap: Record<RoyalPosition, GridPosition[]> = {
		upperLeftRoyal: ['upperLeft'],
		upperMiddleRoyal: ['upperMiddle'],
		upperRightRoyal: ['upperRight'],
		leftUpperRoyal: ['upperLeft'],
		leftMiddleRoyal: ['middleLeft'],
		leftBottomRoyal: ['bottomLeft'],
		rightUpperRoyal: ['upperRight'],
		rightMiddleRoyal: ['middleRight'],
		rightBottomRoyal: ['bottomRight'],
		bottomLeftRoyal: ['bottomLeft'],
		bottomMiddleRoyal: ['bottomMiddle'],
		bottomRightRoyal: ['bottomRight']
	};

	return adjacencyMap[royalPos] ?? [];
}

/**
 * Check if a royal is eligible for armor
 * Based on legacy checkArmorElegibility logic:
 * A royal can only get armor if NO other living royal without armor has a lower value
 */
function isRoyalEligibleForArmor(
	royalPos: RoyalPosition,
	armorCard: Card,
	cardsInPlay: CardsInPlay
): boolean {
	const currentRoyal = cardsInPlay[royalPos][0];
	if (!currentRoyal) return false;

	const currentValue = getCardNumericValue(currentRoyal);

	// Check all other royals
	const allRoyalPositions: RoyalPosition[] = [
		'upperLeftRoyal',
		'upperMiddleRoyal',
		'upperRightRoyal',
		'leftUpperRoyal',
		'leftMiddleRoyal',
		'leftBottomRoyal',
		'rightUpperRoyal',
		'rightMiddleRoyal',
		'rightBottomRoyal',
		'bottomLeftRoyal',
		'bottomMiddleRoyal',
		'bottomRightRoyal'
	];

	for (const otherRoyalPos of allRoyalPositions) {
		if (otherRoyalPos === royalPos) continue;

		const otherRoyal = cardsInPlay[otherRoyalPos][0];

		// Skip if other royal is not alive
		if (!otherRoyal || isRoyalDead(otherRoyal) || isEmptyCard(otherRoyal)) continue;

		// Check if other royal has armor
		const otherArmorPos = getArmorPositionForRoyal(otherRoyalPos);
		const otherArmor = cardsInPlay[otherArmorPos][0];

		// Skip if other royal already has armor
		if (otherArmor && !isEmptyCard(otherArmor)) continue;

		const otherValue = getCardNumericValue(otherRoyal);

		// If other royal has lower value, current royal is not eligible
		if (otherValue < currentValue) {
			return false;
		}

		// If same value, check suit/color priority
		if (otherValue === currentValue) {
			// Other royal has same suit as armor, but current doesn't
			if (otherRoyal.suit === armorCard.suit && currentRoyal.suit !== armorCard.suit) {
				return false;
			}
			// Other royal has same color as armor, but current doesn't
			if (otherRoyal.color === armorCard.color && currentRoyal.color !== armorCard.color) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Find the best armor position for a card
 * Armor must go to lowest-value royal first, with suit/color priority
 * Based on legacy checkArmorElegibility logic
 */
export function getArmorPlacementPosition(
	armorCard: Card,
	cardsInPlay: CardsInPlay
): ArmorPosition | null {
	const royalArmorPairs = ROYAL_ARMOR_PAIRS;

	// Find royals that are alive and don't have armor yet
	const candidatePairs = royalArmorPairs.filter((pair) => {
		const royal = cardsInPlay[pair.royal][0];
		const armor = cardsInPlay[pair.armor][0];

		// Royal must be alive
		if (!royal || isRoyalDead(royal) || isEmptyCard(royal)) return false;

		// Armor slot must be empty
		if (armor && !isEmptyCard(armor)) return false;

		// Don't make royal invincible (total value > 20 is problematic)
		const royalValue = getCardNumericValue(royal);
		const armorValue = getCardNumericValue(armorCard);
		if (royalValue + armorValue > 20) return false;

		return true;
	});

	if (candidatePairs.length === 0) return null;

	// Filter to only eligible pairs (based on legacy checkArmorElegibility)
	const eligiblePairs = candidatePairs.filter((pair) =>
		isRoyalEligibleForArmor(pair.royal, armorCard, cardsInPlay)
	);

	if (eligiblePairs.length === 0) return null;

	// Should only be one eligible royal (the lowest value one)
	// But if multiple (same value), apply suit/color priority
	if (eligiblePairs.length === 1) return eligiblePairs[0].armor;

	// Multiple eligible royals with same value - apply suit/color priority
	for (const pair of eligiblePairs) {
		const royal = cardsInPlay[pair.royal][0];
		if (royal.suit === armorCard.suit) return pair.armor;
	}

	for (const pair of eligiblePairs) {
		const royal = cardsInPlay[pair.royal][0];
		if (royal.color === armorCard.color) return pair.armor;
	}

	// If no match, return first option
	return eligiblePairs[0].armor;
}

/**
 * Check if game is won (all royals dead)
 */
export function checkGameWon(cardsInPlay: CardsInPlay): boolean {
	const royalPositions: RoyalPosition[] = [
		'upperLeftRoyal',
		'upperMiddleRoyal',
		'upperRightRoyal',
		'leftUpperRoyal',
		'leftMiddleRoyal',
		'leftBottomRoyal',
		'rightUpperRoyal',
		'rightMiddleRoyal',
		'rightBottomRoyal',
		'bottomLeftRoyal',
		'bottomMiddleRoyal',
		'bottomRightRoyal'
	];

	for (const pos of royalPositions) {
		const royal = cardsInPlay[pos][0];
		if (royal && !isRoyalDead(royal)) {
			return false; // Found a living royal
		}
	}

	return true; // All royals are dead or not placed
}

/**
 * Check if game is lost (deck empty with living royals)
 */
export function checkGameLost(deck: Card[], cardsInPlay: CardsInPlay): boolean {
	// Game is lost if deck is empty and royals still alive
	if (deck.length > 0) return false;

	return !checkGameWon(cardsInPlay);
}

/**
 * Count living royals on the board
 */
export function countLivingRoyals(cardsInPlay: CardsInPlay): number {
	const royalPositions: RoyalPosition[] = [
		'upperLeftRoyal',
		'upperMiddleRoyal',
		'upperRightRoyal',
		'leftUpperRoyal',
		'leftMiddleRoyal',
		'leftBottomRoyal',
		'rightUpperRoyal',
		'rightMiddleRoyal',
		'rightBottomRoyal',
		'bottomLeftRoyal',
		'bottomMiddleRoyal',
		'bottomRightRoyal'
	];

	let count = 0;
	for (const pos of royalPositions) {
		const royal = cardsInPlay[pos][0];
		if (royal && !isRoyalDead(royal) && !isEmptyCard(royal)) {
			count++;
		}
	}

	return count;
}

/**
 * Initialize empty cards in play structure
 */
export function createEmptyCardsInPlay(): CardsInPlay {
	return {
		// Grid positions (9)
		upperLeft: [],
		upperMiddle: [],
		upperRight: [],
		middleLeft: [],
		middleMiddle: [],
		middleRight: [],
		bottomLeft: [],
		bottomMiddle: [],
		bottomRight: [],

		// Royal positions (12)
		upperLeftRoyal: [],
		upperMiddleRoyal: [],
		upperRightRoyal: [],
		leftUpperRoyal: [],
		leftMiddleRoyal: [],
		leftBottomRoyal: [],
		rightUpperRoyal: [],
		rightMiddleRoyal: [],
		rightBottomRoyal: [],
		bottomLeftRoyal: [],
		bottomMiddleRoyal: [],
		bottomRightRoyal: [],

		// Armor positions (12)
		upperLeftArmor: [],
		upperMiddleArmor: [],
		upperRightArmor: [],
		leftUpperArmor: [],
		leftMiddleArmor: [],
		leftBottomArmor: [],
		rightUpperArmor: [],
		rightMiddleArmor: [],
		rightBottomArmor: [],
		bottomLeftArmor: [],
		bottomMiddleArmor: [],
		bottomRightArmor: [],

		// Special positions
		joker1: [],
		joker2: [],
		ace1: [],
		ace2: [],
		ace3: [],
		ace4: [],
		royalsToBePlaced: []
	};
}

/**
 * Setup phase: Place first 9 numbered cards on grid
 * Sets aside royals, aces, and jokers
 */
export function setupFirstNineCards(deck: Card[]): {
	cardsInPlay: CardsInPlay;
	remainingDeck: Card[];
	royalsToPlace: Card[];
	acesToPlace: Card[];
	jokersToPlace: Card[];
} {
	const cardsInPlay = createEmptyCardsInPlay();
	const gridPositions: GridPosition[] = [
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

	const newDeck = [...deck];
	const royalsToPlace: Card[] = [];
	const acesToPlace: Card[] = [];
	const jokersToPlace: Card[] = [];

	let gridIndex = 0;

	while (gridIndex < 9 && newDeck.length > 0) {
		const card = newDeck.shift()!;

		if (card.value === 'Joker') {
			jokersToPlace.push(card);
		} else if (card.value === 'A') {
			acesToPlace.push(card);
		} else if (card.value === 11 || card.value === 12 || card.value === 13) {
			royalsToPlace.push(card);
		} else {
			// Numbered card: place on grid
			cardsInPlay[gridPositions[gridIndex]] = [card];
			gridIndex++;
		}
	}

	// If no royals found yet, cycle through deck to find at least one
	const cycledCards: Card[] = [];
	while (royalsToPlace.length === 0 && newDeck.length > 0) {
		const card = newDeck.shift()!;

		if (card.value === 'Joker') {
			jokersToPlace.push(card);
		} else if (card.value === 'A') {
			acesToPlace.push(card);
		} else if (card.value === 11 || card.value === 12 || card.value === 13) {
			// Found a royal! Add it to royalsToPlace
			royalsToPlace.push(card);
		} else {
			// Numbered card: add to cycled cards (will go to bottom of deck)
			cycledCards.push(card);
		}
	}

	// Add cycled cards to bottom of deck
	newDeck.push(...cycledCards);

	// Place aces and jokers in their slots
	if (jokersToPlace.length > 0) cardsInPlay.joker1 = [jokersToPlace[0]];
	if (jokersToPlace.length > 1) cardsInPlay.joker2 = [jokersToPlace[1]];
	if (acesToPlace.length > 0) cardsInPlay.ace1 = [acesToPlace[0]];
	if (acesToPlace.length > 1) cardsInPlay.ace2 = [acesToPlace[1]];
	if (acesToPlace.length > 2) cardsInPlay.ace3 = [acesToPlace[2]];
	if (acesToPlace.length > 3) cardsInPlay.ace4 = [acesToPlace[3]];

	// Place royals in royalsToBePlaced stack
	cardsInPlay.royalsToBePlaced = royalsToPlace;

	return {
		cardsInPlay,
		remainingDeck: newDeck,
		royalsToPlace,
		acesToPlace,
		jokersToPlace
	};
}
