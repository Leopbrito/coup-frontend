import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGameStore } from '../store/gameStore';
import { CharacterCard } from '../components/cards/CharacterCard';
import { CoinCounter } from '../components/ui/CoinCounter';

export function InitialDealScreen() {
  const navigate = useNavigate();
  const { players, currentUserId, startGame } = useGameStore();
  const [showCards, setShowCards] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentUserId);

  useEffect(() => {
    // Sequence the animations
    const cardTimer = setTimeout(() => {
      setShowCards(true);
    }, 1000);

    const coinTimer = setTimeout(() => {
      setShowCoins(true);
    }, 2500);

    const continueTimer = setTimeout(() => {
      navigate('/game');
    }, 5000);

    return () => {
      clearTimeout(cardTimer);
      clearTimeout(coinTimer);
      clearTimeout(continueTimer);
    };
  }, [navigate, startGame]);

  if (!currentPlayer) {
    return null;
  }

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
      <div className="relative z-10 text-center">
        <motion.h1
          className="text-3xl mb-12"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--coup-text-primary)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Influence
        </motion.h1>

        {/* Cards */}
        <div className="flex justify-center gap-6 mb-12">
          {currentPlayer.influences.map((influence, index) => (
            <motion.div
              key={index}
              initial={{ x: index === 0 ? -100 : 100, opacity: 0, rotateY: 180 }}
              animate={
                showCards
                  ? {
                      x: 0,
                      opacity: 1,
                      rotateY: 0,
                    }
                  : {}
              }
              transition={{
                delay: index * 0.3,
                duration: 0.8,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <CharacterCard character={influence.character} size="large" />
            </motion.div>
          ))}
        </div>

        {/* Coins */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={showCoins ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div
            className="mb-2"
            style={{
              color: 'var(--coup-text-secondary)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Starting Treasury
          </div>
          <div className="flex justify-center">
            <CoinCounter count={currentPlayer.coins} size="large" animate />
          </div>
        </motion.div>

        {/* Continue hint */}
        <motion.p
          className="mt-12 text-sm"
          style={{
            color: 'var(--coup-text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          Starting game...
        </motion.p>
      </div>
    </div>
  );
}
