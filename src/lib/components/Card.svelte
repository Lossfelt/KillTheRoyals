<script lang="ts">
	import type { Card as CardType } from '$lib/types';
	import CardSVG from './CardSVG.svelte';

	// Props
	export let card: CardType | undefined = undefined;
	export let stackDepth: number = 0;
	export let active: boolean = false;
	export let clickable: boolean = true;
	export let alternative: boolean = false; // Golden glow for alternative royal positions
	export let dimmed: boolean = false; // Lower opacity when disabled/waiting
	export let onclick: (() => void) | undefined = undefined;
	export let slotType: 'royal' | 'armor' | 'joker' | 'ace' | 'grid' | undefined = undefined;

	$: cardColor = card ? card.color : 'black';
	$: showDepth = stackDepth > 1;
</script>

<button
	class="card"
	class:card-red={cardColor === 'red'}
	class:card-black={cardColor === 'black'}
	class:card-active={active}
	class:card-clickable={clickable}
	class:card-alternative={alternative}
	class:card-dimmed={dimmed}
	on:click={onclick}
	disabled={!clickable}
	type="button"
	aria-label={card ? `${card.value} of ${card.suit}` : 'Empty card slot'}
>
	{#if card}
		<CardSVG {card} />
	{:else}
		<!-- Empty slot placeholder -->
		<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" class="card-svg empty-slot">
			<rect
				width="100"
				height="140"
				rx="4"
				fill="transparent"
				stroke="currentColor"
				stroke-width="2"
				stroke-dasharray="5,5"
				opacity="0.3"
			/>

			{#if slotType === 'royal'}
				<!-- Profile silhouette for royal cards -->
				<svg x="0" y="0" width="100" height="140" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet">
					<g opacity="0.3" fill="currentColor" transform="translate(0, 320) scale(0.1, -0.1)">
						<path d="M1545 2943 c-334 -30 -582 -155 -716 -360 -124 -191 -199 -505 -155 -655 9 -31 16 -65 16 -75 0 -10 -43 -88 -95 -173 -59 -96 -95 -164 -95 -181 0 -41 43 -85 103 -105 89 -29 104 -57 70 -130 l-18 -36 33 -28 c29 -24 31 -29 17 -40 -21 -18 -19 -54 6 -76 42 -38 52 -72 38 -122 -29 -103 -8 -182 58 -224 36 -22 45 -23 203 -20 96 1 176 -2 190 -8 38 -16 51 -45 70 -155 l17 -100 591 -3 c326 -1 592 0 592 3 0 3 -32 124 -70 269 -80 300 -92 375 -79 478 13 103 30 150 125 343 125 256 158 375 157 580 -1 142 -28 259 -90 385 -40 81 -61 109 -142 191 -82 81 -110 102 -191 142 -181 88 -394 122 -635 100z m300 -43 c132 -16 198 -35 313 -91 86 -42 115 -62 185 -132 71 -70 91 -97 134 -187 77 -157 103 -310 82 -482 -17 -142 -52 -247 -144 -438 -47 -96 -96 -208 -110 -249 -28 -85 -28 -84 -16 -76 6 3 9 -3 8 -14 0 -10 -6 -17 -13 -14 -6 2 -14 -5 -17 -16 -6 -23 8 -29 16 -8 3 7 6 5 6 -5 1 -10 -3 -18 -9 -18 -14 0 -2 -120 22 -220 11 -47 40 -158 64 -248 24 -90 44 -174 44 -188 l0 -25 -109 2 c-60 1 -113 -1 -119 -5 -5 -3 -12 -3 -14 0 -3 3 -193 5 -421 4 -477 -1 -426 -13 -446 108 -9 51 -21 82 -39 104 -44 53 -76 60 -236 53 -157 -6 -196 2 -228 46 -22 29 -26 75 -13 162 7 49 5 60 -11 78 -17 19 -17 20 0 13 14 -5 17 -3 14 7 -3 8 -12 13 -21 11 -8 -1 -19 3 -23 9 -4 8 -3 9 4 5 7 -4 12 -3 12 3 0 5 -4 13 -10 16 -5 3 -10 25 -10 47 0 25 -7 49 -17 60 -14 15 -15 25 -6 65 19 80 -9 122 -100 154 -50 18 -81 51 -74 81 4 13 38 75 78 138 109 175 113 185 94 265 -57 248 76 632 276 794 104 84 292 161 436 177 29 4 55 10 57 13 8 11 271 12 361 1z" />
					</g>
				</svg>
			{:else if slotType === 'armor'}
				<!-- Shield for armor -->
				<path
					d="M 50 30 L 70 40 L 70 70 Q 70 90 50 110 Q 30 90 30 70 L 30 40 Z"
					fill="transparent"
					stroke="currentColor"
					stroke-width="3"
					opacity="0.2"
				/>
			{:else if slotType === 'joker'}
				<!-- Large "J" for joker -->
				<text
					x="50"
					y="85"
					text-anchor="middle"
					dominant-baseline="middle"
					font-size="60"
					font-weight="bold"
					fill="currentColor"
					opacity="0.15"
				>
					J
				</text>
			{:else if slotType === 'ace'}
				<!-- Large "A" for ace -->
				<text
					x="50"
					y="85"
					text-anchor="middle"
					dominant-baseline="middle"
					font-size="60"
					font-weight="bold"
					fill="currentColor"
					opacity="0.15"
				>
					A
				</text>
			{/if}
		</svg>
	{/if}

	{#if showDepth}
		<span class="card-depth">{stackDepth}</span>
	{/if}
</button>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-width: var(--card-width);
		min-height: var(--card-height);
		background: transparent;
		border: none;
		box-shadow: none;
		transition: all var(--transition-normal);
		cursor: pointer;
		padding: 0;
		margin: 0;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.empty-slot {
		width: 100%;
		height: 100%;
	}

	.card-active {
		filter: brightness(1.2) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
		transform: translateY(-2px);
	}

	.card:disabled {
		cursor: default;
		opacity: 0.9;
	}

	.card-dimmed {
		opacity: 0.2;
		pointer-events: none;
	}

	.card-alternative {
		animation: goldenGlow 2s ease-in-out infinite;
		cursor: pointer;
	}

	@keyframes goldenGlow {
		0%, 100% {
			box-shadow: 0 0 20px 4px rgba(255, 215, 0, 0.2),
			            0 0 25px 6px rgba(255, 215, 0, 0.1);
		}
		50% {
			box-shadow: 0 0 20px 4px rgba(255, 215, 0, 0.5),
			            0 0 25px 6px rgba(255, 215, 0, 0.4);
		}
	}

	.card-depth {
		position: absolute;
		bottom: 2px;
		right: 4px;
		font-size: 0.6rem;
		font-weight: bold;
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.9);
		padding: 1px 3px;
		border-radius: 3px;
		z-index: 10;
	}

	/* Accessibility: Focus visible */
	.card:focus-visible {
		outline: 2px solid var(--color-active-border);
		outline-offset: 2px;
	}
</style>
