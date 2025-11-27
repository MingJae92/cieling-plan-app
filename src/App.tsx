import React from "react";
import CeilingGrid from "./components/CeilingGrid";
import Toolbar from "./components/Toolbar";

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Ceiling Grid Editor — Prototype</h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <small>Use toolbar to add items. Drag items to move. Wheel to zoom. Drag stage to pan.</small>
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <aside style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}>
          <Toolbar />
        </aside>
        <main style={{ flex: 1 }}>
          <CeilingGrid />
        </main>
      </div>
    </div>
  );
}
