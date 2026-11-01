<script lang="ts">
	import type { RoyalValue } from '#lib/types.js';

	interface Props {
		rank: RoyalValue; // 11 Jack, 12 Queen, 13 King
		x: number;
		y: number;
	}

	let { rank, x, y }: Props = $props();
</script>

<!-- Bust of a royal in a 60x110 frame; the robe takes the suit colour -->
<g class="portrait" transform="translate({x} {y})">
	<rect class="frame" width="60" height="110" rx="5" />

	{#if rank === 12}
		<!-- Queen: long hair behind the head -->
		<path class="hair" d="M15 76 Q11 40 18 31 Q30 21 42 31 Q49 40 45 76 Z" />
	{/if}

	<path class="robe" d="M4 110 Q6 74 30 70 Q54 74 56 110 Z" />
	<path class="trim" d="M30 72 V110" />
	<rect class="skin" x="26" y="57" width="8" height="13" />
	<ellipse class="trim-fill" cx="30" cy="72" rx="12" ry="3.5" />
	<ellipse class="skin" cx="30" cy="47" rx="11.5" ry="13.5" />
	<circle class="ink" cx="25.8" cy="46" r="1.4" />
	<circle class="ink" cx="34.2" cy="46" r="1.4" />

	{#if rank === 13}
		<!-- King: beard and tall crown -->
		<path class="hair" d="M18.5 49 Q20 68 30 70 Q40 68 41.5 49 Q37 57 30 57 Q23 57 18.5 49 Z" />
		<path class="mouth" d="M27 54.5 Q30 56 33 54.5" />
		<path class="gold" d="M16.5 35 L18 17 L24 27 L30 13 L36 27 L42 17 L43.5 35 Z" />
		<circle class="jewel" cx="30" cy="29" r="2.4" />
	{:else if rank === 12}
		<!-- Queen: tiara -->
		<path class="lips" d="M27.2 54 Q30 56.5 32.8 54 Q30 55 27.2 54 Z" />
		<path class="gold" d="M19.5 34 L22.5 25.5 L26 30.5 L30 21 L34 30.5 L37.5 25.5 L40.5 34 Z" />
		<circle class="jewel" cx="30" cy="27.5" r="1.8" />
	{:else}
		<!-- Jack: feathered cap -->
		<path class="mouth" d="M27 54 Q30 55.5 33 54" />
		<path class="gold feather" d="M38 31 Q49 14 58 11 Q51 22 43 33 Z" />
		<path class="robe" d="M17 40 Q16 27 30 27 Q44 27 45 37 L17 41 Z" />
		<path class="trim" d="M17 40.5 L45 37" />
	{/if}
</g>

<style>
	.frame {
		fill: var(--suit-tint);
		stroke: var(--suit);
		stroke-width: 1.5;
	}

	.robe {
		fill: var(--suit);
	}

	.trim {
		fill: none;
		stroke: var(--color-card-back-accent);
		stroke-width: 2.5;
	}

	.trim-fill,
	.gold {
		fill: var(--color-card-back-accent);
	}

	.gold {
		stroke: #8a6d1d;
		stroke-width: 1;
		stroke-linejoin: round;
	}

	.feather {
		fill: #f0e2b0;
	}

	.skin {
		fill: var(--color-portrait-skin);
	}

	.hair {
		fill: var(--color-portrait-hair);
	}

	.ink {
		fill: #2a1d14;
	}

	.mouth {
		fill: none;
		stroke: #7a3b2e;
		stroke-width: 1.1;
		stroke-linecap: round;
	}

	.lips {
		fill: #c0392b;
	}

	.jewel {
		fill: var(--color-card-red);
		stroke: white;
		stroke-width: 0.6;
	}
</style>
