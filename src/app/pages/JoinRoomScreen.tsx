import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Player } from '../types/game';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';

export function JoinRoomScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const { setRoomCode: setStoreRoomCode, setCurrentUserId, addPlayer } = useGameStore();

  const handleJoinRoom = () => {
    if (!username.trim() || !roomCode.trim()) return;

    const userId = Math.random().toString(36).substring(2, 15);

    const player: Player = {
      id: userId,
      username: username.trim(),
      coins: 2,
      influences: [],
      isAlive: true,
      isHost: false,
      isReady: false,
      isConnected: true,
    };

    setStoreRoomCode(roomCode.toUpperCase());
    setCurrentUserId(userId);
    addPlayer(player);

    navigate('/lobby');
  };

  return (
    <PageContainer>
      {/* Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[100px] bg-coup-accent-info"
        />
      </div>

      <ContentWrapper>
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg text-coup-text-secondary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl ml-4 font-serif text-coup-text-primary">
              Join Room
            </h1>
          </div>
        </Stack>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            className="rounded-2xl p-6 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Internal Glass Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <Stack gap="lg" className="relative z-10">
              {/* Username */}
              <Stack gap="sm">
                <label className="text-coup-text-primary/70 tracking-wide font-sans font-medium uppercase text-xs">
                  Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-xl outline-none bg-black/20 backdrop-blur-sm border border-white/5 text-coup-text-primary focus:border-coup-accent-info/50 focus:bg-black/30 focus:shadow-[0_0_20px_rgba(72,165,194,0.15)] transition-all"
                  maxLength={20}
                />
              </Stack>

              {/* Room Code */}
              <Stack gap="sm">
                <label className="text-coup-text-primary/70 tracking-wide font-sans font-medium uppercase text-xs">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ENTER 6 DIGITS"
                  className="w-full px-5 py-4 rounded-xl outline-none tracking-[0.2em] text-center text-2xl font-serif text-coup-accent-info bg-black/20 backdrop-blur-sm border border-white/5 focus:border-coup-accent-info/50 focus:bg-black/30 focus:shadow-[0_0_20px_rgba(72,165,194,0.15)] transition-all placeholder:text-coup-text-secondary/30 placeholder:text-xl placeholder:tracking-normal"
                  maxLength={6}
                />
              </Stack>

              {/* Join Button */}
              <motion.button
                className={`w-full py-5 rounded-xl font-sans tracking-wide shadow-xl font-semibold overflow-hidden relative group text-coup-bg ${
                  username.trim() && roomCode.trim().length === 6 ? 'bg-gradient-to-br from-coup-accent-info to-coup-captain shadow-[0_0_20px_rgba(72,165,194,0.3)]' : 'bg-black/30 text-white/30 cursor-not-allowed border border-white/5'
                }`}
                whileHover={username.trim() && roomCode.trim().length === 6 ? { scale: 1.02 } : {}}
                whileTap={username.trim() && roomCode.trim().length === 6 ? { scale: 0.98 } : {}}
                onClick={handleJoinRoom}
                disabled={!username.trim() || roomCode.trim().length !== 6}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                Join Room
              </motion.button>
            </Stack>
          </motion.div>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}
