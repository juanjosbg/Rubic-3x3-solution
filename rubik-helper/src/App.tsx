// src/App.tsx
import { useState } from "react";
import CameraScanner from "@components/CameraScanner";
import type { CubeState } from "@components/CameraScanner";
import CubeRenderer from "@components/CubeRenderer";
import FacePreview from "./components/FacePreview";

function App() {
  const [cubeState, setCubeState] = useState<CubeState | null>(null);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* Cámara arriba */}
      <div className="flex-1 flex justify-center items-center bg-black relative">
        {!cubeState ? (
          <CameraScanner onComplete={setCubeState} />
        ) : (
          <div className="text-white text-lg font-semibold">
            ✅ Cubo escaneado
          </div>
        )}
      </div>

      {/* Sección de abajo con cubo y vistas de caras */}
      <div className="flex-1 grid grid-cols-4 gap-4 p-4 bg-white">
        <div className="bg-gray-200 flex justify-center items-center rounded-lg shadow">
          {cubeState ? (
            <CubeRenderer cubeState={cubeState} />
          ) : (
            "Cubo no escaneado"
          )}
        </div>

        {cubeState && (
          <>
            <FacePreview face="U" colors={cubeState.U} />
            <FacePreview face="F" colors={cubeState.F} />
            <FacePreview face="R" colors={cubeState.R} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
