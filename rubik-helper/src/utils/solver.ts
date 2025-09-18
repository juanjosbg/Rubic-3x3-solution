import * as cubejs from "cubejs";

// Simulación básica de resolución
export const solveCube = (): string[] => {
  const cube = cubejs();
  cube.randomize(); // desordena
  return cube.solve().split(" ");
};
