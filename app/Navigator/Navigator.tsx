import {
  BottomNavigation,
  BottomNavigationAction,
  SvgIconProps,
} from '@mui/material';
import React from 'react';
import { theme } from '../theme';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

export interface Navigation {
  show: () => boolean;
  title: string;
  icon: React.ElementType<SvgIconProps>;
  component: React.ReactElement;
}
export interface NavigatorProps {
  navigations: Navigation[];
}
export const Navigator: React.FunctionComponent<NavigatorProps> = ({
  navigations,
}) => {
  const [bottomNavigationValue, setBottomNavigationValue] = React.useState(0);
  const bottomNavigationActions = navigations
    .filter((it) => it.show())
    .map((navigation) => (
      <BottomNavigationAction
        label={navigation.title}
        icon={
          <navigation.icon
            style={{ color: theme.palette.background.default }}
          />
        }
        style={{ color: theme.palette.background.default }}
      />
    ));
  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: theme.palette.primary.main,
          height: '5rem',
          border: 'solid',
        }}
      >
        <SportsTennisIcon
          color="secondary"
          fontSize="large"
          style={{ paddingRight: '20px', paddingLeft: '20px' }}
        />
        <div
          style={{ width: '100vw', color: theme.palette.background.default }}
        >
          Header Title
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {navigations.map((it, index) => (
          <div hidden={index != bottomNavigationValue}>{it.component}</div>
        ))}
      </div>
      <footer style={{ border: 'solid' }}>
        <BottomNavigation
          style={{ backgroundColor: theme.palette.primary.main }}
          showLabels
          value={bottomNavigationValue}
          onChange={(event, newValue) => {
            setBottomNavigationValue(newValue);
          }}
        >
          {bottomNavigationActions}
        </BottomNavigation>
      </footer>
    </main>
  );
};
