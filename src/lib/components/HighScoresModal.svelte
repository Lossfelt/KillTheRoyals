<script lang="ts">
	import { highScores, formatScoreDate } from '$lib/stores/highScores';

	export let show: boolean = false;

	$: topFive = $highScores.slice(0, 5);

	function close() {
		show = false;
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click={handleOverlayClick}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>High Scores</h2>
				<button class="close-btn" on:click={close} type="button" aria-label="Close">×</button>
			</div>

			<div class="modal-body">
				{#if topFive.length > 0}
					<ol class="scores-list">
						{#each topFive as entry, index}
							<li class="score-entry">
								<span class="rank">{index + 1}.</span>
								<div class="score-info">
									<div class="score-value">Score: {entry.score}/6</div>
								</div>
								<div class="score-date">{formatScoreDate(entry.timestamp)}</div>
							</li>
						{/each}
					</ol>
				{:else}
					<p class="empty-state">No high scores yet. Win a game to set your first record!</p>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="btn-close" on:click={close} type="button">Close</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-modal-overlay);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-overlay);
		padding: var(--spacing-md);
		overflow-y: auto;
	}

	.modal-content {
		background: var(--color-bg-secondary);
		border-radius: calc(var(--card-radius) * 2);
		max-width: 600px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: var(--shadow-lg);
		z-index: var(--z-modal);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-lg);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.close-btn {
		background: transparent;
		border: none;
		font-size: 2rem;
		color: var(--color-text);
		cursor: pointer;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background var(--transition-fast);
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.modal-body {
		padding: var(--spacing-lg);
	}

	.scores-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.score-entry {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--card-radius);
		align-items: center;
	}

	.rank {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--color-text);
		min-width: 2rem;
	}

	.score-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.score-value {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--color-text);
	}

	.score-date {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		text-align: right;
	}

	.empty-state {
		text-align: center;
		color: var(--color-text-muted);
		padding: var(--spacing-xl);
		font-size: 1.1rem;
	}

	.modal-footer {
		padding: var(--spacing-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: center;
	}

	.btn-close {
		padding: var(--spacing-sm) var(--spacing-xl);
		background: var(--color-button);
		color: white;
		border: none;
		border-radius: var(--card-radius);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 120px;
		min-height: var(--touch-target-min);
	}

	.btn-close:hover {
		background: var(--color-button-hover);
		transform: translateY(-2px);
	}

	.btn-close:active {
		transform: translateY(0);
	}

	/* Mobile */
	@media (max-width: 767px) {
		.modal-content {
			max-height: 95vh;
			margin: auto;
		}

		.modal-header,
		.modal-body,
		.modal-footer {
			padding: var(--spacing-md);
		}

		.modal-header h2 {
			font-size: 1.3rem;
		}

		.score-entry {
			grid-template-columns: auto 1fr;
			gap: var(--spacing-sm);
		}

		.score-date {
			grid-column: 2;
			text-align: left;
			font-size: 0.85rem;
		}

		.rank {
			font-size: 1.3rem;
		}

		.score-value {
			font-size: 1.1rem;
		}
	}
</style>
