<script lang="ts">
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';
	import SetupCompleteModal from '$lib/components/SetupCompleteModal.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	import HighScoresModal from '$lib/components/HighScoresModal.svelte';
	import StackViewModal from '$lib/components/StackViewModal.svelte';
	import { audioState, toggleMute } from '$lib/stores/audio';
	import { gameState } from '$lib/stores/game';

	let showRules = false;
	let showHighScores = false;

	function toggleRules() {
		showRules = !showRules;
	}

	function toggleHighScores() {
		showHighScores = !showHighScores;
	}
</script>

<svelte:head>
	<title>Kill The Royals</title>
	<meta name="description" content="Kill The Royals - Digital implementation of Gridcannon by Tom Francis" />
</svelte:head>

<main>
	<button
		class="mute-button"
		on:click={toggleMute}
		type="button"
		aria-label={$audioState.isMuted ? 'Unmute music' : 'Mute music'}
	>
		{$audioState.isMuted ? '🔇' : '🔊'}
	</button>

	<header>
		<h1>Kill The Royals</h1>
		<p class="subtitle">A card game by Tom Francis</p>
	</header>

	<GameControls onShowRules={toggleRules} onShowHighScores={toggleHighScores} />

	<GameBoard />

	<SetupCompleteModal />
	<GameOverModal />
	<RulesModal bind:show={showRules} />
	<HighScoresModal bind:show={showHighScores} />

	{#if $gameState.viewingStack}
		<StackViewModal position={$gameState.viewingStack} />
	{/if}
</main>

<style>
	main {
		min-height: 100vh;
		padding: var(--spacing-md);
		padding-bottom: var(--spacing-xl);
		position: relative;
	}

	.mute-button {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: transparent;
		border: 2px solid var(--color-text-muted);
		color: var(--color-text);
		font-size: 1.25rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.mute-button:hover {
		border-color: var(--color-text);
		transform: scale(1.1);
	}

	.mute-button:active {
		transform: scale(0.95);
	}

	header {
		text-align: center;
		padding: var(--spacing-lg) 0;
	}

	h1 {
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		margin-bottom: var(--spacing-xs);
		color: var(--color-text);
	}

	.subtitle {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Mobile */
	@media (max-width: 767px) {
		main {
			padding: var(--spacing-sm);
		}

		.mute-button {
			top: var(--spacing-sm);
			right: var(--spacing-sm);
		}

		header {
			padding: var(--spacing-md) 0;
		}
	}
</style>
