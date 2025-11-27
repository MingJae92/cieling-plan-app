# Ceiling Grid Editor — Prototype

This is a minimal Vite + React + TypeScript prototype for the Consigli take-home test.
It uses **react-konva** for canvas rendering and **zustand** for state.

## Features
- Draws a rectangular ceiling grid (set width/height in toolbar)
- Add components: Light, Air Supply, Air Return, Smoke Detector, Invalid Tile
- Drag components to move (snap to grid on release)
- Double-click an item to delete it
- Wheel to zoom, drag to pan the stage

## Run locally
1. `npm install`
2. `npm run dev`
3. Open the URL printed by Vite (usually http://localhost:5173)

## Notes
- The grid uses lines (not 1 million DOM boxes) so large sizes (100x100, 1000x1000) are feasible.
- You can customize `gridSize` in `src/components/CeilingGrid.tsx` for a different tile pixel size.

Enjoy — if you want, I can:
- Add export/import JSON for layouts.
- Add selection, rotate or multi-select.
- Add nicer UI, icons, and tests.
