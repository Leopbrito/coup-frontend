import { motion } from 'motion/react';
import { CharacterType } from '../../types/game';
import { CHARACTERS } from '../../constants/game';
import { Crown, Skull, Anchor, Users, Shield, Eye } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterType;
  revealed?: boolean;
  faceDown?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const characterIcons = {
  [CharacterType.DUKE]: Crown,
  [CharacterType.ASSASSIN]: Skull,
  [CharacterType.CAPTAIN]: Anchor,
  [CharacterType.AMBASSADOR]: Users,
  [CharacterType.CONTESSA]: Shield,
  [CharacterType.INQUISITOR]: Eye,
};

export function CharacterCard({
  character,
  revealed = false,
  faceDown = false,
  onClick,
  className = '',
  size = 'medium',
}: CharacterCardProps) {
  const characterData = CHARACTERS[character];
  const Icon = characterIcons[character];

  const sizeClasses = {
    small: 'w-20 h-28',
    medium: 'w-28 h-40',
    large: 'w-36 h-52',
  };

  if (faceDown) {
    return (
      <motion.div
        className={`${sizeClasses[size]} rounded-lg ${className} cursor-pointer`}
        style={{
          background: 'var(--coup-card-back)',
          border: '2px solid var(--coup-border)',
        }}
        whileHover={onClick ? { scale: 1.05, y: -4 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        onClick={onClick}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-16 h-20 rounded border-2 opacity-30"
            style={{ borderColor: 'var(--coup-primary)' }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-lg overflow-hidden relative ${className} ${
        onClick ? 'cursor-pointer' : ''
      } ${revealed ? 'opacity-50 grayscale' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${characterData.secondaryColor} 0%, ${characterData.color} 100%)`,
        border: `2px solid ${characterData.color}`,
        boxShadow: revealed ? 'none' : `0 4px 20px ${characterData.color}40`,
      }}
      whileHover={onClick && !revealed ? { scale: 1.05, y: -4 } : {}}
      whileTap={onClick && !revealed ? { scale: 0.95 } : {}}
      onClick={!revealed ? onClick : undefined}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ornate border pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id={`pattern-${character}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill={`url(#pattern-${character})`} />
        </svg>
      </div>

      {/* Card content */}
      <div className="relative h-full p-3 flex flex-col">
        {/* Character icon */}
        <div className="flex-1 flex items-center justify-center">
          <Icon
            className={`${size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-12 h-12' : 'w-8 h-8'}`}
            style={{ color: 'var(--coup-text-primary)' }}
            strokeWidth={1.5}
          />
        </div>

        {/* Character name */}
        <div
          className="text-center mt-auto"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--coup-text-primary)',
          }}
        >
          <div className={`${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'} mb-1`}>
            {characterData.name}
          </div>
        </div>

        {/* Revealed overlay */}
        {revealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div
              className="transform rotate-12 px-4 py-2 rounded"
              style={{
                background: 'var(--coup-accent-danger)',
                fontFamily: 'var(--font-serif)',
                color: 'var(--coup-text-primary)',
              }}
            >
              REVEALED
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
