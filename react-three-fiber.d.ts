// react-three-fiber.d.ts
import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  // `group`과 같은 컴포넌트의 Props를 정의합니다.
  interface IntrinsicElements {
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
  }
}
