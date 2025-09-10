import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scene3D } from "@/components/3D/Scene3D";
import { GamesZone } from "@/components/Zones/GamesZone";
import { RewardsZone } from "@/components/Zones/RewardsZone";
import { LeaderboardZone } from "@/components/Zones/LeaderboardZone";
import { DashboardZone } from "@/components/Zones/DashboardZone";
import { ImpactZone } from "@/components/Zones/ImpactZone";
import { Button } from "@/components/ui/button";
import { Home, Menu, Gamepad2 } from "lucide-react";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [scrollY, setScrollY] = useState(0);
  const [userCoins, setUserCoins] = useState(850);
  const [userXP, setUserXP] = useState(2450);
  const [userBadges, setUserBadges] = useState<string[]>(['tree', 'recycle']);

  // Calculate pollution level based on scroll (transforms as user scrolls)
  const pollutionLevel = Math.max(0, Math.min(1, 1 - scrollY / 1000));

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHotspotClick = (section: string) => {
    setCurrentSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGameStart = (gameId: number) => {
    console.log(`Starting game ${gameId}`);
  };

  const handleGameComplete = (gameId: number, score: number, badges: string[]) => {
    setUserXP(prev => prev + score);
    setUserCoins(prev => prev + Math.floor(score / 2));
    setUserBadges(prev => [...new Set([...prev, ...badges])]);
    
    console.log(`Game ${gameId} completed! Score: ${score}, Badges: ${badges.join(', ')}`);
  };

  const handleRewardClaim = (rewardId: number) => {
    console.log(`Claiming reward ${rewardId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-primary/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary text-glow">🌍 EcoVerse</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSection("home")}
              className="text-primary hover:bg-primary/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Link to="/games">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/20"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games Only
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Sections */}
      <div className="pt-20">{/* Add top padding for fixed nav */}</div>
      <div id="games"><GamesZone onGameStart={handleGameStart} onGameComplete={handleGameComplete} /></div>
      
      {/* 3D Earth Section */}
      <section className="h-screen relative overflow-hidden" id="earth">
        <div className="absolute inset-0">
          <Scene3D 
            pollutionLevel={pollutionLevel}
            onHotspotClick={handleHotspotClick}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
        
        <motion.div 
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground text-glow mb-4">
            Save Our Planet
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Click the hotspots to explore different zones!
          </p>
        </motion.div>
      </section>
      <div id="rewards"><RewardsZone userCoins={userCoins} onRewardClaim={handleRewardClaim} /></div>
      <div id="leaderboard"><LeaderboardZone /></div>
      <div id="dashboard"><DashboardZone /></div>
      <div id="impact"><ImpactZone /></div>
    </div>
  );
};

export default Index;
