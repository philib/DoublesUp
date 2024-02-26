import { Fab } from '@mui/material';
import { theme } from '../theme';
import { CSSProperties } from 'react';

export interface CustomFabProps {
  onClick: () => void;
  children: React.ReactNode;
  style?: CSSProperties;
}

export const CustomFab: React.FunctionComponent<CustomFabProps> = ({
  onClick,
  children,
  style,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <svg
        width={80}
        height={80}
        style={{
          zIndex: 1049,
          position: 'absolute',
          transform: 'translate(0%, -10%)',
        }}
      >
        <path
          d="M2,40 A8,8 0 0 0 78 40"
          fill={theme.palette.background.default}
          stroke={theme.palette.secondary.main}
          strokeWidth={3}
        />
        <rect
          width={76}
          height={3}
          x={2}
          y={38}
          fill={theme.palette.background.default}
        />
      </svg>
      <Fab
        style={{
          ...style,
          transform: 'translate(20%, 0%)',
          borderRadius: '50%',
        }}
        color="primary"
        aria-label="add"
        onClick={onClick}
      >
        {children}
      </Fab>
    </div>
  );
};
