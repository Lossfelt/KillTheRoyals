<script lang="ts">
	// Victory: the crowns of the fallen royals rain down over the table
	const CROWN_COUNT = 36;

	const crowns = Array.from({ length: CROWN_COUNT }, () => ({
		left: Math.random() * 100,
		delay: Math.random() * 1.6,
		duration: 2.4 + Math.random() * 1.8,
		size: 16 + Math.random() * 22,
		spin: (Math.random() - 0.5) * 720,
		drift: (Math.random() - 0.5) * 120
	}));
</script>

<div class="celebration" aria-hidden="true">
	{#each crowns as crown, i (i)}
		<svg
			class="crown"
			viewBox="0 0 24 24"
			width={crown.size}
			height={crown.size}
			style="left: {crown.left}%; animation-delay: {crown.delay}s; animation-duration: {crown.duration}s; --spin: {crown.spin}deg; --drift: {crown.drift}px"
		>
			<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
		</svg>
	{/each}
</div>

<style>
	.celebration {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: calc(var(--z-modal) + 1);
	}

	.crown {
		position: absolute;
		top: -40px;
		fill: var(--color-gold);
		stroke: #8a6d1d;
		stroke-width: 1;
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
		opacity: 0;
		animation-name: fall;
		animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
		animation-fill-mode: forwards;
	}

	@keyframes fall {
		0% {
			opacity: 1;
			transform: translate(0, 0) rotate(0);
		}
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(var(--drift), 105vh) rotate(var(--spin));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.celebration {
			display: none;
		}
	}
</style>
