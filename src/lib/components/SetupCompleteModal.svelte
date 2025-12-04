<script lang="ts">
	import { gameState, completeSetup, enableReplaceMode } from '$lib/stores/game';

	let delayedShow = false;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// Show modal when setup phase is done and all royals are placed
	// BUT NOT when in replace mode (waiting for player to click a card)
	// Add 500ms delay before showing the modal
	$: {
		const shouldShow =
			$gameState.isSetupPhase &&
			$gameState.cardsInPlay.royalsToBePlaced.length === 0 &&
			!$gameState.setupPhaseReplaceMode;

		if (shouldShow && !delayedShow) {
			// Clear any existing timeout
			if (timeoutId) clearTimeout(timeoutId);
			// Set delayed show after 500ms
			timeoutId = setTimeout(() => {
				delayedShow = true;
			}, 500);
		} else if (!shouldShow) {
			// Reset if conditions are no longer met
			if (timeoutId) clearTimeout(timeoutId);
			delayedShow = false;
		}
	}

	$: showModal = delayedShow;

	let modalElement: HTMLDivElement;

	function handleSkip() {
		completeSetup(false);
	}

	function handleReplace() {
		enableReplaceMode();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleSkip();
		}
	}

	// Auto-focus modal when opened
	$: if (showModal && modalElement) {
		modalElement.focus();
	}
</script>

{#if showModal}
	<div
		bind:this={modalElement}
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		aria-labelledby="setup-complete-title"
		tabindex="-1"
		on:keydown={handleKeydown}
	>
		<div class="modal-content">
			<h2 id="setup-complete-title">Replace a card?</h2>
			<p>You can choose to replace one numbered card on the board with a new card from the deck.</p>

			<div class="button-group">
				<button class="button button-secondary" on:click={handleSkip} type="button">
					No, start game
				</button>
				<button class="button button-primary" on:click={handleReplace} type="button">
					Yes, replace card
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
		align-items: flex-start;
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
		max-height: fit-content;
		height: fit-content;
		box-shadow: var(--shadow-lg);
		text-align: center;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
		min-width: var(--touch-target-min);
		min-height: var(--touch-target-min);
		transition: transform var(--transition-normal),
		            background-color var(--transition-normal),
		            border-color var(--transition-normal),
		            box-shadow var(--transition-normal);
		cursor: pointer;
		border: none;
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

	.button-primary:active {
		transform: translateY(0);
	}

	.button-primary:focus-visible {
		outline: 3px solid var(--color-button);
		outline-offset: 2px;
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

	.button-secondary:active {
		transform: translateY(0);
	}

	.button-secondary:focus-visible {
		outline: 3px solid var(--color-button);
		outline-offset: 2px;
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
