import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, Zap, TrendingUp } from 'lucide-react';

const leaderboardData = [
  {
    rank: 1,
    name: "EcoChampion2024",
    avatar: "/api/placeholder/40/40",
    score: 15420,
    level: 45,
    badge: "Platinum Eco Warrior",
    streak: 127,
    country: "🌍"
  },
  {
    rank: 2,
    name: "GreenThumb",
    avatar: "/api/placeholder/40/40", 
    score: 14890,
    level: 42,
    badge: "Gold Tree Planter",
    streak: 89,
    country: "🇺🇸"
  },
  {
    rank: 3,
    name: "RecycleKing",
    avatar: "/api/placeholder/40/40",
    score: 14205,
    level: 40,
    badge: "Silver Recycler",
    streak: 156,
    country: "🇯🇵"
  },
  {
    rank: 4,
    name: "SolarSage",
    avatar: "/api/placeholder/40/40",
    score: 13750,
    level: 38,
    badge: "Bronze Energy Master",
    streak: 78,
    country: "🇩🇪"
  },
  {
    rank: 5,
    name: "OceanProtector",
    avatar: "/api/placeholder/40/40",
    score: 13200,
    level: 36,
    badge: "Water Guardian",
    streak: 203,
    country: "🇦🇺"
  },
  {
    rank: 6,
    name: "WindWarrior",
    avatar: "/api/placeholder/40/40",
    score: 12800,
    level: 35,
    badge: "Clean Energy Advocate",
    streak: 45,
    country: "🇳🇴"
  },
  {
    rank: 7,
    name: "You",
    avatar: "/api/placeholder/40/40",
    score: 12450,
    level: 34,
    badge: "Rising Star",
    streak: 67,
    country: "🇬🇧"
  }
];

const categories = [
  { title: "Overall", icon: Trophy, active: true },
  { title: "Weekly", icon: Zap, active: false },
  { title: "Friends", icon: Award, active: false },
  { title: "Local", icon: Medal, active: false }
];

export const LeaderboardZone = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1: return "glow-primary border-yellow-400/50";
      case 2: return "glow-accent border-gray-300/50";
      case 3: return "border-orange-400/50";
      default: return rank === 7 ? "glow-primary border-primary/50" : "border-muted/30";
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-400 glow-primary mr-4" />
            <h2 className="text-5xl font-bold text-foreground text-glow">Leaderboards</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compete with eco-warriors worldwide and climb the sustainability rankings!
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-2 border border-primary/20">
            <div className="flex space-x-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.title}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300
                    ${category.active 
                      ? 'bg-primary text-primary-foreground glow-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="font-semibold">{category.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                x: 10
              }}
            >
              <Card className={`
                bg-card/80 backdrop-blur-sm border overflow-hidden group transition-all duration-300 card-3d
                ${getRankGlow(player.rank)}
                ${player.name === "You" ? "ring-2 ring-primary/50" : ""}
              `}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(player.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-12 h-12 border-2 border-primary/30">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {player.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-bold ${
                          player.name === "You" ? "text-primary" : "text-foreground"
                        }`}>
                          {player.name}
                        </h3>
                        <span className="text-lg">{player.country}</span>
                        {player.name === "You" && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Level {player.level}</span>
                        <span className="bg-accent/20 text-accent px-2 py-1 rounded">
                          {player.badge}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {player.score.toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-accent">
                        <Zap className="w-3 h-3" />
                        <span>{player.streak} day streak</span>
                      </div>
                    </div>

                    {/* Trending indicator */}
                    <div className="text-green-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Personal Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-primary/30 glow-primary">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-foreground">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">7th</div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                  <div className="text-xs text-accent">↑ 3 positions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">2,450</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                  <div className="text-xs text-green-400">↑ 150 this week</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-400">67</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                  <div className="text-xs text-primary">Personal best!</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">15</div>
                  <div className="text-sm text-muted-foreground">Friends Ahead</div>
                  <div className="text-xs text-muted-foreground">Keep climbing!</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating trophies */}
        <div className="relative mt-20 h-32 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 20)}%`,
                top: `${Math.sin(i * 0.8) * 25 + 50}%`,
              }}
              animate={{
                y: [0, -25, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Trophy className="w-8 h-8 text-yellow-400/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};