import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './pages/SplashScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CreateRoomScreen } from './pages/CreateRoomScreen';
import { JoinRoomScreen } from './pages/JoinRoomScreen';
import { LobbyScreen } from './pages/LobbyScreen';
import { InitialDealScreen } from './pages/InitialDealScreen';
import { GameScreen } from './pages/GameScreen';
import { RulesScreen } from './pages/RulesScreen';
import { EndGameScreen } from './pages/EndGameScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { SandboxScreen } from './pages/SandboxScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen,
  },
  {
    path: '/home',
    Component: HomeScreen,
  },
  {
    path: '/create',
    Component: CreateRoomScreen,
  },
  {
    path: '/join',
    Component: JoinRoomScreen,
  },
  {
    path: '/lobby',
    Component: LobbyScreen,
  },
  {
    path: '/deal',
    Component: InitialDealScreen,
  },
  {
    path: '/game',
    Component: GameScreen,
  },
  {
    path: '/end',
    Component: EndGameScreen,
  },
  {
    path: '/rules',
    Component: RulesScreen,
  },
  {
    path: '/settings',
    Component: SettingsScreen,
  },
  {
    path: '/sandbox',
    Component: SandboxScreen,
  },
  {
    path: '*',
    Component: () => (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'var(--coup-bg)',
          color: 'var(--coup-text-primary)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            404
          </h1>
          <p style={{ color: 'var(--coup-text-secondary)' }}>Page not found</p>
        </div>
      </div>
    ),
  },
]);