// src/components/CameraScanner.tsx
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { sampleFaceHex, mapHexToCubeColor } from "../utils/colorDetection";
import { useCubeStore } from "../store/cubeStore";

const order = ["U","R","F","D","L","B"] as const;
type Face = typeof order[number];

const tips: Record<Face,string> = {
  U: "Coloca la cara U al frente dentro del marco.",
  R: "Gira el cubo 90° hacia la derecha para mostrar R.",
  F: "Desde R, gira 90° hacia ti para F.",
  D: "Voltea el cubo para mostrar D.",
  L: "Gira 90° a la izquierda para L.",
  B: "Gira 180° desde F para B.",
};

export default function CameraScanner() {
  const webcamRef = useRef<Webcam>(null);
  const [idx, setIdx] = useState(0);
  const [isAligned, setIsAligned] = useState(false);
  const setFace = useCubeStore(s=>s.setFace);

  const screenshotToCanvas = async () => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return null;
    const img = new Image();
    img.src = shot;
    await new Promise<void>(res => (img.onload = () => res()));
    const canvas = document.createElement("canvas");
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return { canvas, img };
  };

  useEffect(() => {
    const it = setInterval(async () => {
      const ctx = await screenshotToCanvas();
      if (!ctx) return;
      const { canvas, img } = ctx;
      const region = { x: img.width/3, y: img.height/3, width: img.width/3, height: img.height/3 };
      const res = sampleFaceHex(canvas, region);
      setIsAligned(res.present);
    }, 350);
    return () => clearInterval(it);
  }, []);

  const capture = async () => {
    const ctx = await screenshotToCanvas();
    if (!ctx) return;
    const { canvas, img } = ctx;
    const region = { x: img.width/3, y: img.height/3, width: img.width/3, height: img.height/3 };
    const res = sampleFaceHex(canvas, region);
    if (!res.present) return alert("❌ Alinea el cubo dentro del marco y vuelve a intentar.");

    // HEX -> nombres canónicos
    const faceColors = res.cubeHex.map(row => row.map(hex => mapHexToCubeColor(hex)));
    setFace(order[idx] as Face, faceColors);
    if (idx < order.length - 1) setIdx(i => i + 1);
  };

  const current = order[idx];
  const next = order[idx + 1];

  return (
    <div className="relative flex flex-col items-center gap-2 text-white">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-[400px] h-[300px] bg-black rounded-lg"
        videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
      />
      <div
        className={`absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 border-4 rounded-md pointer-events-none transition-colors ${
          isAligned ? "border-green-500" : "border-red-500"
        }`}
      />
      <div className="text-sm mt-1">
        Escaneando cara: <b>{current}</b>
        {next ? <span className="ml-2 opacity-80">→ Siguiente: <b>{next}</b></span> : null}
      </div>
      <div className="text-xs opacity-80 -mt-1">{tips[current]}</div>
      <button
        onClick={capture}
        className={`mt-1 px-4 py-2 rounded-md shadow transition ${isAligned ? "bg-green-600 hover:bg-green-700" : "bg-slate-500 hover:bg-slate-600"}`}
      >
        Capturar cara
      </button>
    </div>
  );
}
