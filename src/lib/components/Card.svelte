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
		border: 2px dashed var(--color-text-muted);
		border-radius: var(--card-radius);
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
