<script lang="ts">
	import { gameState, completeSetup, enableReplaceMode } from '$lib/stores/game';

	// Show modal when setup phase is done and all royals are placed
	// BUT NOT when in replace mode (waiting for player to click a card)
	$: showModal =
		$gameState.isSetupPhase &&
		$gameState.cardsInPlay.royalsToBePlaced.length === 0 &&
		!$gameState.setupPhaseReplaceMode;

	function handleSkip() {
		completeSetup(false);
	}

	function handleReplace() {
		enableReplaceMode();
	}
</script>

{#if showModal}
	<div class="modal-overlay">
		<div class="modal-content">
			<h2>Vil du bytte ut ett kort?</h2>
			<p>Du kan velge å bytte ut ett nummerkort på brettet med et nytt kort fra bunken.</p>

			<div class="button-group">
				<button class="button button-secondary" on:click={handleSkip}>
					Nei, start spillet
				</button>
				<button class="button button-primary" on:click={handleReplace}>
					Ja, bytt kort
				</button>
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
		background-color: var(--color-modal-overlay);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-overlay);
		padding: var(--spacing-md);
	}

	.modal-content {
		background-color: var(--color-bg-secondary);
		border: 2px solid var(--color-card-border);
		border-radius: calc(var(--card-radius) * 2);
		padding: var(--spacing-xl);
		max-width: 500px;
		width: 100%;
		box-shadow: var(--shadow-lg);
		text-align: center;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: var(--spacing-md);
		color: var(--color-text);
	}

	p {
		font-size: 1rem;
		color: var(--color-text-muted);
		margin-bottom: var(--spacing-lg);
		line-height: 1.5;
	}

	.button-group {
		display: flex;
		gap: var(--spacing-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.button {
		padding: var(--spacing-md) var(--spacing-lg);
		font-size: 1rem;
		font-weight: 600;
		border-radius: var(--card-radius);
		min-width: 44px;
		min-height: 44px;
		transition: all var(--transition-normal);
		cursor: pointer;
	}

	.button-primary {
		background-color: var(--color-button);
		color: white;
	}

	.button-primary:hover {
		background-color: var(--color-button-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.button-secondary {
		background-color: transparent;
		color: var(--color-text);
		border: 2px solid var(--color-text-muted);
	}

	.button-secondary:hover {
		border-color: var(--color-text);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	/* Mobile optimization */
	@media (max-width: 767px) {
		.modal-content {
			padding: var(--spacing-lg);
		}

		h2 {
			font-size: 1.25rem;
		}

		p {
			font-size: 0.9rem;
		}

		.button-group {
			flex-direction: column;
		}

		.button {
			width: 100%;
		}
	}
</style>
