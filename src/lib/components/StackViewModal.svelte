<script lang="ts">
	import type { GridPosition } from '$lib/types';
	import { gameState, closeStackView } from '$lib/stores/game';
	import CardSVG from './CardSVG.svelte';

	export let position: GridPosition;

	$: stack = $gameState.cardsInPlay[position];
	$: show = $gameState.viewingStack === position;

	function handleClose() {
		closeStackView();
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}

	// Get position name for display
	const positionNames: Record<GridPosition, string> = {
		upperLeft: 'Upper Left',
		upperMiddle: 'Upper Middle',
		upperRight: 'Upper Right',
		middleLeft: 'Middle Left',
		middleMiddle: 'Middle Middle',
		middleRight: 'Middle Right',
		bottomLeft: 'Bottom Left',
		bottomMiddle: 'Bottom Middle',
		bottomRight: 'Bottom Right'
	};
</script>

{#if show}
	<div class="modal-overlay" on:click={handleOverlayClick} on:keydown={handleKeyDown} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
		<div class="modal-content">
			<header>
				<h2 id="modal-title">{positionNames[position]} Stack</h2>
				<button class="close-btn" on:click={handleClose} type="button" aria-label="Close modal">×</button>
			</header>

			<div class="stack-display">
				{#if stack.length === 0}
					<p class="empty-message">No cards in this stack</p>
				{:else}
					<div class="cards-list">
						{#each stack as card, index}
							<div class="card-item">
								<span class="card-position">{index === 0 ? 'Top' : `#${index + 1}`}</span>
								<div class="card-preview card-{card.color}">
									<CardSVG {card} />
								</div>
							</div>
						{/each}
					</div>
				{/if}
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
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-md);
	}

	.modal-content {
		background: var(--color-bg);
		border-radius: var(--card-radius);
		max-width: 200px;
		width: 100%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-md);
		border-bottom: 1px solid var(--color-text-muted);
	}

	h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.close-btn {
		background: transparent;
		border: none;
		font-size: 2rem;
		color: var(--color-text-muted);
		cursor: pointer;
		line-height: 1;
		padding: 0;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: var(--color-text);
	}

	.stack-display {
		padding: var(--spacing-md);
		overflow-y: auto;
		flex: 1;
	}

	.empty-message {
		text-align: center;
		color: var(--color-text-muted);
		padding: var(--spacing-lg);
	}

	.cards-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.card-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-sm);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--card-radius);
	}

	.card-position {
		font-weight: 600;
		color: var(--color-text-muted);
		min-width: 50px;
	}

	.card-preview {
		width: 80px;
		height: 112px;
		flex-shrink: 0;
	}

	/* Mobile adjustments */
	@media (max-width: 767px) {
		.modal-content {
			max-height: 90vh;
		}

		.card-item {
			flex-direction: row;
			align-items: center;
		}

		.card-preview {
			width: 60px;
			height: 84px;
		}
	}
</style>
