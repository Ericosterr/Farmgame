import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { plantTypes } from '../../data/mockData';

// Growbox Component
function GrowboxMesh({ size = 1, level = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Growbox Structure */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 0.1, 3]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Side Walls */}
      <mesh position={[-2, 0.5, 0]}>
        <boxGeometry args={[0.1, 2, 3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2, 0.5, 0]}>
        <boxGeometry args={[0.1, 2, 3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, -1.5]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 1.5]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Interior Reflective Surface */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.8, 1.8, 2.8]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          metalness={0.9} 
          roughness={0.1} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* LED Light Bar */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[3.5, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#4a4a4a" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Exhaust Fan */}
      <mesh position={[1.8, 1.2, -1.4]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Filter System */}
      <mesh position={[-1.8, 1.2, -1.4]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Plant Component with Growth Stages
function Plant3D({ plant, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const getPlantGeometry = () => {
    const progress = plant.progress / 100;
    const height = 0.5 + progress * 1.5; // Grows from 0.5 to 2.0 units
    
    switch (plant.type.toLowerCase()) {
      case 'tomato':
        return (
          <group>
            {/* Stem */}
            <mesh position={[0, height/2, 0]}>
              <cylinderGeometry args={[0.02 + progress * 0.03, 0.05, height]} />
              <meshStandardMaterial color="#2d5016" />
            </mesh>
            
            {/* Leaves */}
            {Array.from({ length: Math.floor(progress * 6) + 1 }, (_, i) => (
              <mesh key={i} position={[Math.sin(i) * 0.3, height * (0.3 + i * 0.1), Math.cos(i) * 0.3]}>
                <sphereGeometry args={[0.15 + progress * 0.1]} />
                <meshStandardMaterial color="#4a7c59" />
              </mesh>
            ))}
            
            {/* Fruit (only when mature) */}
            {plant.stage === 'ready' && (
              <mesh position={[0, height * 0.8, 0]}>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial color="#cc3333" />
              </mesh>
            )}
          </group>
        );
      
      case 'basil':
        return (
          <group>
            <mesh position={[0, height/2, 0]}>
              <cylinderGeometry args={[0.02, 0.04, height]} />
              <meshStandardMaterial color="#2d4a2b" />
            </mesh>
            
            {Array.from({ length: Math.floor(progress * 8) + 2 }, (_, i) => (
              <mesh key={i} position={[
                Math.sin(i * 0.8) * (0.2 + progress * 0.2),
                height * (0.2 + i * 0.08),
                Math.cos(i * 0.8) * (0.2 + progress * 0.2)
              ]}>
                <boxGeometry args={[0.15, 0.02, 0.08]} />
                <meshStandardMaterial color="#5d8233" />
              </mesh>
            ))}
          </group>
        );
      
      case 'lettuce':
        return (
          <group>
            {Array.from({ length: Math.floor(progress * 10) + 3 }, (_, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.sin(i * 0.6) * (0.3 + progress * 0.3),
                  0.1 + i * 0.05,
                  Math.cos(i * 0.6) * (0.3 + progress * 0.3)
                ]}
                rotation={[0, i * 0.6, Math.sin(i) * 0.3]}
              >
                <boxGeometry args={[0.3 + progress * 0.2, 0.02, 0.4 + progress * 0.2]} />
                <meshStandardMaterial color="#6b8e23" />
              </mesh>
            ))}
          </group>
        );
      
      default:
        return (
          <mesh position={[0, height/2, 0]}>
            <cylinderGeometry args={[0.05, 0.1, height]} />
            <meshStandardMaterial color="#4a7c59" />
          </mesh>
        );
    }
  };

  const getPotColor = () => {
    switch (plant.stage) {
      case 'ready': return '#8b4513';
      case 'growing': return '#a0522d';
      default: return '#654321';
    }
  };

  return (
    <group 
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Pot */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={getPotColor()} roughness={0.7} />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Plant */}
      {getPlantGeometry()}

      {/* Floating UI */}
      {hovered && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
            <div className="font-bold">{plant.type}</div>
            <div className="text-gray-600">Stage: {plant.stage}</div>
            <div className="text-gray-600">Progress: {plant.progress}%</div>
            <div className="text-blue-600">Water: {plant.waterLevel}%</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Empty Slot Component
function EmptySlot({ position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 4) * 0.02);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group 
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Empty Pot */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial 
          color="#666" 
          opacity={0.5} 
          transparent 
          roughness={0.7} 
        />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Plus Sign */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#4ade80" 
          emissive="#22c55e"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#4ade80" 
          emissive="#22c55e"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
            <div className="font-bold">Plant Seed</div>
            <div className="text-gray-600">Click to add a new plant</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main 3D Scene Component
function GrowBox3D({ gameState, updateGameState, onPlantClick, onEmptySlotClick }) {
  const currentGrowBox = gameState.growBoxes[0];
  
  const handlePlantClick = (plantId) => {
    if (onPlantClick) {
      onPlantClick(plantId);
    }
  };

  const handleEmptySlotClick = (slotIndex) => {
    if (onEmptySlotClick) {
      onEmptySlotClick(slotIndex);
    }
  };

  // Calculate plant positions in a grid
  const getPlantPosition = (index, capacity) => {
    const cols = Math.ceil(Math.sqrt(capacity));
    const rows = Math.ceil(capacity / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const spacing = 0.8;
    const offsetX = (cols - 1) * spacing / 2;
    const offsetZ = (rows - 1) * spacing / 2;
    
    return [
      col * spacing - offsetX,
      -0.3,
      row * spacing - offsetZ
    ];
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <Canvas 
        camera={{ position: [3, 3, 3], fov: 60 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 2, 0]} intensity={0.8} color="#ffffff" />
        
        {/* Environment */}
        <Environment preset="warehouse" />
        
        {/* Growbox */}
        <GrowboxMesh level={currentGrowBox.level} />
        
        {/* Plants and Empty Slots */}
        {Array.from({ length: currentGrowBox.capacity }, (_, index) => {
          const plant = currentGrowBox.plants[index];
          const position = getPlantPosition(index, currentGrowBox.capacity);
          
          return plant ? (
            <Plant3D
              key={plant.id}
              plant={plant}
              position={position}
              onClick={() => handlePlantClick(plant.id)}
            />
          ) : (
            <EmptySlot
              key={`empty-${index}`}
              position={position}
              onClick={() => handleEmptySlotClick(index)}
            />
          );
        })}
        
        {/* Ground */}
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
        />
        
        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

export default GrowBox3D;