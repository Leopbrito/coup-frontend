import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { CharacterCard } from '../components/cards/CharacterCard';
import { ActionButton } from '../components/game/ActionButton';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Stack } from '../components/layout/Stack';
import { ChallengeModal } from '../components/modals/ChallengeModal';
import { ExchangeModal } from '../components/modals/ExchangeModal';
import { InvestigateModal } from '../components/modals/InvestigateModal';
import { PlayerBadge } from '../components/players/PlayerBadge';
import { BottomSheet } from '../components/ui/BottomSheet';
import { CoinCounter } from '../components/ui/CoinCounter';
import { ACTIONS } from '../constants/game';
import { useGameStore } from '../store/gameStore';
import { ActionType, CharacterType, GamePhase } from '../types/game';

export function GameScreen() {
  const navigate = useNavigate();
  const {
    phase,
    players,
    currentPlayerId,
    currentUserId,
    pendingAction,
    revealingPlayerId,
    exchangeOptions,
    pendingInvestigation,
    treasury,
    winner,
    performAction,
    respondToAction,
    revealInfluence,
    exchangeCards,
    investigateDecision,
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

  const [isPeekingGlobal, setIsPeekingGlobal] = useState(false);
  const [peekingCardIndex, setPeekingCardIndex] = useState<number | null>(null);
  const [isPressing, setIsPressing] = useState<number | null>(null);
  
  // Refs for tap vs hold logic
  const pressTimerRef = useRef<any>(null);
  const isHoldRef = useRef(false);

  const currentPlayer = players.find((p) => p.id === currentUserId);
  const isMyTurn = currentPlayerId === currentUserId;
  const activePlayer = players.find((p) => p.id === currentPlayerId);

  // Derived visibility
  const hasResponded = pendingAction?.respondedPlayers.includes(currentUserId || '');
  const showChallengeModal = phase === GamePhase.RESPONSE && !!pendingAction && (isMyTurn || !hasResponded);
  const isRevealing = phase === GamePhase.REVEAL && revealingPlayerId === currentUserId;
  const isExchanging = phase === GamePhase.EXCHANGE && revealingPlayerId === currentUserId;
  const isInvestigating = phase === GamePhase.INVESTIGATE && revealingPlayerId === currentUserId;

  // Interaction Handlers
  const handleInfluencePointerDown = (index: number) => {
    if (isHoldRef.current) return;
    
    setIsPressing(index);
    isHoldRef.current = false;
    
    // Start hold timer
    pressTimerRef.current = setTimeout(() => {
      isHoldRef.current = true;
      setPeekingCardIndex(index);
    }, 250); // Threshold for hold
  };

  const handleInfluencePointerUp = (index: number, influence: any) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    setIsPressing(null);

    // If it wasn't a hold, it's a tap
    if (!isHoldRef.current) {
      if (isRevealing && !influence.revealed) {
        handleRevealCard(index);
      }
    }

    setPeekingCardIndex(null);
    isHoldRef.current = false;
  };

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
  };

  const handleRevealCard = (index: number) => {
    if (currentUserId) {
      revealInfluence(currentUserId, index);
    }
  };

  const handleExchangeConfirm = (keptCards: CharacterType[]) => {
    if (currentUserId) {
      exchangeCards(currentUserId, keptCards);
    }
  };

  const handleInvestigateDecision = (forceExchange: boolean) => {
    if (currentUserId) {
      investigateDecision(currentUserId, forceExchange);
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
        <Stack direction="horizontal" justify="between" align="center" className="py-4 short:py-2">
          <button
            onClick={() => navigate('/lobby')}
            className="p-2 rounded-xl text-coup-text-secondary/70 hover:bg-white/5 hover:text-coup-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6 short:w-5 short:h-5" />
          </button>

          <Stack direction="horizontal" gap="sm" align="center" className="bg-black/20 backdrop-blur-md border border-white/5 px-4 short:px-3 py-2 short:py-1.5 rounded-xl shadow-inner">
            <div className="text-xs uppercase tracking-wider text-coup-text-secondary/80 font-sans font-semibold">
              Treasury
            </div>
            <CoinCounter count={treasury} size="medium" />
          </Stack>
        </Stack>

        {/* Main Game Area */}
        <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${isMyTurn && !selectedAction ? 'pb-48 short:pb-40' : 'pb-4 short:pb-2'}`}>
          {/* Other Players */}
          <Stack gap="sm" className="mb-4 short:mb-2 overflow-y-auto hide-scrollbar max-h-[30%] shrink-0">
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
                    className="flex flex-col items-center"
                  >
                    <h2 className="text-2xl short:text-xl mb-2 short:mb-1 font-serif text-coup-text-primary/70">
                      <span className="text-white">{activePlayer?.username}'s</span> Turn
                    </h2>
                    <p className="font-sans text-sm short:text-xs text-coup-text-secondary/50">
                      Waiting for their move...
                    </p>
                  </motion.div>
                )}

                {/* Reveal Phase Overlay (Internal to Center Info for clean layout) */}
                {phase === GamePhase.REVEAL && (
                  <motion.div
                    key="reveal-instruction"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 short:mt-4 p-6 short:p-4 rounded-2xl bg-coup-accent-danger/10 border border-coup-accent-danger/30 backdrop-blur-md"
                  >
                    {isRevealing ? (
                      <>
                        <h2 className="text-2xl short:text-xl mb-2 short:mb-1 font-serif text-coup-accent-danger tracking-widest animate-pulse">
                          SACRIFICE REQUIRED
                        </h2>
                        <p className="text-coup-text-primary font-sans text-sm short:text-xs">
                          Select one of your influences to lose
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl short:text-lg mb-1 font-serif text-coup-text-primary/80">
                          Influence Theft
                        </h2>
                        <p className="text-coup-text-secondary font-sans text-sm short:text-xs">
                          {players.find(p => p.id === revealingPlayerId)?.username} is choosing...
                        </p>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Exchange Phase Overlay */}
                {phase === GamePhase.EXCHANGE && !isExchanging && (
                  <motion.div
                    key="exchange-waiting"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 p-6 rounded-2xl bg-coup-primary/10 border border-coup-primary/30 backdrop-blur-md"
                  >
                    <h2 className="text-xl mb-1 font-serif text-coup-text-primary/80 uppercase tracking-widest">
                      Bureaucracy
                    </h2>
                    <p className="text-coup-text-secondary font-sans text-sm">
                      {players.find(p => p.id === revealingPlayerId)?.username} is exchanging influences...
                    </p>
                  </motion.div>
                )}

                {/* Investigate Phase Overlay */}
                {phase === GamePhase.INVESTIGATE && !isInvestigating && (
                  <motion.div
                    key="investigate-waiting"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 p-6 rounded-2xl bg-coup-primary/10 border border-coup-primary/30 backdrop-blur-md"
                  >
                    <h2 className="text-xl mb-1 font-serif text-coup-text-primary/80 uppercase tracking-widest">
                      Interrogation
                    </h2>
                    <p className="text-coup-text-secondary font-sans text-sm">
                      {players.find(p => p.id === revealingPlayerId)?.username} is investigating someone...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Your Cards */}
          {currentPlayer && (
            <Section withSurface={false} className="mb-4 short:mb-1 relative shrink-0">
              {/* Privacy Backdrop Blur Overlay (Moved here to stay behind cards but above board) */}
              <AnimatePresence>
                {(isPeekingGlobal || peekingCardIndex !== null) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-md pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="text-[10px] short:text-[8px] text-center text-coup-text-secondary uppercase tracking-widest mb-1 relative z-[60] opacity-50">
                Your Influences
              </div>
              <Stack direction="horizontal" justify="center" gap="xl">
                {currentPlayer.influences.map((influence, index) => {
                  const isVisibleForMe = isPeekingGlobal || peekingCardIndex === index;
                  
                  return (
                    <motion.div
                      key={index}
                      className="relative z-[70]"
                      onPointerDown={() => !influence.revealed && handleInfluencePointerDown(index)}
                      onPointerUp={() => handleInfluencePointerUp(index, influence)}
                      onPointerLeave={() => {
                        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
                        setPeekingCardIndex(null);
                        setIsPressing(null);
                        isHoldRef.current = false;
                      }}
                      animate={isRevealing && !influence.revealed && isPressing === null ? { 
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CharacterCard
                        character={influence.character}
                        revealed={influence.revealed}
                        faceDown={!isVisibleForMe}
                        size="medium"
                      />
                      
                      {/* Interaction hint for peeking */}
                      {!influence.revealed && !isVisibleForMe && !isPeekingGlobal && (
                        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                           <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white/50 uppercase tracking-tighter">
                              Hold to peek
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </Stack>
              <div className="flex justify-center mt-4 relative">
                <CoinCounter count={currentPlayer.coins} size="large" />
                
                {/* Global Peek Button */}
                <button
                   className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-coup-surface/80 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-center text-coup-primary active:scale-90 transition-transform z-[100]"
                   onPointerDown={() => setIsPeekingGlobal(true)}
                   onPointerUp={() => setIsPeekingGlobal(false)}
                   onPointerLeave={() => setIsPeekingGlobal(false)}
                   aria-label="Peek Cards"
                >
                  {isPeekingGlobal ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
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
          canBeChallenged={ACTIONS[pendingAction.action.type].canBeChallenged}
          onAllow={() => {
            if (currentUserId) {
              respondToAction(currentUserId, 'allow');
            }
          }}
          onChallenge={() => {
            if (currentUserId) {
              respondToAction(currentUserId, 'challenge');
            }
          }}
        />
      )}

      {/* Exchange Modal */}
      {currentPlayer && (
        <ExchangeModal
          isOpen={isExchanging}
          options={exchangeOptions || []}
          currentInfluences={currentPlayer.influences.filter(i => !i.revealed).map(i => i.character)}
          keepCount={currentPlayer.influences.filter(i => !i.revealed).length}
          onConfirm={handleExchangeConfirm}
        />
      )}

      {/* Investigate Modal */}
      <InvestigateModal
        isOpen={isInvestigating}
        targetUsername={players.find(p => p.id === pendingInvestigation?.targetId)?.username || ''}
        character={pendingInvestigation?.character || null}
        onDecision={handleInvestigateDecision}
      />
    </PageContainer>
  );
}