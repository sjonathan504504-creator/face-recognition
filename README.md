# Face Recognition and Capture

**React + TypeScript application** using **MediaPipe Face Landmarker** to guide the user in capturing images of their face from different angles (liveness check).

---

## 🔍 Key Features

- **Real-time detection** of head angles (yaw, pitch, roll).
- **Visual and textual guidance** to reach target poses.
- **Interactive gallery** displaying capture progress.
- **Centralized configuration** in `src/constants/api.ts`.

### Model Configuration

**Editable data:**

- **ROTATION_TOLERANCES**: Adjust these values to make detection stricter (lower values) or more lenient (higher values).
- **ORIENTATION_PRESETS**: Add, remove, or modify target poses. Each object represents a head position to capture.

````typescript
import type { Orientation } from "../types/orientation";

/**rotation tolerance in degrees */
export const ROTATION_TOLERANCES = {
  yaw: 4,
  pitch: 4,
  roll: 4,
} as const;

export type RotationToleranceKeys = keyof typeof ROTATION_TOLERANCES;

export const ORIENTATION_PRESETS: Orientation[] = [
  { yaw: 0, pitch: 0, roll: 0 }, // Centered
  { yaw: -15, pitch: 0, roll: 0 }, // Left
  { yaw: 15, pitch: 0, roll: 0 }, // Right
  { yaw: 0, pitch: -15, roll: 0 }, // Top
  { yaw: 0, pitch: 15, roll: 0 }, // Bottom
];

export const MODEL_PATH: string = "/src/models/face_landmarker.task";
```typescript
````

---

## 🛠 Technologies

- **Frontend**: React + TypeScript, Vite
- **Detection**: MediaPipe Face Landmarker
- **Rendering**: HTML5 `<video>` + `<canvas>`, CSS (theme variables)

---

## 🚀 Installation & Run

### Requirements

- Node.js ≥ 18, npm/yarn/pnpm

### Commands (using npm)

```bash
git clone https://github.com/sjonathan504504-creator/face-recognition.git
cd face-recognition
npm install
npm run dev   # Starts the development server
npm run build # Builds the production bundle
```

---

# Reconnaissance faciale et capture

**Application React + TypeScript** utilisant **MediaPipe Face Landmarker** pour guider l’utilisateur à capturer des images de son visage sous différents angles (liveness check).

---

## 🔍 Fonctionnalités clés

- **Détection en temps réel** des angles de tête (yaw, pitch, roll).
- **Guidage visuel et textuel** pour atteindre les poses cibles.
- **Galerie interactive** affichant la progression des captures.
- **Configuration centralisée** dans `src/constants/api.ts`.

### Paramétrage du modèle

**Données modifiables :**

- **ROTATION_TOLERANCES** : Ajustez les valeurs pour rendre la détection plus stricte (valeurs plus petites) ou plus souple (valeurs plus grandes).
- **ORIENTATION_PRESETS** : Ajoutez, retirez ou modifiez les poses cibles. Chaque objet représente une position de la tête à capturer.

````typescript
import type { Orientation } from "../types/orientation";

/**rotation tolerance in degrees */
export const ROTATION_TOLERANCES = {
  yaw: 4,
  pitch: 4,
  roll: 4,
} as const;

export type RotationToleranceKeys = keyof typeof ROTATION_TOLERANCES;

export const ORIENTATION_PRESETS: Orientation[] = [
  { yaw: 0, pitch: 0, roll: 0 }, // Centered
  { yaw: -15, pitch: 0, roll: 0 }, // Left
  { yaw: 15, pitch: 0, roll: 0 }, // Right
  { yaw: 0, pitch: -15, roll: 0 }, // Top
  { yaw: 0, pitch: 15, roll: 0 }, // Bottom
];

export const MODEL_PATH: string = "/src/models/face_landmarker.task";
```typescript


````

---

## 🛠 Technologies

- **Frontend** : React + TypeScript, Vite.
- **Détection** : MediaPipe Face Landmarker.
- **Affichage** : HTML5 `<video>` + `<canvas>`, CSS (variables de thème).

---

## 🚀 Installation & Lancement

### Prérequis

- Node.js ≥ 18, npm/yarn/pnpm.

### Commandes (avec npm)

```bash
git clone https://github.com/sjonathan504504-creator/face-recognition.git
cd face-recognition
npm install
npm run dev  # Démarre le serveur de développement
npm run build  # Génère le build de production
```
