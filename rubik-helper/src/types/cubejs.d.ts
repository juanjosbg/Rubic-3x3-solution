declare module "cubejs" {
  export interface Cube {
    randomize(): void;
    solve(): string; // devuelve la secuencia de movimientos como string
    asString(): string; // estado del cubo en texto
  }

  export default function cubejs(): Cube;
}
