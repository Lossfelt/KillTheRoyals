<script lang="ts">
	import {
		gameState,
		placeNumberedCard,
		selectJokerPosition,
		selectAcePosition,
		selectRoyalPosition,
		selectArmorPosition,
		activateAce,
		useAce,
		activateJoker,
		selectJokerSource,
		useJoker,
		completeSetup
	} from '$lib/stores/game';
	import Card from './Card.svelte';
	import type { GridPosition, AcePosition, JokerPosition, RoyalPosition, ArmorPosition } from '$lib/types';

	// Handle clicks on grid positions
	function handleGridClick(position: GridPosition) {
		// If in setup replace mode, replace the clicked card
		if ($gameState.isSetupPhase && $gameState.setupPhaseReplaceMode) {
			completeSetup(true, position);
			return;
		}

		// Block clicks during setup phase (unless in replace mode)
		if ($gameState.isSetupPhase) return;

		// Handle Ace usage: click grid to pick up stack
		if ($gameState.aceInUse) {
			useAce(position);
			return;
		}

		// Handle Joker usage: two-click selection (source, then target)
		if ($gameState.jokerInUse) {
			if ($gameState.jokerSourceStack === null) {
				// First click: select source stack
				selectJokerSource(position);
			} else {
				// Second click: move card to target
				useJoker(position);
			}
			return;
		}

		// Normal card placement from deck
		const topCard = $gameState.deck[0];
		if (!topCard) return;

		// Check card type and handle accordingly
		if (typeof topCard.value === 'number' && topCard.value >= 2 && topCard.value <= 10) {
			placeNumberedCard(position);
		}
	}

	// Check if cards should be dimmed (when royals need to be placed or grid cannot be used)
	function shouldDimCard(): boolean {
		return $gameState.cardsInPlay.royalsToBePlaced.length > 0
			|| !$gameState.canPlaceTopCardOnGrid;
	}

	// Check if a specific royal position should be dimmed
	// Alternative positions (that can be clicked) should NOT be dimmed
	function shouldDimRoyalPosition(position: RoyalPosition): boolean {
		if (isAlternativePosition(position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}
		return shouldDimCard();
	}

	function handleRoyalPositionClick(position: RoyalPosition) {
		// Select this position if it's an alternative
		if ($gameState.alternativeRoyalPositions.includes(position)) {
			selectRoyalPosition(position);
		}
	}

	// Check if a royal position is an alternative choice
	function isAlternativePosition(position: RoyalPosition): boolean {
		return $gameState.alternativeRoyalPositions.includes(position);
	}

	// Check if an armor position is an alternative choice
	function isAlternativeArmorPosition(position: ArmorPosition): boolean {
		return $gameState.alternativeArmorPositions.includes(position);
	}

	// Check if a specific armor position should be dimmed
	function shouldDimArmorPosition(position: ArmorPosition): boolean {
		if (isAlternativeArmorPosition(position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}
		return shouldDimCard();
	}

	function handleArmorPositionClick(position: ArmorPosition) {
		// Select this position if it's an alternative
		if ($gameState.alternativeArmorPositions.includes(position)) {
			selectArmorPosition(position);
		}
	}

	// Check if a grid position is an alternative choice for numbered card placement
	function isAlternativeGridPosition(position: GridPosition): boolean {
		return $gameState.alternativeGridPositions.includes(position);
	}

	// Check if a grid card should show golden glow
	// Two scenarios: 1) Setup replace mode, 2) Numbered card placement from deck
	function shouldShowGridAlternative(position: GridPosition): boolean {
		// Don't show grid highlighting during joker/ace usage (clearer UX)
		if ($gameState.jokerInUse || $gameState.aceInUse) return false;

		// Scenario 1: Setup replace mode - highlight numbered cards to replace
		if ($gameState.setupPhaseReplaceMode) {
			const card = $gameState.cardsInPlay[position][0];
			return card !== undefined && typeof card.value === 'number' && card.value >= 2 && card.value <= 10;
		}

		// Scenario 2: Normal play - highlight positions where card can go
		return isAlternativeGridPosition(position);
	}

	// Check if a joker position is an alternative choice
	function isAlternativeJokerPosition(position: JokerPosition): boolean {
		return $gameState.alternativeJokerPositions.includes(position);
	}

	// Check if a joker position should be dimmed
	function shouldDimJokerPosition(position: JokerPosition): boolean {
		if (isAlternativeJokerPosition(position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}

		// Don't dim when armor is being placed (numbered cards can still use joker)
		if ($gameState.alternativeArmorPositions.length > 0) {
			return false;
		}

		// Dim when setup, royals, or other special cards are being placed
		return $gameState.isSetupPhase
			|| $gameState.cardsInPlay.royalsToBePlaced.length > 0
			|| $gameState.alternativeRoyalPositions.length > 0
			|| $gameState.alternativeAcePositions.length > 0
			|| $gameState.alternativeJokerPositions.length > 0;
	}

	// Handle clicks on joker positions (both placement and activation)
	function handleJokerPositionClick(position: JokerPosition) {
		// Check if this is a placement click (alternative position highlighted)
		if ($gameState.alternativeJokerPositions.includes(position)) {
			selectJokerPosition(position);
			return;
		}

		// Otherwise, it's an activation click (joker already placed)
		activateJoker(position);
	}

	// Check if an ace position is an alternative choice
	function isAlternativeAcePosition(position: AcePosition): boolean {
		return $gameState.alternativeAcePositions.includes(position);
	}

	// Check if an ace position should be dimmed
	function shouldDimAcePosition(position: AcePosition): boolean {
		if (isAlternativeAcePosition(position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}

		// Don't dim when armor is being placed (numbered cards can still use ace)
		if ($gameState.alternativeArmorPositions.length > 0) {
			return false;
		}

		// Dim when setup, royals, or other special cards are being placed
		return $gameState.isSetupPhase
			|| $gameState.cardsInPlay.royalsToBePlaced.length > 0
			|| $gameState.alternativeRoyalPositions.length > 0
			|| $gameState.alternativeJokerPositions.length > 0
			|| $gameState.alternativeAcePositions.length > 0;
	}

	// Handle clicks on ace positions (both placement and activation)
	function handleAcePositionClick(position: AcePosition) {
		// Check if this is a placement click (alternative position highlighted)
		if ($gameState.alternativeAcePositions.includes(position)) {
			selectAcePosition(position);
			return;
		}

		// Otherwise, it's an activation click (ace already placed)
		activateAce(position);
	}
</script>

{#if $gameState.isSetupPhase && $gameState.setupPhaseReplaceMode}
	<div class="replace-mode-indicator">
		Click a numbered card to replace it
	</div>
{/if}

<div class="game-board">
	<!-- Row 1: Empty + Upper Armors + Empty + RoyalsToBePlaced -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.upperLeftArmor[0]}
		clickable={isAlternativeArmorPosition('upperLeftArmor')}
		alternative={isAlternativeArmorPosition('upperLeftArmor')}
		onclick={() => handleArmorPositionClick('upperLeftArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('upperLeftArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperMiddleArmor[0]}
		clickable={isAlternativeArmorPosition('upperMiddleArmor')}
		alternative={isAlternativeArmorPosition('upperMiddleArmor')}
		onclick={() => handleArmorPositionClick('upperMiddleArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('upperMiddleArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperRightArmor[0]}
		clickable={isAlternativeArmorPosition('upperRightArmor')}
		alternative={isAlternativeArmorPosition('upperRightArmor')}
		onclick={() => handleArmorPositionClick('upperRightArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('upperRightArmor')}
	/>
	<div class="cell empty"></div>
	{#if $gameState.cardsInPlay.royalsToBePlaced[0]}
		<Card
			card={$gameState.cardsInPlay.royalsToBePlaced[0]}
			stackDepth={$gameState.cardsInPlay.royalsToBePlaced.length}
			clickable={false}
		/>
	{:else}
		<div class="cell empty"></div>
	{/if}

	<!-- Row 2: Empty + Upper Royals + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.upperLeftRoyal[0]}
		clickable={isAlternativePosition('upperLeftRoyal')}
		alternative={isAlternativePosition('upperLeftRoyal')}
		onclick={() => handleRoyalPositionClick('upperLeftRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('upperLeftRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperMiddleRoyal[0]}
		clickable={isAlternativePosition('upperMiddleRoyal')}
		alternative={isAlternativePosition('upperMiddleRoyal')}
		onclick={() => handleRoyalPositionClick('upperMiddleRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('upperMiddleRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperRightRoyal[0]}
		clickable={isAlternativePosition('upperRightRoyal')}
		alternative={isAlternativePosition('upperRightRoyal')}
		onclick={() => handleRoyalPositionClick('upperRightRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('upperRightRoyal')}
	/>
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 3: Left Upper + Grid Top Row + Right Upper -->
	<Card
		card={$gameState.cardsInPlay.leftUpperArmor[0]}
		clickable={isAlternativeArmorPosition('leftUpperArmor')}
		alternative={isAlternativeArmorPosition('leftUpperArmor')}
		onclick={() => handleArmorPositionClick('leftUpperArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('leftUpperArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.leftUpperRoyal[0]}
		clickable={isAlternativePosition('leftUpperRoyal')}
		alternative={isAlternativePosition('leftUpperRoyal')}
		onclick={() => handleRoyalPositionClick('leftUpperRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('leftUpperRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperLeft[0]}
		stackDepth={$gameState.cardsInPlay.upperLeft.length}
		active={$gameState.jokerSourceStack === 'upperLeft'}
		alternative={shouldShowGridAlternative('upperLeft')}
		onclick={() => handleGridClick('upperLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.upperMiddle[0]}
		stackDepth={$gameState.cardsInPlay.upperMiddle.length}
		active={$gameState.jokerSourceStack === 'upperMiddle'}
		alternative={shouldShowGridAlternative('upperMiddle')}
		onclick={() => handleGridClick('upperMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.upperRight[0]}
		stackDepth={$gameState.cardsInPlay.upperRight.length}
		active={$gameState.jokerSourceStack === 'upperRight'}
		alternative={shouldShowGridAlternative('upperRight')}
		onclick={() => handleGridClick('upperRight')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.rightUpperRoyal[0]}
		clickable={isAlternativePosition('rightUpperRoyal')}
		alternative={isAlternativePosition('rightUpperRoyal')}
		onclick={() => handleRoyalPositionClick('rightUpperRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('rightUpperRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.rightUpperArmor[0]}
		clickable={isAlternativeArmorPosition('rightUpperArmor')}
		alternative={isAlternativeArmorPosition('rightUpperArmor')}
		onclick={() => handleArmorPositionClick('rightUpperArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('rightUpperArmor')}
	/>

	<!-- Row 4: Left Middle + Grid Middle Row + Right Middle -->
	<Card
		card={$gameState.cardsInPlay.leftMiddleArmor[0]}
		clickable={isAlternativeArmorPosition('leftMiddleArmor')}
		alternative={isAlternativeArmorPosition('leftMiddleArmor')}
		onclick={() => handleArmorPositionClick('leftMiddleArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('leftMiddleArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.leftMiddleRoyal[0]}
		clickable={isAlternativePosition('leftMiddleRoyal')}
		alternative={isAlternativePosition('leftMiddleRoyal')}
		onclick={() => handleRoyalPositionClick('leftMiddleRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('leftMiddleRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.middleLeft[0]}
		stackDepth={$gameState.cardsInPlay.middleLeft.length}
		active={$gameState.jokerSourceStack === 'middleLeft'}
		alternative={shouldShowGridAlternative('middleLeft')}
		onclick={() => handleGridClick('middleLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.middleMiddle[0]}
		stackDepth={$gameState.cardsInPlay.middleMiddle.length}
		active={$gameState.jokerSourceStack === 'middleMiddle'}
		alternative={shouldShowGridAlternative('middleMiddle')}
		onclick={() => handleGridClick('middleMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.middleRight[0]}
		stackDepth={$gameState.cardsInPlay.middleRight.length}
		active={$gameState.jokerSourceStack === 'middleRight'}
		alternative={shouldShowGridAlternative('middleRight')}
		onclick={() => handleGridClick('middleRight')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.rightMiddleRoyal[0]}
		clickable={isAlternativePosition('rightMiddleRoyal')}
		alternative={isAlternativePosition('rightMiddleRoyal')}
		onclick={() => handleRoyalPositionClick('rightMiddleRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('rightMiddleRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.rightMiddleArmor[0]}
		clickable={isAlternativeArmorPosition('rightMiddleArmor')}
		alternative={isAlternativeArmorPosition('rightMiddleArmor')}
		onclick={() => handleArmorPositionClick('rightMiddleArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('rightMiddleArmor')}
	/>

	<!-- Row 5: Left Bottom + Grid Bottom Row + Right Bottom -->
	<Card
		card={$gameState.cardsInPlay.leftBottomArmor[0]}
		clickable={isAlternativeArmorPosition('leftBottomArmor')}
		alternative={isAlternativeArmorPosition('leftBottomArmor')}
		onclick={() => handleArmorPositionClick('leftBottomArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('leftBottomArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.leftBottomRoyal[0]}
		clickable={isAlternativePosition('leftBottomRoyal')}
		alternative={isAlternativePosition('leftBottomRoyal')}
		onclick={() => handleRoyalPositionClick('leftBottomRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('leftBottomRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomLeft[0]}
		stackDepth={$gameState.cardsInPlay.bottomLeft.length}
		active={$gameState.jokerSourceStack === 'bottomLeft'}
		alternative={shouldShowGridAlternative('bottomLeft')}
		onclick={() => handleGridClick('bottomLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomMiddle[0]}
		stackDepth={$gameState.cardsInPlay.bottomMiddle.length}
		active={$gameState.jokerSourceStack === 'bottomMiddle'}
		alternative={shouldShowGridAlternative('bottomMiddle')}
		onclick={() => handleGridClick('bottomMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomRight[0]}
		stackDepth={$gameState.cardsInPlay.bottomRight.length}
		active={$gameState.jokerSourceStack === 'bottomRight'}
		alternative={shouldShowGridAlternative('bottomRight')}
		onclick={() => handleGridClick('bottomRight')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.rightBottomRoyal[0]}
		clickable={isAlternativePosition('rightBottomRoyal')}
		alternative={isAlternativePosition('rightBottomRoyal')}
		onclick={() => handleRoyalPositionClick('rightBottomRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('rightBottomRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.rightBottomArmor[0]}
		clickable={isAlternativeArmorPosition('rightBottomArmor')}
		alternative={isAlternativeArmorPosition('rightBottomArmor')}
		onclick={() => handleArmorPositionClick('rightBottomArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('rightBottomArmor')}
	/>

	<!-- Row 6: Empty + Bottom Royals + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.bottomLeftRoyal[0]}
		clickable={isAlternativePosition('bottomLeftRoyal')}
		alternative={isAlternativePosition('bottomLeftRoyal')}
		onclick={() => handleRoyalPositionClick('bottomLeftRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('bottomLeftRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomMiddleRoyal[0]}
		clickable={isAlternativePosition('bottomMiddleRoyal')}
		alternative={isAlternativePosition('bottomMiddleRoyal')}
		onclick={() => handleRoyalPositionClick('bottomMiddleRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('bottomMiddleRoyal')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomRightRoyal[0]}
		clickable={isAlternativePosition('bottomRightRoyal')}
		alternative={isAlternativePosition('bottomRightRoyal')}
		onclick={() => handleRoyalPositionClick('bottomRightRoyal')}
		slotType="royal"
		dimmed={shouldDimRoyalPosition('bottomRightRoyal')}
	/>
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 7: Empty + Bottom Armors + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.bottomLeftArmor[0]}
		clickable={isAlternativeArmorPosition('bottomLeftArmor')}
		alternative={isAlternativeArmorPosition('bottomLeftArmor')}
		onclick={() => handleArmorPositionClick('bottomLeftArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('bottomLeftArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomMiddleArmor[0]}
		clickable={isAlternativeArmorPosition('bottomMiddleArmor')}
		alternative={isAlternativeArmorPosition('bottomMiddleArmor')}
		onclick={() => handleArmorPositionClick('bottomMiddleArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('bottomMiddleArmor')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomRightArmor[0]}
		clickable={isAlternativeArmorPosition('bottomRightArmor')}
		alternative={isAlternativeArmorPosition('bottomRightArmor')}
		onclick={() => handleArmorPositionClick('bottomRightArmor')}
		slotType="armor"
		dimmed={shouldDimArmorPosition('bottomRightArmor')}
	/>
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Break between board and supply -->
	<div class="board-break" aria-hidden="true"></div>

	<!-- Row 8: Deck + Jokers + Aces -->
	<Card
		card={$gameState.deck[0]}
		stackDepth={$gameState.deck.length}
		clickable={false}
	/>
	<Card
		card={$gameState.cardsInPlay.joker1[0]}
		active={$gameState.jokerInUse === 'joker1'}
		clickable={isAlternativeJokerPosition('joker1') || (!!$gameState.cardsInPlay.joker1[0] && $gameState.cardsInPlay.joker1[0]?.value !== 'USED')}
		alternative={isAlternativeJokerPosition('joker1')}
		onclick={() => handleJokerPositionClick('joker1')}
		slotType="joker"
		dimmed={shouldDimJokerPosition('joker1')}
	/>
	<Card
		card={$gameState.cardsInPlay.joker2[0]}
		active={$gameState.jokerInUse === 'joker2'}
		clickable={isAlternativeJokerPosition('joker2') || (!!$gameState.cardsInPlay.joker2[0] && $gameState.cardsInPlay.joker2[0]?.value !== 'USED')}
		alternative={isAlternativeJokerPosition('joker2')}
		onclick={() => handleJokerPositionClick('joker2')}
		slotType="joker"
		dimmed={shouldDimJokerPosition('joker2')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace1[0]}
		active={$gameState.aceInUse === 'ace1'}
		clickable={isAlternativeAcePosition('ace1') || (!!$gameState.cardsInPlay.ace1[0] && $gameState.cardsInPlay.ace1[0]?.value !== 'USED')}
		alternative={isAlternativeAcePosition('ace1')}
		onclick={() => handleAcePositionClick('ace1')}
		slotType="ace"
		dimmed={shouldDimAcePosition('ace1')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace2[0]}
		active={$gameState.aceInUse === 'ace2'}
		clickable={isAlternativeAcePosition('ace2') || (!!$gameState.cardsInPlay.ace2[0] && $gameState.cardsInPlay.ace2[0]?.value !== 'USED')}
		alternative={isAlternativeAcePosition('ace2')}
		onclick={() => handleAcePositionClick('ace2')}
		slotType="ace"
		dimmed={shouldDimAcePosition('ace2')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace3[0]}
		active={$gameState.aceInUse === 'ace3'}
		clickable={isAlternativeAcePosition('ace3') || (!!$gameState.cardsInPlay.ace3[0] && $gameState.cardsInPlay.ace3[0]?.value !== 'USED')}
		alternative={isAlternativeAcePosition('ace3')}
		onclick={() => handleAcePositionClick('ace3')}
		slotType="ace"
		dimmed={shouldDimAcePosition('ace3')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace4[0]}
		active={$gameState.aceInUse === 'ace4'}
		clickable={isAlternativeAcePosition('ace4') || (!!$gameState.cardsInPlay.ace4[0] && $gameState.cardsInPlay.ace4[0]?.value !== 'USED')}
		alternative={isAlternativeAcePosition('ace4')}
		onclick={() => handleAcePositionClick('ace4')}
		slotType="ace"
		dimmed={shouldDimAcePosition('ace4')}
	/>
</div>

<style>
	.game-board {
		display: grid;
		grid-template-columns: repeat(7, minmax(var(--card-width), 1fr));
		gap: var(--grid-gap);
		width: 100%;
		max-width: var(--grid-max-width);
		margin: 0 auto;
		padding: var(--spacing-sm);
		background-color: var(--color-bg-secondary);
		border-radius: calc(var(--card-radius) * 2);
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.board-break {
	grid-column: 1 / -1;
	height: var(--spacing-xl);
	background: var(--color-bg);   /* samme som body-bakgrunn */
	border-radius: 0;
	/* Extend horizontally to cover both padding and grid gap */
	margin-left: calc(-1 * (var(--spacing-sm) + var(--grid-gap)));
	margin-right: calc(-1 * (var(--spacing-sm) + var(--grid-gap)));
	width: calc(100% + (var(--spacing-sm) + var(--grid-gap)) * 2);
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: var(--card-height);
	}

	.cell.empty {
		/* Empty cells for spacing */
		background: transparent;
		min-height: var(--card-height);
	}

	/* Mobile optimization */
	@media (max-width: 767px) {
		.game-board {
			padding: 0.25rem;
			border-radius: var(--card-radius);
		}
	}

	/* Tablet and up */
	@media (min-width: 768px) {
		.game-board {
			padding: var(--spacing-md);
		}
	}

	.replace-mode-indicator {
		position: fixed;
		top: var(--spacing-md);
		left: 50%;
		transform: translateX(-50%);
		z-index: 50;
		max-width: 90%;
		background-color: var(--color-button);
		color: white;
		padding: var(--spacing-md);
		border-radius: var(--card-radius);
		text-align: center;
		font-weight: 600;
		box-shadow: var(--shadow-md);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translate(-50%, -20px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
</style>
