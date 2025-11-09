<script lang="ts">
	import { gameState, restartGame, livingRoyalsCount, isGameOver } from '$lib/stores/game';

	export let onShowRules: () => void;

	$: deckCount = $gameState.deck.length;
	$: royalsLeft = $livingRoyalsCount;
</script>

<div class="game-controls">
	<div class="stats">
		<div class="stat">
			<span class="stat-label">Deck:</span>
			<span class="stat-value">{deckCount}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Royals:</span>
			<span class="stat-value">{royalsLeft}/12</span>
		</div>
		<div class="stat">
			<span class="stat-label">Status:</span>
			<span class="stat-value">
				{#if $gameState.gameStatus === 'setup'}
					Setup
				{:else if $gameState.gameStatus === 'won'}
					Won! 🎉
				{:else if $gameState.gameStatus === 'lost'}
					Lost 😞
				{:else}
					Playing
				{/if}
			</span>
		</div>
	</div>

	<div class="buttons">
		<button class="btn btn-secondary" on:click={onShowRules} type="button">
			Rules
		</button>
		<button class="btn btn-primary" on:click={restartGame} type="button">
			{$isGameOver ? 'Play Again' : 'Restart'}
		</button>
	</div>
</div>

<style>
	.game-controls {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		max-width: var(--grid-max-width);
		margin: 0 auto;
	}

	.stats {
		display: flex;
		justify-content: space-around;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background: var(--color-bg-secondary);
		border-radius: var(--card-radius);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--color-text);
	}

	.buttons {
		display: flex;
		gap: var(--spacing-md);
		justify-content: center;
	}

	.btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--card-radius);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-fast);
		border: none;
		min-width: 120px;
		min-height: var(--touch-target-min);
	}

	.btn-primary {
		background: var(--color-button);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-button-hover);
		transform: translateY(-2px);
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-text);
		border: 2px solid var(--color-text-muted);
	}

	.btn-secondary:hover {
		border-color: var(--color-text);
		transform: translateY(-2px);
	}

	.btn-secondary:active {
		transform: translateY(0);
	}

	/* Mobile */
	@media (max-width: 767px) {
		.game-controls {
			padding: var(--spacing-md);
		}

		.stats {
			flex-direction: column;
			gap: var(--spacing-sm);
		}

		.stat {
			flex-direction: row;
			justify-content: space-between;
		}

		.buttons {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
