import { Coins } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { ACTIONS, CHARACTERS } from '../../constants/game';
import { ActionType } from '../../types/game';

interface ActionButtonProps {
  action: ActionType;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ActionButton({ action, disabled = false, onClick, className = '' }: ActionButtonProps) {
  const actionData = ACTIONS[action];
  const characterData = actionData.requiredCharacter ? CHARACTERS[actionData.requiredCharacter] : null;
  const controls = useAnimation();

  const handlePress = () => {
    if (!disabled) {
      controls.start({ scale: 0.96, transition: { duration: 0.1 } });
    }
  };

  const handleRelease = () => {
    controls.start({ scale: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
  };

  const handleHoverStart = () => {
    if (!disabled) {
      controls.start({ scale: 1.02, y: -2, transition: { duration: 0.2 } });
    }
  };

  return (
    <motion.button
      className={`w-full p-4 rounded-lg text-left relative overflow-hidden ${className}`}
      style={{
        background: disabled
          ? 'var(--coup-surface)'
          : characterData
          ? `linear-gradient(135deg, ${characterData.secondaryColor} 0%, ${characterData.color}40 100%)`
          : 'linear-gradient(135deg, var(--coup-surface-elevated) 0%, var(--coup-surface) 100%)',
        border: disabled
          ? '2px solid var(--coup-border)'
          : characterData
          ? `2px solid ${characterData.color}`
          : '2px solid var(--coup-primary)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      animate={controls}
      initial={{ scale: 1, y: 0 }}
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onPointerLeave={handleRelease}
      onMouseEnter={handleHoverStart}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {/* Glow effect */}
      {!disabled && characterData && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${characterData.color} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div
            className="text-lg"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--coup-text-primary)',
            }}
          >
            {actionData.name}
          </div>
          {actionData.cost > 0 && (
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4" style={{ color: 'var(--coup-primary)' }} />
              <span style={{ color: 'var(--coup-primary)', fontFamily: 'var(--font-sans)' }}>
                {actionData.cost}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div
          className="text-sm"
          style={{
            color: 'var(--coup-text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {actionData.description}
        </div>

        {/* Character badge */}
        {characterData && (
          <div
            className="inline-block mt-2 px-2 py-1 rounded text-xs"
            style={{
              background: characterData.color,
              color: 'var(--coup-bg)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {characterData.name}
          </div>
        )}
      </div>
    </motion.button>
  );
}
