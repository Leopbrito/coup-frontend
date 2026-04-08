import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Wrench, X, Navigation, Database, Users, ShieldAlert } from 'lucide-react';
import { useMockGameStore } from '../../store/mockGameStore';

export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nav' | 'state' | 'players'>('nav');
  
  const { applyPreset, players, currentUserId, updatePlayer } = useMockGameStore();

  const handleApplyPreset = (preset: Parameters<typeof applyPreset>[0]) => {
    applyPreset(preset);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] w-12 h-12 rounded-full bg-coup-accent-danger text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,53,69,0.5)] hover:bg-red-500 transition-colors"
      >
        <Wrench className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-black/80 backdrop-blur-3xl border-r border-white/10 z-[10000] p-5 shadow-2xl flex flex-col font-sans overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-widest text-[#FF4C4C] uppercase text-shadow-glow">
                Coup HUD
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('nav')}
                className={`flex-1 py-2 rounded flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-wider ${activeTab === 'nav' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}
              >
                <Navigation className="w-4 h-4" /> Nav
              </button>
              <button 
                onClick={() => setActiveTab('state')}
                className={`flex-1 py-2 rounded flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-wider ${activeTab === 'state' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}
              >
                <Database className="w-4 h-4" /> States
              </button>
            </div>

            {/* Tab: Nav */}
            {activeTab === 'nav' && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/40 uppercase mb-2">Warp Links</span>
                <Link to="/" className="py-2 px-3 bg-white/5 rounded text-white text-sm hover:bg-white/10">Home Screen</Link>
                <Link to="/lobby" className="py-2 px-3 bg-white/5 rounded text-white text-sm hover:bg-white/10">Lobby Screen</Link>
                <Link to="/deal" className="py-2 px-3 bg-white/5 rounded text-white text-sm hover:bg-white/10">Initial Deal</Link>
                <Link to="/game" className="py-2 px-3 bg-white/5 rounded text-white text-sm hover:bg-white/10">Game Screen</Link>
                <Link to="/rules" className="py-2 px-3 bg-white/5 rounded text-white text-sm hover:bg-white/10">Rules Screen</Link>
                <Link to="/sandbox" className="py-2 px-3 bg-white/5 w-full rounded border border-[#FF4C4C]/50 text-[#FF4C4C] text-sm hover:bg-[#FF4C4C]/20 text-center font-bold mt-4 shadow-[0_0_10px_rgba(255,76,76,0.2)]">
                  Library (Isolates)
                </Link>
              </div>
            )}

            {/* Tab: State */}
            {activeTab === 'state' && (
              <div className="flex flex-col gap-3">
                <span className="text-xs text-white/40 uppercase mb-1">Inject Scenarios</span>
                
                <button onClick={() => handleApplyPreset('my_turn')} className="py-2 px-3 bg-blue-500/20 text-blue-300 rounded text-sm text-left hover:bg-blue-500/30 flex items-center justify-between border border-blue-500/30">
                  Your Turn <span>→</span>
                </button>
                <button onClick={() => handleApplyPreset('enemy_turn')} className="py-2 px-3 bg-purple-500/20 text-purple-300 rounded text-sm text-left hover:bg-purple-500/30 flex items-center justify-between border border-purple-500/30">
                  Enemy Turn <span>→</span>
                </button>
                <button onClick={() => handleApplyPreset('coup_ready')} className="py-2 px-3 bg-green-500/20 text-green-300 rounded text-sm text-left hover:bg-green-500/30 flex items-center justify-between border border-green-500/30">
                  Coup Ready (7+ Coins) <span>→</span>
                </button>
                <button onClick={() => handleApplyPreset('challenged')} className="py-2 px-3 bg-red-500/20 text-red-300 rounded text-sm text-left hover:bg-red-500/30 flex items-center justify-between border border-red-500/30">
                  Under Challenge <span>→</span>
                </button>
                <button onClick={() => handleApplyPreset('killed_player')} className="py-2 px-3 bg-gray-500/20 text-gray-300 rounded text-sm text-left hover:bg-gray-500/30 flex items-center justify-between border border-gray-500/30">
                  Kill Player 1 <span>→</span>
                </button>

                <div className="h-px bg-white/10 my-4" />
                
                <span className="text-xs text-white/40 uppercase mb-2">Economy</span>
                {players.map(p => (
                  <div key={p.id} className="p-3 bg-black/40 rounded border border-white/5 flex flex-col gap-2">
                    <span className="text-white/80 text-xs font-bold">{p.username} {p.id === currentUserId ? '(You)' : ''}</span>
                    <div className="flex gap-2">
                      <button onClick={() => updatePlayer(p.id, { coins: p.coins + 1 })} className="flex-1 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20">+ Coin</button>
                      <button onClick={() => updatePlayer(p.id, { coins: Math.max(0, p.coins - 1) })} className="flex-1 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20">- Coin</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
