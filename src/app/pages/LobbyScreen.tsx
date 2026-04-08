import { ArrowLeft, Check, Copy, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PlayerBadge } from '../components/players/PlayerBadge';
import { useGameStore } from '../store/gameStore';
import { Player } from '../types/game';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';
import { Section } from '../components/layout/Section';

export function LobbyScreen() {
  const navigate = useNavigate();
  const { roomCode, players, currentUserId, updatePlayer, initializeGame } = useGameStore();
  const [copied, setCopied] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentUserId);
  const isHost = currentPlayer?.isHost || false;
  const allReady = players.length >= 2 && players.every((p) => p.isReady || p.isHost);

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleReady = () => {
    if (currentUserId) {
      const player = players.find((p) => p.id === currentUserId);
      if (player && !player.isHost) {
        updatePlayer(currentUserId, { isReady: !player.isReady });
      }
    }
  };

  const handleStartGame = () => {
    if (!isHost || !allReady) return;

    // Initialize game with mock data
    const mockPlayers: Player[] = [
      ...players,
      // Add AI players if needed for testing
      ...(players.length < 3
        ? [
            {
              id: 'ai-1',
              username: 'AI Player 1',
              coins: 2,
              influences: [],
              isAlive: true,
              isHost: false,
              isReady: true,
              isConnected: true,
            },
            {
              id: 'ai-2',
              username: 'AI Player 2',
              coins: 2,
              influences: [],
              isAlive: true,
              isHost: false,
              isReady: true,
              isConnected: true,
            },
          ]
        : []),
    ];

    initializeGame(mockPlayers, false);
    navigate('/deal');
  };

  return (
    <PageContainer>
      {/* Premium Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[120px] bg-coup-primary"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full blur-[100px] bg-coup-accent-info"
        />
      </div>

      <ContentWrapper className="py-6">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg text-coup-text-secondary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl ml-4 font-serif text-coup-text-primary">
              Lobby
            </h1>
          </div>

          {/* Room Code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/30 transition-all shadow-inner relative overflow-hidden group"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="tracking-[0.2em] font-serif text-coup-primary text-xl" style={{ textShadow: '0 0 10px rgba(212,169,75,0.3)' }}>
              {roomCode}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-coup-accent-success" />
            ) : (
              <Copy className="w-5 h-5 text-coup-primary/60 group-hover:text-coup-primary transition-colors" />
            )}
          </button>
        </Stack>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Players */}
          <div className="flex-1">
            <h2 className="mb-4 font-sans tracking-wide uppercase text-sm font-semibold text-coup-text-primary/70">
              Players ({players.length}/6)
            </h2>

            <Stack gap="md">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25, delay: index * 0.1 }}
                  className="rounded-2xl bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden"
                >
                  <PlayerBadge player={player} />
                </motion.div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 6 - players.length) }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  className="rounded-2xl p-5 border border-dashed border-white/10 bg-black/10 backdrop-blur-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.3 }}
                  transition={{ delay: players.length * 0.1 + i * 0.05 }}
                >
                  <div className="text-center tracking-wide text-coup-text-secondary/50 font-sans text-sm">
                    Waiting for player...
                  </div>
                </motion.div>
              ))}
            </Stack>
          </div>

          {/* Actions */}
          <Stack gap="sm" className="mt-6">
            {/* Ready Button */}
            {!isHost && (
              <motion.button
                className={`w-full py-5 rounded-xl font-sans tracking-wide font-semibold overflow-hidden relative shadow-xl text-coup-bg ${
                  currentPlayer?.isReady
                    ? 'bg-gradient-to-br from-coup-accent-success to-emerald-600 shadow-[0_0_20px_rgba(40,167,69,0.3)]'
                    : 'bg-gradient-to-br from-coup-primary to-coup-primary-hover'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleReady}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                {currentPlayer?.isReady ? 'Ready!' : 'Ready Up'}
              </motion.button>
            )}

            {/* Start Button */}
            {isHost && (
              <motion.button
                className={`w-full py-5 rounded-xl flex items-center justify-center gap-3 font-sans font-semibold tracking-wide overflow-hidden relative shadow-xl ${
                  allReady
                    ? 'bg-gradient-to-br from-coup-primary to-coup-primary-hover text-coup-bg'
                    : 'bg-black/30 text-white/30 border border-white/5 cursor-not-allowed'
                }`}
                whileHover={allReady ? { scale: 1.02 } : {}}
                whileTap={allReady ? { scale: 0.98 } : {}}
                onClick={handleStartGame}
                disabled={!allReady}
              >
                {allReady && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />}
                <Play className="w-5 h-5" />
                Start Game
              </motion.button>
            )}

            {/* Info */}
            {isHost && !allReady && (
              <div className="text-center text-sm text-coup-text-secondary/70 font-sans tracking-wide mt-2">
                {players.length < 2
                  ? 'Waiting for at least 2 players...'
                  : 'Waiting for all players to ready up...'}
              </div>
            )}
          </Stack>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}