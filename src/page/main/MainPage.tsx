import { Canvas } from '@react-three/fiber';
import Book from '../../components/Book';
import { Suspense } from 'react';
import Experience from '../../components/Experience';
import { Loader } from '@react-three/drei';
import { usePageStore } from '../../store/pageAtom';

export default function MainPage() {
  const { page, nextPage, prevPage } = usePageStore((state) => state);
  return (
    <>
      {page}
      <button
        onClick={() => {
          if (page > 16) return;
          nextPage(1);
        }}
        type="button"
      >
        다음
      </button>
      <button
        onClick={() => {
          if (page === 0) return;
          prevPage(1);
        }}
        type="button"
      >
        이전
      </button>
      <Loader />
      <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
}
