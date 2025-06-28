// src/components/Game.jsx

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { generateMaze } from "../mazeGenerator";

function getWallPositionsFromMaze(maze, wallSize = 2) {
  const positions = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x] === 1) {
        positions.push([x * wallSize, 1.5, y * wallSize]);
      }
    }
  }
  return positions;
}

export default function Game({ onClear }) {
  const mazeWidth = 21;
  const mazeHeight = 21;
  const maze = generateMaze(mazeWidth, mazeHeight);

  const floorTexture = useLoader(THREE.TextureLoader, "/textures/yuka.jpg");
  const wallTexture = useLoader(THREE.TextureLoader, "/textures/wall.jpg");
  const ceilingTexture = useLoader(THREE.TextureLoader, "/textures/wall.jpg");

  const [startTime] = useState(Date.now());
  const [goalPos] = useState(() => {
    const freeSpaces = [];
    for (let y = 0; y < mazeHeight; y++) {
      for (let x = 0; x < mazeWidth; x++) {
        if (maze[y][x] === 0) {
          freeSpaces.push([x, y]);
        }
      }
    }
    return freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
  });

  const wallSize = 2;
  const wallPositions = getWallPositionsFromMaze(maze, wallSize);

  const handleClear = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    onClear(elapsed);
  };

  return (
    <>
      <Canvas camera={{ position: [2, 1.6, 2], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Maze maze={maze} goalPos={goalPos} onClear={handleClear} />
        <PlayerControls wallPositions={wallPositions} goalPos={goalPos} onClear={handleClear} />
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
        <p>右クリック→ゴール判定</p>
        <p>Escで解除</p>
      </div>
    </>
  );
}

function Maze({ maze, goalPos, onClear }) {
  const wallSize = 2;

  // テクスチャを読み込み
  const floorTexture = useLoader(THREE.TextureLoader, "/textures/yuka.jpg");
  const wallTexture = useLoader(THREE.TextureLoader, "/textures/wall.jpg");
  const ceilingTexture = useLoader(THREE.TextureLoader, "/textures/wall.jpg");

  // --- ここで繰り返し設定 ---
  // 繰り返し回数を決定（迷路の大きさに応じて調整）
  const repeatX = maze[0].length;
  const repeatY = maze.length;

  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(repeatX, repeatY);

  ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(repeatX, repeatY);

  // 壁テクスチャもループ表示
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(1, 1); // 1x1で各壁ごとにループ（必要なら値を調整）

  // ------------------------

  // ゴール座標を保持
  const goalPosition = [
    goalPos[0] * wallSize,
    0.75,
    goalPos[1] * wallSize,
  ];

  return (
    <>
      {/* 床 */}
      <mesh rotation-x={-Math.PI / 2} position={[maze[0].length, 0, maze.length]}>
        <planeGeometry args={[maze[0].length * wallSize, maze.length * wallSize]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* 天井 */}
      <mesh rotation-x={Math.PI / 2} position={[maze[0].length, 3, maze.length]}>
        <planeGeometry args={[maze[0].length * wallSize, maze.length * wallSize]} />
        <meshStandardMaterial map={ceilingTexture} />
      </mesh>

      {/* 壁 */}
      {maze.map((row, y) =>
        row.map((cell, x) => {
          if (cell === 1) {
            return (
              <mesh
                key={`${x}-${y}`}
                position={[x * wallSize, 1.5, y * wallSize]}
              >
                <boxGeometry args={[wallSize, 3, wallSize]} />
                <meshStandardMaterial map={wallTexture} />
              </mesh>
            );
          }
          return null;
        })
      )}

      {/* ゴール */}
      <mesh
        position={goalPosition}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}

function PlayerControls({ wallPositions, goalPos, onClear }) {
  const { camera, gl } = useThree();
  const direction = useRef(new THREE.Vector3());
  const keys = useRef({});

  const wallSize = 2;
  const walkSpeed = 4.0;
  const runSpeed = 8.0; // 走る速度を追加

  // ゴール座標
  const goalPosition = [
    goalPos[0] * wallSize,
    0.75,
    goalPos[1] * wallSize,
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 右クリックでゴール判定
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 2) {
        const camPos = camera.position;
        const dx = camPos.x - goalPosition[0];
        const dy = camPos.y - goalPosition[1];
        const dz = camPos.z - goalPosition[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.5) {
          onClear();
        }
      }
    };
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
    };
  }, [camera, gl, goalPosition, onClear]);

  useFrame((_, delta) => {
    direction.current.set(0, 0, 0);

    if (keys.current["KeyW"]) direction.current.z += 1;
    if (keys.current["KeyS"]) direction.current.z -= 1;
    if (keys.current["KeyA"]) direction.current.x -= 1;
    if (keys.current["KeyD"]) direction.current.x += 1;

    if (direction.current.length() > 0) direction.current.normalize();

    const front = new THREE.Vector3();
    camera.getWorldDirection(front);
    front.y = 0;
    front.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(front, camera.up).normalize();

    const move = new THREE.Vector3();
    // Shiftキーで速度を切り替え
    const isRunning =
      keys.current["ShiftLeft"] || keys.current["Shift"] || keys.current["ShiftRight"];
    const speed = isRunning ? runSpeed : walkSpeed;

    move.addScaledVector(front, direction.current.z * speed * delta);
    move.addScaledVector(right, direction.current.x * speed * delta);

    const currentPos = camera.position.clone();

    // X方向だけ動かして判定
    const posX = currentPos.clone().add(new THREE.Vector3(move.x, 0, 0));
    if (!isColliding(posX, wallPositions)) {
      camera.position.x += move.x;
    }

    // Z方向だけ動かして判定
    const posZ = currentPos.clone().add(new THREE.Vector3(0, 0, move.z));
    if (!isColliding(posZ, wallPositions)) {
      camera.position.z += move.z;
    }

    // --- ゴールとの当たり判定を追加 ---
    const dx = camera.position.x - goalPosition[0];
    const dy = camera.position.y - goalPosition[1];
    const dz = camera.position.z - goalPosition[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 1.0) { // 球体半径＋プレイヤー半径程度
      onClear();
    }
  });

  return <PointerLockControls />;
}

// maze-game-bA方式の当たり判定
function isColliding(nextPos, wallPositions) {
  for (const [wx, _, wz] of wallPositions) {
    const dx = nextPos.x - wx;
    const dz = nextPos.z - wz;
    const distanceX = Math.abs(dx);
    const distanceZ = Math.abs(dz);
    const halfWidth = 1 + 0.5; // wallSize/2 + プレイヤー半径
    const halfDepth = 1 + 0.5;

    if (distanceX <= halfWidth && distanceZ <= halfDepth) {
      return true;
    }
  }
  return false;
}
