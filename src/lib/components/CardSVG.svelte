<script lang="ts">
	import type { Card } from '$lib/types';

	export let card: Card;

	// SVG paths for card suits
	const suitPaths: Record<string, string> = {
		hearts:
			'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
		diamonds: 'M12 2L2 12l10 10 10-10L12 2z',
		clubs:
			'M12 2C10.34 2 9 3.34 9 5c0 1.31.84 2.41 2 2.83V9H9c-1.66 0-3 1.34-3 3s1.34 3 3 3h2v2h2v-2h2c1.66 0 3-1.34 3-3s-1.34-3-3-3h-2V7.83c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3z',
		spades:
			'M12 2L3 12h3v3c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-3h3L12 2z'
	};

	// Get suit display value
	function getSuitSymbol(suit: string): string {
		const symbols: Record<string, string> = {
			hearts: '♥',
			diamonds: '♦',
			clubs: '♣',
			spades: '♠',
			joker: '🃏'
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
</script>

<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" class="card-svg">
	<!-- Card background with border and shadow -->
	<defs>
		<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3" />
		</filter>
	</defs>
	<rect width="100" height="140" rx="4" fill="white" stroke="#e0e0e0" stroke-width="1" filter="url(#shadow)" />

	{#if card.suit === 'joker'}
		<!-- Joker card - special design -->
		<text x="50" y="75" text-anchor="middle" dominant-baseline="middle" class="joker-text">
			🃏
		</text>
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

	.corner-value {
		font-size: 50px;
		font-weight: bold;
		font-family: serif;
	}

	.center-suit {
		font-size: 50px;
	}

	.joker-text {
		font-size: 60px;
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
