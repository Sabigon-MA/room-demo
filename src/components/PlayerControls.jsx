import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";
import { isColliding, wallPositions } from "../App";

function PlayerControls() {
  const { camera } = useThree();
  const direction = useRef(new THREE.Vector3());
  const keys = useRef({});

  const walkSpeed = 5.0;
  const runSpeed = 10.0;

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
    move.addScaledVector(front, direction.current.z);
    move.addScaledVector(right, direction.current.x);

    const isRunning =
      keys.current["ShiftLeft"] || keys.current["Shift"] || keys.current["ShiftRight"];
    const speed = isRunning ? runSpeed : walkSpeed;

    if (move.length() > 0) {
      move.setLength(speed * delta);

      // 壁に沿って動く処理
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
    }
  });

  return <PointerLockControls />;
}

export default PlayerControls;
