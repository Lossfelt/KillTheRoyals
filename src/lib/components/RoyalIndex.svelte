<script lang="ts">
	import type { RoyalValue, Suit } from '#lib/types.js';

	interface Props {
		rank: RoyalValue;
		suit: Suit;
	}

	let { rank, suit }: Props = $props();

	// Letters drawn as strokes in a 16x22 box, so no font can push them out of place
	const LETTERS: Record<RoyalValue, { bold: string; thin: string }> = {
		11: { bold: 'M11 0 V15 Q11 22 5.5 22 Q1.5 22 1 18', thin: 'M6 0.5 H16' },
		12: {
			bold: 'M8 0 C3.5 0 1 4.5 1 10 C1 15.5 3.5 20 8 20 C12.5 20 15 15.5 15 10 C15 4.5 12.5 0 8 0 Z',
			thin: 'M8.5 16 L15 22'
		},
		13: {
			bold: 'M3.5 0 V22 M14 0.5 L4 12 M7.5 8.5 L15 21.5',
			thin: 'M0 0.5 H7 M0 21.5 H7 M10.5 0.5 H17 M12 21.5 H17'
		}
	};

	// Suit symbols in a 16x16 box
	const SUITS: Partial<Record<Suit, string>> = {
		hearts:
			'M8 15.5 C1 9.5 0 6.5 0 4.5 C0 2 2 0 4.3 0 C6 0 7.3 1.2 8 2.6 C8.7 1.2 10 0 11.7 0 C14 0 16 2 16 4.5 C16 6.5 15 9.5 8 15.5 Z',
		diamonds: 'M8 0 L14 8 L8 16 L2 8 Z',
		clubs:
			'M8 0.5 A3.6 3.6 0 1 1 8 7.7 A3.6 3.6 0 1 1 8 0.5 Z M4.2 5.5 A3.6 3.6 0 1 1 4.2 12.7 A3.6 3.6 0 1 1 4.2 5.5 Z M11.8 5.5 A3.6 3.6 0 1 1 11.8 12.7 A3.6 3.6 0 1 1 11.8 5.5 Z M8 8 L5.5 16 H10.5 Z',
		spades:
			'M8 0 C6 4 0 7 0 10.5 C0 13 2 14.5 4 14.5 C5.6 14.5 7 13.4 7.4 12.5 L6 16 H10 L8.6 12.5 C9 13.4 10.4 14.5 12 14.5 C14 14.5 16 13 16 10.5 C16 7 10 4 8 0 Z'
	};

	const letter = $derived(LETTERS[rank]);
</script>

<!-- Royal index: letter over suit, centred on x=19 in the corner tab -->
<g class="royal-index">
	<g transform="translate(11 9)">
		<path class="bold" d={letter.bold} />
		<path class="thin" d={letter.thin} />
	</g>
	<path class="suit" transform="translate(11 36)" d={SUITS[suit] ?? ''} />
</g>

<style>
	.royal-index path {
		fill: none;
		stroke: var(--suit);
		stroke-linecap: butt;
	}

	.bold {
		stroke-width: 3.2;
	}

	.thin {
		stroke-width: 1.6;
	}

	.royal-index .suit {
		fill: var(--suit);
		stroke: none;
	}
</style>
