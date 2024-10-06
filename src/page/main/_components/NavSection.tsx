import { useRef } from 'react';
import { pages } from '../../../components/UI';
import { usePageStore } from '../../../store/pageAtom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
export default function NavSection() {
  const { setPage, page } = usePageStore((state) => state);
  const ref = useRef<HTMLUListElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      yPercent: 20,
      opacity: 0,
    });
  });
  return (
    <ul className="fixed bottom-[20px] left-[50%] translate-x-[-50%]  flex gap-[20px]" ref={ref}>
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
  );
}
