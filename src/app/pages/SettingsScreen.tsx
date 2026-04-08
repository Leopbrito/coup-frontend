import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Volume2, VolumeX, Vibrate, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';

export function SettingsScreen() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <PageContainer>
      {/* Premium Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[120px] bg-coup-primary"
        />
      </div>

      <ContentWrapper>
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" className="mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg text-coup-text-secondary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl ml-4 font-serif text-coup-text-primary">
              Settings
            </h1>
          </div>
        </Stack>

        {/* Content */}
        <div className="flex-1 pb-6 w-full">
          <Stack gap="md">
            {/* Sound */}
            <motion.div
              className="rounded-2xl p-5 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${soundEnabled ? 'bg-coup-primary/10' : 'bg-black/20'}`}>
                    {soundEnabled ? (
                      <Volume2 className="w-6 h-6 text-coup-primary" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-coup-text-secondary/50" />
                    )}
                  </div>
                  <Stack gap="xs" direction="vertical">
                    <div className="font-semibold tracking-wide font-sans text-coup-text-primary leading-tight">
                      Sound Effects
                    </div>
                    <div className="text-sm font-sans text-coup-text-secondary/80">
                      Enable game sounds
                    </div>
                  </Stack>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${soundEnabled ? 'bg-coup-primary shadow-[0_0_15px_rgba(212,169,75,0.4)]' : 'bg-black/50 border border-white/10'}`}
                >
                  <motion.div
                    className="absolute w-6 h-6 rounded-full top-[3px] bg-white shadow-md"
                    animate={{ left: soundEnabled ? '28px' : '3px' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>

            {/* Vibration */}
            <motion.div
              className="rounded-2xl p-5 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.1 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${vibrationEnabled ? 'bg-coup-primary/10' : 'bg-black/20'}`}>
                    <Vibrate className={`w-6 h-6 ${vibrationEnabled ? 'text-coup-primary' : 'text-coup-text-secondary/50'}`} />
                  </div>
                  <Stack gap="xs" direction="vertical">
                    <div className="font-semibold tracking-wide font-sans text-coup-text-primary leading-tight">
                      Haptic Feedback
                    </div>
                    <div className="text-sm font-sans text-coup-text-secondary/80">
                      Vibrate on actions
                    </div>
                  </Stack>
                </div>
                <button
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${vibrationEnabled ? 'bg-coup-primary shadow-[0_0_15px_rgba(212,169,75,0.4)]' : 'bg-black/50 border border-white/10'}`}
                >
                  <motion.div
                    className="absolute w-6 h-6 rounded-full top-[3px] bg-white shadow-md"
                    animate={{ left: vibrationEnabled ? '28px' : '3px' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>

            {/* Dark Mode */}
            <motion.div
              className="rounded-2xl p-5 bg-coup-surface/40 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.2 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-coup-primary/10">
                    {darkMode ? (
                      <Moon className="w-6 h-6 text-coup-primary" />
                    ) : (
                      <Sun className="w-6 h-6 text-coup-primary" />
                    )}
                  </div>
                  <Stack gap="xs" direction="vertical">
                    <div className="font-semibold tracking-wide font-sans text-coup-text-primary leading-tight">
                      Dark Mode
                    </div>
                    <div className="text-sm font-sans text-coup-text-secondary/80">
                      Always enabled
                    </div>
                  </Stack>
                </div>
                <div className="w-14 h-8 rounded-full relative bg-coup-primary/30 opacity-70 border border-white/5 cursor-not-allowed">
                  <div className="absolute w-6 h-6 rounded-full top-[3px] left-[28px] bg-white opacity-50" />
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              className="rounded-2xl p-8 text-center bg-transparent mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: 0.3 }}
            >
              <h2 className="text-3xl mb-2 tracking-[0.2em] font-serif text-coup-primary" style={{ textShadow: '0 0 15px rgba(212,169,75,0.3)' }}>
                COUP
              </h2>
              <p className="text-sm mb-1 font-sans text-coup-text-secondary opacity-70">
                Version 1.0.0
              </p>
              <p className="text-xs font-sans text-coup-text-secondary/50">
                A game of deception and influence
              </p>
            </motion.div>
          </Stack>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}
