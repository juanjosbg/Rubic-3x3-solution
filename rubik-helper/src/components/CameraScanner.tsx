// src/components/CameraScanner.tsx
import { useEffect, useRef, useState } from "react";

type Color = "R" | "G" | "B" | "Y" | "O" | "W"; // colores simplificados
export type CubeState = {
  U: Color[][];
  D: Color[][];
  F: Color[][];
  B: Color[][];
  L: Color[][];
  R: Color[][];
};

const defaultFace: Color[][] = [
  ["W", "W", "W"],
  ["W", "W", "W"],
  ["W", "W", "W"],
];

export default function CameraScanner({
  onComplete,
}: {
  onComplete: (cube: CubeState) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faces, setFaces] = useState<Partial<CubeState>>({});
  const [currentFace, setCurrentFace] = useState<keyof CubeState | null>(null);

  const faceOrder: (keyof CubeState)[] = ["U", "D", "F", "B", "L", "R"];

  // === Activar cámara ===
  const startCamera = async (
    facingMode: "user" | "environment" = "environment"
  ) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCurrentFace("U");
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
    }
  };

  // === Capturar cara ===
  const captureFace = () => {
    if (!canvasRef.current || !videoRef.current || !currentFace) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Dibujar frame actual del video en canvas
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // 👉 Aquí deberías detectar colores en los stickers
    // Por ahora devolvemos todo blanco
    const faceData = defaultFace;

    setFaces((prev) => {
      const newFaces = { ...prev, [currentFace]: faceData };
      const nextFace = faceOrder[Object.keys(newFaces).length] || null;

      setCurrentFace(nextFace);

      if (Object.keys(newFaces).length === 6) {
        // ✅ Ya tenemos las 6 caras
        onComplete(newFaces as CubeState);
        stopCamera();
      }

      return newFaces;
    });
  };

  // === Apagar cámara ===
  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setCurrentFace(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {!stream ? (
        <div className="flex gap-4">
          <button
            onClick={() => startCamera("user")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Cámara frontal
          </button>
          <button
            onClick={() => startCamera("environment")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Cámara trasera
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md rounded"
          />
          <canvas ref={canvasRef} width={300} height={300} className="hidden" />
          <p className="text-white">
            Escaneando cara: <strong>{currentFace}</strong>
          </p>
          <button
            onClick={captureFace}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Capturar cara
          </button>
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Apagar cámara
          </button>
        </>
      )}
    </div>
  );
}
