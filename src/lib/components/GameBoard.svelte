<script lang="ts">
	import { gameState, placeNumberedCard, activateAce, activateJoker } from '$lib/stores/game';
	import Card from './Card.svelte';
	import type { GridPosition, AcePosition, JokerPosition } from '$lib/types';

	// Handle clicks on grid positions
	function handleGridClick(position: GridPosition) {
		if ($gameState.isSetupPhase) return;

		const topCard = $gameState.deck[0];
		if (!topCard) return;

		// Check card type and handle accordingly
		if (typeof topCard.value === 'number' && topCard.value >= 2 && topCard.value <= 10) {
			placeNumberedCard(position);
		}
	}

	function handleAceClick(position: AcePosition) {
		activateAce(position);
	}

	function handleJokerClick(position: JokerPosition) {
		activateJoker(position);
	}
</script>

<div class="game-board">
	<!-- Row 1: Empty + Upper Armors + Empty + RoyalsToBePlaced -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card card={$gameState.cardsInPlay.upperLeftArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.upperMiddleArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.upperRightArmor[0]} clickable={false} />
	<div class="cell empty"></div>
	<Card
		card={$gameState.cardsInPlay.royalsToBePlaced[0]}
		stackDepth={$gameState.cardsInPlay.royalsToBePlaced.length}
		clickable={false}
	/>

	<!-- Row 2: Empty + Upper Royals + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card card={$gameState.cardsInPlay.upperLeftRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.upperMiddleRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.upperRightRoyal[0]} clickable={false} />
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 3: Left Upper + Grid Top Row + Right Upper -->
	<Card card={$gameState.cardsInPlay.leftUpperArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.leftUpperRoyal[0]} clickable={false} />
	<Card
		card={$gameState.cardsInPlay.upperLeft[0]}
		stackDepth={$gameState.cardsInPlay.upperLeft.length}
		onclick={() => handleGridClick('upperLeft')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperMiddle[0]}
		stackDepth={$gameState.cardsInPlay.upperMiddle.length}
		onclick={() => handleGridClick('upperMiddle')}
	/>
	<Card
		card={$gameState.cardsInPlay.upperRight[0]}
		stackDepth={$gameState.cardsInPlay.upperRight.length}
		onclick={() => handleGridClick('upperRight')}
	/>
	<Card card={$gameState.cardsInPlay.rightUpperRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.rightUpperArmor[0]} clickable={false} />

	<!-- Row 4: Left Middle + Grid Middle Row + Right Middle -->
	<Card card={$gameState.cardsInPlay.leftMiddleArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.leftMiddleRoyal[0]} clickable={false} />
	<Card
		card={$gameState.cardsInPlay.middleLeft[0]}
		stackDepth={$gameState.cardsInPlay.middleLeft.length}
		onclick={() => handleGridClick('middleLeft')}
	/>
	<Card
		card={$gameState.cardsInPlay.middleMiddle[0]}
		stackDepth={$gameState.cardsInPlay.middleMiddle.length}
		onclick={() => handleGridClick('middleMiddle')}
	/>
	<Card
		card={$gameState.cardsInPlay.middleRight[0]}
		stackDepth={$gameState.cardsInPlay.middleRight.length}
		onclick={() => handleGridClick('middleRight')}
	/>
	<Card card={$gameState.cardsInPlay.rightMiddleRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.rightMiddleArmor[0]} clickable={false} />

	<!-- Row 5: Left Bottom + Grid Bottom Row + Right Bottom -->
	<Card card={$gameState.cardsInPlay.leftBottomArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.leftBottomRoyal[0]} clickable={false} />
	<Card
		card={$gameState.cardsInPlay.bottomLeft[0]}
		stackDepth={$gameState.cardsInPlay.bottomLeft.length}
		onclick={() => handleGridClick('bottomLeft')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomMiddle[0]}
		stackDepth={$gameState.cardsInPlay.bottomMiddle.length}
		onclick={() => handleGridClick('bottomMiddle')}
	/>
	<Card
		card={$gameState.cardsInPlay.bottomRight[0]}
		stackDepth={$gameState.cardsInPlay.bottomRight.length}
		onclick={() => handleGridClick('bottomRight')}
	/>
	<Card card={$gameState.cardsInPlay.rightBottomRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.rightBottomArmor[0]} clickable={false} />

	<!-- Row 6: Empty + Bottom Royals + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card card={$gameState.cardsInPlay.bottomLeftRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.bottomMiddleRoyal[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.bottomRightRoyal[0]} clickable={false} />
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 7: Empty + Bottom Armors + Empty -->
	<div class="cell empty"></div>
	<div class="cell empty"></div>
	<Card card={$gameState.cardsInPlay.bottomLeftArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.bottomMiddleArmor[0]} clickable={false} />
	<Card card={$gameState.cardsInPlay.bottomRightArmor[0]} clickable={false} />
	<div class="cell empty"></div>
	<div class="cell empty"></div>

	<!-- Row 8: Deck + Jokers + Aces -->
	<Card card={$gameState.deck[0]} stackDepth={$gameState.deck.length} clickable={false} />
	<Card
		card={$gameState.cardsInPlay.joker1[0]}
		active={$gameState.jokerInUse !== null}
		onclick={() => handleJokerClick('joker1')}
	/>
	<Card
		card={$gameState.cardsInPlay.joker2[0]}
		active={$gameState.jokerInUse !== null}
		onclick={() => handleJokerClick('joker2')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace1[0]}
		active={$gameState.aceInUse === 'ace1'}
		onclick={() => handleAceClick('ace1')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace2[0]}
		active={$gameState.aceInUse === 'ace2'}
		onclick={() => handleAceClick('ace2')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace3[0]}
		active={$gameState.aceInUse === 'ace3'}
		onclick={() => handleAceClick('ace3')}
	/>
	<Card
		card={$gameState.cardsInPlay.ace4[0]}
		active={$gameState.aceInUse === 'ace4'}
		onclick={() => handleAceClick('ace4')}
	/>
</div>

<style>
	.game-board {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
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
		min-height: var(--card-height);
	}

	.cell.empty {
		/* Empty cells for spacing */
		background: transparent;
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
</style>
