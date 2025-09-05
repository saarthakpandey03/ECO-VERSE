import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { Earth3D } from './Earth3D';

interface Scene3DProps {
  pollutionLevel: number;
  onHotspotClick: (section: string) => void;
}

export const Scene3D = ({ pollutionLevel, onHotspotClick }: Scene3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        className="bg-gradient-to-b from-background via-background to-primary/5"
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} color="#00ff88" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color="#ffffff"
          castShadow
        />
        <pointLight
          position={[-5, -5, -5]}
          intensity={0.5}
          color="#00aaff"
        />

        {/* Environment */}
        <Stars
          radius={300}
          depth={60}
          count={1000}
          factor={7}
          saturation={0}
          fade={true}
        />
        
        {/* 3D Earth */}
        <Earth3D 
          pollutionLevel={pollutionLevel} 
          onHotspotClick={onHotspotClick}
        />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};