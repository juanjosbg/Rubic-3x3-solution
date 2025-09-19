// src/components/CubeRenderer.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { CubeState } from "./CameraScanner";

interface CubeRendererProps {
  cubeState: CubeState | null;
}

const CubeRenderer = ({ cubeState }: CubeRendererProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === ESCENA ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // === CÁMARA ===
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // === LUCES ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // === CUBO DE RUBIK (3x3) ===
    const cubeSize = 1;
    const spacing = 0.05;
    const miniCubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Colores por defecto
    const defaultColors = [
      0xff0000, // rojo
      0x00ff00, // verde
      0x0000ff, // azul
      0xffff00, // amarillo
      0xffa500, // naranja
      0xffffff, // blanco
    ];

    const materials = defaultColors.map(
      (c) => new THREE.MeshStandardMaterial({ color: c })
    );

    const group = new THREE.Group();

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubelet = new THREE.Mesh(miniCubeGeometry, materials);
          cubelet.position.set(
            x * (cubeSize + spacing),
            y * (cubeSize + spacing),
            z * (cubeSize + spacing)
          );
          group.add(cubelet);
        }
      }
    }

    scene.add(group);

    // === ANIMACIÓN ===
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.x += 0.01;
      group.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // === LIMPIEZA ===
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [cubeState]);

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
};

export default CubeRenderer;
