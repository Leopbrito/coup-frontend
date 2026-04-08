import { motion } from 'motion/react';
import { Coins } from 'lucide-react';

interface CoinCounterProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  className?: string;
}

export function CoinCounter({ count, size = 'medium', animate = false, className = '' }: CoinCounterProps) {
  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    medium: 'w-8 h-8 text-base',
    large: 'w-12 h-12 text-xl',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={animate ? { scale: 0.8, opacity: 0 } : {}}
      animate={animate ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
        style={{
          background: 'linear-gradient(135deg, var(--coup-primary) 0%, var(--coup-primary-hover) 100%)',
          boxShadow: '0 2px 8px rgba(212, 169, 75, 0.3)',
        }}
        animate={animate ? { rotate: [0, 360] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Coins className={`${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-7 h-7'}`} style={{ color: 'var(--coup-bg)' }} />
      </motion.div>
      <span
        className={`font-semibold ${textSizes[size]}`}
        style={{
          color: 'var(--coup-primary)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {count}
      </span>
    </motion.div>
  );
}
