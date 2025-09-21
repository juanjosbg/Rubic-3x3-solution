// src/store/cubeStore.ts
import { create } from "zustand";
import type { CubeColor } from "../utils/colorDetection";

const faces = ["U","R","F","D","L","B"] as const;
export type Face = typeof faces[number];
type Sticker = CubeColor | ""; 

export type CubeState = {
  cube: Record<Face, Sticker[][]>;
  setFace: (face: Face, colors: Sticker[][]) => void;
  resetCube: () => void;
  isComplete: boolean;
};

const emptyFace = () => Array.from({length:3},()=>Array<Sticker>(3).fill(""));

function computeIsComplete(c: Record<Face, Sticker[][]>) {
  return (Object.values(c).every(face => face.flat().every(s => s !== "")));
}

export const useCubeStore = create<CubeState>((set)=>({
  cube: { U: emptyFace(), R: emptyFace(), F: emptyFace(), D: emptyFace(), L: emptyFace(), B: emptyFace() },
  setFace: (face, colors) => set((state)=>{
    const updated = { ...state.cube, [face]: colors };
    return { cube: updated, isComplete: computeIsComplete(updated) };
  }),
  resetCube: () => ({
    cube: { U: emptyFace(), R: emptyFace(), F: emptyFace(), D: emptyFace(), L: emptyFace(), B: emptyFace() },
    isComplete: false,
  }),
  isComplete: false,
}));
