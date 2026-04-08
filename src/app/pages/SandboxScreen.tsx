import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';
import { IS_TEST_MODE } from '../../config/env';

// Components to showcase
import { CharacterCard } from '../components/cards/CharacterCard';
import { CharacterType } from '../types/game';
import { CoinCounter } from '../components/ui/CoinCounter';
import { ActionButton } from '../components/game/ActionButton';
import { ActionType } from '../types/game';
import { ChallengeModal } from '../components/modals/ChallengeModal';
import { PlayerBadge } from '../components/players/PlayerBadge';

export function SandboxScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!IS_TEST_MODE) {
      navigate('/home');
    }
  }, [navigate]);

  if (!IS_TEST_MODE) return null;

  return (
    <PageContainer>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-coup-primary" />
      </div>

      <ContentWrapper className="py-6 pb-24">
        <Stack direction="horizontal" justify="between" align="center" className="mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-xl bg-black/20 text-coup-text-secondary hover:bg-black/40 transition-colors border border-white/5"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-serif text-coup-primary tracking-widest uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Component Library
            </h1>
          </div>
        </Stack>

        <Stack gap="xl">
          {/* Section: Cards */}
          <motion.div className="rounded-3xl p-6 bg-coup-surface/30 backdrop-blur-md border border-white/5 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest uppercase text-coup-text-secondary mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Character Cards
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <CharacterCard character={CharacterType.DUKE} revealed={false} size="medium" />
              <CharacterCard character={CharacterType.ASSASSIN} revealed={false} size="medium" />
              <CharacterCard character={CharacterType.CAPTAIN} revealed={true} size="medium" />
              <CharacterCard character={CharacterType.CONTESSA} revealed={true} size="medium" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
               <CharacterCard character={CharacterType.AMBASSADOR} revealed={false} size="large" />
               <div className="flex items-center justify-center">
                 <span className="text-sm text-coup-text-secondary">Large Size Card</span>
               </div>
            </div>
          </motion.div>

          {/* Section: Badges & Coins */}
          <motion.div className="rounded-3xl p-6 bg-coup-surface/30 backdrop-blur-md border border-white/5 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest uppercase text-coup-text-secondary mb-6">
              Indicators (Badges & Econ)
            </h2>
            <div className="flex flex-col gap-6">
              <PlayerBadge 
                player={{ id: '1', username: 'Normal Player', coins: 2, influences: [{}, {}] as any, isAlive: true, isHost: false, isReady: true, isConnected: true }} 
              />
              <PlayerBadge 
                player={{ id: '2', username: 'Current Turn Player', coins: 7, influences: [{revealed: false}, {revealed: true}] as any, isAlive: true, isHost: true, isReady: true, isConnected: true }} 
                isCurrentTurn={true}
              />
              <PlayerBadge 
                player={{ id: '3', username: 'Dead Player', coins: 0, influences: [{revealed: true}, {revealed: true}] as any, isAlive: false, isHost: false, isReady: true, isConnected: true }} 
              />
              
              <div className="flex gap-4 mt-4">
                <CoinCounter count={2} size="small" />
                <CoinCounter count={7} size="medium" />
                <CoinCounter count={10} size="large" />
              </div>
            </div>
          </motion.div>

          {/* Section: Action Buttons */}
          <motion.div className="rounded-3xl p-6 bg-coup-surface/30 backdrop-blur-md border border-white/5 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest uppercase text-coup-text-secondary mb-6">
              Action Buttons
            </h2>
            <div className="flex flex-col gap-3 max-w-sm">
               <ActionButton action={ActionType.INCOME} onClick={() => {}} />
               <ActionButton action={ActionType.FOREIGN_AID} onClick={() => {}} />
               <ActionButton action={ActionType.TAX} onClick={() => {}} />
               <ActionButton action={ActionType.ASSASSINATE} onClick={() => {}} />
            </div>
          </motion.div>

          {/* Section: Modals */}
          <motion.div className="rounded-3xl p-6 bg-coup-surface/30 backdrop-blur-md border border-white/5 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest uppercase text-coup-text-secondary mb-6">
              Modals & Overlays
            </h2>
            <button 
              onClick={() => setShowModal(true)}
              className="py-3 px-6 bg-coup-primary text-coup-bg rounded-xl font-bold hover:bg-coup-primary-hover shadow-[0_0_15px_rgba(212,169,75,0.4)]"
            >
              Open Challenge Modal
            </button>
          </motion.div>
        </Stack>

        {/* Modal Injector */}
        <ChallengeModal 
          isOpen={showModal}
          actor={{ id: '2', username: 'Enemy Bot', coins: 0, influences: [], isAlive: true, isHost: false, isReady: true, isConnected: true }}
          claimedCharacter={CharacterType.DUKE}
          currentPlayerId="1"
          canRespond={true}
          onAllow={() => setShowModal(false)}
          onChallenge={() => setShowModal(false)}
        />
      </ContentWrapper>
    </PageContainer>
  );
}
