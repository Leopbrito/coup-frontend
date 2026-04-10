import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Plus, LogIn, BookOpen, Settings } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentWrapper } from '../components/layout/ContentWrapper';
import { Stack } from '../components/layout/Stack';

export function HomeScreen() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Plus, label: 'Create Room', path: '/create', color: 'var(--coup-primary)' },
    { icon: LogIn, label: 'Join Room', path: '/join', color: 'var(--coup-accent-info)' },
    { icon: BookOpen, label: 'Rules', path: '/rules', color: 'var(--coup-accent-success)' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'var(--coup-text-secondary)' },
  ];

  return (
    <PageContainer>
      {/* Background decoration with animated organic glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-96 h-96 rounded-full blur-[100px] bg-coup-primary"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-10 w-[30rem] h-[30rem] rounded-full blur-[120px] bg-coup-accent-info"
        />
      </div>

      {/* Content */}
      <ContentWrapper className="justify-center py-6">
        {/* Logo */}
        <motion.div
          className="text-center mb-16 short:mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1
            className="text-7xl mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-coup-primary/80 tracking-widest"
            style={{ textShadow: '0 4px 30px rgba(212, 169, 75, 0.5)' }}
          >
            COUP
          </h1>
          <p className="text-xl font-sans tracking-wide text-coup-text-secondary">
            The game of deception and influence
          </p>
        </motion.div>

        {/* Menu */}
        <Stack gap="md" className="short:gap-sm">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              className="w-full py-5 px-6 short:py-3.5 rounded-2xl flex items-center gap-5 relative overflow-hidden group bg-coup-surface/40 backdrop-blur-md border border-white/5 shadow-xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                borderColor: `${item.color}40`,
                boxShadow: `0 10px 40px -10px ${item.color}40`
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(item.path)}
            >
              {/* Premium Glow Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${item.color}15 50%, transparent 100%)`,
                }}
              />

              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center relative z-10 shadow-inner"
                style={{ background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`, border: `1px solid ${item.color}30` }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>

              <span className="text-xl relative z-10 font-sans tracking-wide text-coup-text-primary">
                {item.label}
              </span>
            </motion.button>
          ))}
        </Stack>

        {/* Version */}
        <motion.div
          className="text-center mt-auto pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm font-sans text-coup-text-secondary">
            Version 1.0.0
          </p>
        </motion.div>
      </ContentWrapper>
    </PageContainer>
  );
}
