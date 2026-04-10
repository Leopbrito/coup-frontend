import { animate, AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { ReactNode, useEffect, useState } from 'react';

interface BottomSheetProps {
  isVisible: boolean; // Controla se o drawer existe na tela (ex: turno ativo)
  children: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  onExpandToggle?: (expanded: boolean) => void;
}

export function BottomSheet({ isVisible, children, headerTitle = "Actions", headerSubtitle = "Swipe up to open", onExpandToggle }: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Para resolver o bug do framer-motion com drag e calc()
  // Utilizamo motionValues brutos em vez de variants string-based.
  const y = useMotionValue(0);
  const collapseOffset = typeof window !== 'undefined' ? (window.innerHeight * 0.75) - 100 : 500;

  // Escurecendo o fundo proporcionalmente com base ao rastro do drag
  const backdropOpacity = useTransform(y, [0, collapseOffset], [1, 0]);

  useEffect(() => {
    if (isVisible) {
      setIsExpanded(false);
      animate(y, collapseOffset, { type: 'spring', damping: 25, stiffness: 300 });
    }
  }, [isVisible, y, collapseOffset]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;
    
    // Analisar direção: info.offset.y positivo = para baixo
    const shouldClose = 
      info.velocity.y > velocityThreshold || 
      (info.offset.y > swipeThreshold && !isExpanded) ||
      (info.offset.y > swipeThreshold * 2);

    const shouldExpand = 
      info.velocity.y < -velocityThreshold || 
      (info.offset.y < -swipeThreshold && isExpanded) ||
      (info.offset.y < -swipeThreshold * 2);

    if (shouldClose) {
      setIsExpanded(false);
      animate(y, collapseOffset, { type: 'spring', damping: 25, stiffness: 300 });
      onExpandToggle?.(false);
    } else if (shouldExpand) {
      setIsExpanded(true);
      animate(y, 0, { type: 'spring', damping: 25, stiffness: 300 });
      onExpandToggle?.(true);
    } else {
      // Retorna para o estado natural se largar no meio
      animate(y, isExpanded ? 0 : collapseOffset, { type: 'spring', damping: 25, stiffness: 300 });
    }
  };

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    animate(y, newState ? 0 : collapseOffset, { type: 'spring', damping: 25, stiffness: 300 });
    onExpandToggle?.(newState);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop Escurecido - Aparece apenas quando expandido */}
          <motion.div
            initial={{ opacity: 0 }}
            style={{ opacity: backdropOpacity }}
            onClick={() => isExpanded && toggleExpand()}
            className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
          />

          {/* O Drawer Em Si */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: collapseOffset }}
            dragElastic={0.1} // Resistência física leve ao puxar limites
            onDragEnd={handleDragEnd}
            style={{ y }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.3 } }}
            className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col h-[75vh] will-change-transform"
          >
            {/* Handle & Header (Touchable Area) */}
            <div 
               onClick={toggleExpand}
               className="h-[100px] shrink-0 bg-coup-surface/90 backdrop-blur-2xl border-t border-x border-white/5 rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col items-center justify-start pt-3 relative overflow-hidden"
            >
              {/* O Gradiente "Fade" interno mostrando que há conteúdo embaixo se não estiver expandido */}
              {!isExpanded && <div className="absolute top-[80px] left-0 right-0 h-4 bg-gradient-to-t from-transparent to-coup-surface/5" />}

              <div className="w-12 h-1.5 bg-white/20 rounded-full mb-3" />
              <h3 className="font-serif text-coup-primary text-xl tracking-widest uppercase drop-shadow-md">
                {headerTitle}
              </h3>
              <p className="font-sans text-xs text-coup-text-secondary/70 uppercase tracking-widest mt-1">
                {isExpanded ? 'Swipe down to close' : headerSubtitle}
              </p>
            </div>

            {/* Conteúdo Expansível (Cards) */}
            <div className="flex-1 overflow-y-auto hide-scrollbar scroll-fade bg-coup-surface/95 backdrop-blur-3xl px-6 pb-12 pt-2 shadow-inner overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
