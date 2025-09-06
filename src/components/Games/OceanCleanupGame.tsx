import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, X, Fish as FishIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

interface OceanCleanupGameProps {
  gameId: number;
  onGameComplete: (score: number, badges: string[]) => void;
  onClose: () => void;
}

// 3D Fish Component
const Fish = ({ position, speed = 1 }: { position: [number, number, number], speed?: number }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 2;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Box args={[0.5, 0.2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6b35" />
      </Box>
      <Box args={[0.2, 0.15, 0.05]} position={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#ff8c69" />
      </Box>
    </group>
  );
};

// 3D Trash Component
const TrashPiece = ({ position, type, onClick }: { position: [number, number, number], type: string, onClick: () => void }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} onClick={onClick}>
      {type === 'bottle' && (
        <Box args={[0.1, 0.4, 0.1]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      )}
      {type === 'bag' && (
        <Box args={[0.3, 0.3, 0.1]}>
          <meshStandardMaterial color="#666666" transparent opacity={0.7} />
        </Box>
      )}
      {type === 'can' && (
        <Sphere args={[0.1, 8, 6]} scale={[1, 1.5, 1]}>
          <meshStandardMaterial color="#c0c0c0" />
        </Sphere>
      )}
    </group>
  );
};

// 3D Ocean Scene
const OceanScene = ({ trashCount, cleanedTrash, fishCount }: { trashCount: number, cleanedTrash: number, fishCount: number }) => {
  const [trashItems, setTrashItems] = useState(() => 
    Array.from({ length: trashCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      type: ['bottle', 'bag', 'can'][Math.floor(Math.random() * 3)],
      collected: false
    }))
  );

  const handleTrashClick = (id: number) => {
    setTrashItems(prev => prev.map(item => 
      item.id === id ? { ...item, collected: true } : item
    ));
  };

  const waterColor = cleanedTrash > trashCount * 0.7 ? '#006994' : cleanedTrash > trashCount * 0.4 ? '#4682b4' : '#708090';

  return (
    <>
      {/* Ocean floor */}
      <Box args={[12, 0.5, 12]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#deb887" />
      </Box>
      
      {/* Water effect */}
      <Box args={[12, 4, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color={waterColor} transparent opacity={0.6} />
      </Box>
      
      {/* Fish */}
      {Array.from({ length: Math.min(fishCount, 8) }).map((_, i) => (
        <Fish 
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 6
          ]}
          speed={0.5 + Math.random()}
        />
      ))}
      
      {/* Trash pieces */}
      {trashItems.filter(item => !item.collected).map((item) => (
        <TrashPiece
          key={item.id}
          position={item.position}
          type={item.type}
          onClick={() => handleTrashClick(item.id)}
        />
      ))}
      
      {/* Bubbles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Sphere key={i} args={[0.05]} position={[
          Math.sin(Date.now() * 0.002 + i) * 4,
          Math.sin(Date.now() * 0.003 + i) * 3 + 1,
          Math.cos(Date.now() * 0.002 + i) * 4
        ]}>
          <meshBasicMaterial color="#87ceeb" transparent opacity={0.3} />
        </Sphere>
      ))}
    </>
  );
};

export const OceanCleanupGame = ({ gameId, onGameComplete, onClose }: OceanCleanupGameProps) => {
  const [trashCleaned, setTrashCleaned] = useState(0);
  const [totalTrash] = useState(20);
  const [oceanHealth, setOceanHealth] = useState(30);
  const [fishSaved, setFishSaved] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const { toast } = useToast();

  const cleanTrash = () => {
    if (trashCleaned < totalTrash && timeLeft > 0) {
      const newCleaned = trashCleaned + 1;
      const healthIncrease = 5;
      const newHealth = Math.min(100, oceanHealth + healthIncrease);
      const newFish = Math.floor(newHealth / 10);
      
      setTrashCleaned(newCleaned);
      setOceanHealth(newHealth);
      setFishSaved(newFish);
      setScore(prev => prev + 25);

      // Check for badges
      if (newCleaned >= 10 && !earnedBadges.includes('recycle')) {
        setEarnedBadges(prev => [...prev, 'recycle']);
        toast({
          title: "Badge Earned!",
          description: "Ocean Cleaner badge unlocked!",
        });
      }

      if (newFish >= 8 && !earnedBadges.includes('energy')) {
        setEarnedBadges(prev => [...prev, 'energy']);
        toast({
          title: "Badge Earned!",
          description: "Marine Life Protector badge unlocked!",
        });
      }

      // Check game completion
      if (newCleaned >= totalTrash) {
        const finalBadges = [...earnedBadges];
        const bonusScore = timeLeft * 5 + (newHealth > 80 ? 300 : 150);
        const finalScore = score + bonusScore;
        
        if (finalScore > 800) finalBadges.push('award');
        
        onGameComplete(finalScore, finalBadges);
        
        toast({
          title: "Ocean Saved!",
          description: `You cleaned the entire ocean! Bonus: +${bonusScore} points`,
        });
      }
    }
  };

  // Timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && trashCleaned < totalTrash) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Ocean gets slightly more polluted over time
        setOceanHealth(prev => Math.max(0, prev - 0.2));
      }, 1000);
    } else if (timeLeft === 0) {
      onGameComplete(score, earnedBadges);
      toast({
        title: "Time's Up!",
        description: "The ocean cleanup mission is over.",
        variant: "destructive"
      });
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, trashCleaned]);

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 bg-card/90 border-primary/30">
          <CardHeader className="text-center">
            <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4">
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="text-3xl text-primary">🌊 Ocean Cleanup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Save marine life by cleaning plastic pollution from our oceans!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span>Clean ocean waters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FishIcon className="w-5 h-5 text-orange-400" />
                  <span>Save marine animals</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 8] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} />
                <OceanScene trashCount={5} cleanedTrash={0} fishCount={3} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            <Button 
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg py-6"
            >
              <Droplets className="w-5 h-5 mr-2" />
              Start Cleanup
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
              <CardTitle className="text-2xl text-primary">Ocean Cleanup Mission</CardTitle>
              <div className="flex items-center space-x-4 text-sm">
                <span>Score: {score}</span>
                <span>Trash: {trashCleaned}/{totalTrash}</span>
                <span>Fish Saved: {fishSaved}</span>
                <span className={timeLeft < 20 ? 'text-red-400' : 'text-muted-foreground'}>
                  Time: {timeLeft}s
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={(trashCleaned / totalTrash) * 100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 3D Scene */}
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 8] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} />
                <OceanScene trashCount={totalTrash} cleanedTrash={trashCleaned} fishCount={fishSaved} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            {/* Game Controls */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-muted-foreground mb-2">Click floating trash to clean it up!</p>
                <h3 className="text-lg font-semibold text-foreground">
                  Save the marine ecosystem by removing all plastic waste
                </h3>
              </div>

              <Button
                onClick={cleanTrash}
                disabled={trashCleaned >= totalTrash || timeLeft <= 0}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg py-8"
              >
                <Trash2 className="w-6 h-6 mr-2" />
                Clean Trash ({trashCleaned}/{totalTrash})
              </Button>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-card/50 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(oceanHealth)}%</div>
                  <div className="text-sm text-muted-foreground">Ocean Health</div>
                </div>
                <div className="p-3 bg-card/50 rounded-lg border">
                  <div className="text-2xl font-bold text-orange-400">{fishSaved}</div>
                  <div className="text-sm text-muted-foreground">Fish Saved</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};