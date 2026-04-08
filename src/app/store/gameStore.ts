import { useRealGameStore } from './realGameStore';
import { useMockGameStore } from './mockGameStore';
import { IS_TEST_MODE } from '../../config/env';

// Padrão Facade (Proxy) que injeta dependência baseado no Test Mode.
// Os componentes da UI importam `useGameStore` não precisam saber de nada!
export const useGameStore = IS_TEST_MODE ? useMockGameStore : useRealGameStore;
