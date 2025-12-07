# Kill The Royals

A digital implementation of **Gridcannon** by [Tom Francis](http://www.pentadact.com/2013-10-23-gridcannon-a-single-player-game-with-a-deck-of-cards/).

A challenging solitaire-style card game where the goal is to eliminate all 12 face cards (Jacks, Queens, and Kings) using strategic card placement and special abilities.

## Game Rules

See [GAME_RULES.md](GAME_RULES.md) for complete rules and gameplay instructions.

## Tech Stack

- **Framework:** SvelteKit 2.0
- **UI Library:** Svelte 5
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite 5
- **Styling:** Vanilla CSS with CSS Custom Properties
- **Deployment:** Static Site Generation (adapter-static)

## Development Setup

```bash
# Install dependencies
npm install

# Start development server (with network access)
npm run dev

# Access at http://localhost:5173
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # TypeScript type checking
npm run lint         # ESLint code linting
npm run format       # Prettier code formatting
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # State management (Svelte stores)
│   ├── utils/          # Game logic and utilities
│   └── types.ts        # TypeScript type definitions
├── routes/
│   └── +page.svelte    # Main game page
└── app.css             # Global styles and CSS variables
```

## Credits

Original game concept: **Gridcannon** by Tom Francis
Digital implementation: Kill The Royals v2.0
