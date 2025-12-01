# Ceiling Grid Editor — Prototype

Ceiling Grid editor prototype MVP
It uses **react-konva** for canvas rendering and **zustand** for state.

## Features

- Draws a rectangular ceiling grid (set width/height in toolbar)
- Add components: Light, Air Supply, Air Return, Smoke Detector, Invalid Tile
- Drag components to move (snap to grid on release)
- Click remove tile buttons to remove individual tiles.
- Clear tile button to clear all the tiles selected on grid.
- Wheel to zoom, drag to pan the stage, zoom inview display and alerts user when tiles overlaps.

## Run locally

1. `npm install`
2. `npm run dev`
3. Open the URL printed by Vite (usually http://localhost:5173)

## Notes

- The grid uses lines (not 1 million DOM boxes) so large sizes (100x100, 1000x1000) are feasible.
