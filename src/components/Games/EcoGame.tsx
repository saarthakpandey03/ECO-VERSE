import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TreePine, Recycle, Zap, Droplets, Award, X, Check, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import { questions as allQuestions } from '../../data/ecoQuestions';

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

// Process questions into levels (10 questions per level)
const createLevels = () => {
  const levels = [];
  const questionsPerLevel = 10;
  
  // Remove duplicates while preserving variety
  const uniqueQuestions = allQuestions.filter((question, index, self) => 
    index === self.findIndex(q => q.question === question.question)
  );
  
  for (let i = 0; i < uniqueQuestions.length; i += questionsPerLevel) {
    const levelQuestions = uniqueQuestions.slice(i, i + questionsPerLevel);
    if (levelQuestions.length === questionsPerLevel) {
      levels.push({
        id: levels.length + 1,
        title: `Level ${levels.length + 1}`,
        questions: levelQuestions.map(q => ({
          question: q.question,
          options: q.options.map(option => ({
            text: option,
            correct: option === q.answer
          })),
          correctAnswer: q.answer
        }))
      });
    }
  }
  
  return levels;
};

const gameLevels = createLevels();

export const EcoGame = ({ gameId, onGameComplete, onClose }: EcoGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [earthHealth, setEarthHealth] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showLevelResults, setShowLevelResults] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [levelStats, setLevelStats] = useState<Array<{
    level: number;
    correct: number;
    total: number;
    score: number;
  }>>([]);
  const [currentLevelAnswers, setCurrentLevelAnswers] = useState<Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>>([]);
  const { toast } = useToast();

  const currentLevelData = gameLevels[currentLevel];
  const currentQuestionData = currentLevelData?.questions[currentQuestion];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !showExplanation && !showLevelResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation && !showLevelResults) {
      handleAnswer(-1); // Time's up
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, showExplanation, showLevelResults]);

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestionData) return;

    if (optionIndex === -1) {
      toast({
        title: "Time's Up!",
        description: "You didn't answer in time.",
        variant: "destructive"
      });
    }

    const selectedAnswer = optionIndex >= 0 ? currentQuestionData.options[optionIndex]?.text : "No answer";
    const isCorrect = optionIndex >= 0 ? (currentQuestionData.options[optionIndex]?.correct || false) : false;
    
    // Track answers for current level
    const answerRecord = {
      question: currentQuestionData.question,
      selectedAnswer,
      correctAnswer: currentQuestionData.correctAnswer,
      isCorrect
    };
    
    setCurrentLevelAnswers(prev => [...prev, answerRecord]);
    
    // Update score and health
    const points = isCorrect ? 10 : 0;
    const newScore = score + points;
    const healthChange = isCorrect ? 5 : -2;
    const newHealth = Math.max(0, Math.min(100, earthHealth + healthChange));
    
    setScore(newScore);
    setEarthHealth(newHealth);
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    // Award badges based on performance
    if (isCorrect && !earnedBadges.includes('tree')) {
      setEarnedBadges(prev => [...prev, 'tree']);
    }
    if (newHealth > 80 && !earnedBadges.includes('energy')) {
      setEarnedBadges(prev => [...prev, 'energy']);
    }
    if (newScore > 50 && !earnedBadges.includes('recycle')) {
      setEarnedBadges(prev => [...prev, 'recycle']);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentLevelData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      // Show level results
      const correctCount = currentLevelAnswers.filter(a => a.isCorrect).length + (selectedOption !== null && currentQuestionData?.options[selectedOption]?.correct ? 1 : 0);
      
      setLevelStats(prev => [...prev, {
        level: currentLevel + 1,
        correct: correctCount,
        total: currentLevelData.questions.length,
        score: score
      }]);
      
      setShowLevelResults(true);
    }
  };

  const nextLevel = () => {
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentQuestion(0);
      setCurrentLevelAnswers([]);
      setShowLevelResults(false);
      setShowExplanation(false);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setShowFinalResults(true);
    }
  };

  const goBackLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(prev => prev - 1);
      setCurrentQuestion(0);
      setCurrentLevelAnswers([]);
      setShowLevelResults(false);
      setShowExplanation(false);
      setSelectedOption(null);
      setTimeLeft(30);
    }
  };

  const completeGame = () => {
    const finalBadges = [...earnedBadges];
    if (score > 200) finalBadges.push('award');
    
    onGameComplete(score, finalBadges);
    
    toast({
      title: "Game Complete!",
      description: `You scored ${score} points and earned ${finalBadges.length} badges!`,
    });
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
            <CardTitle className="text-3xl text-primary">🌍 Eco Quiz Master</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Test your environmental knowledge with our comprehensive quiz levels!
              </p>
              <p className="text-sm text-muted-foreground">
                🎯 {gameLevels.length} levels available • 10 questions per level
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
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show level results
  if (showLevelResults) {
    const correctCount = currentLevelAnswers.filter(a => a.isCorrect).length + (selectedOption !== null && currentQuestionData?.options[selectedOption]?.correct ? 1 : 0);
    const percentage = Math.round((correctCount / currentLevelData.questions.length) * 100);
    
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl bg-card/90 border-primary/30 max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary">Level {currentLevel + 1} Complete!</CardTitle>
            <p className="text-lg text-muted-foreground">
              You scored {correctCount} out of {currentLevelData.questions.length} ({percentage}%)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{currentLevelData.questions.length - correctCount}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              <h4 className="text-lg font-semibold">Review Your Answers:</h4>
              {[...currentLevelAnswers, {
                question: currentQuestionData?.question || "",
                selectedAnswer: selectedOption !== null ? currentQuestionData?.options[selectedOption]?.text || "No answer" : "No answer",
                correctAnswer: currentQuestionData?.correctAnswer || "",
                isCorrect: selectedOption !== null ? (currentQuestionData?.options[selectedOption]?.correct || false) : false
              }].map((answer, index) => (
                <div key={index} className={`p-3 rounded-lg border ${answer.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center mb-1">
                    {answer.isCorrect ? (
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="font-medium text-sm">Q{index + 1}: {answer.question}</span>
                  </div>
                  <div className="text-sm text-muted-foreground ml-6">
                    <div>Your answer: {answer.selectedAnswer}</div>
                    {!answer.isCorrect && <div className="text-green-400">Correct answer: {answer.correctAnswer}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={goBackLevel}
                disabled={currentLevel === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back Level
              </Button>
              <Button 
                onClick={currentLevel < gameLevels.length - 1 ? nextLevel : () => setShowFinalResults(true)}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light"
              >
                {currentLevel < gameLevels.length - 1 ? (
                  <>
                    Next Level
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "View Final Results"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show final results
  if (showFinalResults) {
    const totalQuestions = levelStats.reduce((sum, level) => sum + level.total, 0);
    const totalCorrect = levelStats.reduce((sum, level) => sum + level.correct, 0);
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);
    
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl bg-card/90 border-primary/30 max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-primary">🏆 Quiz Complete!</CardTitle>
            <p className="text-xl text-muted-foreground">
              Overall Score: {totalCorrect}/{totalQuestions} ({overallPercentage}%)
            </p>
            <p className="text-lg">Final Score: {score} points</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{levelStats.length}</div>
                <div className="text-sm text-muted-foreground">Levels Completed</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{totalCorrect}</div>
                <div className="text-sm text-muted-foreground">Total Correct</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">{score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Level Summary:</h4>
              {levelStats.map((level, index) => (
                <div key={index} className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Level {level.level}</span>
                    <span className="text-sm">
                      {level.correct}/{level.total} ({Math.round((level.correct / level.total) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(level.correct / level.total) * 100} className="mt-2" />
                </div>
              ))}
            </div>

            {earnedBadges.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">Badges Earned:</h4>
                <div className="flex space-x-2">
                  {earnedBadges.map((badge, index) => (
                    <div key={badge} className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      {badge === 'tree' && <TreePine className="w-6 h-6 text-white" />}
                      {badge === 'energy' && <Zap className="w-6 h-6 text-white" />}
                      {badge === 'recycle' && <Recycle className="w-6 h-6 text-white" />}
                      {badge === 'award' && <Award className="w-6 h-6 text-white" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={completeGame}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-lg py-6"
            >
              Complete Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-card/90 border-primary/30">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading questions...</p>
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
                Level {currentLevel + 1} - Question {currentQuestion + 1}
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
          <Progress value={((currentQuestion + 1) / currentLevelData.questions.length) * 100} className="w-full" />
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
                <h3 className="text-lg font-semibold text-foreground">{currentQuestionData.question}</h3>
              </div>

              {!showExplanation ? (
                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
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
                        {selectedOption !== null && currentQuestionData.options[selectedOption]?.correct ? (
                          <Check className="w-5 h-5 text-green-400 mr-2" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                        )}
                        <span className="font-semibold">
                          {selectedOption !== null && currentQuestionData.options[selectedOption]?.correct ? 'Correct!' : 'Incorrect!'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Correct answer: <span className="text-green-400 font-medium">{currentQuestionData.correctAnswer}</span>
                      </p>
                    </div>

                    <Button
                      onClick={nextQuestion}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light"
                    >
                      {currentQuestion < currentLevelData.questions.length - 1 ? 'Next Question' : 'Complete Level'}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Progress Info */}
          <div className="border-t border-primary/20 pt-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Level Progress: {currentQuestion + 1}/{currentLevelData.questions.length}</span>
              <span>Total Levels: {gameLevels.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};