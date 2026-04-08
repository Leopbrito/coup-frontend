import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--coup-bg)' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'var(--coup-primary)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <motion.h1
          className="text-7xl mb-4"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--coup-text-primary)',
            textShadow: '0 0 40px rgba(212, 169, 75, 0.5)',
          }}
          animate={{
            textShadow: [
              '0 0 40px rgba(212, 169, 75, 0.5)',
              '0 0 60px rgba(212, 169, 75, 0.8)',
              '0 0 40px rgba(212, 169, 75, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COUP
        </motion.h1>

        <motion.p
          className="text-center text-lg"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--coup-text-secondary)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Trust no one. Rule them all.
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        className="absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex gap-2"
          style={{
            color: 'var(--coup-primary)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--coup-primary)' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
