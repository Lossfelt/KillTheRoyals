/**
 * Deck Utilities - Card creation and shuffling
 */

import type { Card, Suit, CardValue, CardColor } from '$lib/types';

/**
 * Create a standard 52-card deck + 2 Jokers (54 cards total)
 * Returns unshuffled deck
 */
export function createDeck(): Card[] {
	const deck: Card[] = [];
	const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
	const values: CardValue[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	// Create 52 standard cards
	for (const suit of suits) {
		for (const value of values) {
			deck.push({
				value,
				suit,
				color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
			});
		}
	}

	// Add 2 Jokers
	deck.push({
		value: 'Joker',
		suit: 'joker',
		color: 'red'
	});
	deck.push({
		value: 'Joker',
		suit: 'joker',
		color: 'black'
	});

	return deck;
}

/**
 * Fisher-Yates shuffle algorithm (optimal O(n) shuffle)
 * Much better than the old 1000-random-swaps approach!
 * Creates a new shuffled array without mutating the input (immutable)
 * @param deck - Array of cards to shuffle (NOT mutated)
 * @returns A new shuffled array
 */
export function shuffleDeck<T>(deck: T[]): T[] {
	// Edge case validation
	if (!deck || !Array.isArray(deck)) {
		console.warn('[Deck] Invalid input to shuffleDeck:', deck);
		return [];
	}

	if (deck.length === 0) {
		return [];
	}

	// Create a copy to avoid mutating the input (immutable pattern)
	const shuffled = [...deck];

	for (let i = shuffled.length - 1; i > 0; i--) {
		// Random index from 0 to i
		const j = Math.floor(Math.random() * (i + 1));

		// Swap elements at i and j
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

/**
 * Create and shuffle a new deck
 * Convenience function for game initialization
 */
export function createShuffledDeck(): Card[] {
	return shuffleDeck(createDeck());
}
