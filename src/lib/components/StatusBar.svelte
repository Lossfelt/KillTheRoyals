<script lang="ts">
	import Icon from './Icon.svelte';
	import { gameState, undo, canUndo } from '#lib/stores/game.js';
	import { TOTAL_ROYALS, calculateScore, countKilledRoyals } from '#lib/utils/score.js';

	const killed = $derived(countKilledRoyals($gameState.cardsInPlay));
	const score = $derived(calculateScore($gameState.cardsInPlay));
	const deckSize = $derived($gameState.deck.length);
</script>

<div class="status-bar">
	<dl class="stats">
		<div class="stat" title="Royals killed">
			<dt><Icon name="crown" size={18} /><span class="sr-only">Royals killed</span></dt>
			<dd>
				<span class="value">{killed}</span><span class="of">/{TOTAL_ROYALS}</span>
				<span class="progress" style="--progress: {killed / TOTAL_ROYALS}" aria-hidden="true"
				></span>
			</dd>
		</div>
		<div class="stat" title="Cards left in deck">
			<dt><Icon name="deck" size={18} /><span class="sr-only">Cards in deck</span></dt>
			<dd><span class="value">{deckSize}</span></dd>
		</div>
		<div class="stat" title="Score: unused Aces and Jokers">
			<dt><Icon name="star" size={18} /><span class="sr-only">Score</span></dt>
			<dd><span class="value">{score}</span><span class="of">/6</span></dd>
		</div>
	</dl>

	<button class="undo-btn" onclick={undo} disabled={!$canUndo} type="button">
		<Icon name="undo" size={18} />
		<span>Undo</span>
	</button>
</div>

<style>
	.status-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		height: var(--status-bar-height);
		padding: 0 var(--spacing-sm);
	}

	.stats {
		display: flex;
		gap: var(--spacing-md);
		margin: 0;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--color-text-muted);
	}

	dt {
		display: flex;
		color: var(--color-gold);
	}

	dd {
		position: relative;
		margin: 0;
		font-variant-numeric: tabular-nums;
	}

	.value {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.of {
		font-size: 0.8rem;
	}

	/* Thin bar under the royal count */
	.progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -3px;
		height: 2px;
		border-radius: 1px;
		background: linear-gradient(
			to right,
			var(--color-gold) calc(var(--progress) * 100%),
			var(--color-divider) 0
		);
	}

	.undo-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 40px;
		padding: 0 var(--spacing-md);
		border: 1px solid var(--color-gold-muted);
		border-radius: 999px;
		background: var(--color-subtle-bg);
		color: var(--color-text);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			background var(--transition-fast),
			opacity var(--transition-fast);
	}

	.undo-btn:hover:not(:disabled) {
		background: var(--color-hover-overlay);
	}

	.undo-btn:focus-visible {
		outline: 3px solid var(--color-gold);
		outline-offset: 2px;
	}

	.undo-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
