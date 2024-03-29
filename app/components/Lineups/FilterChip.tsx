import { Chip } from '@mui/material';
import { CSSProperties } from 'react';

export const FilterChip: React.FC<{
  text: string;
  active: boolean;
  onClick: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}> = ({ text, active, onClick, style, disabled }) => {
  const variant = active ? ('filled' as const) : ('outlined' as const);
  return (
    <Chip
      style={{
        backgroundColor: active ? undefined : 'white',
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '5px',
        marginRight: '5px',
        ...style,
      }}
      disabled={disabled}
      variant={variant}
      color="primary"
      label={text}
      onClick={onClick}
    />
  );
};
