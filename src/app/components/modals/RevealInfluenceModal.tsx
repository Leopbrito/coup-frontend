import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../../types/game';
import { CharacterCard } from '../cards/CharacterCard';
import { AlertCircle } from 'lucide-react';

interface RevealInfluenceModalProps {
  isOpen: boolean;
  player: Player;
  onReveal: (influenceIndex: number) => void;
}

export function RevealInfluenceModal({ isOpen, player, onReveal }: RevealInfluenceModalProps) {
  const availableInfluences = player.influences
    .map((inf, index) => ({ influence: inf, index }))
    .filter((item) => !item.influence.revealed);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative max-w-md w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, var(--coup-surface-elevated) 0%, var(--coup-surface) 100%)',
              border: '2px solid var(--coup-accent-danger)',
              boxShadow: '0 20px 60px rgba(185, 58, 58, 0.5)',
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--coup-accent-danger)',
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: 'var(--coup-text-primary)' }} />
              </motion.div>
            </div>

            {/* Title */}
            <h2
              className="text-2xl text-center mb-2"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--coup-text-primary)',
              }}
            >
              Lose Influence
            </h2>

            {/* Message */}
            <p
              className="text-center mb-6"
              style={{
                color: 'var(--coup-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Choose which influence to reveal
            </p>

            {/* Cards */}
            <div className="flex justify-center gap-4 mb-6">
              {availableInfluences.map((item) => (
                <motion.div
                  key={item.index}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onReveal(item.index)}
                >
                  <CharacterCard character={item.influence.character} size="medium" />
                </motion.div>
              ))}
            </div>

            <p
              className="text-center text-sm"
              style={{
                color: 'var(--coup-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Click a card to reveal it
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
