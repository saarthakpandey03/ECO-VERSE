import { motion } from 'framer-motion';
import { Award, TreePine, Recycle, Zap, Droplets } from 'lucide-react';

interface BadgeProps {
  type: 'tree' | 'recycle' | 'energy' | 'water' | 'award';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  count?: number;
  title: string;
}

const badgeIcons = {
  tree: TreePine,
  recycle: Recycle,
  energy: Zap,
  water: Droplets,
  award: Award
};

const badgeColors = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2'
};

export const Badge = ({ type, level, unlocked, count, title }: BadgeProps) => {
  const Icon = badgeIcons[type];
  const color = badgeColors[level];

  return (
    <motion.div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300 card-3d
        ${unlocked 
          ? 'bg-card/80 border-primary/30 glow-primary cursor-pointer' 
          : 'bg-card/20 border-muted/30 opacity-50'
        }
      `}
      whileHover={unlocked ? { scale: 1.05 } : {}}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: unlocked ? 1 : 0.9, 
        rotate: unlocked ? 0 : -10,
        opacity: unlocked ? 1 : 0.5 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect for unlocked badges */}
      {unlocked && (
        <div 
          className="absolute inset-0 rounded-lg blur-md -z-10"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
      )}

      <div className="text-center space-y-2">
        <div 
          className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
          style={{ backgroundColor: unlocked ? color : '#666666' }}
        >
          <Icon 
            className="w-6 h-6" 
            style={{ color: unlocked ? '#000' : '#333' }}
          />
        </div>
        
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        
        {count !== undefined && (
          <div className="text-xs text-primary font-bold">
            {count}x
          </div>
        )}
        
        <div className="text-xs uppercase tracking-wide" style={{ color }}>
          {level}
        </div>
      </div>

      {/* Sparkle animation for newly unlocked badges */}
      {unlocked && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <div className="w-3 h-3 bg-accent rounded-full glow-accent" />
        </motion.div>
      )}
    </motion.div>
  );
};