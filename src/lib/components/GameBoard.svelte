<script lang="ts">
	import {
		gameState,
		placeNumberedCard,
		placeRoyalCard,
		placeArmorCard,
		placeJokerFromDeck,
		placeAceFromDeck,
		selectRoyalPosition,
		activateAce,
		useAce,
		activateJoker,
		selectJokerSource,
		useJoker,
		completeSetup
	} from '$lib/stores/game';
	import Card from './Card.svelte';
	import type { GridPosition, AcePosition, JokerPosition, RoyalPosition } from '$lib/types';

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

	// Check if cards should be dimmed (when royals need to be placed)
	function shouldDimCard(): boolean {
		return $gameState.cardsInPlay.royalsToBePlaced.length > 0;
	}

	// Check if a specific royal position should be dimmed
	// Alternative positions (that can be clicked) should NOT be dimmed
	function shouldDimRoyalPosition(position: RoyalPosition): boolean {
		if (isAlternativePosition(position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}
		return shouldDimCard();
	}

	function handleAceClick(position: AcePosition) {
		activateAce(position);
	}

	function handleJokerClick(position: JokerPosition) {
		activateJoker(position);
	}

	function handleRoyalClick() {
		// Place royal from royalsToBePlaced stack
		if ($gameState.cardsInPlay.royalsToBePlaced.length > 0) {
			placeRoyalCard();
		}
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

	// Handle clicks on the deck (for placing royals, armor, jokers, or aces during gameplay)
	function handleDeckClick() {
		// Only handle if not in setup phase
		if ($gameState.isSetupPhase) return;

		const topCard = $gameState.deck[0];
		if (!topCard) return;

		// Check if top card is a royal (Jack, Queen, or King)
		if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
			placeRoyalCard();
			return;
		}

		// Check if top card is a Joker
		if (topCard.value === 'Joker') {
			placeJokerFromDeck();
			return;
		}

		// Check if top card is an Ace
		if (topCard.value === 'A') {
			placeAceFromDeck();
			return;
		}

		// Check if top card cannot be placed on grid -> place as armor (only for numbered cards 2-10)
		if (!$gameState.canPlaceTopCardOnGrid && typeof topCard.value === 'number' && topCard.value >= 2 && topCard.value <= 10) {
			placeArmorCard();
		}
	}

	// Check if deck card should be clickable (royal, joker, ace, or armor placement needed)
	function isDeckClickable(): boolean {
		if ($gameState.isSetupPhase) return false;
		const topCard = $gameState.deck[0];
		if (!topCard) return false;

		// Clickable if royal
		if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
			return true;
		}

		// Clickable if Joker
		if (topCard.value === 'Joker') {
			return true;
		}

		// Clickable if Ace
		if (topCard.value === 'A') {
			return true;
		}

		// Clickable if numbered card (2-10) that cannot be placed on grid (needs armor)
		if (typeof topCard.value === 'number' && topCard.value >= 2 && topCard.value <= 10 && !$gameState.canPlaceTopCardOnGrid) {
			return true;
		}

		return false;
	}
</script>

{#if $gameState.isSetupPhase && $gameState.setupPhaseReplaceMode}
	<div class="replace-mode-indicator">
		Klikk på et nummerkort for å bytte det ut
	</div>
{/if}

{#if !$gameState.isSetupPhase && !$gameState.canPlaceTopCardOnGrid && $gameState.deck[0] && typeof $gameState.deck[0].value === 'number' && $gameState.deck[0].value >= 2 && $gameState.deck[0].value <= 10}
	<div class="armor-placement-indicator">
		Klikk på kortstokken for å plassere som armor
	</div>
{/if}

<div class="game-board">
	<!-- Row 1: Empty + Upper Armors + Empty + RoyalsToBePlaced -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card card={$gameState.cardsInPlay.upperLeftArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<Card card={$gameState.cardsInPlay.upperMiddleArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<Card card={$gameState.cardsInPlay.upperRightArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.royalsToBePlaced[0]}
		stackDepth={$gameState.cardsInPlay.royalsToBePlaced.length}
		clickable={$gameState.cardsInPlay.royalsToBePlaced.length > 0}
		onclick={handleRoyalClick}
		slotType="royal"
	/>

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
	<Card card={$gameState.cardsInPlay.leftUpperArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
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
		onclick={() => handleGridClick('upperLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.upperMiddle[0]}
		stackDepth={$gameState.cardsInPlay.upperMiddle.length}
		active={$gameState.jokerSourceStack === 'upperMiddle'}
		onclick={() => handleGridClick('upperMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.upperRight[0]}
		stackDepth={$gameState.cardsInPlay.upperRight.length}
		active={$gameState.jokerSourceStack === 'upperRight'}
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
	<Card card={$gameState.cardsInPlay.rightUpperArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />

	<!-- Row 4: Left Middle + Grid Middle Row + Right Middle -->
	<Card card={$gameState.cardsInPlay.leftMiddleArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
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
		onclick={() => handleGridClick('middleLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.middleMiddle[0]}
		stackDepth={$gameState.cardsInPlay.middleMiddle.length}
		active={$gameState.jokerSourceStack === 'middleMiddle'}
		onclick={() => handleGridClick('middleMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.middleRight[0]}
		stackDepth={$gameState.cardsInPlay.middleRight.length}
		active={$gameState.jokerSourceStack === 'middleRight'}
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
	<Card card={$gameState.cardsInPlay.rightMiddleArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />

	<!-- Row 5: Left Bottom + Grid Bottom Row + Right Bottom -->
	<Card card={$gameState.cardsInPlay.leftBottomArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
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
		onclick={() => handleGridClick('bottomLeft')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomMiddle[0]}
		stackDepth={$gameState.cardsInPlay.bottomMiddle.length}
		active={$gameState.jokerSourceStack === 'bottomMiddle'}
		onclick={() => handleGridClick('bottomMiddle')}
		slotType="grid"
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomRight[0]}
		stackDepth={$gameState.cardsInPlay.bottomRight.length}
		active={$gameState.jokerSourceStack === 'bottomRight'}
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
	<Card card={$gameState.cardsInPlay.rightBottomArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />

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
	<Card card={$gameState.cardsInPlay.bottomLeftArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<Card card={$gameState.cardsInPlay.bottomMiddleArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<Card card={$gameState.cardsInPlay.bottomRightArmor[0]} clickable={false} slotType="armor" dimmed={shouldDimCard()} />
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 8: Deck + Jokers + Aces -->
	<Card
		card={$gameState.deck[0]}
		stackDepth={$gameState.deck.length}
		clickable={isDeckClickable()}
		onclick={handleDeckClick}
		dimmed={shouldDimCard()}
	/>
	<Card
		card={$gameState.cardsInPlay.joker1[0]}
		active={$gameState.jokerInUse === 'joker1'}
		clickable={!!$gameState.cardsInPlay.joker1[0]}
		onclick={() => handleJokerClick('joker1')}
		slotType="joker"
		dimmed={false}
	/>
	<Card
		card={$gameState.cardsInPlay.joker2[0]}
		active={$gameState.jokerInUse === 'joker2'}
		clickable={!!$gameState.cardsInPlay.joker2[0]}
		onclick={() => handleJokerClick('joker2')}
		slotType="joker"
		dimmed={false}
	/>
	<Card
		card={$gameState.cardsInPlay.ace1[0]}
		active={$gameState.aceInUse === 'ace1'}
		clickable={!!$gameState.cardsInPlay.ace1[0]}
		onclick={() => handleAceClick('ace1')}
		slotType="ace"
		dimmed={false}
	/>
	<Card
		card={$gameState.cardsInPlay.ace2[0]}
		active={$gameState.aceInUse === 'ace2'}
		clickable={!!$gameState.cardsInPlay.ace2[0]}
		onclick={() => handleAceClick('ace2')}
		slotType="ace"
		dimmed={false}
	/>
	<Card
		card={$gameState.cardsInPlay.ace3[0]}
		active={$gameState.aceInUse === 'ace3'}
		clickable={!!$gameState.cardsInPlay.ace3[0]}
		onclick={() => handleAceClick('ace3')}
		slotType="ace"
		dimmed={false}
	/>
	<Card
		card={$gameState.cardsInPlay.ace4[0]}
		active={$gameState.aceInUse === 'ace4'}
		clickable={!!$gameState.cardsInPlay.ace4[0]}
		onclick={() => handleAceClick('ace4')}
		slotType="ace"
		dimmed={false}
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
		background-color: var(--color-button);
		color: white;
		padding: var(--spacing-md);
		border-radius: var(--card-radius);
		text-align: center;
		font-weight: 600;
		margin-bottom: var(--spacing-md);
		box-shadow: var(--shadow-md);
		animation: pulse 2s ease-in-out infinite;
	}

	.armor-placement-indicator {
		background-color: #ff9800; /* Orange to indicate action needed */
		color: white;
		padding: var(--spacing-md);
		border-radius: var(--card-radius);
		text-align: center;
		font-weight: 600;
		margin-bottom: var(--spacing-md);
		box-shadow: var(--shadow-md);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
