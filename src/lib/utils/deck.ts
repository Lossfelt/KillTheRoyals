/**
 * Deck Utilities - Card creation and shuffling
 * Uses Unicode playing card characters for display
 */

import type { Card, Suit, CardValue, CardColor } from '$lib/types';

/**
 * Unicode Playing Cards mapping
 * U+1F0A1 - U+1F0AE: Spades (A, 2-10, J, Q, K) - Note: C (knight) skipped
 * U+1F0B1 - U+1F0BE: Hearts
 * U+1F0C1 - U+1F0CE: Diamonds
 * U+1F0D1 - U+1F0DE: Clubs
 * U+1F0DF: Black Joker
 * U+1F0CF: Red Joker (but using black for both)
 * U+1F0A0: Card back (for dead royals)
 */

// Lookup table for Unicode characters (much better than nested if-statements!)
const UNICODE_MAP: Record<Suit, Record<CardValue, string>> = {
	spades: {
		A: '\u{1F0A1}',
		2: '\u{1F0A2}',
		3: '\u{1F0A3}',
		4: '\u{1F0A4}',
		5: '\u{1F0A5}',
		6: '\u{1F0A6}',
		7: '\u{1F0A7}',
		8: '\u{1F0A8}',
		9: '\u{1F0A9}',
		10: '\u{1F0AA}',
		11: '\u{1F0AB}', // Jack
		12: '\u{1F0AD}', // Queen (C/knight is skipped at 1F0AC)
		13: '\u{1F0AE}', // King
		Joker: '\u{1F0DF}' // Not used for spades, but needed for type
	},
	hearts: {
		A: '\u{1F0B1}',
		2: '\u{1F0B2}',
		3: '\u{1F0B3}',
		4: '\u{1F0B4}',
		5: '\u{1F0B5}',
		6: '\u{1F0B6}',
		7: '\u{1F0B7}',
		8: '\u{1F0B8}',
		9: '\u{1F0B9}',
		10: '\u{1F0BA}',
		11: '\u{1F0BB}', // Jack
		12: '\u{1F0BD}', // Queen
		13: '\u{1F0BE}', // King
		Joker: '\u{1F0DF}'
	},
	diamonds: {
		A: '\u{1F0C1}',
		2: '\u{1F0C2}',
		3: '\u{1F0C3}',
		4: '\u{1F0C4}',
		5: '\u{1F0C5}',
		6: '\u{1F0C6}',
		7: '\u{1F0C7}',
		8: '\u{1F0C8}',
		9: '\u{1F0C9}',
		10: '\u{1F0CA}',
		11: '\u{1F0CB}', // Jack
		12: '\u{1F0CD}', // Queen
		13: '\u{1F0CE}', // King
		Joker: '\u{1F0DF}'
	},
	clubs: {
		A: '\u{1F0D1}',
		2: '\u{1F0D2}',
		3: '\u{1F0D3}',
		4: '\u{1F0D4}',
		5: '\u{1F0D5}',
		6: '\u{1F0D6}',
		7: '\u{1F0D7}',
		8: '\u{1F0D8}',
		9: '\u{1F0D9}',
		10: '\u{1F0DA}',
		11: '\u{1F0DB}', // Jack
		12: '\u{1F0DD}', // Queen
		13: '\u{1F0DE}', // King
		Joker: '\u{1F0DF}'
	},
	joker: {
		A: '\u{1F0DF}',
		2: '\u{1F0DF}',
		3: '\u{1F0DF}',
		4: '\u{1F0DF}',
		5: '\u{1F0DF}',
		6: '\u{1F0DF}',
		7: '\u{1F0DF}',
		8: '\u{1F0DF}',
		9: '\u{1F0DF}',
		10: '\u{1F0DF}',
		11: '\u{1F0DF}',
		12: '\u{1F0DF}',
		13: '\u{1F0DF}',
		Joker: '\u{1F0DF}' // Black Joker
	}
};

/**
 * Get Unicode character for a card
 */
export function getCardUnicode(suit: Suit, value: CardValue): string {
	return UNICODE_MAP[suit]?.[value] ?? '\u{1F0A0}'; // Default to card back
}

/**
 * Get color for a suit
 */
function getSuitColor(suit: Suit): CardColor {
	return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

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
				unicode: getCardUnicode(suit, value),
				color: getSuitColor(suit)
			});
		}
	}

	// Add 2 Jokers
	deck.push({
		value: 'Joker',
		suit: 'joker',
		unicode: '\u{1F0DF}',
		color: 'red'
	});
	deck.push({
		value: 'Joker',
		suit: 'joker',
		unicode: '\u{1F0DF}',
		color: 'black'
	});

	return deck;
}

/**
 * Fisher-Yates shuffle algorithm (optimal O(n) shuffle)
 * Much better than the old 1000-random-swaps approach!
 * @param deck - Array of cards to shuffle (will be mutated)
 * @returns The shuffled deck (same reference)
 */
export function shuffleDeck<T>(deck: T[]): T[] {
	for (let i = deck.length - 1; i > 0; i--) {
		// Random index from 0 to i
		const j = Math.floor(Math.random() * (i + 1));

		// Swap elements at i and j
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	return deck;
}

/**
 * Create and shuffle a new deck
 * Convenience function for game initialization
 */
export function createShuffledDeck(): Card[] {
	return shuffleDeck(createDeck());
}

