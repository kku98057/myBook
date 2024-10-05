import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Experience from '../../components/Experience';
import { Loader } from '@react-three/drei';
import { usePageStore } from '../../store/pageAtom';
import { pages } from '../../components/UI';

export default function MainPage() {
  const { setPage, page } = usePageStore((state) => state);

  return (
    <>
      <Loader />
      <Canvas shadows camera={{ position: [0.5, 1, 4], fov: 45 }}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
      <ul className="fixed bottom-[20px] left-[50%] translate-x-[-50%]  flex gap-[20px]">
        {[...pages].map((list, index) => {
          console.log(index);
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
