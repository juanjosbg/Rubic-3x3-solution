import { create } from "zustand";
import cubejs from "cubejs";

interface CubeState {
  cube: ReturnType<typeof cubejs>; // el cubo
  moves: string[]; // historial de movimientos
  solution: string | null; // solución actual
  randomize: () => void;
  solve: () => void;
  reset: () => void;
}

export const useCubeStore = create<CubeState>((set) => ({
  cube: cubejs(),
  moves: [],
  solution: null,

  randomize: () =>
    set((state) => {
      state.cube.randomize();
      return {
        cube: state.cube,
        moves: [],
        solution: null,
      };
    }),

  solve: () =>
    set((state) => {
      const sol = state.cube.solve();
      return { solution: sol, moves: sol.split(" ") };
    }),

  reset: () =>
    set(() => ({
      cube: cubejs(),
      moves: [],
      solution: null,
    })),
}));
