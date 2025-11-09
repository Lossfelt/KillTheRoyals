<script lang="ts">
	export let show: boolean = false;

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
				<h2>Game Rules</h2>
				<button class="close-btn" on:click={close} type="button" aria-label="Close">×</button>
			</div>

			<div class="modal-body">
				<h3>Objective</h3>
				<p>Kill all 12 royal cards (Jacks, Queens, Kings) by creating payloads to shoot them.</p>

				<h3>Setup</h3>
				<ul>
					<li>Draw 9 numbered cards to fill the 3×3 grid</li>
					<li>Royals, Aces, and Jokers are set aside during setup</li>
					<li>Optionally replace one card after setup</li>
				</ul>

				<h3>Card Placement</h3>
				<ul>
					<li><strong>Numbered (2-10):</strong> Place on grid stacks (same or lower value)</li>
					<li><strong>Royals (J/Q/K):</strong> Auto-placed adjacent to similar cards</li>
					<li><strong>Armor:</strong> Goes to lowest-value royal (adds health)</li>
				</ul>

				<h3>Combat</h3>
				<p>When you place a card, it creates a <strong>payload</strong> with 2 adjacent cards that can shoot royals:</p>
				<ul>
					<li><strong>Jack (11):</strong> Any suits, total ≥ 11</li>
					<li><strong>Queen (12):</strong> Same color, total ≥ 12</li>
					<li><strong>King (13):</strong> Same suit, total ≥ 13</li>
				</ul>

				<h3>Special Cards</h3>
				<ul>
					<li><strong>Ace:</strong> Click to activate, then click a stack to remove it</li>
					<li><strong>Joker:</strong> Click to activate, then move one card between stacks</li>
				</ul>

				<h3>Win/Loss</h3>
				<ul>
					<li><strong>Win:</strong> All 12 royals killed</li>
					<li><strong>Loss:</strong> Deck empty with royals still alive</li>
				</ul>

				<p class="note">
					<strong>Original game:</strong>
					<a href="https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/" target="_blank" rel="noopener">
						Gridcannon by Tom Francis
					</a>
				</p>
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
		line-height: 1.6;
	}

	.modal-body h3 {
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
		color: var(--color-active);
		font-size: 1.2rem;
	}

	.modal-body h3:first-child {
		margin-top: 0;
	}

	.modal-body p {
		margin-bottom: var(--spacing-md);
	}

	.modal-body ul {
		margin-bottom: var(--spacing-md);
		padding-left: var(--spacing-lg);
	}

	.modal-body li {
		margin-bottom: var(--spacing-xs);
	}

	.modal-body a {
		color: var(--color-active);
		text-decoration: none;
	}

	.modal-body a:hover {
		text-decoration: underline;
	}

	.note {
		margin-top: var(--spacing-lg);
		padding: var(--spacing-md);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--card-radius);
		font-size: 0.9rem;
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

		.modal-body h3 {
			font-size: 1.1rem;
		}
	}
</style>
