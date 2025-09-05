import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface HotspotProps {
  position: [number, number, number];
  label: string;
  onClick: () => void;
  color: string;
}

const Hotspot = ({ position, label, onClick, color }: HotspotProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <Sphere
        args={[0.05, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {hovered && (
        <Html distanceFactor={10}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-1 text-sm text-foreground glow-primary"
          >
            {label}
          </motion.div>
        </Html>
      )}
    </group>
  );
};

interface Earth3DProps {
  pollutionLevel: number; // 0-1, 0 = clean, 1 = polluted
  onHotspotClick: (section: string) => void;
}

export const Earth3D = ({ pollutionLevel, onHotspotClick }: Earth3DProps) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  // Rotate Earth
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });

  // Calculate Earth colors based on pollution level
  const earthColor = new THREE.Color().lerpColors(
    new THREE.Color('#00ff88'), // Clean green
    new THREE.Color('#8b4513'), // Polluted brown
    pollutionLevel
  );

  const atmosphereColor = new THREE.Color().lerpColors(
    new THREE.Color('#00aaff'), // Clean blue
    new THREE.Color('#666666'), // Polluted gray
    pollutionLevel
  );

  // Hotspot positions (lat/lon converted to 3D coordinates)
  const hotspots = [
    { position: [1.2, 0.5, 0.8] as [number, number, number], label: "Games Zone", section: "games", color: "#00ff88" },
    { position: [-0.8, 0.3, 1.1] as [number, number, number], label: "Rewards", section: "rewards", color: "#00aaff" },
    { position: [0.2, -0.9, 0.9] as [number, number, number], label: "Leaderboard", section: "leaderboard", color: "#ff6b6b" },
    { position: [-1.1, -0.2, 0.6] as [number, number, number], label: "Dashboard", section: "dashboard", color: "#ffaa00" },
    { position: [0.7, 1.0, -0.5] as [number, number, number], label: "Impact", section: "impact", color: "#aa88ff" }
  ];

  return (
    <group>
      {/* Earth Core */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color={earthColor}
          emissive={earthColor}
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[1.05, 32, 32]}>
        <meshStandardMaterial
          color={atmosphereColor}
          transparent
          opacity={0.3}
          emissive={atmosphereColor}
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Glowing outer atmosphere */}
      <Sphere args={[1.1, 32, 32]}>
        <meshStandardMaterial
          color={atmosphereColor}
          transparent
          opacity={0.1}
          emissive={atmosphereColor}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Interactive Hotspots */}
      {hotspots.map((hotspot, index) => (
        <Hotspot
          key={index}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => onHotspotClick(hotspot.section)}
          color={hotspot.color}
        />
      ))}

      {/* Floating eco-elements around Earth */}
      <group>
        {/* Floating Trees */}
        {!pollutionLevel && Array.from({ length: 8 }).map((_, i) => (
          <group key={`tree-${i}`} rotation={[0, (i * Math.PI * 2) / 8, 0]}>
            <group position={[2, Math.sin(i) * 0.5, 0]}>
              <Sphere args={[0.02, 8, 8]} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} />
              </Sphere>
            </group>
          </group>
        ))}

        {/* Recycling Symbols */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`recycle-${i}`} rotation={[0, (i * Math.PI * 2) / 6 + Date.now() * 0.001, 0]}>
            <Text
              position={[2.5, 0, 0]}
              fontSize={0.1}
              color="#00aaff"
              anchorX="center"
              anchorY="middle"
            >
              ♻
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};