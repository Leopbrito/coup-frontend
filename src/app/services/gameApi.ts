/// <reference types="vite/client" />

/**
 * Game API service for HTTP requests
 * Communicates with the NestJS backend
 */

import { Room, Player, RoomSettings } from '../types/game';

// In Vite, environment variables are accessed via import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const gameApi = {
  // Room management
  async createRoom(hostPlayer: Player, settings: RoomSettings): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostPlayer, settings }),
    });
    if (!response.ok) throw new Error('Failed to create room');
    return response.json();
  },

  async joinRoom(roomCode: string, player: Player): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player }),
    });
    if (!response.ok) throw new Error('Failed to join room');
    return response.json();
  },

  async leaveRoom(roomCode: string, playerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    if (!response.ok) throw new Error('Failed to leave room');
  },

  async startGame(roomCode: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to start game');
  },

  async getRoomState(roomCode: string): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}`);
    if (!response.ok) throw new Error('Failed to get room state');
    return response.json();
  },

  // Player actions
  async updatePlayerReady(roomCode: string, playerId: string, isReady: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/players/${playerId}/ready`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isReady }),
    });
    if (!response.ok) throw new Error('Failed to update player ready state');
  },
};
