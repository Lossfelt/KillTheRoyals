<script lang="ts">
	import Card from './Card.svelte';
	import {
		gameState,
		selectJokerPosition,
		selectAcePosition,
		activateAce,
		activateJoker
	} from '#lib/stores/game.js';
	import type { AcePosition, JokerPosition, SpecialPosition } from '#lib/types.js';

	const JOKERS: readonly JokerPosition[] = ['joker1', 'joker2'];
	const ACES: readonly AcePosition[] = ['ace1', 'ace2', 'ace3', 'ace4'];

	const topCard = $derived($gameState.deck[0]);
	const topKey = $derived(topCard ? `${topCard.value}-${topCard.suit}` : 'empty');

	// Placed Ace/Joker that has not been used yet can be activated
	function isUnused(position: SpecialPosition): boolean {
		const card = $gameState.cardsInPlay[position][0];
		return !!card && card.value !== 'USED';
	}

	function isAlternative(position: SpecialPosition): boolean {
		return position.startsWith('joker')
			? $gameState.alternativeJokerPositions.includes(position as JokerPosition)
			: $gameState.alternativeAcePositions.includes(position as AcePosition);
	}

	// Dim specials while something else must be placed first
	function shouldDim(position: SpecialPosition): boolean {
		if (isAlternative(position)) return false; // Never dim alternative positions - they need to be clickable!

		// Don't dim when armor is being placed (numbered cards can still use specials)
		if ($gameState.alternativeArmorPositions.length > 0) return false;

		return (
			$gameState.isSetupPhase ||
			$gameState.cardsInPlay.royalsToBePlaced.length > 0 ||
			$gameState.alternativeRoyalPositions.length > 0 ||
			$gameState.alternativeAcePositions.length > 0 ||
			$gameState.alternativeJokerPositions.length > 0
		);
	}

	// Placement click when highlighted, otherwise activation of a placed card
	function handleJokerClick(position: JokerPosition) {
		if (isAlternative(position)) selectJokerPosition(position);
		else activateJoker(position);
	}

	function handleAceClick(position: AcePosition) {
		if (isAlternative(position)) selectAcePosition(position);
		else activateAce(position);
	}
</script>

<div class="supply" aria-label="Deck, Jokers and Aces">
	<div class="slot deck">
		{#key topKey}
			<Card
				card={topCard}
				stackDepth={$gameState.deck.length}
				clickable={false}
				position="deck"
				flipIn
			/>
		{/key}
	</div>

	{#each JOKERS as pos (pos)}
		<div class="slot">
			<Card
				card={$gameState.cardsInPlay[pos][0]}
				active={$gameState.jokerInUse === pos}
				clickable={isAlternative(pos) || isUnused(pos)}
				alternative={isAlternative(pos)}
				onclick={() => handleJokerClick(pos)}
				slotType="joker"
				dimmed={shouldDim(pos)}
				position={pos}
			/>
		</div>
	{/each}

	{#each ACES as pos (pos)}
		<div class="slot">
			<Card
				card={$gameState.cardsInPlay[pos][0]}
				active={$gameState.aceInUse === pos}
				clickable={isAlternative(pos) || isUnused(pos)}
				alternative={isAlternative(pos)}
				onclick={() => handleAceClick(pos)}
				slotType="ace"
				dimmed={shouldDim(pos)}
				position={pos}
			/>
		</div>
	{/each}
</div>

<style>
	/* Portrait: one row under the board. Landscape: two columns beside it (see GameBoard) */
	.supply {
		display: grid;
		grid-template-columns: repeat(7, var(--card-w));
		grid-auto-rows: var(--card-h);
		gap: var(--gap);
		padding: var(--board-pad);
		border-radius: calc(var(--card-radius) * 3);
		border: 1px solid var(--color-print-faint);
	}

	.slot {
		width: var(--card-w);
		height: var(--card-h);
	}

	.deck {
		filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.35));
	}

	@container stage (aspect-ratio > 1) {
		.supply {
			grid-template-columns: repeat(2, var(--card-w));
			align-content: start;
		}
	}
</style>
