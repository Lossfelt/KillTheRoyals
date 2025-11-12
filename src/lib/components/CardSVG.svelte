<script lang="ts">
	import type { Card } from '$lib/types';

	export let card: Card;

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
		<!-- Joker card - diagonal text -->
		<g transform="rotate(45 50 70)">
			<text x="50" y="70" text-anchor="middle" dominant-baseline="middle" class="joker-text">
				JOKER
			</text>
		</g>
	{:else if card.value === 'DEAD'}
		<!-- Dead royal card - diagonal text -->
		<g transform="rotate(45 50 70)">
			<text x="50" y="70" text-anchor="middle" dominant-baseline="middle" class="dead-text">
				DEAD
			</text>
		</g>
	{:else if card.value === 'USED'}
		<!-- Used card - card back pattern -->
		<rect x="5" y="5" width="90" height="130" rx="2" fill="#1a5490" />
		<!-- Diagonal lines pattern -->
		<g stroke="#3a7bc0" stroke-width="1.5" opacity="0.6">
			<line x1="10" y1="10" x2="90" y2="130" />
			<line x1="20" y1="10" x2="90" y2="120" />
			<line x1="30" y1="10" x2="90" y2="110" />
			<line x1="40" y1="10" x2="90" y2="100" />
			<line x1="50" y1="10" x2="90" y2="90" />
			<line x1="60" y1="10" x2="90" y2="80" />
			<line x1="70" y1="10" x2="90" y2="70" />
			<line x1="80" y1="10" x2="90" y2="60" />
			<line x1="10" y1="20" x2="80" y2="130" />
			<line x1="10" y1="30" x2="70" y2="130" />
			<line x1="10" y1="40" x2="60" y2="130" />
			<line x1="10" y1="50" x2="50" y2="130" />
			<line x1="10" y1="60" x2="40" y2="130" />
			<line x1="10" y1="70" x2="30" y2="130" />
			<line x1="10" y1="80" x2="20" y2="130" />
		</g>
		<!-- Opposite diagonal lines -->
		<g stroke="#5a9bd5" stroke-width="1.5" opacity="0.5">
			<line x1="10" y1="130" x2="90" y2="10" />
			<line x1="20" y1="130" x2="90" y2="20" />
			<line x1="30" y1="130" x2="90" y2="30" />
			<line x1="40" y1="130" x2="90" y2="40" />
			<line x1="50" y1="130" x2="90" y2="50" />
			<line x1="60" y1="130" x2="90" y2="60" />
			<line x1="70" y1="130" x2="90" y2="70" />
			<line x1="80" y1="130" x2="90" y2="80" />
			<line x1="10" y1="120" x2="80" y2="10" />
			<line x1="10" y1="110" x2="70" y2="10" />
			<line x1="10" y1="100" x2="60" y2="10" />
			<line x1="10" y1="90" x2="50" y2="10" />
			<line x1="10" y1="80" x2="40" y2="10" />
			<line x1="10" y1="70" x2="30" y2="10" />
			<line x1="10" y1="60" x2="20" y2="10" />
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
		fill: #9b59b6; /* Purple color for joker */
	}

	.dead-text {
		font-size: 28px;
		font-weight: bold;
		font-family: sans-serif;
		letter-spacing: 2px;
		fill: #666666; /* Gray color for dead cards */
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
