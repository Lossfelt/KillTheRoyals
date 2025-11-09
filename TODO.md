# Kill The Royals - TODO List

## 🚀 Modernization Tasks (Priority: High)

### Phase 1: Documentation ✅
- [x] Create CLAUDE.md with complete developer guide
- [x] Create TODO.md with task tracking
- [ ] Create GAME_RULES.md from About component
- [ ] Update .gitignore for SvelteKit

### Phase 2: SvelteKit Setup
- [ ] Install SvelteKit with TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Set up VSCode extensions recommendations
- [ ] Move old src to src-old for reference
- [ ] Move public assets to static folder

### Phase 3: Type Definitions & Utilities
- [ ] Create TypeScript type definitions (src/lib/types.ts)
  - Card, CardValue, Suit, CardColor types
  - GameState interface
  - Position types (Grid, Royal, Armor, Special)
- [ ] Create deck utilities (src/lib/utils/deck.ts)
  - createDeck() function
  - shuffleDeck() with Fisher-Yates algorithm
  - getCardUnicode() lookup table
- [ ] Create game logic utilities (src/lib/utils/game-logic.ts)
  - Port all functions from src-old/Functions/
  - Convert to pure TypeScript functions
  - Add comprehensive type safety

### Phase 4: State Management
- [ ] Create Svelte stores (src/lib/stores/game.ts)
  - Main gameState writable store
  - Derived stores for computed values
  - Action functions for state mutations
- [ ] Test state management with simple component

### Phase 5: Core Components
- [ ] Create Card.svelte component
  - Display unicode card symbol
  - Handle red/black coloring
  - Support active/inactive states
  - Mobile-friendly touch targets
- [ ] Create CardStack.svelte component
  - Display top card
  - Show stack depth indicator
  - Handle empty stacks
- [ ] Create GameBoard.svelte component
  - 7x7 CSS Grid layout
  - Mobile-first responsive design
  - All 49 positions mapped correctly
- [ ] Create GameControls.svelte component
  - Restart button
  - Rules button
  - (Future: Undo button)
- [ ] Create RulesModal.svelte component
  - Port content from About.js
  - Mobile-friendly modal
  - Click-outside to close
- [ ] Create WinLossModal.svelte component
  - Win message with stats
  - Loss message
  - Restart option
- [ ] Create SetupPhaseModal.svelte component
  - "Replace one card?" prompt
  - Yes/No buttons

### Phase 6: Game Logic Implementation
- [ ] Port setup phase logic (placeFirstNineCards)
- [ ] Port normal card placement (funcPlaceNormalCard)
- [ ] Port royal card placement (funcPlaceRoyalCard)
- [ ] Port armor card placement (funcPlaceArmorCard)
- [ ] Port Joker activation and usage (funcPlaceJoker)
- [ ] Port Ace activation and usage (funcPlaceAce)
- [ ] Port combat resolution (funcKillRoyals)
- [ ] Port auto-cycle deck (funcCycleDeckForRoyal)
- [ ] Port win/loss detection (funcCheckIfGameWon)
- [ ] Port card replacement (funcReplaceOneCard)

### Phase 7: Styling
- [ ] Create CSS custom properties theme
  - Color palette (light & dark modes)
  - Spacing system
  - Card dimensions (responsive)
  - Shadows and effects
- [ ] Implement mobile-first CSS
  - Base styles for mobile (320px+)
  - Tablet breakpoint (768px+)
  - Desktop breakpoint (1024px+)
- [ ] Physical card theme
  - White card backgrounds
  - Realistic shadows
  - Rounded corners
  - Card texture/pattern
  - Smooth transitions
- [ ] Dark mode support
  - Respect prefers-color-scheme
  - Optional toggle button
  - Dark card theme

### Phase 8: Testing & Polish
- [ ] Manual testing checklist (see CLAUDE.md)
- [ ] Mobile device testing
  - iOS Safari
  - Android Chrome
- [ ] Accessibility audit
  - Keyboard navigation
  - ARIA labels
  - Screen reader testing
  - Color contrast check
- [ ] Performance optimization
  - Lighthouse audit
  - Bundle size check
  - Image optimization

### Phase 9: Deployment
- [ ] Build production version
- [ ] Deploy to Vercel or Netlify
- [ ] Update README.md with new instructions
- [ ] Add screenshots/demo GIF

### Phase 10: Cleanup
- [ ] Delete src-old folder after verification
- [ ] Remove old React dependencies
- [ ] Final commit with modernization summary

---

## 🎮 Original TODO List (From Legacy Code)

These were the planned features for the original React version. Most will be implemented during modernization:

### High Priority
- [ ] **Fix cycleDeckForRoyal** - Should work when Joker or Ace on top of deck when no royals
  - Status: Needs verification in new version

- [ ] **Undo functionality** - Enable possibility to "undo" joker and ace usage
  - Status: Planned for future enhancement
  - Implementation: Store state history array

- [ ] **Win message** - Make funcCheckIfGameWon display a win-message
  - Status: WinLossModal.svelte will handle this

- [ ] **Loss message** - Create function to display message if you lost the game
  - Status: WinLossModal.svelte will handle this

- [ ] **Disable cards when game ends** - Disable placement and usage of cards when all royals are dead
  - Status: Will be handled in game logic

- [ ] **Restart button** - So you don't have to reload the site to start again
  - Status: GameControls.svelte will include this

### Medium Priority
- [ ] **Enforce correct royal placement** - Make function to enforce correct royal-placement
  - Status: Already enforced in legacy code, will port

- [ ] **Prevent card placement during special moves** - Ensure other cards can't be placed when using joker or ace
  - Status: Already handled in legacy code, will port

- [ ] **Clean up grid visuals** - Add pictures/colors to show where different cards are to be placed
  - Status: Will be part of physical card theme

### Low Priority / UX Improvements
- [ ] **Change buttons to divs** - Change all buttons to just be `<div>`s with onClick
  - Status: ⚠️ DON'T DO THIS - buttons are better for accessibility
  - Alternative: Use semantic HTML with proper ARIA labels

- [ ] **Unicode symbols for bottom row** - Remove bottom-placeholder-cards and replace with unicode shield/crown or letters A/J
  - Status: Will use appropriate symbols in new design

- [ ] **Stack depth on hover** - Change stack-length number from static to onHover
  - Status: Consider for desktop, but keep visible on mobile

- [ ] **Move deck position** - Possibly move deck, joker and ace row to the left side?
  - Status: Will evaluate during design phase

### Future Enhancements (Beyond Modernization)
- [ ] **Full undo functionality** - Enable undo for all moves (requires state history array)
- [ ] **Animations** - Card flip animations, slide-in effects
- [ ] **Sound effects** - Card placement, royal death, win/loss sounds
- [ ] **Statistics tracking** - Games played, win rate, average turns
- [ ] **Difficulty modes** - Easy (fewer royals), Normal, Hard (more armor)
- [ ] **Tutorial mode** - Interactive guide for new players
- [ ] **Accessibility** - Full keyboard navigation, screen reader support
- [ ] **Multiplayer** - Turn-based or time-based challenges

---

## 📊 Progress Tracking

**Total Modernization Tasks:** ~50
**Completed:** 2
**In Progress:** 1
**Remaining:** ~47

**Estimated Time Remaining:** 4-6 hours

---

**Last Updated:** 2025-11-09
**Current Phase:** Phase 1 - Documentation
