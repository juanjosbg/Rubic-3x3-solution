# 4️⃣ Estructura del proyecto
rubik-helper/
├─ src/
│  ├─ components/
│  │   ├─ CameraCapture.tsx     # Componente para capturar el cubo con 
│  │   ├─ CameraScanner.tsx     #
│  │   ├─ CubeRenderer.tsx      # Visualización 3D con three.js
│  │   ├─ SolutionSteps.tsx     # Muestra los pasos para resolver el cubo
│  │   ├─ SolutionSteps.tsx     #
│  ├─ store/
│  │   ├─ cubeStore.ts          # Estado global (zustand)
│  ├─ utils/
│  │   ├─ colorDetection.ts     # Procesar imagen y detectar colores (OpenCV)
│  │   ├─ solver.ts             # Usar cubejs para resolver
│  ├─ App.tsx
│  ├─ main.tsx

# Librerias instladas 
npm install cubejs zustand three react-webcam


Con fast-average-color y colorthief ya no dependes de opencv.js y puedes detectar colores de cada sticker del cubo de forma mucho más ligera.

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
