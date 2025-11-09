<script lang="ts">
	import type { Card as CardType } from '$lib/types';
	import CardSVG from './CardSVG.svelte';

	// Props
	export let card: CardType | undefined = undefined;
	export let stackDepth: number = 0;
	export let active: boolean = false;
	export let clickable: boolean = true;
	export let empty: boolean = false;
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
	class:card-empty={empty}
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
				<!-- Profile face for royal cards -->
				<g opacity="0.2" fill="currentColor">
					<circle cx="50" cy="55" r="18" />
					<ellipse cx="50" cy="75" rx="25" ry="15" />
				</g>
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

	.card-empty {
		background: transparent;
		color: var(--color-text-muted);
	}

	.empty-slot {
		width: 100%;
		height: 100%;
	}

	.card-active {
		filter: brightness(1.2) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
		transform: translateY(-2px);
	}

	.card-clickable:hover:not(:disabled) {
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
		transform: translateY(-2px);
	}

	.card-clickable:active:not(:disabled) {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
		transform: translateY(0);
	}

	.card:disabled {
		cursor: default;
		opacity: 0.9;
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
