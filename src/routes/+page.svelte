<script lang="ts">
	import { onDestroy } from 'svelte';
	import TopBar from '#lib/components/TopBar.svelte';
	import StatusBar from '#lib/components/StatusBar.svelte';
	import GameBoard from '#lib/components/GameBoard.svelte';
	import Celebration from '#lib/components/Celebration.svelte';
	import RulesModal from '#lib/components/RulesModal.svelte';
	import SetupCompleteModal from '#lib/components/SetupCompleteModal.svelte';
	import GameOverModal from '#lib/components/GameOverModal.svelte';
	import HighScoresModal from '#lib/components/HighScoresModal.svelte';
	import StackViewModal from '#lib/components/StackViewModal.svelte';
	import { cleanupAudio } from '#lib/stores/audio.js';
	import { gameState } from '#lib/stores/game.js';

	let showRules = $state(false);
	let showHighScores = $state(false);

	// Cleanup audio resources when component unmounts
	onDestroy(() => {
		cleanupAudio();
	});
</script>

<svelte:head>
	<title>Kill The Royals</title>
	<meta
		name="description"
		content="Kill The Royals - Digital implementation of Gridcannon by Tom Francis"
	/>
</svelte:head>

<main>
	<TopBar onShowRules={() => (showRules = true)} onShowHighScores={() => (showHighScores = true)} />
	<StatusBar />
	<GameBoard />

	{#if $gameState.gameStatus === 'won'}
		<Celebration />
	{/if}

	<SetupCompleteModal />
	<GameOverModal />
	<RulesModal bind:show={showRules} />
	<HighScoresModal bind:show={showHighScores} />

	{#if $gameState.viewingStack}
		<StackViewModal position={$gameState.viewingStack} />
	{/if}
</main>

<style>
	/* One screen tall: bars at the top, the table fills the rest */
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		max-width: 1000px;
		margin: 0 auto;
		padding: env(safe-area-inset-top) var(--spacing-sm)
			max(var(--spacing-sm), env(safe-area-inset-bottom));
	}
</style>
