import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TreePine, X, Check, AlertTriangle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

interface ForestProtectorGameProps {
  gameId: number;
  onGameComplete: (score: number, badges: string[]) => void;
  onClose: () => void;
}

// 3D Tree Component
const Tree = ({ position, scale = 1, health = 100 }: { position: [number, number, number], scale?: number, health?: number }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const treeColor = health > 70 ? '#22c55e' : health > 40 ? '#eab308' : '#ef4444';

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Tree trunk */}
      <Box args={[0.2, 1, 0.2]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      {/* Tree crown */}
      <Sphere args={[0.5, 8, 6]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={treeColor} />
      </Sphere>
    </group>
  );
};

// 3D Forest Scene
const ForestScene = ({ forestHealth, treesPlanted }: { forestHealth: number, treesPlanted: number }) => {
  const trees = Array.from({ length: Math.min(treesPlanted, 10) }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 8,
      0,
      (Math.random() - 0.5) * 8
    ] as [number, number, number],
    scale: 0.5 + Math.random() * 0.5,
    health: forestHealth + Math.random() * 20 - 10
  }));

  return (
    <>
      {/* Ground */}
      <Box args={[12, 0.1, 12]} position={[0, -1, 0]}>
        <meshStandardMaterial color={forestHealth > 50 ? '#10b981' : '#a3a3a3'} />
      </Box>
      
      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree 
          key={index} 
          position={tree.position} 
          scale={tree.scale}
          health={tree.health}
        />
      ))}
      
      {/* Floating particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Sphere key={i} args={[0.05]} position={[
          Math.sin(Date.now() * 0.001 + i) * 3,
          Math.cos(Date.now() * 0.002 + i) * 2 + 1,
          Math.cos(Date.now() * 0.001 + i) * 3
        ]}>
          <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
        </Sphere>
      ))}
    </>
  );
};

const levels = [
  {
    id: 1,
    title: "Save the Rainforest",
    description: "Illegal loggers are cutting down ancient trees. Stop them!",
    target: "Plant 5 trees to restore the forest",
    treesToPlant: 5,
    timeLimit: 30,
    obstacles: ["Loggers", "Fire risk"]
  },
  {
    id: 2,
    title: "Urban Reforestation",
    description: "Transform the concrete jungle into a green paradise.",
    target: "Plant 8 trees in urban areas",
    treesToPlant: 8,
    timeLimit: 45,
    obstacles: ["Pollution", "Limited space"]
  },
  {
    id: 3,
    title: "Climate Heroes",
    description: "Combat climate change with massive reforestation.",
    target: "Plant 12 trees and maintain 80% forest health",
    treesToPlant: 12,
    timeLimit: 60,
    obstacles: ["Drought", "Pests", "Extreme weather"]
  }
];

export const ForestProtectorGame = ({ gameId, onGameComplete, onClose }: ForestProtectorGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [forestHealth, setForestHealth] = useState(50);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const { toast } = useToast();

  const level = levels[currentLevel];

  const plantTree = () => {
    if (treesPlanted < level.treesToPlant && timeLeft > 0) {
      const newTreesPlanted = treesPlanted + 1;
      const healthIncrease = 15;
      const newHealth = Math.min(100, forestHealth + healthIncrease);
      
      setTreesPlanted(newTreesPlanted);
      setForestHealth(newHealth);
      setScore(prev => prev + 50);

      // Check for badges
      if (newTreesPlanted >= 5 && !earnedBadges.includes('tree')) {
        setEarnedBadges(prev => [...prev, 'tree']);
        toast({
          title: "Badge Earned!",
          description: "Tree Planter badge unlocked!",
        });
      }

      if (newHealth > 80 && !earnedBadges.includes('energy')) {
        setEarnedBadges(prev => [...prev, 'energy']);
        toast({
          title: "Badge Earned!",
          description: "Forest Guardian badge unlocked!",
        });
      }

      // Check level completion
      if (newTreesPlanted >= level.treesToPlant) {
        completeLevel();
      }
    }
  };

  const completeLevel = () => {
    const levelBonus = (timeLeft * 10) + (forestHealth > 80 ? 200 : 100);
    const newScore = score + levelBonus;
    setScore(newScore);

    if (currentLevel < levels.length - 1) {
      toast({
        title: "Level Complete!",
        description: `Great job! Bonus: +${levelBonus} points`,
      });
      
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setTreesPlanted(0);
        setTimeLeft(levels[currentLevel + 1].timeLimit);
      }, 2000);
    } else {
      // Game complete
      setGameComplete(true);
      const finalBadges = [...earnedBadges];
      if (newScore > 1000) finalBadges.push('award');
      
      onGameComplete(newScore, finalBadges);
      
      toast({
        title: "Game Complete!",
        description: `You scored ${newScore} points and saved the forest!`,
      });
    }
  };

  // Timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameComplete) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Decrease forest health over time
        setForestHealth(prev => Math.max(0, prev - 0.5));
      }, 1000);
    } else if (timeLeft === 0 && !gameComplete) {
      toast({
        title: "Time's Up!",
        description: "The forest couldn't be saved in time.",
        variant: "destructive"
      });
      onGameComplete(score, earnedBadges);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameComplete]);

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 bg-card/90 border-primary/30">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="text-3xl text-primary">🌲 Forest Protector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Become a forest guardian! Plant trees, fight deforestation, and save ecosystems!
              </p>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center space-x-2 justify-center">
                  <TreePine className="w-5 h-5 text-green-400" />
                  <span>Click to plant trees and restore forest health</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Complete all levels to become a Forest Hero</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 8] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} />
                <ForestScene forestHealth={50} treesPlanted={3} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            <Button 
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-primary-foreground font-semibold text-lg py-6"
            >
              <TreePine className="w-5 h-5 mr-2" />
              Start Mission
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-card/90 border-primary/30 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-primary">
                Level {currentLevel + 1}: {level.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm">
                <span>Score: {score}</span>
                <span>Trees: {treesPlanted}/{level.treesToPlant}</span>
                <span>Health: {Math.round(forestHealth)}%</span>
                <span className={timeLeft < 10 ? 'text-red-400' : 'text-muted-foreground'}>
                  Time: {timeLeft}s
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={(treesPlanted / level.treesToPlant) * 100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 3D Scene */}
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 8] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} />
                <ForestScene forestHealth={forestHealth} treesPlanted={treesPlanted} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            {/* Game Controls */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-muted-foreground mb-2">{level.description}</p>
                <h3 className="text-lg font-semibold text-foreground">{level.target}</h3>
              </div>

              <Button
                onClick={plantTree}
                disabled={treesPlanted >= level.treesToPlant || timeLeft <= 0}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg py-8"
              >
                <TreePine className="w-6 h-6 mr-2" />
                Plant Tree ({treesPlanted}/{level.treesToPlant})
              </Button>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-card/50 rounded-lg border">
                  <div className="text-2xl font-bold text-green-400">{Math.round(forestHealth)}%</div>
                  <div className="text-sm text-muted-foreground">Forest Health</div>
                </div>
                <div className="p-3 bg-card/50 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="border-t border-primary/20 pt-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Badges Earned:</h4>
              <div className="flex space-x-2">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  >
                    <TreePine className="w-4 h-4 text-white" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};