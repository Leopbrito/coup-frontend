import { Player } from '../../types/game';
import { motion } from 'motion/react';
import { CoinCounter } from '../ui/CoinCounter';
import { CharacterCard } from '../cards/CharacterCard';
import { Crown, Circle, Wifi, WifiOff } from 'lucide-react';

interface PlayerBadgeProps {
  player: Player;
  isCurrentTurn?: boolean;
  showCards?: boolean;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PlayerBadge({
  player,
  isCurrentTurn = false,
  showCards = false,
  compact = false,
  onClick,
  className = '',
}: PlayerBadgeProps) {
  const aliveInfluences = player.influences.filter((inf) => !inf.revealed).length;

  return (
    <motion.div
      className={`rounded-xl p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: isCurrentTurn
          ? 'linear-gradient(135deg, var(--coup-surface-elevated) 0%, var(--coup-surface) 100%)'
          : 'var(--coup-surface)',
        border: isCurrentTurn ? '2px solid var(--coup-primary)' : '2px solid var(--coup-border)',
        boxShadow: isCurrentTurn ? '0 0 20px rgba(212, 169, 75, 0.4)' : 'none',
        opacity: player.isAlive ? 1 : 0.5,
      }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      animate={isCurrentTurn ? { boxShadow: ['0 0 20px rgba(212, 169, 75, 0.4)', '0 0 30px rgba(212, 169, 75, 0.6)', '0 0 20px rgba(212, 169, 75, 0.4)'] } : {}}
      transition={{ duration: 1.5, repeat: isCurrentTurn ? Infinity : 0 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--coup-primary) 0%, var(--coup-primary-hover) 100%)',
              fontFamily: 'var(--font-serif)',
              color: 'var(--coup-bg)',
            }}
          >
            {player.username.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="font-semibold"
                style={{
                  color: 'var(--coup-text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {player.username}
              </span>
              {player.isHost && <Crown className="w-4 h-4" style={{ color: 'var(--coup-primary)' }} />}
              {player.isConnected ? (
                <Wifi className="w-4 h-4" style={{ color: 'var(--coup-accent-success)' }} />
              ) : (
                <WifiOff className="w-4 h-4" style={{ color: 'var(--coup-accent-danger)' }} />
              )}
            </div>

            {/* Influences */}
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <Circle
                  key={i}
                  className="w-3 h-3"
                  style={{
                    color: i < aliveInfluences ? 'var(--coup-primary)' : 'var(--coup-border)',
                    fill: i < aliveInfluences ? 'var(--coup-primary)' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Coins */}
        <CoinCounter count={player.coins} size="small" />
      </div>

      {/* Cards (if showing) */}
      {showCards && (
        <div className="flex gap-2 mt-3">
          {player.influences.map((influence, index) => (
            <CharacterCard
              key={index}
              character={influence.character}
              revealed={influence.revealed}
              size="small"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
