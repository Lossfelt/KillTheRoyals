<script lang="ts">
	import { gameState, restartGame } from '$lib/stores/game';
	import { saveHighScore, highScores } from '$lib/stores/highScores';

	const showModal = $derived($gameState.gameStatus === 'won' || $gameState.gameStatus === 'lost');
	const isWin = $derived($gameState.gameStatus === 'won');

	let modalElement: HTMLDivElement | undefined = $state();

	// Score: Start at 6, subtract 1 for each USED Joker or Ace (0-6)
	const score = $derived.by(() => {
		let baseScore = 6;
		const cards = $gameState.cardsInPlay;

		// Subtract 1 for each used Joker (2)
		if (cards.joker1[0] && cards.joker1[0].value === 'USED') baseScore--;
		if (cards.joker2[0] && cards.joker2[0].value === 'USED') baseScore--;

		// Subtract 1 for each used Ace (4)
		if (cards.ace1[0] && cards.ace1[0].value === 'USED') baseScore--;
		if (cards.ace2[0] && cards.ace2[0].value === 'USED') baseScore--;
		if (cards.ace3[0] && cards.ace3[0].value === 'USED') baseScore--;
		if (cards.ace4[0] && cards.ace4[0].value === 'USED') baseScore--;

		return baseScore;
	});

	let hasScoreSaved = $state(false);

	// Check if current score qualifies as top 5
	const isNewHighScore = $derived(
		isWin &&
			($highScores.length < 5 ||
				score > $highScores[Math.min(4, $highScores.length - 1)].score)
	);

	// Save high score when player wins
	$effect(() => {
		if (isWin && showModal && !hasScoreSaved) {
			saveHighScore(score);
			hasScoreSaved = true;
		}
	});

	// Reset saved flag when modal closes
	$effect(() => {
		if (!showModal) {
			hasScoreSaved = false;
		}
	});

	// Auto-focus modal when opened
	$effect(() => {
		if (showModal && modalElement) {
			modalElement.focus();
		}
	});

	function handlePlayAgain() {
		restartGame();
	}
</script>

{#if showModal}
	<div bind:this={modalElement} class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title" tabindex="-1">
		<div class="modal-content" class:victory={isWin} class:defeat={!isWin}>
			<h2 id="game-over-title">{isWin ? 'Victory! 🎉' : 'Defeat 💔'}</h2>

			{#if isWin}
				{#if isNewHighScore}
					<div class="new-high-score-badge">🎉 New High Score!</div>
				{/if}

				<div class="stats">
					<div class="stat-row">
						<span class="stat-label">Score:</span>
						<span class="stat-value">{score}/6</span>
					</div>
				</div>
			{/if}

			<button class="button button-primary" onclick={handlePlayAgain}>
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
		border-color: var(--color-success);
	}

	.modal-content.defeat {
		border-color: var(--color-error);
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

	.new-high-score-badge {
		background: linear-gradient(135deg, var(--color-gold), #ffed4e);
		color: var(--color-bg);
		font-weight: bold;
		font-size: 1.1rem;
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--card-radius);
		margin-bottom: var(--spacing-md);
		text-align: center;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
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

	.button-primary:focus-visible {
		outline: 3px solid var(--color-button);
		outline-offset: 2px;
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
