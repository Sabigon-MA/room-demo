import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import PlayerControls from "./components/PlayerControls"; // 追加

const floorImgPath = "/textures/yuka.jpg";
const wallImgPath = "/textures/wall.jpg";
const ceilingImgPath = "/textures/wall.jpg";

// 壁の座標データ
const wallPositions = [
  [0, 1.5, -10],
  [0, 1.5, 10],
  [-10, 1.5, 0],
  [10, 1.5, 0],
];

function Room() {
  const floorTexture = useLoader(THREE.TextureLoader, floorImgPath);
  const wallTexture = useLoader(THREE.TextureLoader, wallImgPath);
  const ceilingTexture = useLoader(THREE.TextureLoader, ceilingImgPath);

  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(6.66, 1);
  wallTexture.anisotropy = 16;

  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  floorTexture.anisotropy = 16;

  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(10, 10);
  ceilingTexture.anisotropy = 16;

  return (
    <>
      {/* 床 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* 天井 */}
      <mesh rotation-x={Math.PI / 2} position={[0, 3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={ceilingTexture} />
      </mesh>

      {/* 壁 */}
      {wallPositions.map(([x, y, z], index) => {
        const isXWall = Math.abs(x) === 10;
        const width = 20;
        const height = 3;

        // 回転角度を修正してみる（符号を反転）
        const rotationY = isXWall ? -Math.PI / 2 : 0;

        return (
          <mesh key={index} position={[x, y, z]} rotation-y={rotationY}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}


// 当たり判定の計算（壁にぶつかるか判定）
export function isColliding(nextPos, wallPositions) {
  for (const [wx, _, wz] of wallPositions) {
    const dx = nextPos.x - wx;
    const dz = nextPos.z - wz;
    const distanceX = Math.abs(dx);
    const distanceZ = Math.abs(dz);
    // 壁を平面として判定するなら厚みは0として0.5はプレイヤー半径
    const halfWidth = 10 + 0.5; // 壁は幅20なので半分は10
    const halfDepth = 0.5; // 厚みは0の平面として少し余裕を持たせる

    // 壁の方向に応じて判定
    if (Math.abs(wx) === 10) {
      // X方向の壁（Z軸に長い壁）
      if (distanceX <= halfDepth && distanceZ <= halfWidth) {
        return true;
      }
    } else {
      // Z方向の壁（X軸に長い壁）
      if (distanceZ <= halfDepth && distanceX <= halfWidth) {
        return true;
      }
    }
  }
  return false;
}

export { wallPositions }; // 追加

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Room />
        <PlayerControls /> {/* PlayerControlsのみ呼び出す */}
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          zIndex: 1,
          userSelect: "none",
        }}
      >
        <p>クリック→マウスロック</p>
        <p>WASDで移動、マウスで視点</p>
        <p>Escで解除</p>
      </div>
    </>
  );
}
