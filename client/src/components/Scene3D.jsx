import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import TradingChart3D from './TradingChart3D';
import FloatingCoins from './FloatingCoins';

const Scene3D = ({ children, style = {} }) => {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#00ffff" intensity={0.5} />
        {children}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export const TradingScene = () => (
  <Scene3D>
    <TradingChart3D position={[-2, 0, 0]} />
    <FloatingCoins count={3} />
  </Scene3D>
);

export const CoinsScene = () => (
  <Scene3D>
    <FloatingCoins count={5} />
  </Scene3D>
);

export default Scene3D;

