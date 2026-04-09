# Artisan Press: Interactive Wall Calendar

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> A premium, high-fidelity digital wall calendar that translates the tactile satisfaction of physical paper and ink into a modern web experience. Built with a focus on "God-Tier" aesthetics and interactive delight.

---

## Key Features

### The Physical Experience
- **3D Page Flips**: Real-life physics simulation for month transitions, including curved paper distortion and "heavy paper" easing.
- **Tactile Binder**: A metallic spiral binder system and hanging wire setup that grounds the UI in a physical space.
- **Parallax Depth**: The entire calendar responds to mouse movement, shifting perspective like a physical object hanging on a wall.

### Ambient & Seasonality
- **Seasonal Particle Engine**: Dynamic environment effects (Snow, Petals, Autumn Leaves) that react to the current month's theme.
- **Studio Lighting (Lamp Mode)**: Toggleable warm "Studio Lighting" with bloom effects and paper-grain textures for late-night planning.
- **Localized Typography**: Automatic font swapping and date formatting for English, 日本語 (Japanese), and Français (French).

### Creativity & Utility
- **Calendar Keeper**: Meet your interactive mascot! The Keeper "leans in" to help you flip pages and responds to your clicks with seasonal messages.
- **Canvas Doodling**: Enter Draw Mode to freehand doodle directly onto the calendar grid, simulating a real felt-tip marker.
- **Draggable Task Pins**: Drag custom task pills from your ledger onto the grid to "pin" your priorities.
- **Persistent Ledger**: Integrated sticker notes and a lined paper ledger that saves your thoughts automatically to `localStorage`.
- **Polaroid Snapshots**: Capture high-resolution snapshots of your current calendar page with a realistic camera flash effect.

---

## Architectural Choices

1. **Vanilla CSS + Modern Tokens**: 
   - No heavy CSS frameworks. The project uses fine-tuned CSS variables for "Seasonal Themes," ensuring the UI feels hand-crafted and unique for every month.
2. **Framer Motion for Haptics**: 
   - Motion is used not just for transitions, but for "tactile haptics"—making digital buttons feel like they have physical weight and resistance.
3. **Decoupled Logic Layer**: 
   - `useCalendar`: Handles all date math and range selection logic.
   - `useNotes`: Manages the persistent storage engine.
   - `useTactileAudio`: Injects foley sound effects (paper rustles, pen scratches) for a multi-sensory experience.
4. **SVG & Masking**: 
   - Extensive use of SVG filters and CSS masks to create organic, "printed" textures that standard digital UI lacks.

---

## Getting Started

To run this masterpiece locally, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <your-repo-url>
cd wall-calendar
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
The application will usually be available at [http://localhost:5173/](http://localhost:5173/) (or the next available port).

### 4. Build for Production
```bash
npm run build
```

---

## Responsive Strategy

- **Desktop (1100px+)**: A grand side-by-side "Studio Layout" that emphasizes whitespace and luxury positioning.
- **Tablet/Mobile**: A smart stacking behavior that preserves the "Wall Frame" aesthetic while optimizing the grid for touch interaction.

---

Built with care for the ultimate planning experience.
