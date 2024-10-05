import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  SpotLight,
  useDepthBuffer,
  useHelper,
  useTexture,
} from '@react-three/drei';
import Book from './Book';
import { useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
const city = import(`${import.meta.env.BASE_URL}/hdr/park.hdr`).then((module) => module.default);
export default function Experience() {
  const control = useRef<any>(null);
  const depthBuffer = useDepthBuffer({ frames: 1 });
  const options = useMemo(() => {
    return {
      position: {
        x: { value: 0, min: -10, max: 10, step: 0.1 },
        y: { value: 0, min: -10, max: 10, step: 0.1 },
        z: { value: 0, min: -10, max: 10, step: 0.1 },
      },
      rotation: {
        x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
        y: { value: -1.34, min: -Math.PI * 2, max: Math.PI * 2, step: 0.01 },
        z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      },
    };
  }, []);

  return (
    <>
      <Book control={control} />

      <OrbitControls
        ref={control}
        enabled={false}
        minDistance={3} // 최소 줌 거리
        maxDistance={5} // 최대 줌 거리
        enableZoom={false} // 줌 활성화
        // enableRotate={false}
        minPolarAngle={Math.PI / 2} // 세로 회전 제한 (45도)
        maxPolarAngle={Math.PI / 2} // 세로 회전 제한 (90도)
        // minAzimuthAngle={-Math.PI / 2} // 수평 회전 제한 (-90도)
        // maxAzimuthAngle={Math.PI / 2} // 수평 회전 제한 (90도)
      />
      {/* <Environment
        files={`${import.meta.env.BASE_URL}/hdr/park.hdr`}
        ground={{ height: -1, radius: 5, scale: 50 }}
      /> */}
      <MovingSpot depthBuffer={depthBuffer} color="white" position={[3, 3, 2]} />
      <MovingSpot depthBuffer={depthBuffer} color="white" position={[1, 3, 0]} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={4}
        color={'white'}
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
function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef<any>();
  const viewport = useThree((state) => state.viewport);
  // useFrame((state) => {
  //   light.current.target.position.lerp(
  //     vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0),
  //     0.1
  //   );
  //   light.current.target.updateMatrixWorld();
  // });
  return (
    <SpotLight
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.35}
      castShadow={false}
      attenuation={3}
      anglePower={6}
      intensity={2}
      {...props}
    />
  );
}
