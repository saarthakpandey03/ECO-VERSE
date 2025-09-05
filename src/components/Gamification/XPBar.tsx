import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export const XPBar = ({ currentXP, maxXP, level }: XPBarProps) => {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20 glow-primary">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Level {level}</span>
        <span className="text-xs text-muted-foreground">{currentXP}/{maxXP} XP</span>
      </div>
      
      <div className="xp-bar h-3">
        <motion.div
          className="xp-fill h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-xs text-primary font-semibold">Eco Warrior</span>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < level ? 'bg-primary glow-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};