import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGameStore } from '../store/gameStore';
import { Crown, TrendingUp, Swords, Target } from 'lucide-react';
import { CharacterCard } from '../components/cards/CharacterCard';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function EndGameScreen() {
  const navigate = useNavigate();
  const { winner, players, resetGame } = useGameStore();

  useEffect(() => {
    // Celebration confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#D4A94B', '#E5BE68', '#B93A3A'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  if (!winner) {
    navigate('/home');
    return null;
  }

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  const handleReturnHome = () => {
    resetGame();
    navigate('/home');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--coup-bg)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'var(--coup-primary)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Winner Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--coup-primary) 0%, var(--coup-primary-hover) 100%)',
            }}
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Crown className="w-12 h-12" style={{ color: 'var(--coup-bg)' }} />
          </motion.div>

          <h1
            className="text-4xl mb-2"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--coup-text-primary)',
            }}
          >
            Victory!
          </h1>

          <p
            className="text-2xl"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--coup-primary)',
            }}
          >
            {winner.username}
          </p>

          <p
            className="mt-2"
            style={{
              color: 'var(--coup-text-secondary)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            has seized power and eliminated all rivals
          </p>
        </motion.div>

        {/* Winner's Cards */}
        <motion.div
          className="flex justify-center gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {winner.influences
            .filter((inf) => !inf.revealed)
            .map((influence, index) => (
              <CharacterCard key={index} character={influence.character} size="medium" />
            ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="rounded-xl p-6 mb-6"
          style={{
            background: 'var(--coup-surface)',
            border: '2px solid var(--coup-border)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2
            className="text-xl mb-4 text-center"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--coup-text-primary)',
            }}
          >
            Final Standings
          </h2>

          <div className="space-y-3">
            {players
              .sort((a, b) => {
                const aAlive = a.influences.filter((i) => !i.revealed).length;
                const bAlive = b.influences.filter((i) => !i.revealed).length;
                if (aAlive !== bAlive) return bAlive - aAlive;
                return b.coins - a.coins;
              })
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background:
                      player.id === winner.id
                        ? 'linear-gradient(135deg, var(--coup-primary)20 0%, var(--coup-primary)10 100%)'
                        : 'var(--coup-surface-elevated)',
                    border: player.id === winner.id ? '1px solid var(--coup-primary)' : '1px solid var(--coup-border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: index === 0 ? 'var(--coup-primary)' : 'var(--coup-surface)',
                        color: index === 0 ? 'var(--coup-bg)' : 'var(--coup-text-secondary)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {index + 1}
                    </div>
                    <span
                      style={{
                        color: 'var(--coup-text-primary)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {player.username}
                    </span>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: 'var(--coup-text-secondary)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {player.influences.filter((i) => !i.revealed).length} influences
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, var(--coup-primary) 0%, var(--coup-primary-hover) 100%)',
              color: 'var(--coup-bg)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Play Again
          </button>

          <button
            onClick={handleReturnHome}
            className="w-full py-4 rounded-lg"
            style={{
              background: 'var(--coup-surface)',
              border: '2px solid var(--coup-border)',
              color: 'var(--coup-text-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
