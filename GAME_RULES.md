# Kill The Royals - Game Rules

## Overview

This game is an implementation of **Gridcannon**, created by [Tom Francis](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/).

**Objective:** Kill all 12 royal cards (Jacks, Queens, Kings) from a standard deck of cards.

---

## Setup

### 1. Create the 3×3 Grid

Draw cards and lay out a **3×3 grid** of numbered cards.

- If you draw any **royals** (Jack, Queen, King) during this, put them on a **separate pile** instead and keep drawing until you've made the grid without royals.
- **Aces** and **Jokers** are also set aside during setup.

### 2. Place Initial Royals

If you drew some royals during setup, you now place them using the **royal placement rule**:

**Royal Placement Rule:**
- Put the royal **outside the center nine cards**, adjacent to the card it's most similar to.
- Similarity is determined in this priority order:
  1. **Highest value card of the same suit**
  2. If no suit match: **Highest of same color**
  3. If no color match: **Highest value**
  4. If still tied: **You can choose**
- If the most similar card is on a **corner**, you can choose which side to put the royal.

### 3. Optional Card Replacement

If you wish, you can now choose **one numbered card** on the grid and:
1. Place it on the **bottom of the deck**
2. Draw a new card to place in the same spot

---

## How to Play

### Draw Phase

Each turn, draw **one card** from the deck and follow the rules based on card type:

#### Royal Cards (Jack, Queen, King)
- Use the **royal placement rule** (see Setup step 2)
- Cannot be placed directly on the grid
- Must go in positions **outside** the 3×3 grid

#### Numbered Cards (2-10)
- **Must** be placed on the grid
- Can go on any card with the **same or lower value**
- Empty spots have **value zero** (any card can be placed there)

#### Ace or Joker
- These are placed on the **bottom row**, next to the deck
- They become available to use as special abilities
- Maximum: **4 Aces** and **2 Jokers**

---

## Combat: Killing Royals

### Creating a Payload

When you place a card on the grid **opposite a royal** (with exactly two cards between them), those two cards become a **"payload"** that fires at the royal.

```
Example:
   ROYAL
     ↑
   [Card A]  ← These two cards are the payload
   [Card B]  ←
     ↑
[Placed Card] ← You just placed this card
```

### Payload Power

- **Power** = Sum of the two payload card values
- **Health** = Royal's base value + any armor

The power must be **≥ health** to kill the royal. If not, nothing happens.

### Royal Health & Requirements

#### Jack (11 Health)
- Power needed: **≥ 11**
- Suit requirement: **None** (any suits work)
- Example: 6♠ + 5♥ = 11 ✓

#### Queen (12 Health)
- Power needed: **≥ 12**
- Suit requirement: **Same color** (both red OR both black)
- Example: 7♦ + 6♥ = 13, both red ✓
- Example: 8♠ + 5♦ = 13, different colors ✗

#### King (13 Health)
- Power needed: **≥ 13**
- Suit requirement: **Same suit**
- Example: 8♣ + 5♣ = 13, both clubs ✓
- Example: 8♣ + 5♠ = 13, different suits ✗

---

## Adding Armor

If you **can't play a card** on the grid (no valid positions), you can add it as **armor** to a royal.

### Armor Rules

1. Armor must go to the **lowest value royal** first
2. If tied, prioritize by:
   - Same suit as the card
   - Same color as the card
   - Your choice
3. Armor **increases the royal's health** by the card's value
   - Example: King (13) + 3♠ armor = **16 total health**
4. You **cannot** make a royal invincible (armor limit applies)

### Armor in Combat

- When calculating payload power needed, add armor value to royal health
- When a royal is killed, **armor is also destroyed**

---

## Auto-Cycle Deck

If there are **no more alive royals in play**, but you haven't yet killed all 12, the game will automatically **cycle through the deck** to find a royal for you to place.

- Cards cycled through are added to the **bottom of the deck**
- This prevents the game from getting stuck

---

## Special Abilities

### Using an Ace

**Cost:** One Ace (from bottom row)

**Effect:** Pick up any numbered card stack from the grid

**What happens:**
1. Click an Ace to activate it
2. Click a stack on the grid
3. The entire stack is placed on the **bottom of the deck**
4. The grid position becomes **empty** (value 0)
5. The Ace is turned **face down** (can't be used again)

**Strategic use:** Clear blocked stacks or create better payload opportunities

---

### Using a Joker

**Cost:** One Joker (from bottom row)

**Effect:** Move a card that's already on the grid

**What happens:**
1. Click a Joker to activate it
2. Click a stack to select it (only the **top card** moves)
3. Click another stack to place the card there
4. The card must be placeable (valid value rules apply)
5. The Joker is turned **face down** (can't be used again)

**Strategic use:** Rearrange cards to create better payloads or free up space

---

## Winning

You **win** if all 12 royals have been:
1. **Placed** on the board
2. **Killed**

### Score

Your score is the number of **unspent Jokers and Aces** (0-6).

- **Perfect game:** Score of 6 (won without using any)
- **Good game:** Score of 3-5
- **Close game:** Score of 1-2
- **Barely won:** Score of 0

---

## Losing

You **lose** if any of these conditions occur:

### 1. Can't Place or Armor a Card

You draw a card that:
- Can't be placed on the grid (no valid positions)
- AND can't be added as armor because:
  - No more armor slots available, OR
  - It would make a royal invincible

### 2. Deck Runs Out

Your deck is empty AND you don't have any unused Aces to continue playing.

---

## Strategy Tips

### General Tips
1. **Plan your payloads** - Think ahead about which cards will create killing combinations
2. **Save your Aces and Jokers** - Only use them when absolutely necessary (they're your score!)
3. **Manage your stacks** - Try to keep multiple stacks buildable
4. **Watch armor placement** - Don't let armor make royals too strong

### Setup Phase
- **Consider card replacement carefully** - Removing a high card might help, but you lose it from the deck
- **Look for immediate threats** - Are any royals already adjacent to strong payloads?

### Combat Priority
1. **Kill weak royals first** - Jacks are easiest (any suits)
2. **Prevent armor stacking** - Try to kill royals before they get too much armor
3. **Use color/suit matching** - Plan your plays to match Queen/King requirements

### Special Ability Usage
- **Aces:** Use to clear high-value stacks that are blocking other plays
- **Jokers:** Use to create suit/color matches for Queens and Kings

### Emergency Tactics
- If you're about to lose, use all your Aces and Jokers to survive
- Sometimes it's better to armor a royal than to lose immediately
- Remember: Auto-cycle will help if no royals are on the board

---

## Quick Reference

### Card Values
- **2-10:** Numbered cards (can stack, create payloads)
- **Jack (J):** 11 health, any suits
- **Queen (Q):** 12 health, same color required
- **King (K):** 13 health, same suit required
- **Ace (A):** Special ability - remove stack
- **Joker:** Special ability - move card

### Valid Card Placements
- **Numbered:** On grid, on card with ≤ value
- **Royal:** Outside grid, by similarity rule
- **Armor:** On royal, lowest value first
- **Ace/Joker:** Bottom row only

### Win/Loss
- **Win:** All 12 royals killed
- **Loss:** Can't play card, or deck empty with no Aces

---

**Last Updated:** 2025-11-09
**Based on:** Gridcannon by Tom Francis
**Implementation:** Kill The Royals v2.0
