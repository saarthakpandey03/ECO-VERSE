import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EcoGame } from '@/components/Games/EcoGame';
import { ForestProtectorGame } from '@/components/Games/ForestProtectorGame';
import { OceanCleanupGame } from '@/components/Games/OceanCleanupGame';
import { TreePine, Droplets, Leaf, ArrowLeft } from 'lucide-react';

export const GamePage = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    badges: [] as string[],
    level: 1
  });

  const games = [
    {
      id: 'eco-quiz',
      title: 'Eco Quiz Challenge',
      description: 'Test your environmental knowledge with interactive quizzes',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'forest-protector',
      title: 'Forest Protector',
      description: 'Save forests by planting trees and fighting deforestation',
      icon: TreePine,
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'ocean-cleanup',
      title: 'Ocean Cleanup',
      description: 'Clean plastic pollution and save marine life',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const handleGameComplete = (score: number, badges: string[]) => {
    setUserStats(prev => ({
      totalScore: prev.totalScore + score,
      badges: [...new Set([...prev.badges, ...badges])],
      level: Math.floor((prev.totalScore + score) / 1000) + 1
    }));
    setCurrentGame(null);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  if (currentGame) {
    switch (currentGame) {
      case 'eco-quiz':
        return <EcoGame gameId={1} onGameComplete={handleGameComplete} onClose={handleBackToMenu} />;
      case 'forest-protector':
        return <ForestProtectorGame gameId={2} onGameComplete={handleGameComplete} onClose={handleBackToMenu} />;
      case 'ocean-cleanup':
        return <OceanCleanupGame gameId={3} onGameComplete={handleGameComplete} onClose={handleBackToMenu} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🌍 Eco Games</h1>
          <p className="text-lg text-muted-foreground">Learn about our environment through interactive games</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{userStats.totalScore}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{userStats.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card key={game.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">{game.description}</p>
                  <Button 
                    onClick={() => setCurrentGame(game.id)}
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold`}
                  >
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badges Display */}
        {userStats.badges.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">🏆 Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                {userStats.badges.map((badge, index) => (
                  <div key={index} className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white text-sm">🏅</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};