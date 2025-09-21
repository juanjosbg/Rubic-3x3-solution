// src/components/FacePreview.tsx
import type { CubeColor } from "../utils/colorDetection";

const PALETTE: Record<CubeColor, string> = {
  white:  "#ffffff",
  yellow: "#ffd500",
  red:    "#c41e3a",
  orange: "#ff6a00",
  blue:   "#0051ba",
  green:  "#009e60",
};

interface FacePreviewProps {
  name: string;
  colors: (CubeColor | "")[][];
}

export default function FacePreview({ name, colors }: FacePreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-semibold mb-1">{name}</p>
      <div className="grid grid-cols-3 gap-1">
        {colors.flat().map((c, i) => (
          <div
            key={i}
            className="w-8 h-8 border rounded-sm"
            style={{ backgroundColor: c ? PALETTE[c] : "transparent" }}
            title={c || "empty"}
          />
        ))}
      </div>
    </div>
  );
}
