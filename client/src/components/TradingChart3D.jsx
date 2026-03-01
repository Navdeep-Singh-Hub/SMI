import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const TradingChart3D = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef(null);
  const barsRef = useRef([]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        height: Math.random() * 2 + 0.5,
        x: i * 0.3 - 3,
        color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    barsRef.current.forEach((bar, i) => {
      if (bar) {
        bar.position.y = chartData[i].height / 2;
        bar.scale.y = chartData[i].height;
      }
    });
  });

  return (
    <group ref={meshRef} position={position}>
      {chartData.map((bar, i) => (
        <mesh
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          position={[bar.x, 0, 0]}
        >
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial
            color={bar.color}
            emissive={bar.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export default TradingChart3D;
