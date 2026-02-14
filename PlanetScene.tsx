"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { PlanetData } from "@/src/app/page"; // Ensure this matches where you export the type
import "@/components/ProceduralPlanetMaterial"; 

// Define specific props for the Mesh
interface PlanetMeshProps {
  planet: PlanetData;
  year: number;
  isWarping: boolean;
}

function PlanetMesh({ planet, year, isWarping }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Calculate Terraform Progress (0.0 - 1.0)
  const terraformFactor = useMemo(() => {
    if (planet.id === 'earth_ref') return 0.5; 
    const maxYear = 10000;
    let factor = year / maxYear;
    factor = factor * (1.0 - planet.terraformDifficulty * 0.2); 
    return Math.min(Math.max(factor, 0), 1);
  }, [year, planet]);

  // Prepare Colors
  const colors = useMemo(() => ({
    base1: new THREE.Color(planet.baseColor1),
    base2: new THREE.Color(planet.baseColor2),
    plant: new THREE.Color(planet.plantColor),
    water: new THREE.Color(planet.waterColor),
  }), [planet]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const rotationSpeed = 0.05 + (terraformFactor * 0.2);
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      
      materialRef.current.uniforms.uTerraformFactor.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uTerraformFactor.value,
        terraformFactor,
        delta * 2.5
      );
    }
  });

  return (
    <mesh ref={meshRef} scale={isWarping ? 0.01 : 2.8}>
      <sphereGeometry args={[1, 128, 128]} /> 
      {/* Typescript now knows this tag exists because of the fix in ProceduralPlanetMaterial */}
      <proceduralMaterial
        ref={materialRef}
        uBaseColor1={colors.base1}
        uBaseColor2={colors.base2}
        uPlantColor={colors.plant}
        uWaterColor={colors.water}
        uTerraformFactor={0} 
      />
    </mesh>
  );
}

export default function PlanetScene({ planet, year, isWarping }: PlanetMeshProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.1} />
      <pointLight position={[15, 10, 10]} intensity={1.5} color="#fff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4c6ef5" />

      <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
      
      <Suspense fallback={null}>
        <PlanetMesh planet={planet} year={year} isWarping={isWarping} />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        minDistance={3.5} 
        maxDistance={12} 
        autoRotate={false}
      />
    </Canvas>
  );
}