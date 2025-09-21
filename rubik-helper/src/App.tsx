// src/App.tsx
import CameraScanner from "./components/CameraScanner";
import CubeRenderer from "./components/CubeRenderer";
import FacePreview from "./components/FacePreview";
import { useCubeStore } from "./store/cubeStore";

function App() {
  const cube = useCubeStore((s) => s.cube);
  const isComplete = useCubeStore((s) => s.isComplete);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      <div className="h-[45%] flex justify-center items-center bg-black">
        <CameraScanner />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-white">
        {/* IZQUIERDA: previews */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
          <FacePreview name="U" colors={cube.U} />
          <FacePreview name="D" colors={cube.D} />
          <FacePreview name="F" colors={cube.F} />
          <FacePreview name="B" colors={cube.B} />
          <FacePreview name="L" colors={cube.L} />
          <FacePreview name="R" colors={cube.R} />
        </div>

        {/* DERECHA: 3D (condicional) */}
        <div className="bg-gray-200 flex justify-center items-center rounded-lg shadow">
          {isComplete ? (
            <CubeRenderer />
          ) : (
            <p className="text-gray-600 text-center px-6">
              Escanea las 6 caras para visualizar el cubo en 3D.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
