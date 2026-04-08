import { create } from 'zustand';
import { GameState, Player, GamePhase, ActionData, CharacterType, Influence } from '../types/game';
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

export const useRealGameStore = create<GameStore>((set, get) => ({
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
}));
