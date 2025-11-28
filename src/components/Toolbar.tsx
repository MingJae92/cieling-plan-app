import React, { useState } from 'react';
import { useCeilingStore, GridItem, ComponentType } from '../store/store';

export default function Toolbar() {
  const addComponent = useCeilingStore((s) => s.addComponent);
  const setSize = useCeilingStore((s) => s.setSize);
  const clear = useCeilingStore((s) => s.clear);
  const [w, setW] = useState(20);
  const [h, setH] = useState(12);

  const makeItem = (type: ComponentType) => {
    const id = crypto.randomUUID();
    const item: GridItem = { id, x: Math.floor(Math.random() * w), y: Math.floor(Math.random() * h), type };
    addComponent(item);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      

      <div>
        <button onClick={()=>makeItem('light')}>Add Light</button>
        <button onClick={()=>makeItem('air_supply')}>Add Air Supply</button>
        <button onClick={()=>makeItem('air_return')}>Add Air Return</button>
        <button onClick={()=>makeItem('smoke_detector')}>Add Smoke Detector</button>
        <button onClick={()=>makeItem('invalid')}>Add Invalid Tile</button>
      </div>

      <div>
        <button onClick={()=>clear()}>Clear All</button>
      </div>

      <div style={{marginTop:8}}>
        <p style={{margin:0, fontSize:12}}>Tips:</p>
        <ul style={{marginTop:4}}>
          <li>Drag items to move them (snap to grid on release).</li>
          <li>Wheel to zoom, drag stage to pan.</li>
        </ul>
      </div>
    </div>
  );
}
