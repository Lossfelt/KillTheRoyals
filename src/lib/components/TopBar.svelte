<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from './Icon.svelte';
	import { audioState, toggleMute } from '#lib/stores/audio.js';
	import { gameState, restartGame, toggleViewStackMode } from '#lib/stores/game.js';

	interface Props {
		onShowRules: () => void;
		onShowHighScores: () => void;
	}

	let { onShowRules, onShowHighScores }: Props = $props();

	const CONFIRM_WINDOW_MS = 3000;

	let isTogglingMute = $state(false);
	let confirmingRestart = $state(false);
	let confirmTimer: ReturnType<typeof setTimeout> | undefined;

	// A finished game restarts at once; a game in progress asks for a second tap
	function handleRestart() {
		const inProgress = $gameState.gameStatus === 'playing' && !$gameState.isSetupPhase;
		if (!inProgress || confirmingRestart) {
			clearTimeout(confirmTimer);
			confirmingRestart = false;
			restartGame();
			return;
		}
		confirmingRestart = true;
		confirmTimer = setTimeout(() => (confirmingRestart = false), CONFIRM_WINDOW_MS);
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

	onDestroy(() => clearTimeout(confirmTimer));
</script>

<header class="top-bar">
	<h1 class="title">
		<span class="title-crown"><Icon name="crown" size={20} filled /></span>
		<span>Kill the Royals</span>
	</h1>

	<nav class="actions" aria-label="Game menu">
		<button class="icon-btn" onclick={onShowRules} type="button" aria-label="Rules" title="Rules">
			<Icon name="rules" />
		</button>
		<button
			class="icon-btn"
			onclick={onShowHighScores}
			type="button"
			aria-label="High scores"
			title="High scores"
		>
			<Icon name="trophy" />
		</button>
		<button
			class="icon-btn"
			class:active={$gameState.viewStackMode}
			onclick={toggleViewStackMode}
			type="button"
			aria-pressed={$gameState.viewStackMode}
			aria-label="View stacks"
			title="View stacks (or long-press a stack)"
		>
			<Icon name="eye" />
		</button>
		<button
			class="icon-btn"
			class:error={$audioState.hasError}
			onclick={handleMuteToggle}
			disabled={isTogglingMute || $audioState.hasError}
			type="button"
			aria-label={$audioState.isMuted ? 'Unmute music' : 'Mute music'}
			title={$audioState.hasError ? 'Audio failed to load' : 'Music'}
		>
			{#if isTogglingMute}
				<Icon name="loading" />
			{:else if $audioState.hasError}
				<Icon name="alert" />
			{:else}
				<Icon name={$audioState.isMuted ? 'muted' : 'sound'} />
			{/if}
		</button>
		<button
			class="icon-btn restart"
			class:confirming={confirmingRestart}
			onclick={handleRestart}
			type="button"
			aria-label={confirmingRestart ? 'Tap again to restart' : 'Restart'}
			title="Restart"
		>
			<Icon name="restart" />
			{#if confirmingRestart}<span class="confirm-label">Restart?</span>{/if}
		</button>
	</nav>
</header>

<style>
	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		height: var(--top-bar-height);
		padding: 0 var(--spacing-sm);
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.05rem, 4.2vw, 1.6rem);
		font-variant: small-caps;
		letter-spacing: 0.06em;
		white-space: nowrap;
		background: var(--gradient-gold);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.title-crown {
		display: flex;
		color: var(--color-gold);
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
	}

	.actions {
		display: flex;
		gap: 2px;
	}

	.icon-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-width: var(--touch-target-min);
		height: var(--touch-target-min);
		padding: 0 var(--spacing-xs);
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		transition:
			background var(--transition-fast),
			color var(--transition-fast);
	}

	.icon-btn:hover:not(:disabled) {
		background: var(--color-hover-overlay);
	}

	.icon-btn:focus-visible {
		outline: 3px solid var(--color-gold);
		outline-offset: 1px;
	}

	.icon-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon-btn.active {
		background: var(--color-gold);
		color: var(--color-ink);
	}

	.icon-btn.error {
		color: var(--color-error);
	}

	.restart.confirming {
		padding: 0 var(--spacing-sm);
		background: var(--color-target);
		color: white;
	}

	.confirm-label {
		font-size: 0.85rem;
		font-weight: 700;
	}

	/* Narrow phones: keep the full height for touch, trim the width so the title fits */
	@media (max-width: 400px) {
		.top-bar {
			padding: 0;
		}

		.title {
			font-size: 0.92rem;
			letter-spacing: 0.02em;
		}

		.actions {
			gap: 0;
		}

		.icon-btn {
			min-width: 38px;
		}
	}
</style>
