/**
 * Socket service for real-time multiplayer communication
 * Uses socket.io-client to connect to backend
 */

import { io, Socket } from 'socket.io-client';

export interface SocketEvents {
  // Room events
  'room:created': (roomCode: string) => void;
  'room:join': (data: { roomCode: string; player: any }) => void;
  'room:joined': (players: any[]) => void;
  'room:left': (playerId: string) => void;
  'player:ready': (playerId: string) => void;
  
  // Game events
  'game:started': () => void;
  'game:action': (action: any) => void;
  'game:response': (response: any) => void;
  'game:reveal': (data: any) => void;
  'game:exchange': (data: any) => void;
  'game:investigateDecision': (data: any) => void;
  'game:stateUpdate': (state: any) => void;
  
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': () => void;
}

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  connect(url: string) {
    if (this.socket) {
      if (this.socket.connected) return;
      this.socket.connect();
      return;
    }

    console.log('[Socket] Connecting to:', url);
    this.socket = io(url, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[Socket] Connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('[Socket] Disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('[Socket] Disconnecting');
      this.socket.disconnect();
      this.connected = false;
    }
  }

  emit(event: keyof SocketEvents, data?: any) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[Socket] Cannot emit ${event}, not connected`);
    }
  }

  on<E extends keyof SocketEvents>(event: E, callback: SocketEvents[E]) {
    if (this.socket) {
      this.socket.on(event, callback as any);
    } else {
      console.warn(`[Socket] Cannot listen to ${event}, socket uninitialized. Call connect() first.`);
      // A safe way to handle setting listeners before connect is delaying or queueing.
      // But for simplicity, we assume connect() is called early.
    }
  }

  off(event: keyof SocketEvents, callback?: Function) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback as any);
      } else {
        this.socket.off(event);
      }
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const socket = new SocketService();
