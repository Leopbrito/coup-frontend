import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Coins, Users, Shield, Eye, Skull } from 'lucide-react';
import { CHARACTERS, ACTIONS } from '../constants/game';
import { CharacterType, ActionType } from '../types/game';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';

export function RulesScreen() {
  const navigate = useNavigate();

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
          className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full blur-[100px] bg-coup-accent-danger"
        />
      </div>

      <ContentWrapper>
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" className="mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg text-coup-text-secondary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl ml-4 font-serif text-coup-text-primary">
              How to Play
            </h1>
          </div>
        </Stack>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto pb-6 w-full">
          <Stack gap="lg" className="mx-auto w-full">
            {/* Overview */}
            <motion.div
              className="rounded-2xl p-7 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coup-primary/30 to-transparent" />
              <h2 className="mb-4 font-serif text-coup-primary tracking-wide uppercase text-sm font-bold">
                Overview
              </h2>
              <p className="mb-4 font-sans text-coup-text-primary/90 leading-relaxed">
                Coup is a game of deception and manipulation. You are the head of a noble family in a corrupt Italian
                city-state. You must use influence and eliminate your rivals to become the sole power.
              </p>
              <ul className="space-y-3 font-sans text-coup-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-coup-primary mt-1">•</span>
                  <span>Each player starts with 2 influence cards (kept secret) and 2 coins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coup-primary mt-1">•</span>
                  <span>You can claim any character action, even if you don't have that card (bluff!)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coup-primary mt-1">•</span>
                  <span>Other players can challenge your claim or block your action</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coup-primary mt-1">•</span>
                  <span>Lose an influence when you lose a challenge or are successfully challenged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coup-primary mt-1">•</span>
                  <span>Last player with influence remaining wins</span>
                </li>
              </ul>
            </motion.div>

            {/* General Actions */}
            <motion.div
              className="rounded-2xl p-7 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.1 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="mb-6 font-serif text-coup-primary tracking-wide uppercase text-sm font-bold">
                General Actions
              </h2>
              <Stack gap="lg">
                <Stack gap="xs" className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-coup-primary/10">
                      <Coins className="w-5 h-5 text-coup-primary" />
                    </div>
                    <span className="font-semibold tracking-wide font-sans text-coup-text-primary">
                      Income
                    </span>
                  </div>
                  <p className="font-sans text-coup-text-secondary text-sm mt-1">
                    Take 1 coin from the treasury. <span className="text-white/60">Cannot be challenged or blocked.</span>
                  </p>
                </Stack>
                
                <Stack gap="xs" className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-coup-primary/10">
                      <Users className="w-5 h-5 text-coup-primary" />
                    </div>
                    <span className="font-semibold tracking-wide font-sans text-coup-text-primary">
                      Foreign Aid
                    </span>
                  </div>
                  <p className="font-sans text-coup-text-secondary text-sm mt-1">
                    Take 2 coins from the treasury. <span className="text-coup-duke/80">Can be blocked by Duke.</span>
                  </p>
                </Stack>

                <Stack gap="xs" className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-coup-accent-danger/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 rounded-lg bg-coup-accent-danger/10">
                      <Skull className="w-5 h-5 text-coup-accent-danger" />
                    </div>
                    <span className="font-semibold tracking-wide font-sans text-coup-text-primary">
                      Coup
                    </span>
                  </div>
                  <p className="font-sans text-coup-text-secondary text-sm mt-1 relative z-10">
                    Pay 7 coins to force a player to lose an influence. <span className="text-coup-accent-danger/80">Cannot be challenged or blocked.</span> Must coup if you have 10+ coins.
                  </p>
                </Stack>
              </Stack>
            </motion.div>

            {/* Characters */}
            <motion.div
              className="rounded-2xl p-7 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.2 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="mb-6 font-serif text-coup-primary tracking-wide uppercase text-sm font-bold">
                Characters
              </h2>
              <Stack gap="md">
                {Object.values(CharacterType).map((charType) => {
                  const char = CHARACTERS[charType];
                  return (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={charType}
                      className="p-5 rounded-xl shadow-inner relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${char.color}15 0%, ${char.secondaryColor}05 100%)`,
                        border: `1px solid ${char.color}30`,
                      }}
                    >
                      {/* Character glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-2xl" style={{ background: char.color }} />
                      
                      <div
                        className="font-bold letter-spacing tracking-wider uppercase mb-2 relative z-10"
                        style={{ color: char.color, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}
                      >
                        {char.name}
                      </div>
                      <p className="text-sm font-sans text-coup-text-secondary/90 leading-relaxed relative z-10">
                        {char.description}
                      </p>
                    </motion.div>
                  );
                })}
              </Stack>
            </motion.div>

            {/* Challenges */}
            <motion.div
              className="rounded-2xl p-7 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.3 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="mb-6 font-serif text-coup-primary tracking-wide uppercase text-sm font-bold">
                Challenges & Blocks
              </h2>
              <Stack gap="md">
                <Stack gap="sm" className="p-5 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-coup-accent-info" />
                    <span className="font-semibold tracking-wide font-sans text-coup-text-primary">
                      Challenge
                    </span>
                  </div>
                  <p className="font-sans text-coup-text-secondary text-sm leading-relaxed">
                    Call out another player's bluff. If they have the card, <span className="text-coup-accent-danger/80">you lose an influence</span>. If they don't, <span className="text-coup-accent-success/80">they lose an influence</span>.
                  </p>
                </Stack>
                <Stack gap="sm" className="p-5 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-coup-primary" />
                    <span className="font-semibold tracking-wide font-sans text-coup-text-primary">
                      Block
                    </span>
                  </div>
                  <p className="font-sans text-coup-text-secondary text-sm leading-relaxed">
                    Claim a character to block an action (can also be challenged).
                  </p>
                </Stack>
              </Stack>
            </motion.div>
          </Stack>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}
