import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, TreePine, Recycle, Zap, Droplets, Users, Heart, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';

const impactStats = [
  {
    icon: TreePine,
    title: "Trees Planted",
    value: 125420,
    unit: "trees",
    color: "text-green-400",
    bgColor: "from-green-400/20 to-green-600/20"
  },
  {
    icon: Recycle,
    title: "Waste Recycled",
    value: 89340,
    unit: "kg",
    color: "text-blue-400",
    bgColor: "from-blue-400/20 to-blue-600/20"
  },
  {
    icon: Zap,
    title: "Energy Saved",
    value: 234560,
    unit: "kWh",
    color: "text-yellow-400",
    bgColor: "from-yellow-400/20 to-yellow-600/20"
  },
  {
    icon: Droplets,
    title: "Water Conserved",
    value: 156780,
    unit: "liters",
    color: "text-cyan-400",
    bgColor: "from-cyan-400/20 to-cyan-600/20"
  }
];

const globalStats = [
  { title: "Active Users", value: 2500000, icon: Users, color: "text-primary" },
  { title: "Countries Reached", value: 195, icon: Globe, color: "text-accent" },
  { title: "CO₂ Reduced", value: 45000, unit: "tons", icon: Leaf, color: "text-green-400" },
  { title: "Lives Impacted", value: 890000, icon: Heart, color: "text-red-400" }
];

const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export const ImpactZone = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-accent glow-accent mr-4 animate-earth-rotate" />
            <h2 className="text-5xl font-bold text-foreground text-glow">Impact Zone</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Witness the incredible transformation our global community has achieved together!
          </p>
        </motion.div>

        {/* Earth Transformation Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mb-20"
        >
          <Card className="bg-gradient-to-br from-card/90 to-primary/5 backdrop-blur-sm border-primary/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h3 className="text-3xl font-bold text-foreground">Earth's Transformation</h3>
                
                {/* Before/After Earth Animation */}
                <div className="relative h-64 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Polluted Earth (background) */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 to-brown-600 opacity-30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Clean Earth (overlay) */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent glow-primary"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      animate={{ rotate: -360 }}
                      style={{ 
                        background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--accent)))',
                        boxShadow: 'inset 0 0 50px rgba(0, 255, 136, 0.3), 0 0 100px rgba(0, 170, 255, 0.2)'
                      }}
                    />
                    
                    {/* Floating eco elements */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4"
                        style={{
                          left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
                          top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
                        }}
                        animate={{
                          rotate: 360,
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {i % 4 === 0 && <TreePine className="w-full h-full text-green-400" />}
                        {i % 4 === 1 && <Recycle className="w-full h-full text-blue-400" />}
                        {i % 4 === 2 && <Zap className="w-full h-full text-yellow-400" />}
                        {i % 4 === 3 && <Droplets className="w-full h-full text-cyan-400" />}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-center">
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-muted-foreground">Before Our Impact</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Polluted atmosphere</li>
                      <li>Massive waste accumulation</li>
                      <li>Excessive energy consumption</li>
                      <li>Water scarcity crisis</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-primary">After Our Collective Action</h4>
                    <ul className="text-sm text-foreground space-y-1">
                      <li>Clean, breathable atmosphere</li>
                      <li>Circular economy principles</li>
                      <li>Renewable energy adoption</li>
                      <li>Water conservation success</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Card className={`
                bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border-primary/20 
                hover:glow-primary transition-all duration-300 card-3d overflow-hidden
              `}>
                <CardContent className="p-6 text-center relative">
                  {/* Background icon */}
                  <div className="absolute top-2 right-2 opacity-10">
                    <stat.icon className="w-16 h-16" />
                  </div>
                  
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{stat.unit}</div>
                  <div className="text-lg font-semibold text-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Global Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-accent/30 hover:glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-foreground">Global Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {globalStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center space-y-3"
                  >
                    <stat.icon className={`w-10 h-10 mx-auto ${stat.color}`} />
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      <AnimatedCounter value={stat.value} />
                      {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-primary/30 glow-primary">
            <CardContent className="p-12">
              <h3 className="text-4xl font-bold text-foreground mb-6">Join the Movement!</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Every action counts. Together, we're creating a sustainable future for generations to come.
                Your contribution makes a real difference in healing our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg glow-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Impact Journey
                </motion.button>
                <motion.button
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating impact elements */}
        <div className="relative mt-20 h-32 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 10)}%`,
                top: `${Math.sin(i * 0.6) * 30 + 50}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {i % 5 === 0 && <TreePine className="w-6 h-6 text-green-400/20" />}
              {i % 5 === 1 && <Recycle className="w-6 h-6 text-blue-400/20" />}
              {i % 5 === 2 && <Zap className="w-6 h-6 text-yellow-400/20" />}
              {i % 5 === 3 && <Droplets className="w-6 h-6 text-cyan-400/20" />}
              {i % 5 === 4 && <Heart className="w-6 h-6 text-red-400/20" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};