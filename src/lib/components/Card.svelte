<script lang="ts">
	import type { Card as CardType } from '#lib/types.js';
	import CardSVG from './CardSVG.svelte';
	import EmptySlot from './EmptySlot.svelte';

	interface Props {
		card?: CardType;
		stackDepth?: number;
		active?: boolean;
		clickable?: boolean;
		alternative?: boolean; // Golden glow for alternative positions
		dimmed?: boolean; // Faded when disabled/waiting
		viewMode?: boolean; // View stack mode indicator
		slotType?: 'royal' | 'armor' | 'joker' | 'ace' | 'grid';
		position?: string; // Board position, used to locate the card for effects
		killCount?: number; // Royals this slot would kill if the pending card lands here
		showCount?: boolean; // Show the number of cards in the stack (while an ace is chosen)
		targeted?: boolean; // Would die from the hovered move
		aiming?: boolean; // Part of the hovered move's payload
		firing?: boolean; // Just fired a shot
		hit?: boolean; // Just got shot
		landed?: boolean; // Just landed after a move (dust puff)
		flipIn?: boolean; // Turn over when the card appears
		onclick?: () => void;
		onhover?: (hovering: boolean) => void;
		onlongpress?: () => void; // Long-press or right-click
	}

	let {
		card,
		stackDepth = 0,
		active = false,
		clickable = true,
		alternative = false,
		dimmed = false,
		viewMode = false,
		slotType,
		position,
		killCount = 0,
		showCount = false,
		targeted = false,
		aiming = false,
		firing = false,
		hit = false,
		landed = false,
		flipIn = false,
		onclick,
		onhover,
		onlongpress
	}: Props = $props();

	const LONG_PRESS_MS = 450;

	const cardColor = $derived(card ? card.color : 'black');
	const edges = $derived(Math.min(Math.max(stackDepth - 1, 0), 3)); // Visible card edges under the top card
	const label = $derived.by(() => {
		const name = card ? `${card.value} of ${card.suit}` : 'Empty card slot';
		const depth = stackDepth > 1 ? `, stack of ${stackDepth}` : '';
		const kills = killCount > 0 ? `, kills ${killCount} royal${killCount > 1 ? 's' : ''}` : '';
		return name + depth + kills;
	});

	let pressTimer: ReturnType<typeof setTimeout> | undefined;
	let swallowClick = false;
	let lastPointerType = 'mouse';

	// Touch has no hover: the kill badge carries the preview there
	function handlePointer(event: PointerEvent, hovering: boolean) {
		if (event.pointerType !== 'touch') onhover?.(hovering);
	}

	function startPress(event: PointerEvent) {
		lastPointerType = event.pointerType;
		if (!onlongpress || event.button !== 0) return;
		swallowClick = false;
		pressTimer = setTimeout(() => {
			swallowClick = true; // The release after a long-press must not also place a card
			onlongpress?.();
		}, LONG_PRESS_MS);
	}

	function cancelPress() {
		clearTimeout(pressTimer);
	}

	function handleClick() {
		if (swallowClick) {
			swallowClick = false;
			return;
		}
		onclick?.();
	}

	function handleContextMenu(event: MouseEvent) {
		if (!onlongpress) return;
		event.preventDefault();
		cancelPress();
		if (swallowClick) return; // The long-press timer already opened it

		onlongpress();
		// Touch browsers send a click on release after the context menu; a right-click does not
		if (lastPointerType !== 'mouse') swallowClick = true;
	}
</script>

<button
	class="card edges-{edges}"
	style="--edges: {edges}"
	class:card-red={cardColor === 'red'}
	class:card-black={cardColor === 'black'}
	class:card-active={active}
	class:card-alternative={alternative}
	class:card-alternative-grid={alternative && slotType === 'grid'}
	class:card-dimmed={dimmed}
	class:card-view-mode={viewMode}
	class:card-targeted={targeted}
	class:card-aiming={aiming}
	class:card-firing={firing}
	class:card-hit={hit}
	class:card-landed={landed}
	class:card-flip-in={flipIn}
	data-pos={position}
	onclick={handleClick}
	onpointerenter={(event) => handlePointer(event, true)}
	onpointerleave={(event) => {
		handlePointer(event, false);
		cancelPress();
	}}
	onpointerdown={startPress}
	onpointerup={cancelPress}
	onpointercancel={cancelPress}
	oncontextmenu={handleContextMenu}
	onfocus={() => onhover?.(true)}
	onblur={() => onhover?.(false)}
	disabled={!clickable}
	type="button"
	aria-label={label}
>
	{#if card}
		<CardSVG {card} {slotType} />
	{:else}
		<EmptySlot {slotType} />
	{/if}

	{#if killCount > 0}
		<span class="kill-badge" aria-hidden="true">
			<svg viewBox="0 0 16 16" class="kill-icon">
				<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="2" />
				<path d="M8 0v5M8 11v5M0 8h5M11 8h5" stroke="currentColor" stroke-width="2" />
			</svg>
			{#if killCount > 1}{killCount}{/if}
		</span>
	{/if}

	{#if showCount && stackDepth > 0}
		<span class="count-badge" aria-hidden="true">{stackDepth}</span>
	{/if}
</button>

<style>
	.card {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		border-radius: var(--card-radius);
		box-shadow: none;
		transition:
			filter var(--transition-normal),
			opacity var(--transition-normal),
			transform var(--transition-normal);
		cursor: pointer;
		padding: 0;
		margin: 0;
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	/* Stacked cards: the top card sits raised on a pile, one edge per card underneath */
	.card {
		--stack-step: max(2px, calc(var(--card-w, 60px) * 0.04));
	}

	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
		background: repeating-linear-gradient(
			to top,
			var(--color-card-edge-line) 0 1px,
			var(--color-card-edge) 1px var(--stack-step)
		);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
	}

	.edges-0::before {
		display: none;
	}

	.card > :global(svg) {
		transform: translateY(calc(var(--edges) * var(--stack-step) * -1));
	}

	.card-active {
		filter: brightness(1.15) drop-shadow(0 0 8px var(--color-gold));
		transform: translateY(-3px);
	}

	.card:disabled {
		cursor: default;
	}

	/* Waiting cards fall into shadow but keep their red and black */
	.card-dimmed {
		filter: brightness(0.62) contrast(0.9);
	}

	.card-alternative {
		animation: goldenGlow 2s ease-in-out infinite;
	}

	.card-alternative-grid {
		animation: none;
	}

	.card-view-mode {
		cursor: help;
	}

	.card-view-mode:hover {
		transform: scale(1.05);
		box-shadow: 0 0 0 2px var(--color-gold);
	}

	@keyframes goldenGlow {
		0%,
		100% {
			box-shadow:
				0 0 14px 3px rgba(255, 215, 0, 0.25),
				0 0 0 2px rgba(255, 215, 0, 0.5);
		}
		50% {
			box-shadow:
				0 0 22px 6px rgba(255, 215, 0, 0.5),
				0 0 0 2px rgba(255, 215, 0, 0.9);
		}
	}

	/* Attack preview: royals in the line of fire */
	.card-targeted {
		animation: targetPulse 0.9s ease-in-out infinite;
	}

	.card-aiming {
		box-shadow: 0 0 0 2px var(--color-shot);
	}

	.kill-badge {
		position: absolute;
		top: -5px;
		left: -5px;
		display: flex;
		align-items: center;
		gap: 1px;
		padding: 2px 4px;
		font-size: 0.65rem;
		font-weight: bold;
		line-height: 1;
		color: white;
		background: var(--color-target);
		border-radius: 999px;
		box-shadow: var(--shadow-sm);
		z-index: 11;
		pointer-events: none;
	}

	.kill-icon {
		width: 10px;
		height: 10px;
	}

	/* Stack size, shown while the player picks a stack for an ace */
	.count-badge {
		position: absolute;
		top: -6px;
		right: -6px;
		z-index: 11;
		min-width: 22px;
		height: 22px;
		padding: 0 5px;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 700;
		line-height: 1;
		color: var(--color-ink);
		background: var(--gradient-gold);
		border-radius: 999px;
		box-shadow: var(--shadow-md);
		pointer-events: none;
		animation: popIn 0.2s ease-out;
	}

	@keyframes popIn {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
	}

	/* Shot effects */
	.card-firing {
		animation: recoil 0.25s ease-out;
	}

	.card-hit {
		animation: hitShake 0.45s ease-out;
	}

	/* A landing king squashes on impact, above its neighbours and out of the shadow */
	.card-landed {
		z-index: 5;
		filter: none;
		animation: impact 0.2s ease-out;
	}

	/* Dust blown out from under all four edges at the moment of impact */
	.card-landed::after {
		content: '';
		position: absolute;
		--puff: calc(var(--card-w, 60px) * 0.2);
		inset: -22% -30%;
		z-index: -2;
		pointer-events: none;
		/* Puffs on every edge: three along top and bottom, two on each side, one per corner */
		background:
			radial-gradient(circle var(--puff) at 30% 12%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 50% 9%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 70% 12%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 30% 88%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 50% 91%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 70% 88%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 12% 36%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 12% 64%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 88% 36%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 88% 64%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 16% 14%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 84% 14%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 16% 86%, var(--color-dust) 35%, transparent),
			radial-gradient(circle var(--puff) at 84% 86%, var(--color-dust) 35%, transparent);
		filter: blur(1.5px);
		animation: dust 0.5s ease-out forwards;
	}

	.card-flip-in {
		animation: flipIn 0.32s ease-out;
	}

	@keyframes targetPulse {
		0%,
		100% {
			box-shadow: 0 0 0 2px var(--color-target);
		}
		50% {
			box-shadow:
				0 0 0 3px var(--color-target),
				0 0 14px 4px var(--color-target);
		}
	}

	@keyframes recoil {
		30% {
			transform: scale(0.92);
		}
	}

	@keyframes hitShake {
		0% {
			filter: brightness(2.5);
			box-shadow: 0 0 18px 6px var(--color-target);
		}
		20% {
			transform: translateX(-4px) rotate(-3deg);
		}
		40% {
			transform: translateX(4px) rotate(3deg);
		}
		60% {
			transform: translateX(-2px);
		}
		100% {
			transform: none;
			filter: none;
			box-shadow: none;
		}
	}

	@keyframes dust {
		0% {
			opacity: 1;
			transform: scale(0.75);
		}
		35% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			transform: scale(1.3);
		}
	}

	@keyframes impact {
		0% {
			transform: scale(1.04, 0.94);
		}
	}

	@keyframes flipIn {
		0% {
			transform: perspective(400px) rotateY(90deg);
		}
		100% {
			transform: perspective(400px) rotateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card-targeted {
			animation: none;
			box-shadow: 0 0 0 3px var(--color-target);
		}

		.card-firing,
		.card-hit,
		.card-flip-in,
		.card-landed,
		.card-landed::after {
			animation: none;
		}

		.card-landed::after {
			display: none;
		}
	}

	/* Accessibility: Focus visible */
	.card:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 3px;
	}
</style>
