import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export const panelStyles: SxProps<Theme> = {
  width: 200,
  padding: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const inputStyles: SxProps<Theme> = {
  width: '100%',
};

export const buttonStyles: SxProps<Theme> = {
  width: '100%',
};

export const stageContainerStyles: CSSProperties = {
  background: '#fafafa',
  marginLeft: 8,
  flexGrow: 1,
};
