<script lang="ts" module>
	export const SHOT_TRAVEL_MS = 300; // Projectile flight from shooter to royal
	export const SHOT_TOTAL_MS = 900; // Whole effect, including impact and fade
</script>

<script lang="ts">
	import type { AimLine, KillEvent } from '#lib/utils/attack-preview.js';

	// Props
	export let board: HTMLElement | undefined = undefined;
	export let events: KillEvent[] = [];
	export let aims: AimLine[] = []; // Lines of fire for the move being previewed
	export let volley: number = 0; // Bumped for every new set of shots to restart the animation

	interface Segment {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}

	// Unit directions for the sparks thrown off at impact
	const SPARKS = Array.from({ length: 8 }, (_, i) => {
		const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
		return { x: Math.cos(angle), y: Math.sin(angle) };
	});

	$: tracers = board ? measure(board, events) : [];
	$: aimLines = board ? measure(board, aims) : [];

	// Find the centre of a card on the board, relative to the board itself
	function centreOf(boardEl: HTMLElement, position: string): { x: number; y: number } | null {
		const el = boardEl.querySelector(`[data-pos="${position}"]`);
		if (!el) return null;

		const boardRect = boardEl.getBoundingClientRect();
		const rect = el.getBoundingClientRect();
		return {
			x: rect.left - boardRect.left + rect.width / 2,
			y: rect.top - boardRect.top + rect.height / 2
		};
	}

	// Four short ticks around a reticle centred on (x, y)
	function reticleTicks(x: number, y: number): string {
		return `M${x} ${y - 22}v10M${x} ${y + 12}v10M${x - 22} ${y}h10M${x + 12} ${y}h10`;
	}

	function measure(boardEl: HTMLElement, shots: readonly AimLine[]): Segment[] {
		const result: Segment[] = [];
		for (const shot of shots) {
			const from = centreOf(boardEl, shot.shooter);
			const to = centreOf(boardEl, shot.royal);
			if (from && to) result.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
		}
		return result;
	}
</script>

<svg
	class="shot-layer"
	aria-hidden="true"
	style="--shot-travel: {SHOT_TRAVEL_MS}ms; --shot-total: {SHOT_TOTAL_MS}ms"
>
	<!-- Aim preview: marching line of fire and a reticle on each royal that would die -->
	{#each aimLines as aim, i (i)}
		<line class="aim-line" x1={aim.x1} y1={aim.y1} x2={aim.x2} y2={aim.y2} />
		<g class="reticle" style="transform-origin: {aim.x2}px {aim.y2}px">
			<circle cx={aim.x2} cy={aim.y2} r="15" />
			<path d={reticleTicks(aim.x2, aim.y2)} />
		</g>
	{/each}

	{#key volley}
		{#each tracers as shot, i (i)}
			<defs>
				<linearGradient
					id="trail-{i}"
					gradientUnits="userSpaceOnUse"
					x1={shot.x1}
					y1={shot.y1}
					x2={shot.x2}
					y2={shot.y2}
				>
					<stop offset="0" stop-color="var(--color-shot)" stop-opacity="0" />
					<stop offset="1" stop-color="var(--color-shot)" stop-opacity="1" />
				</linearGradient>
			</defs>

			<g style="--dx: {shot.x2 - shot.x1}px; --dy: {shot.y2 - shot.y1}px">
				<circle class="muzzle" cx={shot.x1} cy={shot.y1} r="18" />
				<line
					class="trail"
					x1={shot.x1}
					y1={shot.y1}
					x2={shot.x2}
					y2={shot.y2}
					stroke="url(#trail-{i})"
					pathLength="1"
				/>
				<circle class="bullet" cx={shot.x1} cy={shot.y1} r="5" />
				<circle class="impact" cx={shot.x2} cy={shot.y2} r="24" />
				<circle class="shockwave" cx={shot.x2} cy={shot.y2} r="24" />
				{#each SPARKS as spark, s (s)}
					<line
						class="spark"
						x1={shot.x2}
						y1={shot.y2}
						x2={shot.x2 + spark.x * 7}
						y2={shot.y2 + spark.y * 7}
						style="--sx: {spark.x * 34}px; --sy: {spark.y * 34}px"
					/>
				{/each}
			</g>
		{/each}
	{/key}
</svg>

<style>
	.shot-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
		z-index: 20;
	}

	/* Aim preview */
	.aim-line {
		stroke: var(--color-target);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-dasharray: 6 6;
		opacity: 0.85;
		animation: march 0.5s linear infinite;
	}

	.reticle {
		fill: none;
		stroke: var(--color-target);
		stroke-width: 2.5;
		animation: reticleIn 0.25s ease-out;
	}

	/* Shot */
	.muzzle {
		fill: white;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		filter: drop-shadow(0 0 6px var(--color-shot));
		animation: muzzleFlash 0.18s ease-out;
	}

	.trail {
		stroke-width: 5;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		filter: drop-shadow(0 0 4px var(--color-shot));
		animation:
			trailDraw var(--shot-travel) ease-in forwards,
			fadeOut calc(var(--shot-total) - var(--shot-travel)) ease-out var(--shot-travel) forwards;
	}

	.bullet {
		fill: white;
		filter: drop-shadow(0 0 5px var(--color-shot)) drop-shadow(0 0 2px white);
		animation: bulletFly var(--shot-travel) ease-in forwards;
	}

	.impact {
		fill: white;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		filter: drop-shadow(0 0 10px var(--color-shot));
		animation: impactBurst 0.35s ease-out var(--shot-travel) forwards;
	}

	.shockwave {
		fill: none;
		stroke: var(--color-shot);
		stroke-width: 3;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: shockwave 0.5s ease-out var(--shot-travel) forwards;
	}

	.spark {
		stroke: var(--color-shot);
		stroke-width: 2.5;
		stroke-linecap: round;
		opacity: 0;
		animation: sparkFly 0.45s ease-out var(--shot-travel) forwards;
	}

	@keyframes march {
		to {
			stroke-dashoffset: -12;
		}
	}

	@keyframes reticleIn {
		from {
			opacity: 0;
			transform: scale(1.6) rotate(45deg);
		}
	}

	@keyframes muzzleFlash {
		0% {
			opacity: 1;
			transform: scale(0.3);
		}
		100% {
			opacity: 0;
			transform: scale(1.3);
		}
	}

	@keyframes trailDraw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes bulletFly {
		to {
			transform: translate(var(--dx), var(--dy));
			opacity: 0;
		}
	}

	@keyframes fadeOut {
		to {
			opacity: 0;
		}
	}

	@keyframes impactBurst {
		0% {
			opacity: 1;
			transform: scale(0.2);
		}
		100% {
			opacity: 0;
			transform: scale(1.2);
		}
	}

	@keyframes shockwave {
		0% {
			opacity: 0.9;
			transform: scale(0.4);
		}
		100% {
			opacity: 0;
			transform: scale(2.2);
		}
	}

	@keyframes sparkFly {
		0% {
			opacity: 1;
			transform: translate(0, 0);
		}
		100% {
			opacity: 0;
			transform: translate(var(--sx), var(--sy));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.aim-line,
		.reticle {
			animation: none;
		}

		.muzzle,
		.trail,
		.bullet,
		.impact,
		.shockwave,
		.spark {
			display: none;
		}
	}
</style>
