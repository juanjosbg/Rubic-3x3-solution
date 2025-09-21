// src/components/CubeRenderer.tsx
import React from "react";
import { useCubeStore } from "../store/cubeStore";

const CubeRenderer: React.FC = () => {
  const cube = useCubeStore((state) => state.cube);

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <div className="relative w-80 h-80 preserve-3d">
        {/* Cara U */}
        <div className="absolute w-40 h-40 -translate-x-1/2 -translate-y-full left-1/2 top-0 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.U.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Cara D */}
        <div className="absolute w-40 h-40 -translate-x-1/2 left-1/2 bottom-0 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.D.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Cara F */}
        <div className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.F.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Cara B */}
        <div className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 -z-10 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.B.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Cara L */}
        <div className="absolute w-40 h-40 -translate-y-1/2 left-0 top-1/2 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.L.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Cara R */}
        <div className="absolute w-40 h-40 -translate-y-1/2 right-0 top-1/2 transform bg-white border border-gray-300 flex flex-wrap">
          {cube.R.flat().map((c, i) => (
            <div key={i} className="w-1/3 h-1/3 border" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CubeRenderer;
