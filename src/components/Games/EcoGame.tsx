import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TreePine, Recycle, Zap, Droplets, Award, X, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

interface EcoGameProps {
  gameId: number;
  onGameComplete: (score: number, badges: string[]) => void;
  onClose: () => void;
}

// 3D Earth Component
const GameEarth = ({ health }: { health: number }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.003;
    }
  });

  const earthColor = health > 70 ? '#00ff88' : health > 40 ? '#ffaa00' : '#ff4444';
  const atmosphereOpacity = Math.max(0.1, health / 100);

  return (
    <group>
      <Sphere ref={earthRef} args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={earthColor}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      <Sphere ref={atmosphereRef} args={[2.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#88aaff"
          transparent 
          opacity={atmosphereOpacity}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Floating environmental elements
const FloatingElement = ({ type, position }: { type: string, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Box args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial 
          color={type === 'tree' ? '#00ff88' : type === 'recycle' ? '#00aaff' : '#ffaa00'}
          emissive={type === 'tree' ? '#004422' : type === 'recycle' ? '#002244' : '#442200'}
        />
      </Box>
    </group>
  );
};

// Game scenarios
const gameScenarios = [
  {
    id: 1,
    title: "Forest Protection",
    description: "A forest is being cut down for development. What should we do?",
    question: "How can we balance development with forest conservation?",
    options: [
      { text: "Create sustainable development zones with green corridors", points: 20, correct: true },
      { text: "Allow complete deforestation for quick profit", points: -15, correct: false },
      { text: "Plant trees elsewhere as compensation", points: 10, correct: false },
      { text: "Use vertical development to minimize land use", points: 15, correct: true }
    ],
    explanation: "Sustainable development with green corridors maintains biodiversity while allowing controlled growth. Forests are crucial for carbon absorption, oxygen production, and ecosystem balance."
  },
  {
    id: 2,
    title: "Ocean Pollution",
    description: "Plastic waste is threatening marine life in our oceans.",
    question: "What's the most effective solution for ocean plastic pollution?",
    options: [
      { text: "Ban single-use plastics completely", points: 15, correct: true },
      { text: "Continue using plastic but recycle more", points: 8, correct: false },
      { text: "Develop biodegradable alternatives", points: 18, correct: true },
      { text: "Let nature handle the decomposition", points: -20, correct: false }
    ],
    explanation: "Biodegradable alternatives combined with plastic bans are most effective. Ocean plastic takes 400+ years to decompose and kills millions of marine animals annually."
  },
  {
    id: 3,
    title: "Energy Crisis",
    description: "The city needs more energy but must reduce carbon emissions.",
    question: "Which energy solution is most sustainable?",
    options: [
      { text: "Build more coal power plants", points: -25, correct: false },
      { text: "Invest in solar and wind farms", points: 25, correct: true },
      { text: "Use nuclear energy exclusively", points: 10, correct: false },
      { text: "Combine renewables with energy storage", points: 30, correct: true }
    ],
    explanation: "Renewable energy with storage systems provides clean, reliable power. Coal plants produce 2.2 tons of CO2 per MWh, while renewables produce virtually none."
  },
  {
    id: 4,
    title: "Water Conservation",
    description: "Freshwater sources are depleting rapidly in your region.",
    question: "What's the best approach to water conservation?",
    options: [
      { text: "Implement rainwater harvesting systems", points: 20, correct: true },
      { text: "Restrict water usage during peak hours only", points: 5, correct: false },
      { text: "Invest in desalination technology", points: 12, correct: false },
      { text: "Combine harvesting, recycling, and smart irrigation", points: 25, correct: true }
    ],
    explanation: "Comprehensive water management includes harvesting, recycling, and efficient use. Only 3% of Earth's water is freshwater, and 97% of that is frozen in ice caps."
  },
  {
    id: 5,
    title: "Climate Action",
    description: "Global warming is accelerating. Immediate action is needed.",
    question: "Which strategy has the most impact on climate change?",
    options: [
      { text: "Individual lifestyle changes only", points: 8, correct: false },
      { text: "Government policies and regulations", points: 15, correct: true },
      { text: "Corporate sustainability initiatives", points: 18, correct: true },
      { text: "Global cooperation and systemic change", points: 30, correct: true }
    ],
    explanation: "Climate change requires systemic change at all levels. While individual actions matter, coordinated global efforts can achieve the scale needed to limit warming to 1.5°C."
  }
];

export const EcoGame = ({ gameId, onGameComplete, onClose }: EcoGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [earthHealth, setEarthHealth] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const { toast } = useToast();

  const scenario = gameScenarios[currentScenario];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !showExplanation) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(-1); // Time's up
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, showExplanation]);

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === -1) {
      toast({
        title: "Time's Up!",
        description: "You didn't answer in time.",
        variant: "destructive"
      });
    }

    const option = scenario.options[optionIndex] || { points: 0, correct: false };
    const newScore = Math.max(0, score + option.points);
    const newHealth = Math.max(0, Math.min(100, earthHealth + option.points));
    
    setScore(newScore);
    setEarthHealth(newHealth);
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    // Award badges based on performance
    if (option.points >= 20 && !earnedBadges.includes('tree')) {
      setEarnedBadges(prev => [...prev, 'tree']);
    }
    if (newHealth > 80 && !earnedBadges.includes('water')) {
      setEarnedBadges(prev => [...prev, 'water']);
    }
    if (newScore > 100 && !earnedBadges.includes('energy')) {
      setEarnedBadges(prev => [...prev, 'energy']);
    }
  };

  const nextScenario = () => {
    if (currentScenario < gameScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      // Game complete
      const finalBadges = [...earnedBadges];
      if (score > 120) finalBadges.push('award');
      
      onGameComplete(score, finalBadges);
      
      toast({
        title: "Game Complete!",
        description: `You scored ${score} points and earned ${finalBadges.length} badges!`,
      });
    }
  };

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 bg-card/90 border-primary/30">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="text-3xl text-primary">🌍 Eco Protector Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Learn about environmental protection through real-world scenarios!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <TreePine className="w-5 h-5 text-green-400" />
                  <span>Learn about ecosystems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span>Water conservation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Renewable energy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Recycle className="w-5 h-5 text-cyan-400" />
                  <span>Waste management</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <GameEarth health={50} />
                <FloatingElement type="tree" position={[-4, 0, 0]} />
                <FloatingElement type="recycle" position={[4, 1, -2]} />
                <FloatingElement type="energy" position={[0, 3, -1]} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            <Button 
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-primary-foreground font-semibold text-lg py-6"
            >
              <Award className="w-5 h-5 mr-2" />
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
                Mission {currentScenario + 1}: {scenario.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm">
                <span>Score: {score}</span>
                <span>Earth Health: {earthHealth}%</span>
                <span className={timeLeft < 10 ? 'text-red-400' : 'text-muted-foreground'}>
                  Time: {timeLeft}s
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={(currentScenario / gameScenarios.length) * 100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 3D Scene */}
            <div className="h-64 border border-primary/20 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <GameEarth health={earthHealth} />
                <FloatingElement type="tree" position={[-4, 0, 0]} />
                <FloatingElement type="recycle" position={[4, 1, -2]} />
                <FloatingElement type="energy" position={[0, 3, -1]} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            {/* Game Content */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-muted-foreground mb-2">{scenario.description}</p>
                <h3 className="text-lg font-semibold text-foreground">{scenario.question}</h3>
              </div>

              {!showExplanation ? (
                <div className="space-y-3">
                  {scenario.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-primary/10"
                      onClick={() => handleAnswer(index)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-center mb-2">
                        {selectedOption !== null && scenario.options[selectedOption]?.correct ? (
                          <Check className="w-5 h-5 text-green-400 mr-2" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                        )}
                        <span className="font-semibold">
                          {selectedOption !== null && scenario.options[selectedOption]?.correct ? 'Correct!' : 'Learn More:'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                    </div>

                    <Button
                      onClick={nextScenario}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light"
                    >
                      {currentScenario < gameScenarios.length - 1 ? 'Next Mission' : 'Complete Game'}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
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
                    {badge === 'tree' && <TreePine className="w-4 h-4 text-white" />}
                    {badge === 'water' && <Droplets className="w-4 h-4 text-white" />}
                    {badge === 'energy' && <Zap className="w-4 h-4 text-white" />}
                    {badge === 'award' && <Award className="w-4 h-4 text-white" />}
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