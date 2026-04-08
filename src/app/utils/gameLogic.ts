import { Player, ActionType, CharacterType } from '../types/game';
import { ACTIONS } from '../constants/game';

/**
 * Check if a player can perform an action
 */
export function canPerformAction(player: Player, action: ActionType, targetPlayer?: Player): boolean {
  const actionData = ACTIONS[action];

  // Check if player has enough coins
  if (actionData.cost > player.coins) {
    return false;
  }

  // Check if action requires a target and target is valid
  if (actionData.requiresTarget && !targetPlayer) {
    return false;
  }

  if (targetPlayer && !targetPlayer.isAlive) {
    return false;
  }

  return true;
}

/**
 * Check if a player has a specific character card
 */
export function hasCharacter(player: Player, character: CharacterType): boolean {
  return player.influences.some((inf) => !inf.revealed && inf.character === character);
}

/**
 * Get alive players
 */
export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter((p) => p.isAlive);
}

/**
 * Calculate next player in turn order
 */
export function getNextPlayer(players: Player[], currentPlayerId: string): Player | null {
  const alivePlayers = getAlivePlayers(players);
  if (alivePlayers.length === 0) return null;

  const currentIndex = alivePlayers.findIndex((p) => p.id === currentPlayerId);
  if (currentIndex === -1) return alivePlayers[0];

  const nextIndex = (currentIndex + 1) % alivePlayers.length;
  return alivePlayers[nextIndex];
}

/**
 * Check if action can be blocked by a character
 */
export function canBlock(action: ActionType, character: CharacterType): boolean {
  const actionData = ACTIONS[action];
  return actionData.blockableBy?.includes(character) || false;
}

/**
 * Format player name with truncation
 */
export function formatPlayerName(name: string, maxLength: number = 15): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
}

/**
 * Generate random room code
 */
export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Generate random player ID
 */
export function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 15);
}
