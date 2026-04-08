import { create } from 'zustand';
import { GameState, Player, GamePhase, ActionData, CharacterType, Influence, ActionType } from '../types/game';
import { createDeck, INITIAL_COINS, INFLUENCES_PER_PLAYER } from '../constants/game';

interface GameStore extends GameState {
  // Room management
  roomCode: string | null;
  currentUserId: string | null;
  setRoomCode: (code: string) => void;
  setCurrentUserId: (id: string) => void;
  
  // Game initialization
  initializeGame: (players: Player[], includeInquisitor: boolean) => void;
  startGame: () => void;
  
  // Player actions
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  // Game actions
  performAction: (action: ActionData) => void;
  respondToAction: (playerId: string, response: 'allow' | 'challenge' | 'block', blockCharacter?: CharacterType) => void;
  revealInfluence: (playerId: string, influenceIndex: number) => void;
  nextTurn: () => void;
  
  // Utility
  resetGame: () => void;
  getCurrentPlayer: () => Player | null;
}

const initialState: GameState = {
  phase: GamePhase.LOBBY,
  players: [],
  currentPlayerId: null,
  deck: [],
  treasury: 50,
  pendingAction: null,
  pendingChallenge: null,
  pendingBlock: null,
  revealingPlayerId: null,
  winner: null,
  includeInquisitor: false,
};

// Extensões exclusivas para o modo Teste que não afetam a Produção
export interface MockExtensions {
  injectMockState: (partial: Partial<GameState>) => void;
  applyPreset: (preset: 'my_turn' | 'enemy_turn' | 'challenged' | 'killed_player' | 'coup_ready') => void;
}

export const useMockGameStore = create<GameStore & MockExtensions>((set, get) => ({
  ...initialState,
  roomCode: null,
  currentUserId: null,

  setRoomCode: (code) => set({ roomCode: code }),
  
  setCurrentUserId: (id) => set({ currentUserId: id }),

  initializeGame: (players, includeInquisitor) => {
    const deck = createDeck(includeInquisitor);
    const initializedPlayers = players.map((player) => {
      const influences: Influence[] = [
        { character: deck.pop()!, revealed: false },
        { character: deck.pop()!, revealed: false },
      ];
      return {
        ...player,
        coins: INITIAL_COINS,
        influences,
        isAlive: true,
      };
    });

    set({
      phase: GamePhase.STARTING,
      players: initializedPlayers,
      deck,
      currentPlayerId: initializedPlayers[0].id,
      includeInquisitor,
    });
  },

  startGame: () => {
    set({ phase: GamePhase.ACTION });
  },

  addPlayer: (player) => {
    set((state) => ({
      players: [...state.players, player],
    }));
  },

  removePlayer: (playerId) => {
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    }));
  },

  updatePlayer: (playerId, updates) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p
      ),
    }));
  },

  performAction: (action) => {
    set({
      pendingAction: {
        action,
        timestamp: Date.now(),
        respondedPlayers: [action.actorId],
      },
      phase: GamePhase.RESPONSE,
    });
  },

  respondToAction: (playerId, response, blockCharacter) => {
    const state = get();
    
    if (!state.pendingAction) return;

    const respondedPlayers = [...state.pendingAction.respondedPlayers, playerId];

    if (response === 'challenge') {
      set({
        pendingChallenge: {
          challengerId: playerId,
          targetId: state.pendingAction.action.actorId,
          claimedCharacter: state.pendingAction.action.claimedCharacter!,
        },
        phase: GamePhase.CHALLENGE,
      });
    } else if (response === 'block' && blockCharacter) {
      set({
        pendingBlock: {
          blockerId: playerId,
          claimedCharacter: blockCharacter,
        },
        phase: GamePhase.RESPONSE,
      });
    } else if (response === 'allow') {
      set((state) => ({
        pendingAction: state.pendingAction
          ? { ...state.pendingAction, respondedPlayers }
          : null,
      }));

      // Check if all players have responded
      const alivePlayers = state.players.filter(p => p.isAlive && p.id !== state.pendingAction?.action.actorId);
      if (respondedPlayers.length > alivePlayers.length) {
        // Execute action
        get().nextTurn();
      }
    }
  },

  revealInfluence: (playerId, influenceIndex) => {
    set((state) => ({
      players: state.players.map((p) => {
        if (p.id === playerId) {
          const newInfluences = [...p.influences];
          newInfluences[influenceIndex] = {
            ...newInfluences[influenceIndex],
            revealed: true,
          };
          const isAlive = newInfluences.some((inf) => !inf.revealed);
          return { ...p, influences: newInfluences, isAlive };
        }
        return p;
      }),
      revealingPlayerId: null,
      phase: GamePhase.ACTION,
    }));

    // Check for winner
    const alivePlayers = get().players.filter((p) => p.isAlive);
    if (alivePlayers.length === 1) {
      set({
        winner: alivePlayers[0],
        phase: GamePhase.ENDED,
      });
    } else {
      get().nextTurn();
    }
  },

  nextTurn: () => {
    const state = get();
    const alivePlayers = state.players.filter((p) => p.isAlive);
    const currentIndex = alivePlayers.findIndex((p) => p.id === state.currentPlayerId);
    const nextIndex = (currentIndex + 1) % alivePlayers.length;

    set({
      currentPlayerId: alivePlayers[nextIndex].id,
      pendingAction: null,
      pendingChallenge: null,
      pendingBlock: null,
      phase: GamePhase.ACTION,
    });
  },

  getCurrentPlayer: () => {
    const state = get();
    return state.players.find((p) => p.id === state.currentPlayerId) || null;
  },

  resetGame: () => {
    set({
      ...initialState,
      roomCode: get().roomCode,
      currentUserId: get().currentUserId,
    });
  },

  // === EXCLUSIVO PARA O TEST MODE (DEVTOOLS) ===
  injectMockState: (partial) => {
    set({ ...partial } as Partial<GameStore & MockExtensions>);
  },
  
  applyPreset: (preset) => {
    const state = get();
    // Garante que existam players mockados antes de aplicar presets
    const playersToUse = state.players.length >= 2 ? state.players : [
      { id: state.currentUserId || 'p1', username: 'You (Test)', coins: 2, influences: [{character: CharacterType.DUKE, revealed: false}, {character: CharacterType.ASSASSIN, revealed: false}], isAlive: true, isHost: true, isReady: true, isConnected: true },
      { id: 'p2', username: 'Enemy Bot', coins: 2, influences: [{character: CharacterType.CAPTAIN, revealed: false}, {character: CharacterType.CONTESSA, revealed: false}], isAlive: true, isHost: false, isReady: true, isConnected: true }
    ];
    
    // Atualizar jogador atual caso o ID seja nulo
    const meId = state.currentUserId || 'p1';

    switch(preset) {
      case 'my_turn':
        set({
          phase: GamePhase.ACTION,
          players: playersToUse,
          currentPlayerId: meId,
          pendingAction: null,
          pendingChallenge: null,
        });
        break;
      case 'enemy_turn':
        set({
          phase: GamePhase.ACTION,
          players: playersToUse,
          currentPlayerId: playersToUse[1].id,
        });
        break;
      case 'coup_ready':
        set({
          phase: GamePhase.ACTION,
          players: playersToUse.map(p => p.id === meId ? { ...p, coins: 7 } : p),
          currentPlayerId: meId,
        });
        break;
      case 'challenged':
        set({
          phase: GamePhase.CHALLENGE,
          players: playersToUse,
          currentPlayerId: meId,
          pendingAction: { action: { type: ActionType.FOREIGN_AID, actorId: meId, cost: 0 }, timestamp: Date.now(), respondedPlayers: [meId, playersToUse[1].id] },
          pendingChallenge: { challengerId: playersToUse[1].id, targetId: meId, claimedCharacter: CharacterType.DUKE }
        } as Partial<GameState>);
        break;
      case 'killed_player':
        set({
          players: playersToUse.map(p => p.id === playersToUse[1].id ? { ...p, isAlive: false, influences: p.influences.map(i => ({...i, revealed: true})) } : p),
        });
        break;
    }
  }
}));
