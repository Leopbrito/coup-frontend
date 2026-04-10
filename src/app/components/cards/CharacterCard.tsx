import { Anchor, Crown, Eye, Shield, Skull, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { CHARACTERS } from '../../constants/game';
import { CharacterType } from '../../types/game';

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
    small: 'w-24 h-36 border-[6px]',
    medium: 'w-32 h-48 border-[8px]',
    large: 'w-44 h-64 border-[10px]',
  };

  const isActuallyFaceDown = faceDown && !revealed;

  return (
    <div 
      className={`relative ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} perspective-1000 ${className}`}
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isActuallyFaceDown ? 180 : 0 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      >
        {/* Front Side (Face Up) */}
        <div 
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden z-10"
          style={{
            background: `linear-gradient(135deg, ${characterData.secondaryColor} 0%, ${characterData.color} 100%)`,
            border: `2px solid ${characterData.color}`,
          }}
        >
          {/* Card Content */}
          <div className={`relative h-full p-2.5 flex flex-col ${revealed ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
             <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id={`pattern-${character}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="100" height="100" fill={`url(#pattern-${character})`} />
                </svg>
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                <Icon
                  className={`${size === 'large' ? 'w-20 h-20' : size === 'medium' ? 'w-14 h-14' : 'w-10 h-10'}`}
                  style={{ color: 'var(--coup-text-primary)' }}
                  strokeWidth={1.5}
                />
              </div>

              <div className="text-center mt-auto w-full">
                <div className={`
                  font-serif text-coup-text-primary uppercase leading-tight text-center
                  ${characterData.name.length > 9 ? 'tracking-normal text-sm' : 'tracking-wider'}
                  ${size === 'large' 
                    ? (characterData.name.length > 9 ? 'text-lg' : 'text-xl') 
                    : size === 'medium' 
                      ? (characterData.name.length > 9 ? 'text-base' : 'text-lg') 
                      : (characterData.name.length > 9 ? 'text-[10px]' : 'text-xs')
                  }
                `}>
                  {characterData.name}
                </div>
              </div>
          </div>

          {revealed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
              <div className="transform rotate-12 bg-coup-accent-danger text-white px-4 py-1 font-serif text-sm border-2 border-white/20 shadow-xl">
                REVEALED
              </div>
            </div>
          )}
        </div>

        {/* Back Side (Card Back) */}
        <div 
          className="absolute inset-0 backface-hidden rounded-xl rotate-y-180 z-0"
          style={{
            background: 'var(--coup-card-back)',
            border: '2px solid var(--coup-border)',
            backgroundImage: 'radial-gradient(circle at center, rgba(212,169,75,0.05) 0%, transparent 70%)',
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-6 grayscale opacity-30">
             <div className="w-full h-full border-2 border-coup-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 rotate-45 scale-150">
                  <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                    {[...Array(16)].map((_, i) => (
                       <div key={i} className="border border-coup-primary w-full h-full opacity-20" />
                    ))}
                  </div>
                </div>
                <div className="text-coup-primary/40 font-serif tracking-[0.2em] uppercase text-xl rotate-90 whitespace-nowrap">
                  COUP CARD
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
