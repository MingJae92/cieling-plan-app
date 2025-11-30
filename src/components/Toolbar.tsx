import React from "react";
import { useCeilingStore, GridItem, ComponentType } from "../store/store";

export default function Toolbar() {
  const addComponent = useCeilingStore((s) => s.addComponent);
  const clear = useCeilingStore((s) => s.clear);
  const components = useCeilingStore((s) => s.components);

  // Your grid is fixed at 20 × 12 unless you add sizing UI later
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 12;

  const makeItem = (type: ComponentType) => {
    if (components.length >= GRID_WIDTH * GRID_HEIGHT) {
      // Grid is full, cannot add more
      alert("Grid is full! Cannot add more components.");
      return;
    }

    let x: number, y: number;

    // Keep picking random coordinates until a free cell is found
    do {
      x = Math.floor(Math.random() * GRID_WIDTH);
      y = Math.floor(Math.random() * GRID_HEIGHT);
    } while (components.some((c) => c.x === x && c.y === y));

    const id = crypto.randomUUID();
    const item: GridItem = { id, x, y, type };
    addComponent(item);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <button onClick={() => makeItem("light")}>Add Light</button>
        <button onClick={() => makeItem("air_supply")}>Add Air Supply</button>
        <button onClick={() => makeItem("air_return")}>Add Air Return</button>
        <button onClick={() => makeItem("smoke_detector")}>
          Add Smoke Detector
        </button>
        <button onClick={() => makeItem("invalid")}>Add Invalid Tile</button>
      </div>

      <div>
        <button onClick={() => clear()}>Clear All</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: 12 }}>Tips:</p>
        <ul style={{ marginTop: 4 }}>
          <li>Drag items to move them (snap to grid on release).</li>
          <li>Wheel to zoom, drag stage to pan.</li>
        </ul>
      </div>
    </div>
  );
}
