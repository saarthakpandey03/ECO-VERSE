import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, TreePine, Recycle, Zap, Trophy } from 'lucide-react';
import { EcoGame } from '@/components/Games/EcoGame';

const games = [
  {
    id: 1,
    title: "Tree Planting Hero",
    description: "Plant virtual trees and watch them grow in real-time!",
    icon: TreePine,
    difficulty: "Easy",
    xpReward: 50,
    color: "from-primary to-primary-light"
  },
  {
    id: 2,
    title: "Recycling Master",
    description: "Sort waste correctly and build recycling chains!",
    icon: Recycle,
    difficulty: "Medium",
    xpReward: 75,
    color: "from-accent to-accent-light"
  },
  {
    id: 3,
    title: "Energy Saver",
    description: "Optimize city energy usage and power renewable sources!",
    icon: Zap,
    difficulty: "Hard",
    xpReward: 100,
    color: "from-yellow-400 to-orange-400"
  },
  {
    id: 4,
    title: "Eco Champions",
    description: "Compete in weekly environmental challenges!",
    icon: Trophy,
    difficulty: "Expert",
    xpReward: 150,
    color: "from-purple-400 to-pink-400"
  }
];

interface GamesZoneProps {
  onGameStart: (gameId: number) => void;
  onGameComplete: (gameId: number, score: number, badges: string[]) => void;
}

export const GamesZone = ({ onGameStart, onGameComplete }: GamesZoneProps) => {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const handleGameStart = (gameId: number) => {
    setActiveGame(gameId);
    onGameStart(gameId);
  };

  const handleGameComplete = (score: number, badges: string[]) => {
    if (activeGame) {
      onGameComplete(activeGame, score, badges);
      setActiveGame(null);
    }
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-12 h-12 text-primary glow-primary mr-4" />
            <h2 className="text-5xl font-bold text-foreground text-glow">Games Zone</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about sustainability through fun, interactive games and earn XP!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 100, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02
              }}
              className="card-3d"
            >
              <Card className="bg-card/80 backdrop-blur-sm border-primary/30 overflow-hidden group hover:glow-primary transition-all duration-300">
                <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:animate-pulse">
                    <game.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{game.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {game.description}
                  </p>

                  <div className="flex justify-between items-center text-xs">
                    <span className={`
                      px-2 py-1 rounded-full
                      ${game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : ''}
                      ${game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                      ${game.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' : ''}
                      ${game.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400' : ''}
                    `}>
                      {game.difficulty}
                    </span>
                    <span className="text-accent font-semibold">+{game.xpReward} XP</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-primary-foreground font-semibold"
                    onClick={() => handleGameStart(game.id)}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Floating eco elements */}
        <div className="relative mt-20 h-32 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 text-primary/30"
              style={{
                left: `${(i * 16.66)}%`,
                top: `${Math.sin(i) * 20 + 50}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {i % 3 === 0 && <TreePine className="w-full h-full" />}
              {i % 3 === 1 && <Recycle className="w-full h-full" />}
              {i % 3 === 2 && <Zap className="w-full h-full" />}
            </motion.div>
          ))}
        </div>

        {/* Game Modal */}
        {activeGame && (
          <EcoGame
            gameId={activeGame}
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )}
      </div>
    </section>
  );
};