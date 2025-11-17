<script lang="ts">
	import { restartGame } from '$lib/stores/game';

	export let onShowRules: () => void;
</script>

<div class="game-controls">
	<button class="btn btn-secondary" on:click={onShowRules} type="button">
		Rules
	</button>
	<button class="btn btn-primary" on:click={restartGame} type="button">
		Restart
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
			flex-direction: column;
			padding: var(--spacing-md);
		}

		.btn {
			width: 100%;
		}
	}
</style>
