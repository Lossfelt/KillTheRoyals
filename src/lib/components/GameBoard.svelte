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
		completeSetup,
		openStackView
	} from '#lib/stores/game.js';
	import { onDestroy } from 'svelte';
	import Card from './Card.svelte';
	import ShotLayer, { SHOT_TOTAL_MS, SHOT_TRAVEL_MS } from './ShotLayer.svelte';
	import { BOARD_LAYOUT } from './board-layout.js';
	import { buildAttackPreview, findKillEvents, type KillEvent } from '#lib/utils/attack-preview.js';
	import type {
		Card as CardType,
		CardsInPlay,
		GridPosition,
		AcePosition,
		JokerPosition,
		RoyalPosition,
		ArmorPosition,
		SpecialPosition,
		GameState
	} from '#lib/types.js';

	// Handle clicks on grid positions
	function handleGridClick(position: GridPosition) {
		// If in setup replace mode, replace the clicked card
		if ($gameState.isSetupPhase && $gameState.setupPhaseReplaceMode) {
			completeSetup(true, position);
			return;
		}

		// Block clicks during setup phase (unless in replace mode)
		if ($gameState.isSetupPhase) return;

		// Handle view stack mode: click to view stack contents
		if ($gameState.viewStackMode) {
			openStackView(position);
			return;
		}

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

	// Display helpers take the state as an argument. In legacy mode Svelte only tracks
	// variables written directly in a template expression, so a helper that read
	// $gameState itself would not update inside the {#each} below.

	// Check if cards should be dimmed (when royals need to be placed or grid cannot be used)
	function shouldDimCard(state: GameState): boolean {
		return state.cardsInPlay.royalsToBePlaced.length > 0
			|| !state.canPlaceTopCardOnGrid;
	}

	// Check if a grid card should be dimmed (when it's not an alternative position)
	function shouldDimGridCard(state: GameState, position: GridPosition): boolean {
		// Don't dim grid during special interactive modes where grid remains clickable
		if (state.jokerInUse || state.aceInUse || state.viewStackMode) {
			return false;
		}

		// First check general dimming conditions
		if (shouldDimCard(state)) return true;

		// If there are alternative positions, dim cards that are NOT in the list
		if (state.alternativeGridPositions.length > 0) {
			return !state.alternativeGridPositions.includes(position);
		}

		return false;
	}

	// Check if a specific royal position should be dimmed
	// Alternative positions (that can be clicked) should NOT be dimmed
	function shouldDimRoyalPosition(state: GameState, position: RoyalPosition): boolean {
		if (isAlternativePosition(state, position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}
		return shouldDimCard(state);
	}

	function handleRoyalPositionClick(position: RoyalPosition) {
		// Select this position if it's an alternative
		if ($gameState.alternativeRoyalPositions.includes(position)) {
			selectRoyalPosition(position);
		}
	}

	// Check if a royal position is an alternative choice
	function isAlternativePosition(state: GameState, position: RoyalPosition): boolean {
		return state.alternativeRoyalPositions.includes(position);
	}

	// Check if an armor position is an alternative choice
	function isAlternativeArmorPosition(state: GameState, position: ArmorPosition): boolean {
		return state.alternativeArmorPositions.includes(position);
	}

	// Check if a specific armor position should be dimmed
	function shouldDimArmorPosition(state: GameState, position: ArmorPosition): boolean {
		if (isAlternativeArmorPosition(state, position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}
		return shouldDimCard(state);
	}

	function handleArmorPositionClick(position: ArmorPosition) {
		// Select this position if it's an alternative
		if ($gameState.alternativeArmorPositions.includes(position)) {
			selectArmorPosition(position);
		}
	}

	// Check if a grid position is an alternative choice for numbered card placement
	function isAlternativeGridPosition(state: GameState, position: GridPosition): boolean {
		return state.alternativeGridPositions.includes(position);
	}

	// Check if a grid card should show golden glow
	// Two scenarios: 1) Setup replace mode, 2) Numbered card placement from deck
	function shouldShowGridAlternative(state: GameState, position: GridPosition): boolean {
		// Don't show grid highlighting during joker/ace usage or view stack mode (clearer UX)
		if (state.jokerInUse || state.aceInUse || state.viewStackMode) return false;

		// Scenario 1: Setup replace mode - all grid cards can be replaced
		if (state.setupPhaseReplaceMode) return true;

		// Scenario 2: Normal play - highlight positions where card can go
		return isAlternativeGridPosition(state, position);
	}

	// Check if a joker position is an alternative choice
	function isAlternativeJokerPosition(state: GameState, position: JokerPosition): boolean {
		return state.alternativeJokerPositions.includes(position);
	}

	// Check if a joker position should be dimmed
	function shouldDimJokerPosition(state: GameState, position: JokerPosition): boolean {
		if (isAlternativeJokerPosition(state, position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}

		// Don't dim when armor is being placed (numbered cards can still use joker)
		if (state.alternativeArmorPositions.length > 0) {
			return false;
		}

		// Dim when setup, royals, or other special cards are being placed
		return state.isSetupPhase
			|| state.cardsInPlay.royalsToBePlaced.length > 0
			|| state.alternativeRoyalPositions.length > 0
			|| state.alternativeAcePositions.length > 0
			|| state.alternativeJokerPositions.length > 0;
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
	function isAlternativeAcePosition(state: GameState, position: AcePosition): boolean {
		return state.alternativeAcePositions.includes(position);
	}

	// Check if an ace position should be dimmed
	function shouldDimAcePosition(state: GameState, position: AcePosition): boolean {
		if (isAlternativeAcePosition(state, position)) {
			return false; // Never dim alternative positions - they need to be clickable!
		}

		// Don't dim when armor is being placed (numbered cards can still use ace)
		if (state.alternativeArmorPositions.length > 0) {
			return false;
		}

		// Dim when setup, royals, or other special cards are being placed
		return state.isSetupPhase
			|| state.cardsInPlay.royalsToBePlaced.length > 0
			|| state.alternativeRoyalPositions.length > 0
			|| state.alternativeJokerPositions.length > 0
			|| state.alternativeAcePositions.length > 0;
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

	// Placed Ace/Joker that has not been used yet can be activated
	function isUnusedSpecial(state: GameState, position: SpecialPosition): boolean {
		const card = state.cardsInPlay[position][0];
		return !!card && card.value !== 'USED';
	}

	// Attack preview: the grid slot under the pointer or keyboard focus
	let hoveredGrid: GridPosition | null = null;
	$: preview = buildAttackPreview($gameState, hoveredGrid);

	function setHovered(position: GridPosition, hovering: boolean) {
		if (hovering) hoveredGrid = position;
		else if (hoveredGrid === position) hoveredGrid = null;
	}

	// Shot effects: spot royals that died since the last state and animate the shot
	let boardElement: HTMLElement | undefined;
	let shotEvents: KillEvent[] = [];
	let volley = 0;
	let firingPositions: string[] = [];
	let hitPositions: string[] = [];
	let heldCards: Record<string, CardType> = {}; // Cards kept on screen until the shot lands
	let shotTimers: ReturnType<typeof setTimeout>[] = [];
	let previousCardsInPlay: CardsInPlay = $gameState.cardsInPlay;

	$: handleBoardChange($gameState.cardsInPlay);

	function handleBoardChange(next: CardsInPlay) {
		if (next === previousCardsInPlay) return;
		const previous = previousCardsInPlay;
		previousCardsInPlay = next;

		resetShotEffects();
		const kills = findKillEvents(previous, next);
		if (kills.length > 0) fireShots(kills, previous);
	}

	function prefersReducedMotion(): boolean {
		return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function fireShots(kills: KillEvent[], previous: CardsInPlay) {
		const reducedMotion = prefersReducedMotion();
		const held: Record<string, CardType> = {};
		if (!reducedMotion) {
			for (const kill of kills) {
				const royal = previous[kill.royal][0];
				const armor = previous[kill.armor][0];
				if (royal) held[kill.royal] = royal;
				if (armor) held[kill.armor] = armor;
			}
		}

		heldCards = held;
		shotEvents = kills;
		volley += 1;
		firingPositions = kills.flatMap((kill) => [kill.shooter, ...kill.payloadPositions]);
		navigator.vibrate?.(40);

		shotTimers = [
			setTimeout(
				() => {
					heldCards = {};
					hitPositions = kills.flatMap((kill) =>
						previous[kill.armor][0] ? [kill.royal, kill.armor] : [kill.royal]
					);
				},
				reducedMotion ? 0 : SHOT_TRAVEL_MS
			),
			setTimeout(resetShotEffects, SHOT_TOTAL_MS)
		];
	}

	function resetShotEffects() {
		shotTimers.forEach(clearTimeout);
		shotTimers = [];
		heldCards = {};
		shotEvents = [];
		firingPositions = [];
		hitPositions = [];
	}

	onDestroy(resetShotEffects);
</script>

{#if $gameState.isSetupPhase && $gameState.setupPhaseReplaceMode}
	<div class="replace-mode-indicator">
		Click a numbered card to replace it
	</div>
{/if}

<div class="game-board" class:board-shake={hitPositions.length > 0} bind:this={boardElement}>
	{#each BOARD_LAYOUT as cell, i (i)}
		{#if cell.kind === 'empty'}
			<div class="cell empty"></div>
		{:else if cell.kind === 'break'}
			<div class="board-break" aria-hidden="true"></div>
		{:else if cell.kind === 'pending'}
			{#if $gameState.cardsInPlay.royalsToBePlaced[0]}
				<Card
					card={$gameState.cardsInPlay.royalsToBePlaced[0]}
					stackDepth={$gameState.cardsInPlay.royalsToBePlaced.length}
					clickable={false}
				/>
			{:else}
				<div class="cell empty"></div>
			{/if}
		{:else if cell.kind === 'deck'}
			<Card card={$gameState.deck[0]} stackDepth={$gameState.deck.length} clickable={false} />
		{:else if cell.kind === 'grid'}
			<Card
				card={$gameState.cardsInPlay[cell.pos][0]}
				stackDepth={$gameState.cardsInPlay[cell.pos].length}
				active={$gameState.jokerSourceStack === cell.pos}
				alternative={shouldShowGridAlternative($gameState, cell.pos)}
				onclick={() => handleGridClick(cell.pos)}
				onhover={(hovering) => setHovered(cell.pos, hovering)}
				slotType="grid"
				dimmed={!preview.aiming.includes(cell.pos) && shouldDimGridCard($gameState, cell.pos)}
				viewMode={$gameState.viewStackMode}
				position={cell.pos}
				killCount={preview.killCounts[cell.pos] ?? 0}
				aiming={preview.aiming.includes(cell.pos)}
				firing={firingPositions.includes(cell.pos)}
			/>
		{:else if cell.kind === 'royal'}
			<Card
				card={heldCards[cell.pos] ?? $gameState.cardsInPlay[cell.pos][0]}
				clickable={isAlternativePosition($gameState, cell.pos)}
				alternative={isAlternativePosition($gameState, cell.pos)}
				onclick={() => handleRoyalPositionClick(cell.pos)}
				slotType="royal"
				dimmed={!preview.targeted.includes(cell.pos) && shouldDimRoyalPosition($gameState, cell.pos)}
				position={cell.pos}
				targeted={preview.targeted.includes(cell.pos)}
				hit={hitPositions.includes(cell.pos)}
			/>
		{:else if cell.kind === 'armor'}
			<Card
				card={heldCards[cell.pos] ?? $gameState.cardsInPlay[cell.pos][0]}
				clickable={isAlternativeArmorPosition($gameState, cell.pos)}
				alternative={isAlternativeArmorPosition($gameState, cell.pos)}
				onclick={() => handleArmorPositionClick(cell.pos)}
				slotType="armor"
				dimmed={!preview.targeted.includes(cell.pos) && shouldDimArmorPosition($gameState, cell.pos)}
				position={cell.pos}
				targeted={preview.targeted.includes(cell.pos)}
				hit={hitPositions.includes(cell.pos)}
			/>
		{:else if cell.kind === 'joker'}
			<Card
				card={$gameState.cardsInPlay[cell.pos][0]}
				active={$gameState.jokerInUse === cell.pos}
				clickable={isAlternativeJokerPosition($gameState, cell.pos) || isUnusedSpecial($gameState, cell.pos)}
				alternative={isAlternativeJokerPosition($gameState, cell.pos)}
				onclick={() => handleJokerPositionClick(cell.pos)}
				slotType="joker"
				dimmed={shouldDimJokerPosition($gameState, cell.pos)}
			/>
		{:else if cell.kind === 'ace'}
			<Card
				card={$gameState.cardsInPlay[cell.pos][0]}
				active={$gameState.aceInUse === cell.pos}
				clickable={isAlternativeAcePosition($gameState, cell.pos) || isUnusedSpecial($gameState, cell.pos)}
				alternative={isAlternativeAcePosition($gameState, cell.pos)}
				onclick={() => handleAcePositionClick(cell.pos)}
				slotType="ace"
				dimmed={shouldDimAcePosition($gameState, cell.pos)}
			/>
		{/if}
	{/each}

	<ShotLayer board={boardElement} events={shotEvents} aims={shotEvents.length > 0 ? [] : preview.lines} {volley} />
</div>

<style>
	.game-board {
		position: relative; /* Anchor for the shot layer */
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
	
	/* Recoil of the whole board when a shot lands */
	.board-shake {
		animation: boardShake 0.3s ease-out;
	}

	@keyframes boardShake {
		20% {
			transform: translate(-3px, 2px);
		}
		45% {
			transform: translate(3px, -2px);
		}
		70% {
			transform: translate(-1px, 1px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.board-shake {
			animation: none;
		}
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
