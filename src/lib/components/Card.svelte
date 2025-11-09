<script lang="ts">
	import type { Card as CardType } from '$lib/types';

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
		<span class="card-symbol no-select">
			{card.unicode}
		</span>
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
		width: var(--card-width);
		height: var(--card-height);
		min-width: var(--touch-target-min);
		min-height: var(--touch-target-min);
		background: var(--color-card);
		border: 1px solid var(--color-card-border);
		border-radius: var(--card-radius);
		box-shadow: var(--shadow-card);
		transition: all var(--transition-normal);
		cursor: pointer;
		padding: 0;
		margin: 0;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.card-symbol {
		font-size: var(--card-font-size);
		line-height: 1;
	}

	.card-red {
		color: var(--color-card-red);
	}

	.card-black {
		color: var(--color-card-black);
	}

	.card-empty {
		background: transparent;
		border: 2px dashed var(--color-text-muted);
		box-shadow: none;
	}

	.card-active {
		background: var(--color-active);
		border-color: var(--color-active-border);
		box-shadow: var(--shadow-card-hover);
		transform: translateY(-2px);
	}

	.card-clickable:hover:not(:disabled) {
		box-shadow: var(--shadow-card-hover);
		transform: translateY(-2px);
	}

	.card-clickable:active:not(:disabled) {
		box-shadow: var(--shadow-card-active);
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
		font-size: 0.7rem;
		font-weight: bold;
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.8);
		padding: 1px 4px;
		border-radius: 4px;
	}

	/* Accessibility: Focus visible */
	.card:focus-visible {
		outline: 2px solid var(--color-active-border);
		outline-offset: 2px;
	}

	/* Mobile: Ensure touch targets */
	@media (max-width: 767px) {
		.card {
			/* Ensure minimum touch target size */
			min-width: var(--touch-target-min);
			min-height: var(--touch-target-min);
		}
	}
</style>
