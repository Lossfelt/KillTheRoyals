<script lang="ts">
	import type { Card } from '$lib/types';

	export let card: Card;

	// Generate unique ID for this component instance to avoid duplicate filter IDs
	const uid = Math.random().toString(36).substring(2, 9);

	// Get suit display value
	function getSuitSymbol(suit: string): string {
		const symbols: Record<string, string> = {
			hearts: '♥',
			diamonds: '♦',
			clubs: '♣',
			spades: '♠'
		};
		return symbols[suit] || '';
	}

	// Get display value for card
	function getDisplayValue(value: number | string): string {
		if (value === 'A') return 'A';
		if (value === 'Joker') return 'JOKER';
		if (value === 11) return 'J';
		if (value === 12) return 'Q';
		if (value === 13) return 'K';
		return value.toString();
	}

	const usedPatternRows = [
		{ y: 18, columns: [19, 41, 63] },
		{ y: 38, columns: [30, 52] },
		{ y: 58, columns: [19, 41, 63] },
		{ y: 78, columns: [30, 52] },
		{ y: 98, columns: [19, 41, 63] }
	];

	const usedPatternPositions = usedPatternRows.flatMap(({ y, columns }) =>
		columns.map((x) => ({ x, y }))
	);
</script>

<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" class="card-svg">
	<!-- Card background with border and shadow -->
	<defs>
		<filter id="shadow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3" />
		</filter>
	</defs>
	<rect class="card-background" width="100" height="140" rx="4" stroke-width="1" filter="url(#shadow-{uid})" />

	{#if card.suit === 'joker'}
		<!-- Joker card - diagonal text -->
		<g transform="rotate(45 50 70)">
			<text x="50" y="70" text-anchor="middle" dominant-baseline="middle" class="joker-text">
				JOKER
			</text>
		</g>
	{:else if card.value === 'DEAD' || card.value === 'USED'}
		<!-- Card back pattern - for dead royals/armor and used jokers/aces -->
		<rect class="card-back-outer" x="2" y="2" width="96" height="136" rx="4" stroke-width="2" />
		<rect class="card-back-inner" x="15" y="15" width="70" height="110" rx="2" stroke-width="2" />
		<g class="card-back-pattern">
			{#each usedPatternPositions as { x, y }}
				<polygon points="{x},{y + 10} {x + 9},{y} {x + 18},{y + 10} {x + 9},{y + 20}" />
			{/each}
		</g>
	{:else}
		<!-- Top center - value -->
		<text x="50" y="35" text-anchor="middle" dominant-baseline="middle" class="corner-value">{getDisplayValue(card.value)}</text>

		<!-- Bottom center - suit symbol -->
		<text x="50" y="105" text-anchor="middle" dominant-baseline="middle" class="center-suit">
			{getSuitSymbol(card.suit)}
		</text>
	{/if}
</svg>

<style>
	.card-svg {
		width: 100%;
		height: 100%;
	}

	.card-background {
		fill: var(--color-card);
		stroke: var(--color-card-border);
	}

	.card-back-outer,
	.card-back-inner {
		fill: var(--color-card);
		stroke: var(--color-card-black);
	}

	.card-back-pattern {
		fill: var(--color-card-black);
	}

	.corner-value {
		font-size: 50px;
		font-weight: bold;
		font-family: serif;
	}

	.center-suit {
		font-size: 50px;
	}

	.joker-text {
		font-size: 28px;
		font-weight: bold;
		font-family: sans-serif;
		letter-spacing: 2px;
		fill: var(--color-joker);
	}

	/* Color based on card suit */
	:global(.card-red) .corner-value,
	:global(.card-red) .center-suit {
		fill: var(--color-card-red);
	}

	:global(.card-black) .corner-value,
	:global(.card-black) .center-suit {
		fill: var(--color-card-black);
	}
</style>
