# COUP - Game Architecture Documentation

## Overview

This is a production-ready mobile multiplayer game implementing the social deduction game "Coup" with a premium dark neo-renaissance UI aesthetic.

## Tech Stack

- **React 18** - Component framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Zustand** - Global state management
- **Framer Motion (motion)** - Premium animations
- **Tailwind CSS v4** - Styling with CSS variables
- **Lucide React** - Icon system

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── cards/           # Character cards
│   │   ├── game/            # Game-specific components (ActionButton)
│   │   ├── modals/          # Modals (ChallengeModal)
│   │   ├── players/         # Player-related components (PlayerBadge)
│   │   └── ui/              # Reusable UI components (CoinCounter, etc.)
│   ├── constants/           # Game constants and configurations
│   ├── hooks/               # Custom React hooks (useCountdown)
│   ├── pages/               # Screen components
│   ├── services/            # API/Socket services (placeholders for backend)
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root component
│   └── routes.tsx           # Route configuration
└── styles/
    ├── fonts.css            # Font imports (Cinzel, Inter)
    ├── theme.css            # CSS variables and design tokens
    ├── tailwind.css         # Tailwind imports
    └── index.css            # Global styles
```

## Game Screens

1. **SplashScreen** (`/`) - Animated intro with logo
2. **HomeScreen** (`/home`) - Main menu
3. **CreateRoomScreen** (`/create`) - Create new game room
4. **JoinRoomScreen** (`/join`) - Join existing room with code
5. **LobbyScreen** (`/lobby`) - Pre-game lobby with players
6. **InitialDealScreen** (`/deal`) - Dramatic card reveal
7. **GameScreen** (`/game`) - Main gameplay
8. **EndGameScreen** (`/end`) - Victory screen with stats
9. **RulesScreen** (`/rules`) - How to play
10. **SettingsScreen** (`/settings`) - Game settings

## Game Flow

```
Splash → Home → Create/Join → Lobby → Initial Deal → Game → End Game
                                ↑                              ↓
                                └──────── Play Again ──────────┘
```

## Color System

All colors are centralized in `/src/styles/theme.css` as CSS variables:

```css
--coup-bg: #0D1016              /* Dark background */
--coup-surface: #151A22          /* Surface layer */
--coup-primary: #D4A94B          /* Gold accent */
--coup-text-primary: #F5F1E8     /* Main text */
/* ... character-specific colors ... */
```

**Never hardcode colors in components**. Always reference CSS variables.

## Typography

- **Serif (Cinzel)**: Titles, branding, dramatic text
- **Sans-serif (Inter)**: Body text, UI elements

Fonts are imported in `/src/styles/fonts.css`.

## State Management

### Zustand Store (`/src/app/store/gameStore.ts`)

Central game state including:
- Room information (code, players)
- Game phase (lobby, action, response, ended)
- Current turn
- Pending actions/challenges
- Player influences and coins

### Key Actions

- `initializeGame()` - Deal cards to players
- `performAction()` - Submit player action
- `respondToAction()` - Challenge/allow/block
- `revealInfluence()` - Reveal a card when losing
- `nextTurn()` - Advance to next player

## Component Architecture

### Character Cards (`CharacterCard.tsx`)

- Beautiful gradient backgrounds per character
- Flip animations
- Revealed state (grayscale + overlay)
- Face-down mode for opponents

### Player Badges (`PlayerBadge.tsx`)

- Avatar, username, host badge
- Connection indicator
- Influence dots
- Coin counter
- Current turn glow effect

### Challenge Modal (`ChallengeModal.tsx`)

- Appears when action requires response
- Countdown timer (15s)
- Allow / Challenge / Block options
- Dramatic pulsing animation
- Auto-allow on timeout

### Action Buttons (`ActionButton.tsx`)

- Character-themed gradients
- Cost display
- Disabled states
- Hover effects

## Game Logic

### Character Types

```typescript
enum CharacterType {
  DUKE,       // Tax (3 coins), Block Foreign Aid
  ASSASSIN,   // Assassinate (costs 3)
  CAPTAIN,    // Steal (2 coins), Block stealing
  AMBASSADOR, // Exchange cards, Block stealing
  CONTESSA,   // Block assassination
  INQUISITOR, // Investigate, Exchange (variant)
}
```

### Actions

- **Income**: 1 coin (unchallenged)
- **Foreign Aid**: 2 coins (blockable by Duke)
- **Coup**: 7 coins, force reveal (unchallenged)
- **Character Actions**: Require claiming a character (challengeable)

### Challenge System

1. Player claims character action
2. Others can challenge, block, or allow
3. If challenged and player has card → challenger loses influence
4. If challenged and player doesn't have card → player loses influence
5. Blocks can also be challenged

## Multiplayer Integration

### Current Implementation

The game currently uses **local state** with Zustand. All players share the same state in a single browser session. This is ideal for testing and local play.

### Real Multiplayer Setup

To enable true multiplayer, integrate the placeholder services:

#### 1. Socket Service (`/src/app/services/socket.ts`)

Replace placeholders with Socket.IO or WebSocket:

```typescript
import io from 'socket.io-client';

const socket = io('wss://your-backend-url');

socket.on('game:stateUpdate', (state) => {
  // Update Zustand store
});

socket.emit('game:action', actionData);
```

#### 2. Game API (`/src/app/services/gameApi.ts`)

Replace with actual HTTP endpoints:

```typescript
export const gameApi = {
  async createRoom(player, settings) {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ player, settings })
    });
    return response.json();
  },
  // ... other endpoints
};
```

#### 3. Backend Requirements

You'll need:
- Room management (create, join, leave)
- Game state synchronization
- Turn validation
- Disconnect handling
- Reconnect support

**Recommended Stack**: Node.js + Socket.IO + PostgreSQL/Redis

#### 4. Integration Points

Update these components to use real multiplayer:
- `CreateRoomScreen` - Call `gameApi.createRoom()`
- `JoinRoomScreen` - Call `gameApi.joinRoom()`
- `LobbyScreen` - Listen for `player:joined` events
- `GameScreen` - Emit actions to server, listen for state updates

### Supabase Integration

For quick multiplayer, you can use **Supabase Realtime**:

1. Create Supabase tables: `rooms`, `players`, `game_state`
2. Use Realtime subscriptions for live updates
3. Replace Zustand actions with Supabase queries
4. Use Supabase Auth for player authentication

## Animation Guidelines

All animations use **Framer Motion** (`motion` package):

```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* content */}
</motion.div>
```

### Animation Principles

- **Subtle, not arcade-y**: Elegant spring physics
- **Tense atmosphere**: Pulse effects, glows
- **Quick feedback**: Button presses, selections
- **Cinematic reveals**: Card flips, initial deal

## Mobile Optimization

- Touch-friendly tap targets (min 44x44px)
- Swipe gestures disabled where not needed
- Viewport meta tag configured
- No hover-only interactions (use `whileTap`)

## Future Enhancements

- [ ] Sound effects (coin clinks, card flips)
- [ ] Haptic feedback on mobile
- [ ] Spectator mode
- [ ] Replay system
- [ ] Tournament mode
- [ ] Achievements and statistics
- [ ] Custom card backs/themes
- [ ] Chat system
- [ ] Push notifications for turn reminders

## Performance Considerations

- Use `React.memo()` for expensive components
- Animations run on GPU (transform, opacity)
- Lazy load screens with `React.lazy()`
- Optimize card images
- Debounce API calls

## Testing Recommendations

- Unit tests for game logic (`/src/app/utils/gameLogic.ts`)
- Integration tests for Zustand store
- E2E tests for critical flows (create → join → play)
- Visual regression tests for UI components

## Deployment

Build for production:
```bash
npm run build
```

Deploy to:
- **Vercel** (recommended for frontend)
- **Netlify**
- **AWS Amplify**
- **Firebase Hosting**

For backend, deploy to:
- **Railway**
- **Render**
- **AWS ECS**
- **Heroku**

## Credits

Game design based on "Coup" by Rikki Tahta (La Mame Games).
This is a fan-made digital implementation for educational purposes.

---

**Last Updated**: April 8, 2026
**Version**: 1.0.0
