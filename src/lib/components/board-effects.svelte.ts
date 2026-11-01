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
			const keyframes = move.heavy
				? [
						{ transform: `${start} scale(1.1)`, offset: 0 },
						{ transform: 'translateY(-10px) scale(1.12)', offset: 0.7 },
						{ transform: 'scale(0.94)', offset: 0.86 },
						{ transform: 'none', offset: 1 }
					]
				: [{ transform: start }, { transform: 'none' }];

			to.style.zIndex = '30';
			const animation = to.animate(keyframes, {
				duration: move.heavy ? HEAVY_MOVE_MS : MOVE_MS,
				easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
			});
			animation.onfinish = animation.oncancel = () => {
				to.style.zIndex = '';
				if (move.heavy) this.#land(move.to);
			};
		}
	}

	#land(position: string) {
		this.landed = [...this.landed, position];
		this.#later(LANDED_MS, () => {
			this.landed = this.landed.filter((pos) => pos !== position);
		});
	}

	#later(ms: number, fn: () => void) {
		this.#timers.push(setTimeout(fn, ms));
	}
}
