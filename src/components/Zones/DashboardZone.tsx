import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XPBar } from '@/components/Gamification/XPBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, TreePine, Recycle, Zap, Droplets, Target, Calendar, TrendingUp } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', activities: 12, xp: 240 },
  { day: 'Tue', activities: 15, xp: 300 },
  { day: 'Wed', activities: 8, xp: 160 },
  { day: 'Thu', activities: 20, xp: 400 },
  { day: 'Fri', activities: 18, xp: 360 },
  { day: 'Sat', activities: 25, xp: 500 },
  { day: 'Sun', activities: 22, xp: 440 }
];

const impactData = [
  { name: 'Trees Planted', value: 45, color: '#00ff88' },
  { name: 'Waste Recycled', value: 120, color: '#00aaff' },
  { name: 'Energy Saved', value: 89, color: '#ffaa00' },
  { name: 'Water Conserved', value: 67, color: '#88aaff' }
];

const achievements = [
  { icon: TreePine, title: "Tree Planter", count: 45, total: 50, color: "text-green-400" },
  { icon: Recycle, title: "Recycler", count: 120, total: 150, color: "text-blue-400" },
  { icon: Zap, title: "Energy Saver", count: 89, total: 100, color: "text-yellow-400" },
  { icon: Droplets, title: "Water Guardian", count: 67, total: 75, color: "text-cyan-400" }
];

export const DashboardZone = () => {
  const totalXP = weeklyData.reduce((sum, day) => sum + day.xp, 0);
  const totalActivities = weeklyData.reduce((sum, day) => sum + day.activities, 0);

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
            <Activity className="w-12 h-12 text-primary glow-primary mr-4" />
            <h2 className="text-5xl font-bold text-foreground text-glow">Dashboard</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your environmental impact and monitor your sustainability journey!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Target, title: "Daily Goal", value: "18/20", subtitle: "Actions completed", color: "text-primary" },
            { icon: Calendar, title: "Streak", value: "67", subtitle: "Days active", color: "text-accent" },
            { icon: TrendingUp, title: "This Week", value: totalActivities.toString(), subtitle: "Total actions", color: "text-green-400" },
            { icon: Activity, title: "XP Earned", value: totalXP.toString(), subtitle: "Experience points", color: "text-yellow-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:glow-primary transition-all duration-300 card-3d">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
                  <div className="text-xs text-primary font-semibold mt-1">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <XPBar currentXP={2450} maxXP={3000} level={34} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:glow-primary transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <BarChart className="w-6 h-6 mr-2 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--primary) / 0.3)',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar 
                      dataKey="activities" 
                      fill="hsl(var(--primary))" 
                      name="Activities"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* XP Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-accent/20 hover:glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-accent" />
                  XP Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--accent) / 0.3)',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                      name="XP Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Impact Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:glow-primary transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Impact Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                      fontSize={12}
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--primary) / 0.3)',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievement Progress */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-accent/20 hover:glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-foreground">{achievement.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {achievement.count}/{achievement.total}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r from-primary to-accent`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(achievement.count / achievement.total) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Floating data points */}
        <div className="relative mt-20 h-32 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 16.66)}%`,
                top: `${Math.sin(i * 0.7) * 30 + 50}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {i % 4 === 0 && <Activity className="w-6 h-6 text-primary/30" />}
              {i % 4 === 1 && <BarChart className="w-6 h-6 text-accent/30" />}
              {i % 4 === 2 && <TrendingUp className="w-6 h-6 text-green-400/30" />}
              {i % 4 === 3 && <Target className="w-6 h-6 text-yellow-400/30" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};