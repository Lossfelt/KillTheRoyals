# Kill The Royals - Developer Guide

## Overview

**Kill The Royals** is a digital implementation of "Gridcannon" by Tom Francis. Single-player puzzle card game where you eliminate 12 royal cards by placing numbered cards on a 3x3 grid.

**📖 Game Rules:** See [GAME_RULES.md](GAME_RULES.md)
**✅ Tasks:** See [TODO.md](TODO.md)
**🎮 Original:** [Gridcannon by Tom Francis](http://www.pentadact.com/2013-10-23-gridcannon-a-single-player-game-with-a-deck-of-cards/)

## Tech Stack

- **Framework:** SvelteKit (Svelte 5)
- **Language:** TypeScript (strict mode)
- **Build:** Vite 5
- **Styling:** Vanilla CSS + CSS custom properties
- **Design:** Mobile-first, physical card theme, dark mode support

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # game.ts - Svelte stores for state
│   ├── utils/          # deck.ts, game-logic.ts
│   └── types.ts        # TypeScript definitions
├── routes/
│   └── +page.svelte    # Main game page
└── app.css             # Global styles + CSS variables

Legacy: src-old/        # Original React code (reference only)
```

**Type definitions:** See [src/lib/types.ts](src/lib/types.ts) for all TypeScript types

## State Management

### Svelte Stores Pattern

```typescript
// src/lib/stores/game.ts
import { writable, derived } from 'svelte/store';

export const gameState = writable<GameState>({ /* initial state */ });

// Derived stores for computed values
export const isGameOver = derived(
  gameState,
  $state => $state.gameStatus === 'won' || $state.gameStatus === 'lost'
);

// Actions (pure functions that return new state)
export function placeCard(position: GridPosition, card: Card) {
  gameState.update(state => ({
    ...state,  // Always spread for immutability
    cardsInPlay: { /* updated cards */ }
  }));
}
```

### Usage in Components

```svelte
<script lang="ts">
  import { gameState } from '$lib/stores/game';
  // Access with $ prefix: $gameState.deck[0]
</script>

<button on:click={() => placeCard('upperLeft', $gameState.deck[0])}>
  {$gameState.deck[0]?.unicode}
</button>
```

## Styling Guidelines

### Mobile-First CSS

**IMPORTANT:** All styling must be mobile-first (smallest screens first, then scale up)

```css
/* Mobile (default) - 320px+ */
.card { width: 60px; height: 84px; }

/* Tablet - 768px+ */
@media (min-width: 768px) {
  .card { width: 80px; height: 112px; }
}

/* Desktop - 1024px+ */
@media (min-width: 1024px) {
  .card { width: 100px; height: 140px; }
}
```

### CSS Custom Properties

All colors, spacing, and dimensions use CSS variables (defined in [src/app.css](src/app.css)):

```css
:root {
  --color-bg: #1a472a;
  --color-card: #ffffff;
  --card-width: 60px;
  --card-height: 84px;
  --spacing-md: 1rem;
  --shadow-card: 0 2px 4px rgba(0,0,0,0.2);
}

/* Dark mode automatically switches */
@media (prefers-color-scheme: dark) {
  :root { --color-bg: #0d1b14; }
}
```

### Touch Targets

**Minimum 44x44px for all interactive elements** (iOS/Android guideline)

## Development Conventions

### Naming
- **Files:** kebab-case (`game-logic.ts`)
- **Components:** PascalCase (`GameBoard.svelte`)
- **Functions:** camelCase (`placeCard`)
- **Constants:** UPPER_SNAKE_CASE (`DEAD_CARD_UNICODE`)
- **Types:** PascalCase (`GameState`)
- **All code in English** (no Norwegian variable names)

### Code Quality
- **Pure functions:** Game logic should not mutate inputs
- **Type everything:** Use TypeScript for all code
- **Immutable updates:** Always spread `{ ...state }` when updating
- **Safe access:** Use optional chaining `card?.value` for nullable values

### Example Function

```typescript
/**
 * Calculates if a payload can kill a royal
 * @param payload - Array of exactly 2 cards
 * @param royal - The royal card to check
 * @param armor - Optional armor card
 */
export function canKillRoyal(
  payload: [Card, Card],
  royal: Card,
  armor?: Card
): boolean {
  const totalValue = (payload[0].value as number) + (payload[1].value as number);
  const targetValue = (royal.value as number) + ((armor?.value as number) ?? 0);

  if (totalValue < targetValue) return false;

  // Jack (11): any suits
  if (royal.value === 11) return true;

  // Queen (12): same color
  if (royal.value === 12) return payload[0].color === payload[1].color;

  // King (13): same suit
  if (royal.value === 13) return payload[0].suit === payload[1].suit;

  return false;
}
```

## Common Pitfalls to Avoid

```typescript
// ❌ Mutating state
$gameState.deck.push(card);

// ✅ Immutable update
gameState.update(s => ({ ...s, deck: [...s.deck, card] }));

// ❌ Unsafe access
const value = stack[0].value;

// ✅ Safe access
const value = stack[0]?.value ?? 0;

// ❌ Touch target too small
min-width: 30px;  /* Too small for mobile! */

// ✅ Proper touch target
min-width: 44px;  /* iOS/Android minimum */
```

## Key Game Logic References

**Legacy code location:** `src-old/Functions/`

When porting functions, modernize:
- Remove Norwegian variables (`bunke` → `stack`, `kort` → `card`)
- Add TypeScript types
- Make functions pure (no side effects)
- Use const/let instead of var
- Replace nested if-statements with lookup tables or early returns

**Important:** Legacy code has anti-patterns (class components, manual binding, setState batching issues). Use modern patterns from this guide instead.

## Quick Commands

```bash
npm run check        # TypeScript check
npm run lint         # ESLint check
npm run format       # Prettier format
npm run build        # Production build
```

## Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Unicode Playing Cards](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
- [Mobile Touch Guidelines](https://web.dev/accessible-tap-targets/)

---

**Version:** 2.0.0 (SvelteKit + TypeScript)
**Last Updated:** 2025-11-09
