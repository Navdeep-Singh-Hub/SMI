import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const FloatingCoins = ({ count = 5 }) => {
  const coinsRef = useRef([]);

  const coins = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: Math.random() * 0.02 + 0.01,
    }));
  }, [count]);

  useFrame((state) => {
    coinsRef.current.forEach((coin, i) => {
      if (coin) {
        coin.rotation.y += coins[i].speed;
        coin.position.y = coins[i].position[1] + Math.sin(state.clock.elapsedTime + i) * 0.5;
      }
    });
  });

  return (
    <group>
      {coins.map((coin, i) => (
        <mesh
          key={i}
          ref={(el) => (coinsRef.current[i] = el)}
          position={coin.position}
          rotation={coin.rotation}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default FloatingCoins;
