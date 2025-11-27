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
  const gridSize = 48; // px per tile
  const padding = 20;

  // center stage when size changes
  useEffect(()=> {
    const stage = stageRef.current;
    if (!stage) return;
    const w = width * gridSize;
    const h = height * gridSize;
    stage.width(window.innerWidth - 220); // account for sidebar
    stage.height(window.innerHeight - 60);
    // optional: center on load
    stage.position({ x: padding, y: padding });
    stage.draw();
  }, [width, height]);

  const handleWheel = (e:any) => {
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
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  // draw grid lines as two Line arrays: vertical and horizontal
  const verticalPoints = [];
  for (let i=0;i<=width;i++) {
    const x = i * gridSize;
    verticalPoints.push([x, 0, x, height * gridSize]);
  }
  const horizontalPoints = [];
  for (let j=0;j<=height;j++) {
    const y = j * gridSize;
    horizontalPoints.push([0, y, width * gridSize, y]);
  }

  const toScreenX = (gx:number) => gx * gridSize + gridSize/2;
  const toScreenY = (gy:number) => gy * gridSize + gridSize/2;

  return (
    <Stage
      ref={stageRef}
      style={{ background: '#fafafa' }}
      draggable
      onWheel={handleWheel}
      width={window.innerWidth - 220}
      height={window.innerHeight - 60}
    >
      <Layer ref={layerRef}>
        {/* grid lines */}
        {verticalPoints.map((p, idx)=>(
          <Line key={'v'+idx} points={p} stroke="#ddd" strokeWidth={1} />
        ))}
        {horizontalPoints.map((p, idx)=>(
          <Line key={'h'+idx} points={p} stroke="#eee" strokeWidth={1} />
        ))}

        {/* components */}
        {components.map((c) => {
          const x = toScreenX(c.x);
          const y = toScreenY(c.y);
          const commonProps = {
            x, y, draggable: true, key: c.id,
            onDragEnd: (e:any) => {
              const nx = Math.round(e.target.x() / gridSize - 0.5);
              const ny = Math.round(e.target.y() / gridSize - 0.5);
              // clamp
              const cx = Math.max(0, Math.min(nx, width-1));
              const cy = Math.max(0, Math.min(ny, height-1));
              updateComponent(c.id, { x: cx, y: cy });
            },
            onDblClick: ()=> removeComponent(c.id)
          } as any;

          if (c.type === 'invalid') {
            return (
              <Rect {...commonProps} width={gridSize-4} height={gridSize-4} offsetX={(gridSize-4)/2} offsetY={(gridSize-4)/2} fill="#000" opacity={0.25}/>
            );
          }

          const color =
            c.type === 'light' ? '#f6c84c' :
            c.type === 'air_supply' ? '#4ea8f2' :
            c.type === 'air_return' ? '#60d394' : '#f77';

          return <Circle {...commonProps} radius={gridSize/3} fill={color} />;
        })}
      </Layer>
    </Stage>
  );
}
