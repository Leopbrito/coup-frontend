import { create } from 'zustand';
import { GameState, Player, GamePhase, ActionData, CharacterType, Influence } from '../types/game';
import { socket } from '../services/socket';
import { gameApi } from '../services/gameApi';

export interface GameStore extends GameState {
  // Room management
  roomCode: string | null;
  currentUserId: string | null;
  setRoomCode: (code: string) => void;
  setCurrentUserId: (id: string) => void;
  
  // Realtime Integration
  connectSocket: (url: string) => void;
  syncState: (newState: GameState) => void;

  // Game initialization
  initializeGame: (players: Player[], includeInquisitor: boolean) => Promise<void>;
  startGame: () => Promise<void>;
  
  // Game actions
  performAction: (action: ActionData) => void;
  respondToAction: (playerId: string, response: 'allow' | 'challenge' | 'block', blockCharacter?: CharacterType) => void;
  revealInfluence: (playerId: string, influenceIndex: number) => void;
  exchangeCards: (playerId: string, keptCards: CharacterType[]) => void;
  investigateDecision: (playerId: string, forceExchange: boolean) => void;
  nextTurn: () => void;
  setPlayers: (players: Player[]) => void;
  
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
  exchangeOptions: null,
  pendingInvestigation: null,
  winner: null,
  includeInquisitor: false,
};

export const useRealGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  roomCode: null,
  currentUserId: null,

  setRoomCode: (code) => set({ roomCode: code }),
  
  setCurrentUserId: (id) => set({ currentUserId: id }),

  connectSocket: (url) => {
    socket.connect(url);
    
    // Listen for state updates from the authoritative backend
    socket.on('game:stateUpdate', (newState: GameState) => {
      set({ ...newState });
    });

    socket.on('room:joined', (players: Player[]) => {
      set({ players });
    });

    socket.on('game:started', () => {
      // Just visually handled by StateUpdate, but could add UI flags if needed
    });
  },

  syncState: (newState) => set(newState),

  initializeGame: async (players, includeInquisitor) => {
    // Actually uses API instead of generating locally
    const roomCode = get().roomCode;
    const currentUserId = get().currentUserId;
    if (!roomCode || !currentUserId) return;
    try {
      const room = await gameApi.getRoomState(roomCode);
      set({ players: room.players, includeInquisitor: room.settings.includeInquisitor });
    } catch {
      // ignore
    }
  },

  startGame: async () => {
    const roomCode = get().roomCode;
    if (!roomCode) return;
    try {
      await gameApi.startGame(roomCode);
    } catch (e) {
      console.error(e);
    }
  },

  performAction: (action) => {
    socket.emit('game:action', action);
  },

  respondToAction: (playerId, response, blockCharacter) => {
    socket.emit('game:response', { playerId, response, blockCharacter });
  },

  revealInfluence: (playerId, influenceIndex) => {
    socket.emit('game:reveal', { playerId, influenceIndex });
  },
  
  exchangeCards: (playerId, keptCards) => {
    const roomCode = get().roomCode;
    socket.emit('game:exchange', { roomCode, playerId, keptCards });
  },

  investigateDecision: (playerId, forceExchange) => {
    const roomCode = get().roomCode;
    socket.emit('game:investigateDecision', { roomCode, playerId, forceExchange });
  },

  nextTurn: () => {
    // Backend handles nextTurn internally based on responses
  },

  setPlayers: (players) => set({ players }),

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
