import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGameStore } from '../store/gameStore';
import { CharacterCard } from '../components/cards/CharacterCard';
import { PlayerBadge } from '../components/players/PlayerBadge';
import { CoinCounter } from '../components/ui/CoinCounter';
import { BottomSheet } from '../components/ui/BottomSheet';
import { ActionButton } from '../components/game/ActionButton';
import { ChallengeModal } from '../components/modals/ChallengeModal';
import { ActionType, CharacterType, GamePhase } from '../types/game';
import { ACTIONS } from '../constants/game';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';
import { Section } from '../components/layout/Section';

export function GameScreen() {
  const navigate = useNavigate();
  const {
    phase,
    players,
    currentPlayerId,
    currentUserId,
    pendingAction,
    winner,
    performAction,
    respondToAction,
    revealInfluence,
  } = useGameStore();

  // Navigate to end screen when game ends
  useEffect(() => {
    if (phase === GamePhase.ENDED && winner) {
      setTimeout(() => {
        navigate('/end');
      }, 2000);
    }
  }, [phase, winner, navigate]);

  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [revealingCard, setRevealingCard] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentUserId);
  const isMyTurn = currentPlayerId === currentUserId;
  const activePlayer = players.find((p) => p.id === currentPlayerId);

  const availableActions = Object.values(ActionType).filter((action) => {
    const actionData = ACTIONS[action];
    if (!currentPlayer) return false;
    if (actionData.cost > currentPlayer.coins) return false;
    if (actionData.requiresTarget && players.filter((p) => p.isAlive && p.id !== currentUserId).length === 0)
      return false;
    return true;
  });

  const handleActionSelect = (action: ActionType) => {
    const actionData = ACTIONS[action];
    
    if (actionData.requiresTarget) {
      setSelectedAction(action);
    } else {
      performAction({
        type: action,
        actorId: currentUserId!,
        claimedCharacter: actionData.requiredCharacter || undefined,
        cost: actionData.cost,
      });
      setShowChallengeModal(true);
    }
  };

  const handleTargetSelect = (targetId: string) => {
    if (!selectedAction) return;

    const actionData = ACTIONS[selectedAction];
    performAction({
      type: selectedAction,
      actorId: currentUserId!,
      targetId,
      claimedCharacter: actionData.requiredCharacter || undefined,
      cost: actionData.cost,
    });
    setSelectedAction(null);
    setShowChallengeModal(true);
  };

  const handleRevealCard = (index: number) => {
    if (currentUserId) {
      revealInfluence(currentUserId, index);
      setRevealingCard(false);
    }
  };

  return (
    <PageContainer>
      {/* Premium In-Game Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] bg-coup-primary"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full blur-[80px] bg-coup-accent-danger"
        />
      </div>

      <ContentWrapper>
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" className="py-4">
          <button
            onClick={() => navigate('/lobby')}
            className="p-2 rounded-xl text-coup-text-secondary/70 hover:bg-white/5 hover:text-coup-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <Stack direction="horizontal" gap="sm" align="center" className="bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 rounded-xl shadow-inner">
            <div className="text-xs uppercase tracking-wider text-coup-text-secondary/80 font-sans font-semibold">
              Treasury
            </div>
            <CoinCounter count={50} size="medium" />
          </Stack>
        </Stack>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col pb-4">
          {/* Other Players */}
          <Stack gap="sm" className="mb-4">
          {players
            .filter((p) => p.id !== currentUserId)
            .map((player) => (
              <motion.div
                key={player.id}
                onClick={selectedAction ? () => handleTargetSelect(player.id) : undefined}
                style={{
                  cursor: selectedAction && player.isAlive ? 'pointer' : 'default',
                }}
              >
                <PlayerBadge player={player} isCurrentTurn={player.id === currentPlayerId} />
              </motion.div>
            ))}
          </Stack>

          {/* Center Info */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center w-full max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                {selectedAction ? (
                  <motion.div
                    key="select-target"
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="p-6 rounded-2xl bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <h2 className="text-2xl mb-2 font-serif text-coup-text-primary tracking-wide">
                      Select Target
                    </h2>
                    <p className="text-coup-text-secondary/80 font-sans text-sm mb-6">
                      {ACTIONS[selectedAction].description}
                    </p>
                    <button
                      onClick={() => setSelectedAction(null)}
                      className="w-full px-6 py-3 rounded-xl bg-black/40 text-coup-text-primary/70 font-sans hover:bg-black/60 transition-colors border border-white/5"
                    >
                      Cancel Action
                    </button>
                  </motion.div>
                ) : isMyTurn ? (
                  <motion.div
                    key="your-turn"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <h2 className="text-4xl mb-3 font-serif text-coup-primary tracking-widest drop-shadow-[0_0_15px_rgba(212,169,75,0.4)]">
                      YOUR TURN
                    </h2>
                    <p className="font-sans text-sm tracking-wide uppercase text-coup-text-secondary/70">
                      Choose an action to plot
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="their-turn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-2xl mb-2 font-serif text-coup-text-primary/70">
                      <span className="text-white">{activePlayer?.username}'s</span> Turn
                    </h2>
                    <p className="font-sans text-sm text-coup-text-secondary/50">
                      Waiting for their move...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Your Cards */}
          {currentPlayer && (
            <Section withSurface={false} className="mb-4">
              <div className="text-sm text-center text-coup-text-secondary font-sans mb-1">
                Your Influences
              </div>
              <Stack direction="horizontal" justify="center" gap="md">
                {currentPlayer.influences.map((influence, index) => (
                  <CharacterCard
                    key={index}
                    character={influence.character}
                    revealed={influence.revealed}
                    size="medium"
                    onClick={revealingCard && !influence.revealed ? () => handleRevealCard(index) : undefined}
                  />
                ))}
              </Stack>
              <div className="flex justify-center mt-2">
                <CoinCounter count={currentPlayer.coins} size="large" />
              </div>
            </Section>
          )}

          {/* Action Panel (Drawer Mobile Premium) */}
          <BottomSheet
            isVisible={isMyTurn && !selectedAction}
            headerTitle="YOUR TURN"
            headerSubtitle="Swipe up to view actions"
          >
            <Stack gap="sm">
              {availableActions.map((action, index) => (
                <motion.div
                  key={action}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ActionButton action={action} onClick={() => handleActionSelect(action)} />
                </motion.div>
              ))}
            </Stack>
          </BottomSheet>
        </div>
      </ContentWrapper>

      {/* Challenge Modal */}
      {pendingAction && activePlayer && (
        <ChallengeModal
          isOpen={showChallengeModal}
          actor={activePlayer}
          claimedCharacter={pendingAction.action.claimedCharacter || CharacterType.DUKE}
          currentPlayerId={currentUserId || ''}
          canRespond={currentUserId !== pendingAction.action.actorId}
          onAllow={() => {
            if (currentUserId) {
              respondToAction(currentUserId, 'allow');
              setShowChallengeModal(false);
            }
          }}
          onChallenge={() => {
            if (currentUserId) {
              respondToAction(currentUserId, 'challenge');
              setShowChallengeModal(false);
            }
          }}
        />
      )}
    </PageContainer>
  );
}