<script lang="ts">
	import type { Card } from '#lib/types.js';
	import { isRoyalValue } from '#lib/types.js';
	import { royalArtUrl } from '#lib/utils/royal-art.js';

	interface Props {
		card: Card;
		slotType?: string; // Picks the emblem on a dead card
	}

	let { card, slotType }: Props = $props();

	// Unique id per instance so filter ids do not collide between cards
	const uid = Math.random().toString(36).substring(2, 9);

	// U+FE0E asks for the text glyph, so iOS does not swap in a coloured emoji
	const SUIT_SYMBOLS: Record<string, string> = {
		hearts: '♥︎',
		diamonds: '♦︎',
		clubs: '♣︎',
		spades: '♠︎'
	};

	const ROYAL_LETTERS: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K' };

	// Diamond lattice on the card back
	const BACK_PATTERN = [
		{ y: 18, columns: [19, 41, 63] },
		{ y: 38, columns: [30, 52] },
		{ y: 58, columns: [19, 41, 63] },
		{ y: 78, columns: [30, 52] },
		{ y: 98, columns: [19, 41, 63] }
	].flatMap(({ y, columns }) => columns.map((x) => ({ x, y })));

	const suit = $derived(SUIT_SYMBOLS[card.suit] ?? '');
	const isRoyal = $derived(isRoyalValue(card.value));
	const index = $derived(
		typeof card.value === 'number' ? (ROYAL_LETTERS[card.value] ?? String(card.value)) : card.value
	);
	const suitStyle = $derived(
		card.color === 'red'
			? '--suit: var(--color-card-red); --suit-tint: rgba(220, 20, 60, 0.09)'
			: '--suit: var(--color-card-black); --suit-tint: rgba(40, 50, 70, 0.09)'
	);
</script>

<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" class="card-svg" style={suitStyle}>
	<defs>
		<filter id="shadow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3" />
		</filter>
	</defs>
	<rect
		class="card-background"
		width="100"
		height="140"
		rx="5"
		stroke-width="1"
		filter="url(#shadow-{uid})"
	/>

	{#if card.value === 'DEAD'}
		<!-- Dead royal or armor: fallen emblem, struck through -->
		<rect class="dead-background" width="100" height="140" rx="5" />
		<g class="dead-emblem" transform="rotate(-14 50 72)">
			{#if slotType === 'armor'}
				<path d="M50 42 L72 52 L72 76 Q72 96 50 110 Q28 96 28 76 L28 52 Z" />
			{:else}
				<path d="M24 92 L24 54 L38 70 L50 46 L62 70 L76 54 L76 92 Z" />
				<rect x="22" y="94" width="56" height="8" rx="2" />
			{/if}
		</g>
		<path class="dead-slash" d="M20 26 L80 114" pathLength="1" />
		<path class="dead-slash dead-slash-second" d="M80 26 L20 114" pathLength="1" />
	{:else if card.value === 'USED'}
		<!-- Card back - used Jokers and Aces -->
		<rect class="back" x="3" y="3" width="94" height="134" rx="4" />
		<rect class="back-frame" x="9" y="9" width="82" height="122" rx="3" />
		<g class="back-pattern">
			{#each BACK_PATTERN as { x, y } (`${x},${y}`)}
				<polygon points="{x},{y + 10} {x + 9},{y} {x + 18},{y + 10} {x + 9},{y + 20}" />
			{/each}
		</g>
	{:else if card.suit === 'joker'}
		<!-- Joker: jester star -->
		<text class="joker-text" x="50" y="26" text-anchor="middle">JOKER</text>
		<path
			class="joker-star"
			d="M50 46 L57 66 L78 66 L61 79 L67 100 L50 87 L33 100 L39 79 L22 66 L43 66 Z"
		/>
		<circle class="joker-bell" cx="50" cy="116" r="6" />
	{:else if isRoyal}
		<!-- Royal: full-card portrait with the index on a tab in the corner -->
		<clipPath id="art-{uid}">
			<rect x="5" y="5" width="90" height="130" rx="3" />
		</clipPath>
		<image
			href={royalArtUrl(card)}
			x="5"
			y="5"
			width="90"
			height="130"
			preserveAspectRatio="xMidYMin slice"
			clip-path="url(#art-{uid})"
		/>
		<rect class="art-frame" x="5" y="5" width="90" height="130" rx="3" />
		<path class="index-tab" d="M5 5 H33 V54 Q33 60 27 60 H5 Z" />
		<!-- J and Q hang far below the baseline in some serifs (Iowan on iOS), so the suit sits well clear -->
		<text class="index royal-index" x="19" y="27" text-anchor="middle">{index}</text>
		<text class="index-suit" x="19" y="55" text-anchor="middle">{suit}</text>
	{:else}
		<!-- Numbered card or Ace: big index top-left, watermark suit, small mirrored index -->
		<text class="index" x="29" y="44" text-anchor="middle">{index}</text>
		<text class="index-suit big" x="29" y="78" text-anchor="middle">{suit}</text>
		<text class="watermark" x="68" y="118" text-anchor="middle">{suit}</text>
		<g transform="rotate(180 50 70)">
			<text class="index small" x="14" y="22" text-anchor="middle">{index}</text>
		</g>
	{/if}
</svg>

<style>
	.card-svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.card-background {
		fill: var(--color-card);
		stroke: var(--color-card-border);
	}

	/* Indices */
	.index {
		font-family: var(--font-display);
		font-size: 46px;
		font-weight: 700;
		fill: var(--suit);
		letter-spacing: -2px;
	}

	.index.small {
		font-size: 20px;
		letter-spacing: -1px;
	}

	.royal-index {
		font-size: 24px;
		letter-spacing: 0;
	}

	/* Royal portrait */
	.art-frame {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.5;
	}

	.index-tab {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.5;
	}

	.index-suit {
		font-size: 22px;
		fill: var(--suit);
	}

	.index-suit.big {
		font-size: 34px;
	}

	.watermark {
		font-size: 64px;
		fill: var(--suit);
		opacity: 0.16;
	}

	/* Card back */
	.back {
		fill: var(--color-card-back);
	}

	.back-frame {
		fill: none;
		stroke: var(--color-card-back-accent);
		stroke-width: 2;
	}

	.back-pattern {
		fill: var(--color-card-back-accent);
		opacity: 0.45;
	}

	/* Joker */
	.joker-text {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 3px;
		fill: var(--color-joker);
	}

	.joker-star {
		fill: var(--color-joker);
		stroke: var(--color-card-back-accent);
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.joker-bell {
		fill: var(--color-card-back-accent);
	}

	/* Dead royal or armor */
	.dead-background {
		fill: var(--color-dead-card);
	}

	.dead-emblem {
		fill: var(--color-dead-emblem);
	}

	/* Slashes are drawn in when the card dies */
	.dead-slash {
		fill: none;
		stroke: var(--color-target);
		stroke-width: 7;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: slash 0.2s ease-out backwards;
	}

	.dead-slash-second {
		animation-delay: 0.12s;
	}

	@keyframes slash {
		from {
			stroke-dashoffset: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dead-slash {
			animation: none;
		}
	}
</style>
