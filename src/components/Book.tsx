import { GroupProps, useFrame } from '@react-three/fiber';
import { pageProps } from '../types/pageTypes';
import { pages } from './UI';
import gsap from 'gsap';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MeshStandardMaterial,
  Object3DEventMap,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from 'three';
import { useCursor, useTexture } from '@react-three/drei';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { usePageStore } from '../store/pageAtom';
import { easing } from 'maath';

import { useControls } from 'leva';

const easingFactor = 0.35; // 책 넘기는 속도
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18; // 책을 얼마나 넘기는지 (강도)
const outsideCurveStrenth = 0.05; //
const turnningCurveStrenth = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, 2);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
const position = pageGeometry.attributes.position;

const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // pageGeometry의 위치값을 vertex에 저장
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;

  //   현재의 정점이 어떤 세그먼트에 있는지 계산
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  //   현재 정점이 해당 세그먼트 내에서 얼마나 이동했는지
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

const whiteColor = new Color('white');
const emissiveColor = new Color('orange');
pageGeometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));
const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: '#111',
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

pages.forEach((page) => {
  useTexture.preload(`/textures/${page.front}.jpg`);
  useTexture.preload(`/textures/${page.back}.jpg`);
  useTexture.preload(`/textures/book-cover-roughness.jpg`);
});

const Page = memo(
  ({
    number,
    data,
    page,
    opened,
    bookClose,
    ...props
  }: {
    number: number;
    data: pageProps;
    page: number;
    opened: boolean;
    bookClose: boolean;
  } & GroupProps) => {
    const [picture, picture2, pictureRoughness] = useTexture([
      `/textures/${data.front}.jpg`,
      `/textures/${data.back}.jpg`,
      ...(number === 0 || number === pages.length - 1
        ? [`/textures/book-cover-roughness.jpg`]
        : []),
    ]);
    // RGB(빨간색, 녹색, 파란색) 값으로 표현하며, 모니터와 같은 디스플레이 장치에서 색상을 정확하게 표시하기 위해 사용
    picture.colorSpace = picture2.colorSpace = SRGBColorSpace;

    const turnedAt = useRef<number>(0);
    const lastOpened = useRef(opened);

    const group = useRef<Group<Object3DEventMap>>(null);
    const skinnedMeshRef = useRef<any>(null);

    //   스킨메시 생성
    const manualSkinnedMesh = useMemo(() => {
      const bones = [];
      for (let i = 0; i <= PAGE_SEGMENTS; i++) {
        //새로운 빼대 생성
        const bone = new Bone();
        // 뼈대를 추가
        bones.push(bone);
        if (i === 0) {
          bone.position.x = 0; //첫번째 뼈대는 무조건 왼쪽으로(0으로)
        } else {
          bone.position.x = SEGMENT_WIDTH; //나버지 뼈대는 SEGMENT_WIDTH만큼
        }
        if (i > 0) {
          bones[i - 1].add(bone); // 이전뼈대에 현재뼈대를 추가
        }
      }

      const skeleton = new Skeleton(bones);
      const materials = [
        ...pageMaterials,
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture,
          ...(number === 0 ? { roughnessMap: pictureRoughness } : { roughness: 0.1 }),
          emissive: emissiveColor,
          emissiveIntensity: 0,
        }),
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture2,
          ...(number === pages.length - 1
            ? { roughnessMap: pictureRoughness }
            : { roughness: 0.1 }),
          emissive: emissiveColor,
          emissiveIntensity: 0,
        }),
      ];
      const mesh = new SkinnedMesh(pageGeometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);
      return mesh;
    }, []);

    // useHelper(skinnedMeshRef, SkeletonHelper);

    useFrame((_, delta) => {
      if (!skinnedMeshRef.current) {
        return;
      }

      const emissiveIntensity = highlighted ? 0.22 : 0;
      skinnedMeshRef.current.material[4].emissiveIntensity =
        skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
          skinnedMeshRef.current.material[4].emissiveIntensity,
          emissiveIntensity,
          0.1
        );
      if (lastOpened.current !== opened) {
        turnedAt.current = +new Date().getTime();
        lastOpened.current = opened;
      }

      let turningTime = Math.min(400, new Date().getTime() - turnedAt.current) / 400;
      turningTime = Math.sin(turningTime * Math.PI);

      let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
      if (!bookClose) {
        targetRotation += degToRad(number * 0.8);
      }
      const bones = skinnedMeshRef.current.skeleton.bones;

      for (let i = 0; i < bones.length; i++) {
        const target = i === 0 ? group.current : bones[i];

        const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
        const outsideCurveIntensity = i > 8 ? Math.cos(i * 0.3 + 0.09) : 0;
        const turningCurveIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
        let rotationAngle =
          insideCurveIntensity * insideCurveStrength * targetRotation -
          outsideCurveStrenth * outsideCurveIntensity * targetRotation -
          turnningCurveStrenth * turningCurveIntensity * targetRotation;
        let foldRotationAngle = degToRad(Math.sin(targetRotation) * 2);
        if (bookClose) {
          if (i === 0) {
            rotationAngle = targetRotation;
            foldRotationAngle = 0;
          } else {
            rotationAngle = 0;
          }
        }
        easing.dampAngle(target.rotation, 'y', rotationAngle, easingFactor, delta);

        const foldIntensity =
          i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0;
        easing.dampAngle(
          target.rotation,
          'x',
          foldRotationAngle * foldIntensity,
          easingFactorFold,
          delta
        );
      }
    });
    const { setPage } = usePageStore((state) => state);
    const [highlighted, setHighlighted] = useState(false);
    useCursor(highlighted);
    const handleClick = useCallback(
      (e: any) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      },
      [opened, number]
    );
    return (
      <group
        ref={group}
        {...props}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHighlighted(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHighlighted(false);
        }}
        onClick={handleClick}
      >
        <primitive
          object={manualSkinnedMesh}
          ref={skinnedMeshRef}
          position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
        />
      </group>
    );
  }
);

export default function Book({ ...props }: { control: any } & any) {
  const bookRef = useRef<any>(null);
  const { page } = usePageStore((state) => state);
  const [delayedPage, setDelayedPage] = useState<number>(page);

  useEffect(() => {
    const goToPage = () => {
      setDelayedPage((prevDelayedPage) => {
        if (page === prevDelayedPage) {
          return prevDelayedPage; // 현재 페이지와 같으면 업데이트하지 않음
        }
        // 페이지가 변경되었으므로, 1씩 증가 또는 감소
        return page > prevDelayedPage ? prevDelayedPage + 1 : prevDelayedPage - 1;
      });
    };

    // 타이머를 설정하여 일정 시간 간격으로 페이지를 업데이트
    const timeout = setTimeout(goToPage, Math.abs(page - delayedPage) > 2 ? 50 : 150);

    return () => {
      clearTimeout(timeout); // 타이머 정리
    };
  }, [page, delayedPage]);

  // useHelper(bookRef, BoxHelper);

  const options = useMemo(() => {
    return {
      position: {
        x: { value: -0.6, min: -10, max: 10, step: 0.1 },
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

  const cont = useControls('mehs', options.position);
  const rota = useControls('rota', options.rotation);

  useEffect(() => {
    if (delayedPage === 0) {
      gsap.to(bookRef.current.position, {
        x: -0.6,
      });
    } else if (delayedPage === pages.length) {
      gsap.to(bookRef.current.position, {
        x: 0.6,
      });
    } else {
      gsap.to(bookRef.current.position, {
        x: 0,
      });
    }
  }, [delayedPage]);

  return (
    <group
      {...props}
      ref={bookRef}
      position={[cont.x, cont.y, cont.z]}
      rotation={[rota.x, rota.y, rota.z]}
    >
      {[...pages].map((pageData, index) => (
        <Page
          key={`페이지${pageData.id}`}
          number={index}
          page={delayedPage}
          data={pageData}
          opened={delayedPage > index}
          bookClose={delayedPage === 0 || delayedPage === pages.length}
        />
      ))}
    </group>
  );
}
