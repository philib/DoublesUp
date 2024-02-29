import { Card } from '@mui/material';
import { ReactNode } from 'react';

export const LineupCard: React.FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => <Card style={{ margin: '10px' }}>{children}</Card>;
