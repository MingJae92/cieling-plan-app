import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { useCeilingStore } from '../store/store';

export default function CeilingGrid() {
  const width = useCeilingStore((s) => s.width);
  const height = useCeilingStore((s) => s.height);
  const components = useCeilingStore((s) => s.components);
  const updateComponent = useCeilingStore((s) => s.updateComponent);
  const removeComponent = useCeilingStore((s) => s.removeComponent);

  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  const [scale, setScale] = useState(1);

  // USER ADJUSTABLE TILE SIZE (mm → px)
  const [tileWidth, setTileWidth] = useState(48);   // internal tile width px
  const [tileHeight, setTileHeight] = useState(48); // internal tile height px

  // INPUT FIELDS
  const [inputTileWidth, setInputTileWidth] = useState(600);
  const [inputTileHeight, setInputTileHeight] = useState(600);

  const padding = 20;

  // DEFAULT AUTO-FIT ONLY ONCE (when page loads)
  useEffect(() => {
    const maxW = window.innerWidth - 220;
    const maxH = window.innerHeight - 60;

    const newTileW = Math.floor(maxW / width);
    const newTileH = Math.floor(maxH / height);

    const finalTileW = Math.max(20, Math.min(newTileW, 120));
    const finalTileH = Math.max(20, Math.min(newTileH, 120));

    setTileWidth(finalTileW);
    setTileHeight(finalTileH);
  }, []);

  // Apply tile size from the input box
  const applyTileSize = () => {
    // Convert mm → px (simple scaling for UI)
    const scaleFactor = 0.08; // 600mm ≈ 48px

    const newW = Math.max(20, Math.min(inputTileWidth * scaleFactor, 200));
    const newH = Math.max(20, Math.min(inputTileHeight * scaleFactor, 200));

    setTileWidth(newW);
    setTileHeight(newH);
  };

  // Zoom
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1 + direction * 0.1;
    const newScale = Math.max(0.2, Math.min(oldScale * factor, 4));
    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
    stage.batchDraw();
  };

  // Grid lines
  const verticalLines = [];
  for (let i = 0; i <= width; i++) {
    verticalLines.push([i * tileWidth, 0, i * tileWidth, height * tileHeight]);
  }

  const horizontalLines = [];
  for (let j = 0; j <= height; j++) {
    horizontalLines.push([0, j * tileHeight, width * tileWidth, j * tileHeight]);
  }

  // Position helpers
  const toScreenX = (gx: number) => gx * tileWidth + tileWidth / 2;
  const toScreenY = (gy: number) => gy * tileHeight + tileHeight / 2;

  return (
    <div style={{ display: 'flex' }}>
      {/* SETTINGS PANEL */}
      <div style={{ width: 200, padding: 10 }}>
        <h3>Tile Size (mm)</h3>

        <label>Tile Width (mm)</label>
        <input
          type="number"
          value={inputTileWidth}
          onChange={(e) => setInputTileWidth(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Tile Height (mm)</label>
        <input
          type="number"
          value={inputTileHeight}
          onChange={(e) => setInputTileHeight(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <button
          onClick={applyTileSize}
          style={{
            width: '100%',
            padding: '8px 0',
            background: '#333',
            color: 'white',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            marginTop: 10,
          }}
        >
          Apply Tile Size
        </button>
      </div>

      <Stage
        ref={stageRef}
        style={{ background: '#fafafa', marginLeft: 10 }}
        draggable
        onWheel={handleWheel}
        width={window.innerWidth - 220}
        height={window.innerHeight - 60}
      >
        <Layer ref={layerRef}>
          {/* GRID */}
          {verticalLines.map((p, idx) => (
            <Line key={'v' + idx} points={p} stroke="#ccc" strokeWidth={1} />
          ))}
          {horizontalLines.map((p, idx) => (
            <Line key={'h' + idx} points={p} stroke="#eee" strokeWidth={1} />
          ))}

          {/* COMPONENTS */}
          {components.map((c) => {
            const x = toScreenX(c.x);
            const y = toScreenY(c.y);

            const commonProps = {
              x,
              y,
              draggable: true,
              key: c.id,
              onDragEnd: (e: any) => {
                const nx = Math.round(e.target.x() / tileWidth - 0.5);
                const ny = Math.round(e.target.y() / tileHeight - 0.5);

                // Clamp to grid
                const cx = Math.max(0, Math.min(nx, width - 1));
                const cy = Math.max(0, Math.min(ny, height - 1));
                updateComponent(c.id, { x: cx, y: cy });
              },
              onDblClick: () => removeComponent(c.id),
            };

            if (c.type === 'invalid') {
              return (
                <Rect
                  {...commonProps}
                  width={tileWidth - 4}
                  height={tileHeight - 4}
                  offsetX={(tileWidth - 4) / 2}
                  offsetY={(tileHeight - 4) / 2}
                  fill="#000"
                  opacity={0.25}
                />
              );
            }

            const color =
              c.type === 'light'
                ? '#f6c84c'
                : c.type === 'air_supply'
                ? '#4ea8f2'
                : c.type === 'air_return'
                ? '#60d394'
                : '#f77';

            return (
              <Circle
                {...commonProps}
                radius={Math.min(tileWidth, tileHeight) / 3}
                fill={color}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
