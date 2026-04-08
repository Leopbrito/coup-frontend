import { ActionType, CharacterType } from '../types/game';

export const ACTIONS = {
  [ActionType.INCOME]: {
    type: ActionType.INCOME,
    name: 'Income',
    description: 'Take 1 coin from the treasury',
    cost: 0,
    gain: 1,
    canBeBlocked: false,
    canBeChallenged: false,
    requiresTarget: false,
    requiredCharacter: null,
  },
  [ActionType.FOREIGN_AID]: {
    type: ActionType.FOREIGN_AID,
    name: 'Foreign Aid',
    description: 'Take 2 coins from the treasury',
    cost: 0,
    gain: 2,
    canBeBlocked: true,
    blockableBy: [CharacterType.DUKE],
    canBeChallenged: false,
    requiresTarget: false,
    requiredCharacter: null,
  },
  [ActionType.COUP]: {
    type: ActionType.COUP,
    name: 'Coup',
    description: 'Pay 7 coins to force a player to lose influence',
    cost: 7,
    gain: 0,
    canBeBlocked: false,
    canBeChallenged: false,
    requiresTarget: true,
    requiredCharacter: null,
  },
  [ActionType.TAX]: {
    type: ActionType.TAX,
    name: 'Tax',
    description: 'Take 3 coins from the treasury (Duke)',
    cost: 0,
    gain: 3,
    canBeBlocked: false,
    canBeChallenged: true,
    requiresTarget: false,
    requiredCharacter: CharacterType.DUKE,
  },
  [ActionType.ASSASSINATE]: {
    type: ActionType.ASSASSINATE,
    name: 'Assassinate',
    description: 'Pay 3 coins to force a player to lose influence (Assassin)',
    cost: 3,
    gain: 0,
    canBeBlocked: true,
    blockableBy: [CharacterType.CONTESSA],
    canBeChallenged: true,
    requiresTarget: true,
    requiredCharacter: CharacterType.ASSASSIN,
  },
  [ActionType.STEAL]: {
    type: ActionType.STEAL,
    name: 'Steal',
    description: 'Take 2 coins from another player (Captain)',
    cost: 0,
    gain: 2,
    canBeBlocked: true,
    blockableBy: [CharacterType.CAPTAIN, CharacterType.AMBASSADOR],
    canBeChallenged: true,
    requiresTarget: true,
    requiredCharacter: CharacterType.CAPTAIN,
  },
  [ActionType.EXCHANGE]: {
    type: ActionType.EXCHANGE,
    name: 'Exchange',
    description: 'Draw 2 cards from deck, return 2 cards (Ambassador)',
    cost: 0,
    gain: 0,
    canBeBlocked: false,
    canBeChallenged: true,
    requiresTarget: false,
    requiredCharacter: CharacterType.AMBASSADOR,
  },
  [ActionType.INVESTIGATE]: {
    type: ActionType.INVESTIGATE,
    name: 'Investigate',
    description: 'View one of another player\'s cards (Inquisitor)',
    cost: 0,
    gain: 0,
    canBeBlocked: false,
    canBeChallenged: true,
    requiresTarget: true,
    requiredCharacter: CharacterType.INQUISITOR,
  },
} as const;

export const CHARACTERS = {
  [CharacterType.DUKE]: {
    type: CharacterType.DUKE,
    name: 'Duke',
    description: 'Take 3 coins (Tax). Block Foreign Aid.',
    actions: [ActionType.TAX],
    blocks: [ActionType.FOREIGN_AID],
    color: 'var(--coup-duke)',
    secondaryColor: 'var(--coup-duke-secondary)',
  },
  [CharacterType.ASSASSIN]: {
    type: CharacterType.ASSASSIN,
    name: 'Assassin',
    description: 'Pay 3 coins to assassinate a player.',
    actions: [ActionType.ASSASSINATE],
    blocks: [],
    color: 'var(--coup-assassin)',
    secondaryColor: 'var(--coup-assassin-secondary)',
  },
  [CharacterType.CAPTAIN]: {
    type: CharacterType.CAPTAIN,
    name: 'Captain',
    description: 'Steal 2 coins from another player. Block stealing.',
    actions: [ActionType.STEAL],
    blocks: [ActionType.STEAL],
    color: 'var(--coup-captain)',
    secondaryColor: 'var(--coup-captain-secondary)',
  },
  [CharacterType.AMBASSADOR]: {
    type: CharacterType.AMBASSADOR,
    name: 'Ambassador',
    description: 'Exchange cards with deck. Block stealing.',
    actions: [ActionType.EXCHANGE],
    blocks: [ActionType.STEAL],
    color: 'var(--coup-ambassador)',
    secondaryColor: 'var(--coup-ambassador-secondary)',
  },
  [CharacterType.CONTESSA]: {
    type: CharacterType.CONTESSA,
    name: 'Contessa',
    description: 'Block assassination attempts.',
    actions: [],
    blocks: [ActionType.ASSASSINATE],
    color: 'var(--coup-contessa)',
    secondaryColor: 'var(--coup-contessa-secondary)',
  },
  [CharacterType.INQUISITOR]: {
    type: CharacterType.INQUISITOR,
    name: 'Inquisitor',
    description: 'Investigate a player\'s card. Exchange with deck. Block stealing.',
    actions: [ActionType.INVESTIGATE, ActionType.EXCHANGE],
    blocks: [ActionType.STEAL],
    color: 'var(--coup-inquisitor)',
    secondaryColor: 'var(--coup-inquisitor-secondary)',
  },
} as const;

export const INITIAL_COINS = 2;
export const COUP_COST = 7;
export const MAX_COINS_BEFORE_COUP = 10;
export const INFLUENCES_PER_PLAYER = 2;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const RESPONSE_TIMEOUT = 15000; // 15 seconds

export const createDeck = (includeInquisitor: boolean): CharacterType[] => {
  const characters = includeInquisitor
    ? [
        CharacterType.DUKE,
        CharacterType.DUKE,
        CharacterType.DUKE,
        CharacterType.ASSASSIN,
        CharacterType.ASSASSIN,
        CharacterType.ASSASSIN,
        CharacterType.CAPTAIN,
        CharacterType.CAPTAIN,
        CharacterType.CAPTAIN,
        CharacterType.CONTESSA,
        CharacterType.CONTESSA,
        CharacterType.CONTESSA,
        CharacterType.INQUISITOR,
        CharacterType.INQUISITOR,
      ]
    : [
        CharacterType.DUKE,
        CharacterType.DUKE,
        CharacterType.DUKE,
        CharacterType.ASSASSIN,
        CharacterType.ASSASSIN,
        CharacterType.ASSASSIN,
        CharacterType.CAPTAIN,
        CharacterType.CAPTAIN,
        CharacterType.CAPTAIN,
        CharacterType.AMBASSADOR,
        CharacterType.AMBASSADOR,
        CharacterType.AMBASSADOR,
        CharacterType.CONTESSA,
        CharacterType.CONTESSA,
        CharacterType.CONTESSA,
      ];

  return characters.sort(() => Math.random() - 0.5);
};
