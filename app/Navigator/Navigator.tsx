import {
  BottomNavigation,
  BottomNavigationAction,
  SvgIconProps,
} from '@mui/material';
import React from 'react';

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
        icon={<navigation.icon />}
      />
    ));
  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#d90e29',
          height: '5rem',
          border: 'solid',
        }}
      >
        <div style={{ width: '100px' }}>Logo</div>
        <div style={{ width: '100vw' }}>Header Title</div>
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
