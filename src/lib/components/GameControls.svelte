<script lang="ts">
	import { restartGame, gameState, toggleViewStackMode, undo, canUndo } from '$lib/stores/game';

	export let onShowRules: () => void;
	export let onShowHighScores: () => void;
</script>

<div class="game-controls">
	<button class="btn" on:click={restartGame} type="button">
		Restart
	</button>
	<button class="btn" on:click={onShowHighScores} type="button">
		High Scores
	</button>
	<button class="btn" on:click={onShowRules} type="button">
		Rules
	</button>
	<button class="btn" on:click={undo} disabled={!$canUndo} type="button">
		Undo
	</button>
	<button
		class="btn"
		class:active={$gameState.viewStackMode}
		on:click={toggleViewStackMode}
		type="button"
	>
		View Stack
	</button>
</div>

<style>
	.game-controls {
		display: flex;
		gap: var(--spacing-md);
		justify-content: center;
		padding: var(--spacing-lg);
		max-width: var(--grid-max-width);
		margin: 0 auto;
	}

	.btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--card-radius);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 120px;
		min-height: var(--touch-target-min);
		background: transparent;
		color: var(--color-text);
		border: 2px solid var(--color-text-muted);
	}

	.btn:hover {
		border-color: var(--color-text);
		transform: translateY(-2px);
	}

	.btn:active {
		transform: translateY(0);
	}

	.btn.active {
		background: var(--color-button);
		color: white;
		border-color: var(--color-button);
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Mobile */
	@media (max-width: 767px) {
		.game-controls {
			flex-direction: column;
			padding: var(--spacing-md);
		}

		.btn {
			width: 100%;
		}
	}
</style>
