import { FastAverageColor } from "fast-average-color";
import ColorThief from "colorthief";

/**
 * Detecta el color promedio de una región de la imagen
 */
export async function getAverageColorFromCanvas(
  canvas: HTMLCanvasElement,
  region: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const fac = new FastAverageColor();

  // Recortamos la región que queremos analizar
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener el contexto 2D");

  const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);

  const color = fac.getColorFromArray4(imageData.data, {
    algorithm: "sqrt", // mejor percepción
  });

  return color.hex; // Devuelve #RRGGBB
}

/**
 * Detecta el color dominante de una imagen usando ColorThief
 */
export async function getDominantColorFromImage(img: HTMLImageElement): Promise<string> {
  const colorThief = new ColorThief();

  return new Promise((resolve, reject) => {
    if (img.complete) {
      try {
        const rgb = colorThief.getColor(img);
        resolve(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      } catch (err) {
        reject(err);
      }
    } else {
      img.addEventListener("load", () => {
        try {
          const rgb = colorThief.getColor(img);
          resolve(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        } catch (err) {
          reject(err);
        }
      });
    }
  });
}
