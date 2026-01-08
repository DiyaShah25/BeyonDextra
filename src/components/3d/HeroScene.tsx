import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useAccessibility } from '@/contexts/AccessibilityContext';

function FloatingOrb({ position, color, size, speed }: { 
  position: [number, number, number]; 
  color: string; 
  size: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.8}
          distort={0.3}
          speed={2}
          roughness={0}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const points = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      p.push([x, y, z]);
    }
    return p;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flat()), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#2dd4bf"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function ConnectingLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  const points = useMemo(() => [
    new THREE.Vector3(-2, -1, 0),
    new THREE.Vector3(0, 1, 1),
    new THREE.Vector3(2, -0.5, -1),
    new THREE.Vector3(3, 1, 0.5),
  ], []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const linePoints = useMemo(() => curve.getPoints(50), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

  return (
    <group ref={linesRef}>
      <line>
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial color="#fbbf24" opacity={0.4} transparent linewidth={2} />
      </line>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#2dd4bf" />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      
      {/* Floating orbs representing diversity and inclusion */}
      <FloatingOrb position={[-3, 0, -2]} color="#2dd4bf" size={0.8} speed={1.2} />
      <FloatingOrb position={[2.5, 1, -3]} color="#fbbf24" size={0.6} speed={1.5} />
      <FloatingOrb position={[0, -1, -1]} color="#f97316" size={0.5} speed={1} />
      <FloatingOrb position={[-1.5, 2, -4]} color="#3b82f6" size={0.4} speed={0.8} />
      <FloatingOrb position={[3, -1.5, -2]} color="#8b5cf6" size={0.45} speed={1.3} />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Connecting lines symbolizing community */}
      <ConnectingLines />
    </>
  );
}

export function HeroScene() {
  const { settings } = useAccessibility();

  // Don't render 3D scene if reduced motion is enabled
  if (settings.reduceMotion) {
    return (
      <div 
        className="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
