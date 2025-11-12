# Joker & Ace Bug - Detailed Code Analysis

## Problem Location 1: GameBoard.svelte handleDeckClick()

**File:** src/lib/components/GameBoard.svelte  
**Lines:** 77-94

### Current Code (Broken):
```typescript
function handleDeckClick() {
    if ($gameState.isSetupPhase) return;

    const topCard = $gameState.deck[0];
    if (!topCard) return;

    // Check if top card is a royal (Jack, Queen, or King)
    if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
        placeRoyalCard();
        return;
    }

    // Check if top card cannot be placed on grid -> place as armor
    if (!$gameState.canPlaceTopCardOnGrid && 
        typeof topCard.value === 'number' && 
        topCard.value >= 2 && 
        topCard.value <= 10) {
        placeArmorCard();
    }
    // ← NO CODE FOR JOKER OR ACE!
}
```

### What Happens:
1. When Joker or Ace is on top of deck
2. First if-check fails (not 11, 12, or 13)
3. Second if-check fails (not a number 2-10)
4. Function returns without doing anything
5. Card stays stuck in deck

### What Should Happen:
Need to add else-if branches for Joker and Ace:

```typescript
// After the royal check and armor check, add:
} else if (topCard.value === 'Joker') {
    placeJokerFromDeck();  // NEW FUNCTION NEEDED
} else if (topCard.value === 'A') {
    placeAceFromDeck();    // NEW FUNCTION NEEDED
}
```

---

## Problem Location 2: GameBoard.svelte isDeckClickable()

**File:** src/lib/components/GameBoard.svelte  
**Lines:** 97-113

### Current Code (Broken):
```typescript
function isDeckClickable(): boolean {
    if ($gameState.isSetupPhase) return false;
    const topCard = $gameState.deck[0];
    if (!topCard) return false;

    // Clickable if royal
    if (topCard.value === 11 || topCard.value === 12 || topCard.value === 13) {
        return true;
    }

    // Clickable if numbered card (2-10) that cannot be placed on grid (needs armor)
    if (typeof topCard.value === 'number' && 
        topCard.value >= 2 && 
        topCard.value <= 10 && 
        !$gameState.canPlaceTopCardOnGrid) {
        return true;
    }

    return false;  // ← JOKER AND ACE NEVER GET HERE
}
```

### What Happens:
1. When Joker or Ace on top, deck is never marked as clickable
2. Player can't click the deck
3. Card appears "stuck"
4. No UI feedback about what to do

### What Should Happen:
Need to check for available Joker/Ace slots before returning false:

```typescript
// Before the final return false, add:

// Clickable if joker and slots available
if (topCard.value === 'Joker') {
    // Check if any joker slots are empty
    if ($gameState.cardsInPlay.joker1.length === 0 || 
        $gameState.cardsInPlay.joker2.length === 0) {
        return true;
    }
}

// Clickable if ace and slots available
if (topCard.value === 'A') {
    // Check if any ace slots are empty
    if ($gameState.cardsInPlay.ace1.length === 0 || 
        $gameState.cardsInPlay.ace2.length === 0 || 
        $gameState.cardsInPlay.ace3.length === 0 || 
        $gameState.cardsInPlay.ace4.length === 0) {
        return true;
    }
}

return false;
```

---

## Problem Location 3: Missing Store Actions

**File:** src/lib/stores/game.ts  
**What's Missing:** Two action functions

### Current Actions (Lines 340-465):
- ✓ `placeNumberedCard(position: GridPosition)` (line 158)
- ✓ `placeRoyalCard()` (line 205)
- ✓ `placeArmorCard()` (line 309)
- ✓ `activateAce(position: AcePosition)` (line 342)
- ✓ `activateJoker(position: JokerPosition)` (line 387)
- ✓ `useAce(stackPosition: GridPosition)` (line 357)
- ✓ `useJoker(targetPosition: GridPosition)` (line 426)
- ✗ **`placeJokerFromDeck()` - MISSING**
- ✗ **`placeAceFromDeck()` - MISSING**

### Where They Should Go:
Between `placeArmorCard()` (line 309) and `activateAce()` (line 342)

### What placeJokerFromDeck() Should Do:
```typescript
export function placeJokerFromDeck() {
    gameState.update((state) => {
        const card = state.deck[0];
        if (!card || card.value !== 'Joker') return state;

        // Find first empty joker slot
        const newDeck = state.deck.slice(1);
        const newCardsInPlay = { ...state.cardsInPlay };

        if (newCardsInPlay.joker1.length === 0) {
            newCardsInPlay.joker1 = [card];
        } else if (newCardsInPlay.joker2.length === 0) {
            newCardsInPlay.joker2 = [card];
        } else {
            return state; // No empty slots
        }

        const newState = {
            ...state,
            deck: newDeck,
            cardsInPlay: newCardsInPlay
        };

        return updateCanPlaceTopCardOnGrid(newState);
    });
}
```

### What placeAceFromDeck() Should Do:
```typescript
export function placeAceFromDeck() {
    gameState.update((state) => {
        const card = state.deck[0];
        if (!card || card.value !== 'A') return state;

        // Find first empty ace slot
        const newDeck = state.deck.slice(1);
        const newCardsInPlay = { ...state.cardsInPlay };

        if (newCardsInPlay.ace1.length === 0) {
            newCardsInPlay.ace1 = [card];
        } else if (newCardsInPlay.ace2.length === 0) {
            newCardsInPlay.ace2 = [card];
        } else if (newCardsInPlay.ace3.length === 0) {
            newCardsInPlay.ace3 = [card];
        } else if (newCardsInPlay.ace4.length === 0) {
            newCardsInPlay.ace4 = [card];
        } else {
            return state; // No empty slots
        }

        const newState = {
            ...state,
            deck: newDeck,
            cardsInPlay: newCardsInPlay
        };

        return updateCanPlaceTopCardOnGrid(newState);
    });
}
```

---

## Problem Location 4: Missing Imports

**File:** src/lib/components/GameBoard.svelte  
**Lines:** 1-11

### Current Imports:
```typescript
import {
    gameState,
    placeNumberedCard,
    placeRoyalCard,
    placeArmorCard,
    selectRoyalPosition,
    activateAce,
    activateJoker,
    completeSetup
} from '$lib/stores/game';
```

### What Needs to Be Added:
```typescript
import {
    gameState,
    placeNumberedCard,
    placeRoyalCard,
    placeArmorCard,
    selectRoyalPosition,
    activateAce,
    activateJoker,
    completeSetup,
    placeJokerFromDeck,   // ← NEW
    placeAceFromDeck      // ← NEW
} from '$lib/stores/game';
```

---

## Summary of Changes Needed

### 1. src/lib/stores/game.ts
- Add `placeJokerFromDeck()` function (after placeArmorCard)
- Add `placeAceFromDeck()` function (after placeJokerFromDeck)

### 2. src/lib/components/GameBoard.svelte
- Import `placeJokerFromDeck` and `placeAceFromDeck`
- Update `handleDeckClick()` to call these functions
- Update `isDeckClickable()` to recognize Joker/Ace

### 3. Optional: Add UI Indicator
Like the existing armor-placement-indicator (line 122), could add:
```typescript
{#if !$gameState.isSetupPhase && $gameState.deck[0] && $gameState.deck[0].value === 'Joker'}
    <div class="joker-placement-indicator">
        Klikk på kortstokken for å plassere Joker
    </div>
{/if}

{#if !$gameState.isSetupPhase && $gameState.deck[0] && $gameState.deck[0].value === 'A'}
    <div class="ace-placement-indicator">
        Klikk på kortstokken for å plassere Ace
    </div>
{/if}
```

