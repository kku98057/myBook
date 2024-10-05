import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import Experience from '../../components/Experience';
import { Environment, Lightformer, Loader } from '@react-three/drei';
import { usePageStore } from '../../store/pageAtom';
import { pages } from '../../components/UI';
export default function MainPage() {
  const { setPage, page } = usePageStore((state) => state);

  return (
    <>
      <Loader />
      <Canvas
        shadows
        camera={{ position: [0.5, 1, 4], fov: 45 }}
        style={{ position: 'fixed', top: 0 }}
      >
        <fog attach="fog" args={['#202020', 5, 20]} />
        <color attach="background" args={['#15151a']} />
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
        <hemisphereLight intensity={0.5} />

        <Environment resolution={512}>
          {/* Ceiling */}
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, -9]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, -6]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, -3]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, 0]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, 3]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, 6]}
            scale={[10, 1, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, 9]}
            scale={[10, 1, 1]}
          />
          {/* Sides */}
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-50, 2, 0]}
            scale={[100, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[50, 2, 0]}
            scale={[100, 2, 1]}
          />
          {/* Key */}
          <Lightformer
            form="ring"
            color="red"
            intensity={10}
            scale={2}
            position={[10, 5, 10]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        </Environment>
      </Canvas>
      <ul className="fixed bottom-[20px] left-[50%] translate-x-[-50%]  flex gap-[20px]">
        {[...pages].map((list, index) => {
          if (index === 0) {
            return (
              <li
                onClick={() => setPage(index)}
                className={`cursor-pointer flex items-center justify-center px-[20px] py-[5px] rounded-full border-[1px] bg-[rgba(180,180,180,0.2)] text-white whitespace-nowrap ${
                  page === index ? '!bg-white !text-black' : ''
                }`}
                key={`페이지버튼${list.id}`}
              >
                COVER
              </li>
            );
          }

          return (
            <li
              onClick={() => setPage(index)}
              className={`cursor-pointer flex items-center justify-center px-[20px] py-[5px] rounded-full border-[1px] bg-[rgba(180,180,180,0.2)] text-white whitespace-nowrap ${
                page === index ? '!bg-white !text-black' : ''
              }`}
              key={`페이지버튼${list.id}`}
            >
              {index}
            </li>
          );
        })}
        <li
          onClick={() => setPage(pages.length)}
          className={`cursor-pointer flex items-center justify-center px-[20px] py-[5px] rounded-full border-[1px] bg-[rgba(180,180,180,0.2)] text-white whitespace-nowrap ${
            page === pages.length ? '!bg-white !text-black' : ''
          }`}
        >
          END
        </li>
      </ul>
    </>
  );
}
