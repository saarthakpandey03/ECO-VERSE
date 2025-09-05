import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/Gamification/Badge';
import { Gift, Coins, Star, Crown, Leaf } from 'lucide-react';

const rewards = [
  {
    id: 1,
    title: "Eco Warrior Badge",
    description: "Complete 10 environmental actions",
    cost: 100,
    type: "badge" as const,
    unlocked: true
  },
  {
    id: 2,
    title: "Plant Avatar Skin",
    description: "Transform your avatar with leafy accessories",
    cost: 250,
    type: "cosmetic" as const,
    unlocked: false
  },
  {
    id: 3,
    title: "Double XP Boost",
    description: "2x XP for the next 24 hours",
    cost: 150,
    type: "boost" as const,
    unlocked: false
  },
  {
    id: 4,
    title: "Tree Planting Donation",
    description: "Plant a real tree through our partners",
    cost: 500,
    type: "real-world" as const,
    unlocked: false
  }
];

const badges = [
  { type: 'tree' as const, level: 'gold' as const, unlocked: true, count: 15, title: "Forest Guardian" },
  { type: 'recycle' as const, level: 'silver' as const, unlocked: true, count: 8, title: "Recycle Master" },
  { type: 'energy' as const, level: 'bronze' as const, unlocked: true, count: 3, title: "Energy Saver" },
  { type: 'water' as const, level: 'platinum' as const, unlocked: false, count: 0, title: "Water Protector" },
];

interface RewardsZoneProps {
  userCoins: number;
  onRewardClaim: (rewardId: number) => void;
}

export const RewardsZone = ({ userCoins, onRewardClaim }: RewardsZoneProps) => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Gift className="w-12 h-12 text-accent glow-accent mr-4" />
            <h2 className="text-5xl font-bold text-foreground text-glow">Rewards Zone</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock amazing rewards and showcase your eco-achievements!
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border border-accent/30 rounded-lg p-6 mb-12 text-center glow-accent"
        >
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Coins className="w-8 h-8 text-accent animate-spin-slow" />
              <div>
                <div className="text-2xl font-bold text-accent">{userCoins}</div>
                <div className="text-sm text-muted-foreground">Eco Coins</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-primary animate-pulse-glow" />
              <div>
                <div className="text-2xl font-bold text-primary">2,450</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-yellow-400 animate-float" />
              <div>
                <div className="text-2xl font-bold text-yellow-400">7th</div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges Collection */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Your Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Badge {...badge} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Available Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Available Rewards</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 100, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                className="card-3d"
              >
                <Card className={`
                  bg-card/80 backdrop-blur-sm border overflow-hidden group transition-all duration-300
                  ${reward.unlocked 
                    ? 'border-primary/30 hover:glow-primary' 
                    : userCoins >= reward.cost 
                      ? 'border-accent/30 hover:glow-accent' 
                      : 'border-muted/30 opacity-70'
                  }
                `}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {reward.type === 'badge' && <Star className="w-8 h-8 text-primary" />}
                      {reward.type === 'cosmetic' && <Leaf className="w-8 h-8 text-accent" />}
                      {reward.type === 'boost' && <Crown className="w-8 h-8 text-yellow-400" />}
                      {reward.type === 'real-world' && <Gift className="w-8 h-8 text-green-400" />}
                    </div>
                    <CardTitle className="text-lg text-foreground">{reward.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-center space-x-2">
                      <Coins className="w-4 h-4 text-accent" />
                      <span className="text-accent font-semibold">{reward.cost}</span>
                    </div>

                    <Button
                      className={`w-full font-semibold ${
                        reward.unlocked
                          ? 'bg-primary/20 text-primary cursor-not-allowed'
                          : userCoins >= reward.cost
                            ? 'bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      onClick={() => !reward.unlocked && userCoins >= reward.cost && onRewardClaim(reward.id)}
                      disabled={reward.unlocked || userCoins < reward.cost}
                    >
                      {reward.unlocked ? 'Owned' : userCoins >= reward.cost ? 'Claim' : 'Not enough coins'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating coins animation */}
        <div className="relative mt-20 h-32 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 12.5)}%`,
                top: `${Math.sin(i * 0.5) * 30 + 50}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Coins className="w-6 h-6 text-accent/40" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};