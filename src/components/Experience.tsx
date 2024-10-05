import { Environment, OrbitControls } from '@react-three/drei';
import Book from './Book';
import { useRef } from 'react';

export default function Experience() {
  const control = useRef<any>(null);
  return (
    <>
      <Book control={control} />

      <OrbitControls
        ref={control}
        minDistance={3} // 최소 줌 거리
        maxDistance={5} // 최대 줌 거리
        enableZoom={true} // 줌 활성화
        // enableRotate={false}
        // minPolarAngle={Math.PI / 6} // 세로 회전 제한 (45도)
        // maxPolarAngle={Math.PI / 2} // 세로 회전 제한 (90도)
        // minAzimuthAngle={-Math.PI / 2} // 수평 회전 제한 (-90도)
        // maxAzimuthAngle={Math.PI / 2} // 수평 회전 제한 (90도)
      />
      <Environment preset="studio" />

      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
}
