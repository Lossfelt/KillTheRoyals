<script lang="ts">
	import { get } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import {
		gameState,
		placeNumberedCard,
		selectRoyalPosition,
		selectArmorPosition,
		useAce,
		selectJokerSource,
		useJoker,
		completeSetup,
		openStackView,
		peekStack
	} from '#lib/stores/game.js';
	import Card from './Card.svelte';
	import ShotLayer from './ShotLayer.svelte';
	import SupplyArea from './SupplyArea.svelte';
	import { BOARD_LAYOUT } from './board-layout.js';
	import { BoardEffects } from './board-effects.svelte.js';
	import { buildAttackPreview } from '#lib/utils/attack-preview.js';
	import {
		isAlternativeArmor,
		isAlternativeRoyal,
		shouldDimArmor,
		shouldDimGridCard,
		shouldDimRoyal,
		shouldShowGridAlternative
	} from '#lib/utils/board-view.js';
	import type { GridPosition } from '#lib/types.js';

	let tableElement: HTMLElement | undefined = $state();
	let boardElement: HTMLElement | undefined = $state();

	// Attack preview: the grid slot under the pointer or keyboard focus
	let hoveredGrid: GridPosition | null = $state(null);
	const preview = $derived(buildAttackPreview($gameState, hoveredGrid));

	// Shots and card moves react to each new state before the DOM updates
	const effects = new BoardEffects(get(gameState), () => tableElement);
	$effect.pre(() => effects.update($gameState));
	onDestroy(() => effects.reset());

	function setHovered(position: GridPosition, hovering: boolean) {
		if (hovering) hoveredGrid = position;
		else if (hoveredGrid === position) hoveredGrid = null;
	}

	// Handle clicks on grid positions
	function handleGridClick(position: GridPosition) {
		const state = $gameState;

		// If in setup replace mode, replace the clicked card
		if (state.isSetupPhase && state.setupPhaseReplaceMode) {
			completeSetup(true, position);
			return;
		}

		// Block clicks during setup phase (unless in replace mode)
		if (state.isSetupPhase) return;

		if (state.viewStackMode) {
			openStackView(position);
		} else if (state.aceInUse) {
			useAce(position);
		} else if (state.jokerInUse) {
			// Two-click selection: source stack, then target
			if (state.jokerSourceStack === null) selectJokerSource(position);
			else useJoker(position);
		} else {
			const topCard = state.deck[0];
			if (typeof topCard?.value === 'number' && topCard.value >= 2 && topCard.value <= 10) {
				placeNumberedCard(position);
			}
		}
	}
</script>

{#if $gameState.isSetupPhase && $gameState.setupPhaseReplaceMode}
	<div class="replace-mode-indicator">Click a numbered card to replace it</div>
{/if}

<div class="stage">
	<div class="table" class:defeated={$gameState.gameStatus === 'lost'} bind:this={tableElement}>
		<div class="board" class:board-shake={effects.hits.length > 0} bind:this={boardElement}>
			<div class="wall" aria-hidden="true"></div>
			<div class="platform" aria-hidden="true"></div>

			{#each BOARD_LAYOUT as cell, i (i)}
				{#if cell.kind === 'empty'}
					<div class="cell"></div>
				{:else if cell.kind === 'pending'}
					<div class="cell" data-pos="pending">
						{#if $gameState.cardsInPlay.royalsToBePlaced[0]}
							<Card
								card={$gameState.cardsInPlay.royalsToBePlaced[0]}
								stackDepth={$gameState.cardsInPlay.royalsToBePlaced.length}
								clickable={false}
								slotType="royal"
							/>
						{/if}
					</div>
				{:else if cell.kind === 'grid'}
					<Card
						card={$gameState.cardsInPlay[cell.pos][0]}
						stackDepth={$gameState.cardsInPlay[cell.pos].length}
						active={$gameState.jokerSourceStack === cell.pos}
						alternative={shouldShowGridAlternative($gameState, cell.pos)}
						onclick={() => handleGridClick(cell.pos)}
						onhover={(hovering) => setHovered(cell.pos, hovering)}
						onlongpress={() => peekStack(cell.pos)}
						slotType="grid"
						dimmed={!preview.aiming.includes(cell.pos) && shouldDimGridCard($gameState, cell.pos)}
						viewMode={$gameState.viewStackMode}
						position={cell.pos}
						killCount={preview.killCounts[cell.pos] ?? 0}
						aiming={preview.aiming.includes(cell.pos)}
						firing={effects.firing.includes(cell.pos)}
					/>
				{:else if cell.kind === 'royal'}
					<Card
						card={effects.held[cell.pos] ?? $gameState.cardsInPlay[cell.pos][0]}
						clickable={isAlternativeRoyal($gameState, cell.pos)}
						alternative={isAlternativeRoyal($gameState, cell.pos)}
						onclick={() => selectRoyalPosition(cell.pos)}
						slotType="royal"
						dimmed={!preview.targeted.includes(cell.pos) && shouldDimRoyal($gameState, cell.pos)}
						position={cell.pos}
						targeted={preview.targeted.includes(cell.pos)}
						hit={effects.hits.includes(cell.pos)}
						landed={effects.landed.includes(cell.pos)}
					/>
				{:else if cell.kind === 'armor'}
					<Card
						card={effects.held[cell.pos] ?? $gameState.cardsInPlay[cell.pos][0]}
						clickable={isAlternativeArmor($gameState, cell.pos)}
						alternative={isAlternativeArmor($gameState, cell.pos)}
						onclick={() => selectArmorPosition(cell.pos)}
						slotType="armor"
						dimmed={!preview.targeted.includes(cell.pos) && shouldDimArmor($gameState, cell.pos)}
						position={cell.pos}
						targeted={preview.targeted.includes(cell.pos)}
						hit={effects.hits.includes(cell.pos)}
					/>
				{/if}
			{/each}

			<ShotLayer
				board={boardElement}
				events={effects.shotEvents}
				aims={effects.shotEvents.length > 0 ? [] : preview.lines}
				volley={effects.volley}
			/>
		</div>

		<SupplyArea />
	</div>
</div>

<style>
	/* The stage takes the space left by the bars; cards are sized to fit it */
	.stage {
		flex: 1;
		min-height: 0;
		display: grid;
		place-items: center;
		container: stage / size;
	}

	.table {
		--gap: clamp(3px, 1.1cqmin, 10px);
		--board-pad: clamp(4px, 1.4cqmin, 14px);
		--tray-space: clamp(6px, 1.8cqmin, 20px);
		/* Portrait: 7 columns wide, 7 board rows + 1 supply row tall (cards are 5:7) */
		--card-w: min(
			calc((100cqw - 6 * var(--gap) - 2 * var(--board-pad)) / 7),
			calc((100cqh - 6 * var(--gap) - 4 * var(--board-pad) - var(--tray-space)) / 11.2),
			120px
		);
		--card-h: calc(var(--card-w) * 1.4);

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--tray-space);
	}

	/* Landscape: supply in two columns beside the board, 9 columns wide and 7 rows tall */
	@container stage (aspect-ratio > 1) {
		.table {
			--card-w: min(
				calc((100cqw - 7 * var(--gap) - 4 * var(--board-pad) - var(--tray-space)) / 9),
				calc((100cqh - 6 * var(--gap) - 2 * var(--board-pad)) / 9.8),
				130px
			);
			flex-direction: row;
			align-items: flex-start;
		}
	}

	.board {
		position: relative;
		display: grid;
		grid-template-columns: repeat(7, var(--card-w));
		grid-auto-rows: var(--card-h);
		gap: var(--gap);
		padding: var(--board-pad);
		border-radius: calc(var(--card-radius) * 3);
		background: var(--color-board);
		box-shadow: var(--shadow-board);
		transition: filter 1.2s ease;
	}

	.cell {
		width: var(--card-w);
		height: var(--card-h);
	}

	/* Castle wall: the ring of royals and armor around the grid */
	.wall,
	.platform {
		position: absolute;
		pointer-events: none;
	}

	.wall {
		left: calc(var(--board-pad) + var(--card-w) + var(--gap) / 2);
		top: calc(var(--board-pad) + var(--card-h) + var(--gap) / 2);
		width: calc(5 * var(--card-w) + 5 * var(--gap));
		height: calc(5 * var(--card-h) + 5 * var(--gap));
		border-radius: calc(var(--card-radius) * 3);
		background: var(--color-wall);
		box-shadow:
			inset 0 0 0 2px var(--color-wall-edge),
			inset 0 0 calc(var(--card-w) * 0.4) rgba(0, 0, 0, 0.35);
	}

	/* Cannon platform under the 3x3 grid */
	.platform {
		left: calc(var(--board-pad) + 2 * var(--card-w) + 1.5 * var(--gap));
		top: calc(var(--board-pad) + 2 * var(--card-h) + 1.5 * var(--gap));
		width: calc(3 * var(--card-w) + 3 * var(--gap));
		height: calc(3 * var(--card-h) + 3 * var(--gap));
		border-radius: calc(var(--card-radius) * 2);
		background: var(--color-platform);
		box-shadow:
			0 0 0 2px var(--color-gold-muted),
			0 6px 16px rgba(0, 0, 0, 0.45),
			inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}

	/* Defeat: the board loses its colour */
	.defeated .board {
		filter: grayscale(0.85) brightness(0.75);
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
