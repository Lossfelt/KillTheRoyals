<script lang="ts">
	import { onDestroy } from 'svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';
	import SetupCompleteModal from '$lib/components/SetupCompleteModal.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	import HighScoresModal from '$lib/components/HighScoresModal.svelte';
	import StackViewModal from '$lib/components/StackViewModal.svelte';
	import { audioState, toggleMute, cleanupAudio } from '$lib/stores/audio';
	import { gameState } from '$lib/stores/game';

	let showRules = false;
	let showHighScores = false;
	let isTogglingMute = false;

	function toggleRules() {
		showRules = !showRules;
	}

	function toggleHighScores() {
		showHighScores = !showHighScores;
	}

	async function handleMuteToggle() {
		if (isTogglingMute) return; // Prevent race condition from multiple clicks

		isTogglingMute = true;
		try {
			await toggleMute();
		} catch (error) {
			console.error('[UI] Failed to toggle mute:', error);
		} finally {
			isTogglingMute = false;
		}
	}

	// Cleanup audio resources when component unmounts
	onDestroy(() => {
		cleanupAudio();
	});
</script>

<svelte:head>
	<title>Kill The Royals</title>
	<meta name="description" content="Kill The Royals - Digital implementation of Gridcannon by Tom Francis" />
</svelte:head>

<main>
	<button
		class="mute-button"
		class:error={$audioState.hasError}
		on:click={handleMuteToggle}
		disabled={isTogglingMute || $audioState.hasError}
		type="button"
		aria-label={$audioState.isMuted ? 'Unmute music' : 'Mute music'}
		title={$audioState.hasError ? 'Audio failed to load' : ''}
	>
		{#if isTogglingMute}
			⏳
		{:else if $audioState.hasError}
			❌
		{:else}
			{$audioState.isMuted ? '🔇' : '🔊'}
		{/if}
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

	.mute-button:focus-visible {
		outline: 3px solid var(--color-button);
		outline-offset: 2px;
	}

	.mute-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.mute-button:disabled:hover {
		border-color: var(--color-text-muted);
		transform: none;
	}

	.mute-button.error {
		border-color: var(--color-error);
		opacity: 0.7;
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
