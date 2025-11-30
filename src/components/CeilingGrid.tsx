import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Rect } from "react-konva";
import Konva from "konva";
import { useCeilingStore, GridItem } from "../store/store";
import { Box, Typography, TextField, Button } from "@mui/material";
import {
  panelStyles,
  inputStyles,
  buttonStyles,
  stageContainerStyles,
} from "../styles/Ceilingrid.styles";

export default function CeilingGrid() {
  const width = useCeilingStore((s) => s.width);
  const height = useCeilingStore((s) => s.height);
  const components = useCeilingStore((s) => s.components);
  const updateComponent = useCeilingStore((s) => s.updateComponent);
  const removeComponent = useCeilingStore((s) => s.removeComponent);
  const clear = useCeilingStore((s) => s.clear);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const [scale, setScale] = useState<number>(1);
  const [tileWidth, setTileWidth] = useState<number>(48);
  const [tileHeight, setTileHeight] = useState<number>(48);
  const [inputTileWidth, setInputTileWidth] = useState<number>(600);
  const [inputTileHeight, setInputTileHeight] = useState<number>(600);

  useEffect(() => {
    const maxW = window.innerWidth - 220;
    const maxH = window.innerHeight - 60;
    const newTileW = Math.floor(maxW / width);
    const newTileH = Math.floor(maxH / height);
    setTileWidth(Math.max(20, Math.min(newTileW, 120)));
    setTileHeight(Math.max(20, Math.min(newTileH, 120)));
  }, [width, height]);

  const applyTileSize = () => {
    const scaleFactor = 0.08;
    setTileWidth(Math.max(20, Math.min(inputTileWidth * scaleFactor, 200)));
    setTileHeight(Math.max(20, Math.min(inputTileHeight * scaleFactor, 200)));
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
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

  const verticalLines: number[][] = [];
  for (let i = 0; i <= width; i++)
    verticalLines.push([i * tileWidth, 0, i * tileWidth, height * tileHeight]);
  const horizontalLines: number[][] = [];
  for (let j = 0; j <= height; j++)
    horizontalLines.push([
      0,
      j * tileHeight,
      width * tileWidth,
      j * tileHeight,
    ]);

  const toScreenX = (gx: number) => gx * tileWidth + tileWidth / 2;
  const toScreenY = (gy: number) => gy * tileHeight + tileHeight / 2;

  const typeCounts = components.reduce<Record<string, number>>((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});

  // Function to remove all tiles of a type
  const removeByType = (type: string) => {
    components
      .filter((c) => c.type === type)
      .forEach((c) => removeComponent(c.id));
  };

  return (
    <Box display="flex" height="100vh">
      {/* SETTINGS PANEL */}
      <Box sx={panelStyles}>
        <Typography variant="h6" gutterBottom>
          Tile Size (mm)
        </Typography>

        <TextField
          label="Tile Width (mm)"
          type="number"
          value={inputTileWidth}
          onChange={(e) => setInputTileWidth(Number(e.target.value))}
          sx={inputStyles}
        />

        <TextField
          label="Tile Height (mm)"
          type="number"
          value={inputTileHeight}
          onChange={(e) => setInputTileHeight(Number(e.target.value))}
          sx={inputStyles}
        />

        <Button
          variant="contained"
          color="primary"
          sx={buttonStyles}
          onClick={applyTileSize}
        >
          Apply Tile Size
        </Button>

        {/* Total tiles & type counts */}
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Total Tiles: {components.length}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Lights: {typeCounts.light || 0} | Air Supply: {typeCounts.air_supply || 0} | Air Return: {typeCounts.air_return || 0} | Smoke Detectors: {typeCounts.smoke_detector || 0} | Invalid: {typeCounts.invalid || 0}
        </Typography>

        {/* Remove buttons */}
        <Typography variant="subtitle1">Remove Tiles:</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Button variant="outlined" onClick={() => removeByType("light")}>Remove Lights</Button>
          <Button variant="outlined" onClick={() => removeByType("air_supply")}>Remove Air Supply</Button>
          <Button variant="outlined" onClick={() => removeByType("air_return")}>Remove Air Return</Button>
          <Button variant="outlined" onClick={() => removeByType("smoke_detector")}>Remove Smoke Detectors</Button>
          <Button variant="outlined" onClick={() => removeByType("invalid")}>Remove Invalid Tiles</Button>
          <Button variant="contained" color="secondary" onClick={clear}>Clear All</Button>
        </Box>
      </Box>

      {/* STAGE */}
      <Box sx={stageContainerStyles}>
        <Stage
          ref={stageRef}
          draggable
          onWheel={handleWheel}
          width={window.innerWidth - 220}
          height={window.innerHeight - 60}
          style={{ width: "100%", height: "100%" }}
        >
          <Layer ref={layerRef}>
            {/* GRID */}
            {verticalLines.map((p, idx) => (
              <Line key={"v" + idx} points={p} stroke="#080707ff" strokeWidth={1} />
            ))}
            {horizontalLines.map((p, idx) => (
              <Line key={"h" + idx} points={p} stroke="#080707ff" strokeWidth={1} />
            ))}

            {/* COMPONENTS */}
            {components.map((c: GridItem) => {
              const x = toScreenX(c.x);
              const y = toScreenY(c.y);

              const commonProps = {
                x,
                y,
                draggable: true,
                key: c.id,
                onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                  const nx = Math.round(e.target.x() / tileWidth - 0.5);
                  const ny = Math.round(e.target.y() / tileHeight - 0.5);

                  const clampedX = Math.max(0, Math.min(nx, width - 1));
                  const clampedY = Math.max(0, Math.min(ny, height - 1));

                  const occupied = components.some(
                    other => other.id !== c.id && other.x === clampedX && other.y === clampedY
                  );

                  if (!occupied) {
                    updateComponent(c.id, { x: clampedX, y: clampedY });
                  } else {
                    e.target.position({
                      x: c.x * tileWidth + tileWidth / 2,
                      y: c.y * tileHeight + tileHeight / 2,
                    });
                    alert("Cannot move here — tile already occupied!");
                  }
                },
                onDblClick: () => removeComponent(c.id),
              };

              if (c.type === "invalid") {
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
                c.type === "light"
                  ? "#f6c84c"
                  : c.type === "air_supply"
                  ? "#4ea8f2"
                  : c.type === "air_return"
                  ? "#60d394"
                  : "#f77";
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
      </Box>
    </Box>
  );
}
