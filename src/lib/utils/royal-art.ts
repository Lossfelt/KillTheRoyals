/**
 * Royal Art - portraits for the court cards, one per royal, in static/royals
 */

import { asset } from '$app/paths';
import type { Card } from '#lib/types.js';

const ROYAL_VALUES = [11, 12, 13] as const;
const ROYAL_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

/**
 * URL of the portrait for a royal card
 */
export function royalArtUrl(card: Pick<Card, 'value' | 'suit'>): string {
	return asset(`royals/${card.value}-${card.suit}.webp` as Parameters<typeof asset>[0]);
}

/**
 * Fetch every portrait up front, so a royal never lands as an empty frame
 */
export function preloadRoyalArt(): void {
	for (const value of ROYAL_VALUES) {
		for (const suit of ROYAL_SUITS) {
			new Image().src = royalArtUrl({ value, suit });
		}
	}
}
