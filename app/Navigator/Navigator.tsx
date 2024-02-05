import {
  BottomNavigation,
  BottomNavigationAction,
  SvgIconProps,
} from '@mui/material';
import React from 'react';

export interface NavigatorProps {
  navigations: {
    title: string;
    icon: React.ElementType<SvgIconProps>;
    component: React.ReactElement;
  }[];
}
export const Navigator: React.FunctionComponent<NavigatorProps> = ({
  navigations,
}) => {
  const [bottomNavigationValue, setBottomNavigationValue] = React.useState(0);
  const bottomNavigationActions = navigations.map((navigation) => (
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
        {navigations[bottomNavigationValue].component}
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
