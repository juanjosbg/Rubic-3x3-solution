import React, { useRef } from "react";
import Webcam from "react-webcam";
import { getAverageColorFromCanvas } from "../utils/colorDetection";

const CameraCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);

  const captureColor = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Creamos una imagen en memoria
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Ejemplo: tomar una región en el centro
      const color = await getAverageColorFromCanvas(canvas, {
        x: img.width / 2 - 20,
        y: img.height / 2 - 20,
        width: 40,
        height: 40,
      });

      console.log("Color detectado:", color);
    };
  };

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/png" />
      <button onClick={captureColor}>Detectar color</button>
    </div>
  );
};

export default CameraCapture;
