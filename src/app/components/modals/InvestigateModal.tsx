import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterType } from '../../types/game';
import { CharacterCard } from '../cards/CharacterCard';
import { Stack } from '../layout/Stack';
import { Search, RotateCcw, ThumbsUp } from 'lucide-react';

interface InvestigateModalProps {
  isOpen: boolean;
  targetUsername: string;
  character: CharacterType | null;
  onDecision: (forceExchange: boolean) => void;
}

export const InvestigateModal: React.FC<InvestigateModalProps> = ({
  isOpen,
  targetUsername,
  character,
  onDecision,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-coup-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-coup-primary/10 to-transparent">
              <div className="w-16 h-16 rounded-full bg-coup-primary/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-coup-primary" />
              </div>
              <h2 className="text-3xl font-serif text-coup-text-primary mb-2 tracking-widest">
                INVESTIGATION
              </h2>
              <p className="text-coup-text-secondary font-sans text-sm">
                You are looking at <span className="text-white font-bold">{targetUsername}'s</span> influence
              </p>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="mb-10 relative">
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ perspective: 1000 }}
                >
                  {character ? (
                    <CharacterCard
                      character={character}
                      revealed={false}
                      size="large"
                    />
                  ) : (
                    <div className="w-48 h-72 rounded-xl bg-white/5 animate-pulse flex items-center justify-center border border-dashed border-white/20">
                      <p className="text-white/20 font-serif">Redacting...</p>
                    </div>
                  )}
                </motion.div>
                
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-coup-primary text-black text-[10px] font-bold uppercase tracking-tighter shadow-lg">
                  Target's Card
                </div>
              </div>

              <Stack gap="md" className="w-full">
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDecision(true)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-coup-accent-danger/20 border border-coup-accent-danger/40 text-coup-accent-danger hover:bg-coup-accent-danger/30 transition-all font-sans font-bold uppercase text-xs"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Force Exchange
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDecision(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-500 hover:bg-green-500/30 transition-all font-sans font-bold uppercase text-xs"
                  >
                    <ThumbsUp className="w-6 h-6" />
                    Allow to Keep
                  </motion.button>
                </div>
              </Stack>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
