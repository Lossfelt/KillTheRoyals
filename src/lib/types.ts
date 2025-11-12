/**
 * Kill The Royals - Type Definitions
 * Complete type safety for the game state and logic
 */

// Card Types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'joker' | 'back';
export type CardColor = 'red' | 'black';
export type NumberedValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type RoyalValue = 11 | 12 | 13; // Jack, Queen, King
export type CardValue = NumberedValue | RoyalValue | 'A' | 'Joker' | 'DEAD' | 'USED';

export interface Card {
	value: CardValue;
	suit: Suit;
	unicode: string; // Unicode character for display (U+1F0A1 - U+1F0DF)
	color: CardColor;
}

export type CardStack = Card[]; // Array of cards, index 0 is top

// Grid Position Types (3x3 numbered card stacks)
export type GridPosition =
	| 'upperLeft'
	| 'upperMiddle'
	| 'upperRight'
	| 'middleLeft'
	| 'middleMiddle'
	| 'middleRight'
	| 'bottomLeft'
	| 'bottomMiddle'
	| 'bottomRight';

// Royal Position Types (12 positions around grid)
export type RoyalPosition =
	| 'upperLeftRoyal'
	| 'upperMiddleRoyal'
	| 'upperRightRoyal'
	| 'leftUpperRoyal'
	| 'leftMiddleRoyal'
	| 'leftBottomRoyal'
	| 'rightUpperRoyal'
	| 'rightMiddleRoyal'
	| 'rightBottomRoyal'
	| 'bottomLeftRoyal'
	| 'bottomMiddleRoyal'
	| 'bottomRightRoyal';

// Armor Position Types (12 positions, mirror royals)
export type ArmorPosition =
	| 'upperLeftArmor'
	| 'upperMiddleArmor'
	| 'upperRightArmor'
	| 'leftUpperArmor'
	| 'leftMiddleArmor'
	| 'leftBottomArmor'
	| 'rightUpperArmor'
	| 'rightMiddleArmor'
	| 'rightBottomArmor'
	| 'bottomLeftArmor'
	| 'bottomMiddleArmor'
	| 'bottomRightArmor';

// Special Position Types (Aces and Jokers)
export type AcePosition = 'ace1' | 'ace2' | 'ace3' | 'ace4';
export type JokerPosition = 'joker1' | 'joker2';
export type SpecialPosition = AcePosition | JokerPosition;

// All board position types combined
export type BoardPosition =
	| GridPosition
	| RoyalPosition
	| ArmorPosition
	| SpecialPosition
	| 'royalsToBePlaced';

// Game Status
export type GameStatus = 'setup' | 'playing' | 'won' | 'lost';

// Cards in Play (All 49 positions on the board)
export interface CardsInPlay {
	// Grid positions (9)
	upperLeft: CardStack;
	upperMiddle: CardStack;
	upperRight: CardStack;
	middleLeft: CardStack;
	middleMiddle: CardStack;
	middleRight: CardStack;
	bottomLeft: CardStack;
	bottomMiddle: CardStack;
	bottomRight: CardStack;

	// Royal positions (12)
	upperLeftRoyal: CardStack;
	upperMiddleRoyal: CardStack;
	upperRightRoyal: CardStack;
	leftUpperRoyal: CardStack;
	leftMiddleRoyal: CardStack;
	leftBottomRoyal: CardStack;
	rightUpperRoyal: CardStack;
	rightMiddleRoyal: CardStack;
	rightBottomRoyal: CardStack;
	bottomLeftRoyal: CardStack;
	bottomMiddleRoyal: CardStack;
	bottomRightRoyal: CardStack;

	// Armor positions (12)
	upperLeftArmor: CardStack;
	upperMiddleArmor: CardStack;
	upperRightArmor: CardStack;
	leftUpperArmor: CardStack;
	leftMiddleArmor: CardStack;
	leftBottomArmor: CardStack;
	rightUpperArmor: CardStack;
	rightMiddleArmor: CardStack;
	rightBottomArmor: CardStack;
	bottomLeftArmor: CardStack;
	bottomMiddleArmor: CardStack;
	bottomRightArmor: CardStack;

	// Special positions (6 + 1)
	joker1: CardStack;
	joker2: CardStack;
	ace1: CardStack;
	ace2: CardStack;
	ace3: CardStack;
	ace4: CardStack;
	royalsToBePlaced: CardStack;
}

// Main Game State
export interface GameState {
	deck: Card[];
	cardsInPlay: CardsInPlay;
	jokerInUse: JokerPosition | null; // Which joker is activated (joker1 or joker2)
	jokerSourceStack: GridPosition | null; // Source stack when moving with joker
	aceInUse: AcePosition | null; // Which ace is activated
	isSetupPhase: boolean;
	setupPhaseReplaceMode: boolean; // Waiting for user to choose card to replace
	alternativeRoyalPositions: RoyalPosition[]; // Available positions for player to choose when placing royal
	canPlaceTopCardOnGrid: boolean; // Whether the top card in deck can be placed on any grid position
	gameStatus: GameStatus;
}

// Payload type (2 cards that can kill a royal)
export type Payload = [Card, Card];

// Royal-to-Armor mapping (for armor placement logic)
export type RoyalArmorPair = {
	royal: RoyalPosition;
	armor: ArmorPosition;
};

// Constants
export const DEAD_CARD_UNICODE = '\u{1F0A0}'; // Card back for dead royals
export const GRID_SIZE = 3;
export const TOTAL_ROYALS = 12;

// Helper type guards
export function isNumberedValue(value: CardValue): value is NumberedValue {
	return typeof value === 'number' && value >= 2 && value <= 10;
}

export function isRoyalValue(value: CardValue): value is RoyalValue {
	return value === 11 || value === 12 || value === 13;
}

export function isAce(value: CardValue): value is 'A' {
	return value === 'A';
}

export function isJoker(value: CardValue): value is 'Joker' {
	return value === 'Joker';
}

export function isGridPosition(position: string): position is GridPosition {
	const gridPositions: GridPosition[] = [
		'upperLeft',
		'upperMiddle',
		'upperRight',
		'middleLeft',
		'middleMiddle',
		'middleRight',
		'bottomLeft',
		'bottomMiddle',
		'bottomRight'
	];
	return gridPositions.includes(position as GridPosition);
}

export function isRoyalPosition(position: string): position is RoyalPosition {
	return position.endsWith('Royal');
}

export function isArmorPosition(position: string): position is ArmorPosition {
	return position.endsWith('Armor');
}

export function isAcePosition(position: string): position is AcePosition {
	return position.startsWith('ace');
}

export function isJokerPosition(position: string): position is JokerPosition {
	return position.startsWith('joker');
}

// Royal-Armor position mapping
export const ROYAL_ARMOR_PAIRS: RoyalArmorPair[] = [
	{ royal: 'upperLeftRoyal', armor: 'upperLeftArmor' },
	{ royal: 'upperMiddleRoyal', armor: 'upperMiddleArmor' },
	{ royal: 'upperRightRoyal', armor: 'upperRightArmor' },
	{ royal: 'leftUpperRoyal', armor: 'leftUpperArmor' },
	{ royal: 'leftMiddleRoyal', armor: 'leftMiddleArmor' },
	{ royal: 'leftBottomRoyal', armor: 'leftBottomArmor' },
	{ royal: 'rightUpperRoyal', armor: 'rightUpperArmor' },
	{ royal: 'rightMiddleRoyal', armor: 'rightMiddleArmor' },
	{ royal: 'rightBottomRoyal', armor: 'rightBottomArmor' },
	{ royal: 'bottomLeftRoyal', armor: 'bottomLeftArmor' },
	{ royal: 'bottomMiddleRoyal', armor: 'bottomMiddleArmor' },
	{ royal: 'bottomRightRoyal', armor: 'bottomRightArmor' }
];

// Attack mapping type: which royal and which two cards form the payload
export type AttackMapping = {
	royal: RoyalPosition;
	payloadPositions: [GridPosition, GridPosition];
};

// Complete attack mappings based on legacy code (src-old/Functions/funcKillRoyals.js)
// When a card is placed at a grid position, these are the royals that can be attacked
// and the two cards that form the payload for each attack
export const ATTACK_MAPPINGS: Record<GridPosition, AttackMapping[]> = {
	upperLeft: [
		{ royal: 'rightUpperRoyal', payloadPositions: ['upperMiddle', 'upperRight'] },
		{ royal: 'bottomLeftRoyal', payloadPositions: ['middleLeft', 'bottomLeft'] }
	],
	upperMiddle: [
		{ royal: 'bottomMiddleRoyal', payloadPositions: ['middleMiddle', 'bottomMiddle'] }
	],
	upperRight: [
		{ royal: 'leftUpperRoyal', payloadPositions: ['upperMiddle', 'upperLeft'] },
		{ royal: 'bottomRightRoyal', payloadPositions: ['middleRight', 'bottomRight'] }
	],
	middleLeft: [
		{ royal: 'rightMiddleRoyal', payloadPositions: ['middleMiddle', 'middleRight'] }
	],
	middleMiddle: [], // Center can't shoot anything
	middleRight: [
		{ royal: 'leftMiddleRoyal', payloadPositions: ['middleMiddle', 'middleLeft'] }
	],
	bottomLeft: [
		{ royal: 'rightBottomRoyal', payloadPositions: ['bottomMiddle', 'bottomRight'] },
		{ royal: 'upperLeftRoyal', payloadPositions: ['middleLeft', 'upperLeft'] }
	],
	bottomMiddle: [
		{ royal: 'upperMiddleRoyal', payloadPositions: ['middleMiddle', 'upperMiddle'] }
	],
	bottomRight: [
		{ royal: 'leftBottomRoyal', payloadPositions: ['bottomMiddle', 'bottomLeft'] },
		{ royal: 'upperRightRoyal', payloadPositions: ['middleRight', 'upperRight'] }
	]
};

// Grid-to-Royal firing lines (which grid position can shoot which royal)
// Derived from ATTACK_MAPPINGS for convenience
export const FIRING_LINES: Record<GridPosition, RoyalPosition[]> = {
	upperLeft: ['rightUpperRoyal', 'bottomLeftRoyal'],
	upperMiddle: ['bottomMiddleRoyal'],
	upperRight: ['leftUpperRoyal', 'bottomRightRoyal'],
	middleLeft: ['rightMiddleRoyal'],
	middleMiddle: [], // Center can't shoot anything
	middleRight: ['leftMiddleRoyal'],
	bottomLeft: ['rightBottomRoyal', 'upperLeftRoyal'],
	bottomMiddle: ['upperMiddleRoyal'],
	bottomRight: ['leftBottomRoyal', 'upperRightRoyal']
};
