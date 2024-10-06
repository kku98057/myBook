import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  SpotLight,
  useDepthBuffer,
} from '@react-three/drei';
import Book from './Book';
import { useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useThree, Vector3Props } from '@react-three/fiber';
import { useControls } from 'leva';
import { compressNormals } from 'three/examples/jsm/utils/GeometryCompressionUtils.js';
import * as THREE from 'three';

export default function Experience() {
  const control = useRef<any>(null);
  // const depthBuffer = useDepthBuffer({ frames: 1 });
  const options = useMemo(() => {
    return {
      position: {
        x: { value: 2, min: -10, max: 10, step: 0.1 },
        y: { value: 5, min: -10, max: 10, step: 0.1 },
        z: { value: 2, min: -10, max: 10, step: 0.1 },
      },
      shadow: { value: true },
      spotlight: { value: true, distance: { value: 80, min: 0, max: 100, step: 0.1 } },
    };
  }, []);

  const lightPosition = useControls('빛위치', options.position);
  const shadow = useControls('그림자', options.shadow);
  const spotlight = useControls('스포트라이트', options.spotlight);
  const spotlightDistance = useControls('스포트라이트', options.spotlight);
  return (
    <>
      <Float speed={3} floatingRange={[0, 0]} rotationIntensity={0.5}>
        <Book control={control} />
      </Float>
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

      {/* <MovingSpot
        // depthBuffer={depthBuffer}
        color="white"
        position={[3, 3, 2]}
        spotlight={spotlight.value}
        spotlightDistance={spotlightDistance.distance}
      />
      <MovingSpot
        // depthBuffer={depthBuffer}
        color="white"
        position={[1, 3, 0]}
        spotlight={spotlight.value}
        spotlightDistance={spotlightDistance.distance}
      /> */}
      <directionalLight
        position={[lightPosition.x, lightPosition.y, lightPosition.z]}
        intensity={4}
        color={'white'}
        castShadow={shadow.value}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
      <Lamp
        position={[0, 1.52, 0]}
        scale={0.1}
        spotlight={spotlight.value}
        spotlightDistance={spotlightDistance.distance}
      />
    </>
  );
}
function MovingSpot({
  vec = new Vector3(),
  spotlight,
  spotlightDistance,
  ...props
}: {
  spotlight: boolean;
  vec: Vector3Props;
  spotlightDistance: boolean;
} & any) {
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
      distance={spotlightDistance}
      angle={0.35}
      castShadow={false}
      attenuation={spotlight ? 3 : 0}
      anglePower={6}
      intensity={2}
      {...props}
    />
  );
}
export function Lamp({
  spotlight,
  spotlightDistance,
  ...props
}: { spotlight: boolean; spotlightDistance: boolean } & any) {
  const [target] = useState(() => new THREE.Object3D());
  return (
    <mesh {...props}>
      <cylinderGeometry args={[0.5, 1.5, 2, 32]} />
      <meshStandardMaterial />
      <SpotLight
        castShadow={false}
        target={target}
        penumbra={0.2}
        radiusTop={0.4}
        radiusBottom={40}
        distance={spotlightDistance}
        angle={0.45}
        attenuation={spotlight ? 20 : 0}
        anglePower={5}
        intensity={1}
        opacity={0.2}
      />
      <primitive object={target} position={[0, -1, 0]} />
    </mesh>
  );
}
