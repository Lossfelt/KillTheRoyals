<script lang="ts">
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';
	import SetupCompleteModal from '$lib/components/SetupCompleteModal.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	import HighScoresModal from '$lib/components/HighScoresModal.svelte';

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
</main>

<style>
	main {
		min-height: 100vh;
		padding: var(--spacing-md);
		padding-bottom: var(--spacing-xl);
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

		header {
			padding: var(--spacing-md) 0;
		}
	}
</style>
