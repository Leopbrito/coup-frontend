import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Player } from '../types/game';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';
import { gameApi } from '../services/gameApi';

export function CreateRoomScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [includeInquisitor, setIncludeInquisitor] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  const { setRoomCode: setStoreRoomCode, setCurrentUserId, setPlayers } = useGameStore();

  const handleCreateRoom = async () => {
    if (!username.trim()) return;

    const userId = Math.random().toString(36).substring(2, 15);

    const hostPlayer: Player = {
      id: userId,
      username: username.trim(),
      coins: 2,
      influences: [],
      isAlive: true,
      isHost: true,
      isReady: false,
      isConnected: true,
    };

    try {
      const room = await gameApi.createRoom(hostPlayer, {
        maxPlayers,
        includeInquisitor,
      });

      setRoomCode(room.code);
      setStoreRoomCode(room.code);
      setCurrentUserId(userId);
      setPlayers(room.players);
      
      // Join the websocket room
      const { socket } = await import('../services/socket');
      socket.emit('room:join', { roomCode: room.code, player: hostPlayer });
      
      setRoomCreated(true);

      // Navigate to lobby after a short delay
      setTimeout(() => {
        navigate('/lobby');
      }, 2000);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer>
      {/* Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-80 h-80 rounded-full blur-[100px] bg-coup-primary"
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
              Create Room
            </h1>
          </div>
        </Stack>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          {!roomCreated ? (
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
                    className="w-full px-5 py-4 rounded-xl outline-none bg-black/20 backdrop-blur-sm border border-white/5 text-coup-text-primary focus:border-coup-primary/50 focus:bg-black/30 focus:shadow-[0_0_20px_rgba(212,169,75,0.15)] transition-all"
                    maxLength={20}
                  />
                </Stack>

                {/* Settings */}
                <Stack gap="md">
                  <label className="text-coup-text-primary/70 tracking-wide font-sans font-medium uppercase text-xs">
                    Room Settings
                  </label>

                  {/* Max Players */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-sans tracking-wide text-coup-text-primary">
                        Max Players: <span className="text-coup-primary font-semibold">{maxPlayers}</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="w-full accent-coup-primary cursor-pointer hover:accent-coup-primary-hover transition-colors"
                    />
                  </div>

                  {/* Include Inquisitor */}
                  <div className="flex items-center justify-between p-5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                    <Stack gap="xs">
                      <div className="font-medium font-sans tracking-wide text-coup-text-primary">
                        Include Inquisitor
                      </div>
                      <div className="text-sm font-sans text-coup-text-secondary">
                        Replaces Ambassador
                      </div>
                    </Stack>
                    <button
                      onClick={() => setIncludeInquisitor(!includeInquisitor)}
                      className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${includeInquisitor ? 'bg-coup-primary shadow-[0_0_15px_rgba(212,169,75,0.4)]' : 'bg-black/50 border border-white/10'}`}
                    >
                      <motion.div
                        className="absolute w-6 h-6 rounded-full top-[3px] bg-white shadow-md"
                        animate={{ left: includeInquisitor ? '28px' : '3px' }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </Stack>

                {/* Create Button */}
                <motion.button
                  className={`w-full py-5 rounded-xl font-sans tracking-wide shadow-xl font-semibold overflow-hidden relative group text-coup-bg ${
                    username.trim() ? 'bg-gradient-to-br from-coup-primary to-coup-primary-hover' : 'bg-black/30 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                  whileHover={username.trim() ? { scale: 1.02 } : {}}
                  whileTap={username.trim() ? { scale: 0.98 } : {}}
                  onClick={handleCreateRoom}
                  disabled={!username.trim()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Create Room
                </motion.button>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              className="rounded-2xl p-8 text-center bg-coup-surface/60 backdrop-blur-xl border border-coup-primary/30 shadow-[0_0_30px_rgba(212,169,75,0.15)] relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coup-primary/50 to-transparent" />
              
              <Stack gap="lg" className="relative z-10">
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-coup-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Check className="w-10 h-10 text-coup-bg" />
                </motion.div>

                <Stack gap="xs">
                  <h2 className="text-2xl font-serif text-coup-text-primary">
                    Room Created!
                  </h2>
                  <p className="font-sans text-coup-text-secondary">
                    Share this code with your friends
                  </p>
                </Stack>

                <div className="p-8 rounded-xl bg-black/30 backdrop-blur-md border border-white/5 shadow-inner">
                  <Stack gap="md">
                    <div className="text-5xl tracking-[0.2em] font-serif text-coup-primary" style={{ textShadow: '0 0 20px rgba(212,169,75,0.3)' }}>
                      {roomCode}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-sans tracking-wide w-full font-medium ${
                        copied ? 'bg-coup-accent-success/20 text-coup-accent-success border border-coup-accent-success/50' : 'bg-coup-primary/10 text-coup-primary border border-coup-primary/30 hover:bg-coup-primary/20 hover:border-coup-primary/50'
                      } transition-all`}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </Stack>
                </div>
              </Stack>
            </motion.div>
          )}
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}
