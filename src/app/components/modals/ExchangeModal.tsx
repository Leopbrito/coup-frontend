import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterType } from '../../types/game';
import { CharacterCard } from '../cards/CharacterCard';
import { Stack } from '../layout/Stack';
import { Check } from 'lucide-react';

interface ExchangeModalProps {
  isOpen: boolean;
  options: CharacterType[];
  currentInfluences: CharacterType[];
  keepCount: number;
  onConfirm: (keptCards: CharacterType[]) => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  options,
  currentInfluences,
  keepCount,
  onConfirm,
}) => {
  const allCards = [...currentInfluences, ...options];
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else if (selectedIndices.length < keepCount) {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === keepCount) {
      const keptCards = selectedIndices.map((i) => allCards[i]);
      onConfirm(keptCards);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-coup-surface/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <h2 className="text-3xl font-serif text-coup-text-primary mb-2 tracking-widest">
                EXCHANGE
              </h2>
              <p className="text-coup-text-secondary font-sans text-sm">
                Select exactly <span className="text-coup-primary font-bold">{keepCount}</span> cards to keep
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center mb-8">
                {allCards.map((character, index) => {
                  const isSelected = selectedIndices.includes(index);
                  return (
                    <motion.div
                      key={index}
                      onClick={() => toggleCard(index)}
                      className="relative cursor-pointer"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CharacterCard
                        character={character}
                        revealed={false}
                        size="small"
                      />
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-coup-primary flex items-center justify-center shadow-lg border-2 border-coup-surface"
                          >
                            <Check className="w-5 h-5 text-black" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className={`absolute inset-0 rounded-xl border-2 transition-colors pointer-events-none ${
                        isSelected ? 'border-coup-primary' : 'border-transparent'
                      }`} />
                    </motion.div>
                  );
                })}
              </div>

              <Stack gap="md">
                <button
                  disabled={selectedIndices.length !== keepCount}
                  onClick={handleConfirm}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                    selectedIndices.length === keepCount
                      ? 'bg-coup-primary text-black shadow-lg shadow-coup-primary/20'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Confirm Selection
                </button>
              </Stack>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
