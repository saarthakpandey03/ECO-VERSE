import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, TreePine, Recycle, Zap, Trophy } from 'lucide-react';

const games = [
  {
    id: 1,
    title: "Forest Protector",
    description: "Plant trees and restore forest ecosystems in 3D!",
    icon: TreePine,
    difficulty: "Easy",
    xpReward: 50,
    color: "from-green-500 to-green-600",
    component: "forest"
  },
  {
    id: 2,
    title: "Ocean Cleanup",
    description: "Clean plastic pollution and save marine life!",
    icon: Recycle,
    difficulty: "Medium",
    xpReward: 75,
    color: "from-blue-500 to-cyan-500",
    component: "ocean"
  },
  {
    id: 3,
    title: "Eco Quiz Master",
    description: "Test your environmental knowledge with MCQ challenges!",
    icon: Zap,
    difficulty: "Hard",
    xpReward: 100,
    color: "from-yellow-400 to-orange-400",
    component: "quiz"
  },
  {
    id: 4,
    title: "Climate Champion",
    description: "Complete all eco-challenges and become a hero!",
    icon: Trophy,
    difficulty: "Expert",
    xpReward: 150,
    color: "from-purple-400 to-pink-400",
    component: "quiz"
  }
];

interface GamesZoneProps {
  // Add your custom props here if needed
}

export const GamesZone = ({}: GamesZoneProps) => {
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
                    onClick={() => {
                      // TODO: Add your custom link/navigation here
                      // Example: window.open('https://your-game-url.com', '_blank');
                      // Or: navigate('/your-game-page');
                      console.log(`Clicked game: ${game.title}`);
                    }}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* More Games Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 mb-8"
        >
          <p className="text-2xl font-bold text-muted-foreground/60 text-glow">
            More games are coming soon . . .
          </p>
        </motion.div>

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
      </div>
    </section>
  );
};