/**
 * Game API service for HTTP requests
 * This is a placeholder for REST API integration with backend
 */

import { Room, Player, RoomSettings } from '../types/game';

const API_BASE_URL = process.env.VITE_API_URL || '/api';

export const gameApi = {
  // Room management
  async createRoom(hostPlayer: Player, settings: RoomSettings): Promise<Room> {
    // TODO: Implement API call
    console.log('[API] Creating room', { hostPlayer, settings });
    
    // Mock response
    return {
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      settings,
      players: [hostPlayer],
      hostId: hostPlayer.id,
    };
  },

  async joinRoom(roomCode: string, player: Player): Promise<Room> {
    // TODO: Implement API call
    console.log('[API] Joining room', { roomCode, player });
    
    // Mock response
    return {
      code: roomCode,
      settings: { maxPlayers: 6, includeInquisitor: false },
      players: [player],
      hostId: 'mock-host-id',
    };
  },

  async leaveRoom(roomCode: string, playerId: string): Promise<void> {
    // TODO: Implement API call
    console.log('[API] Leaving room', { roomCode, playerId });
  },

  async startGame(roomCode: string): Promise<void> {
    // TODO: Implement API call
    console.log('[API] Starting game', { roomCode });
  },

  async getRoomState(roomCode: string): Promise<Room> {
    // TODO: Implement API call
    console.log('[API] Getting room state', { roomCode });
    
    // Mock response
    return {
      code: roomCode,
      settings: { maxPlayers: 6, includeInquisitor: false },
      players: [],
      hostId: 'mock-host-id',
    };
  },

  // Player actions
  async updatePlayerReady(roomCode: string, playerId: string, isReady: boolean): Promise<void> {
    // TODO: Implement API call
    console.log('[API] Updating player ready state', { roomCode, playerId, isReady });
  },
};
