import { motion, AnimatePresence } from 'motion/react';
import { Player, CharacterType } from '../../types/game';
import { CHARACTERS } from '../../constants/game';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChallengeModalProps {
  isOpen: boolean;
  actor: Player;
  claimedCharacter: CharacterType;
  currentPlayerId: string;
  canRespond: boolean;
  onAllow: () => void;
  onChallenge: () => void;
  onBlock?: () => void;
  blockableCharacters?: CharacterType[];
  timeout?: number;
}

export function ChallengeModal({
  isOpen,
  actor,
  claimedCharacter,
  currentPlayerId,
  canRespond,
  onAllow,
  onChallenge,
  onBlock,
  blockableCharacters = [],
  timeout = 15,
}: ChallengeModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const [selectedBlockCharacter, setSelectedBlockCharacter] = useState<CharacterType | null>(null);

  useEffect(() => {
    if (!isOpen || !canRespond) return;

    setTimeLeft(timeout);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onAllow();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, canRespond, timeout]);

  const characterData = CHARACTERS[claimedCharacter];
  const canBlock = blockableCharacters.length > 0;

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
            style={{ background: 'rgba(0, 0, 0, 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative max-w-md w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, var(--coup-surface-elevated) 0%, var(--coup-surface) 100%)',
              border: '2px solid var(--coup-primary)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{
              scale: 1,
              y: 0,
              boxShadow: [
                '0 20px 60px rgba(212, 169, 75, 0.2)',
                '0 20px 80px rgba(212, 169, 75, 0.4)',
                '0 20px 60px rgba(212, 169, 75, 0.2)',
              ],
            }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              boxShadow: {
                duration: 1.5,
                repeat: Infinity,
              },
            }}
          >
            {/* Timer */}
            {canRespond && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: timeLeft <= 5 ? 'var(--coup-accent-danger)' : 'var(--coup-primary)',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--coup-bg)',
                    fontSize: '1.25rem',
                  }}
                  animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
                >
                  {timeLeft}
                </motion.div>
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${characterData.color} 0%, ${characterData.color}80 100%)`,
                }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
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
              Action Declared
            </h2>

            {/* Message */}
            <p
              className="text-center mb-6"
              style={{
                color: 'var(--coup-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span style={{ color: 'var(--coup-primary)' }}>{actor.username}</span> claims to be the{' '}
              <span style={{ color: characterData.color }}>{characterData.name}</span>.
            </p>

            {/* Actions */}
            {canRespond ? (
              <div className="space-y-3">
                {/* Allow */}
                <motion.button
                  className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--coup-accent-success)',
                    color: 'var(--coup-text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAllow}
                >
                  <CheckCircle className="w-5 h-5" />
                  Allow
                </motion.button>

                {/* Challenge */}
                <motion.button
                  className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--coup-accent-danger)',
                    color: 'var(--coup-text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onChallenge}
                >
                  <XCircle className="w-5 h-5" />
                  Challenge
                </motion.button>

                {/* Block */}
                {canBlock && onBlock && (
                  <div className="space-y-2">
                    <div
                      className="text-sm text-center"
                      style={{
                        color: 'var(--coup-text-secondary)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Block as:
                    </div>
                    {blockableCharacters.map((char) => {
                      const charData = CHARACTERS[char];
                      return (
                        <motion.button
                          key={char}
                          className="w-full py-3 px-4 rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${charData.secondaryColor} 0%, ${charData.color}40 100%)`,
                            border: `2px solid ${charData.color}`,
                            color: 'var(--coup-text-primary)',
                            fontFamily: 'var(--font-sans)',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onBlock}
                        >
                          Block as {charData.name}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="text-center py-4"
                style={{
                  color: 'var(--coup-text-secondary)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Waiting for other players...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
