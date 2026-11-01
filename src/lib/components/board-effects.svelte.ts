/**
 * Board Effects - visual reactions to game state changes
 * Shots at royals that died, and cards gliding from one slot to another.
 * Feed every new state to update(); the board reads the reactive fields.
 */

import { tick } from 'svelte';
import type { Card, GameState } from '#lib/types.js';
import { findKillEvents, type KillEvent } from '#lib/utils/attack-preview.js';
import { findCardMoves, type CardMove } from '#lib/utils/card-motion.js';
import { SHOT_TOTAL_MS, SHOT_TRAVEL_MS } from './ShotLayer.svelte';

const MOVE_MS = 260;
const HEAVY_MOVE_MS = 460;
const LANDED_MS = 550;

function prefersReducedMotion(): boolean {
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export class BoardEffects {
	shotEvents = $state<KillEvent[]>([]);
	volley = $state(0); // Bumped for every new set of shots to restart the animation
	firing = $state<string[]>([]);
	hits = $state<string[]>([]);
	landed = $state<string[]>([]);
	thud = $state(false); // The table shakes when a king lands
	held = $state<Record<string, Card>>({}); // Cards kept on screen until the shot lands

	#previous: GameState;
	#getRoot: () => HTMLElement | undefined;
	#timers: ReturnType<typeof setTimeout>[] = [];

	constructor(initial: GameState, getRoot: () => HTMLElement | undefined) {
		this.#previous = initial;
		this.#getRoot = getRoot;
	}

	/**
	 * React to a new game state. Call before the DOM updates, so a dying
	 * royal can be held on screen until the shot reaches it.
	 */
	update(next: GameState) {
		const previous = this.#previous;
		if (next.cardsInPlay === previous.cardsInPlay && next.deck === previous.deck) return;
		this.#previous = next;

		const kills = findKillEvents(previous.cardsInPlay, next.cardsInPlay);
		const moves = findCardMoves(previous, next);
		const reducedMotion = prefersReducedMotion();

		this.reset();
		if (kills.length > 0) this.#fireShots(kills, previous, reducedMotion);
		if (moves.length > 0 && !reducedMotion) {
			tick().then(() => this.#animateMoves(moves));
		}
	}

	reset() {
		this.#timers.forEach(clearTimeout);
		this.#timers = [];
		this.held = {};
		this.shotEvents = [];
		this.firing = [];
		this.hits = [];
		this.landed = [];
		this.thud = false;
	}

	#fireShots(kills: KillEvent[], previous: GameState, reducedMotion: boolean) {
		const held: Record<string, Card> = {};
		if (!reducedMotion) {
			for (const kill of kills) {
				const royal = previous.cardsInPlay[kill.royal][0];
				const armor = previous.cardsInPlay[kill.armor][0];
				if (royal) held[kill.royal] = royal;
				if (armor) held[kill.armor] = armor;
			}
		}

		this.held = held;
		this.shotEvents = kills;
		this.volley += 1;
		this.firing = kills.flatMap((kill) => [kill.shooter, ...kill.payloadPositions]);
		// Browsers refuse (and log an error) before the player has tapped the page
		if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(40);

		this.#later(reducedMotion ? 0 : SHOT_TRAVEL_MS, () => {
			this.held = {};
			this.hits = kills.flatMap((kill) =>
				previous.cardsInPlay[kill.armor][0] ? [kill.royal, kill.armor] : [kill.royal]
			);
		});
		this.#later(SHOT_TOTAL_MS, () => {
			this.shotEvents = [];
			this.firing = [];
			this.hits = [];
		});
	}

	// Glide each moved card from where it was to where it is now
	#animateMoves(moves: CardMove[]) {
		const root = this.#getRoot();
		if (!root) return;

		for (const move of moves) {
			const from = root.querySelector<HTMLElement>(`[data-pos="${move.from}"]`);
			const to = root.querySelector<HTMLElement>(`[data-pos="${move.to}"]`);
			if (!from || !to) continue;

			const a = from.getBoundingClientRect();
			const b = to.getBoundingClientRect();
			const start = `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
			to.style.zIndex = '30';
			const animation = move.heavy
				? // Lifted high over its slot, then dropped: the last frame is the impact
					to.animate(
						[
							{ transform: `${start} scale(1.08)`, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
							{ transform: 'translateY(-18px) scale(1.18)', offset: 0.7, easing: 'ease-in' },
							{ transform: 'none' }
						],
						{ duration: HEAVY_MOVE_MS }
					)
				: to.animate([{ transform: start }, { transform: 'none' }], {
						duration: MOVE_MS,
						easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
					});

			animation.finished
				.then(() => {
					if (move.heavy) this.#land(move.to);
				})
				.catch(() => {}) // Cancelled by the next move: no impact
				.finally(() => {
					to.style.zIndex = '';
				});
		}
	}

	// Impact of a king: dust around the card and a thud through the table
	#land(position: string) {
		this.landed = [...this.landed, position];
		this.thud = true;
		if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(30);
		this.#later(LANDED_MS, () => {
			this.landed = this.landed.filter((pos) => pos !== position);
			this.thud = false;
		});
	}

	#later(ms: number, fn: () => void) {
		this.#timers.push(setTimeout(fn, ms));
	}
}
