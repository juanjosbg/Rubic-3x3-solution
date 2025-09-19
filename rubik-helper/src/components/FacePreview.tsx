import React from "react";

type FacePreviewProps = {
  face: string;
  colors: string[][];
};

const FacePreview: React.FC<FacePreviewProps> = ({ face, colors }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 font-semibold text-gray-700">{face}</span>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        {colors.flat().map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 border border-gray-400 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default FacePreview;
