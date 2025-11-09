<script lang="ts">
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';

	let showRules = false;

	function toggleRules() {
		showRules = !showRules;
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

	<GameControls onShowRules={toggleRules} />

	<GameBoard />

	<RulesModal bind:show={showRules} />
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
