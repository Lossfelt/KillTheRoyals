<script lang="ts">
	import { gameState, restartGame } from '$lib/stores/game';

	$: showModal = $gameState.gameStatus === 'won' || $gameState.gameStatus === 'lost';
	$: isWin = $gameState.gameStatus === 'won';
	$: cardsUsed = 54 - $gameState.deck.length; // Total cards - remaining cards

	// Score: Number of unspent Jokers and Aces (0-6)
	$: {
		let unusedCount = 0;
		const cards = $gameState.cardsInPlay;

		// Count unused Jokers (2)
		if (cards.joker1[0] && cards.joker1[0].value !== 'USED') unusedCount++;
		if (cards.joker2[0] && cards.joker2[0].value !== 'USED') unusedCount++;

		// Count unused Aces (4)
		if (cards.ace1[0] && cards.ace1[0].value !== 'USED') unusedCount++;
		if (cards.ace2[0] && cards.ace2[0].value !== 'USED') unusedCount++;
		if (cards.ace3[0] && cards.ace3[0].value !== 'USED') unusedCount++;
		if (cards.ace4[0] && cards.ace4[0].value !== 'USED') unusedCount++;

		score = unusedCount;
	}

	let score = 0;

	function handlePlayAgain() {
		restartGame();
	}
</script>

{#if showModal}
	<div class="modal-overlay">
		<div class="modal-content" class:victory={isWin} class:defeat={!isWin}>
			<h2>{isWin ? 'Victory! 🎉' : 'Defeat 😞'}</h2>

			<div class="stats">
				<div class="stat-row">
					<span class="stat-label">Cards used:</span>
					<span class="stat-value">{cardsUsed}/54</span>
				</div>
				<div class="stat-row">
					<span class="stat-label">Score:</span>
					<span class="stat-value">{score}/6</span>
				</div>
			</div>

			<button class="button button-primary" on:click={handlePlayAgain}>
				Play Again
			</button>
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
		max-width: 400px;
		width: 100%;
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

	.modal-content.victory {
		border-color: #4caf50;
	}

	.modal-content.defeat {
		border-color: #f44336;
	}

	h2 {
		font-size: 2rem;
		margin: 0 0 var(--spacing-lg) 0;
		color: var(--color-text);
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-xl);
		padding: var(--spacing-md);
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: var(--card-radius);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-label {
		font-size: 1rem;
		color: var(--color-text-muted);
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--color-text);
	}

	.button {
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: var(--card-radius);
		min-width: 200px;
		min-height: var(--touch-target-min);
		transition: all var(--transition-normal);
		cursor: pointer;
	}

	.button-primary {
		background-color: var(--color-button);
		color: white;
		border: none;
	}

	.button-primary:hover {
		background-color: var(--color-button-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.button-primary:active {
		transform: translateY(0);
	}

	/* Mobile optimization */
	@media (max-width: 767px) {
		.modal-content {
			padding: var(--spacing-lg);
		}

		h2 {
			font-size: 1.5rem;
		}

		.button {
			width: 100%;
		}
	}
</style>
