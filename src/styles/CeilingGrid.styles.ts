import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export const panelStyles: SxProps<Theme> = {
  width: 220, // slightly larger to fit text comfortably
  padding: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  boxSizing: 'border-box', // ensures padding doesn't overflow
  overflowY: 'auto', // scrollable if content exceeds height
  backgroundColor: '#f5f5f5', // subtle panel background
};

export const inputStyles: SxProps<Theme> = {
  width: '100%',
  boxSizing: 'border-box',
};

export const buttonStyles: SxProps<Theme> = {
  width: '100%',
  boxSizing: 'border-box',
};

export const stageContainerStyles: CSSProperties = {
  background: '#fafafa',
  marginLeft: 0, // removed extra margin to align stage with panel
  flexGrow: 1,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};
