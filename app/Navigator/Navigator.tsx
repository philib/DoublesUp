import {
  BottomNavigation,
  BottomNavigationAction,
  Snackbar,
} from '@mui/material';
import React from 'react';
import { theme } from '../theme';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

export interface Navigation {
  disabledHint: string | undefined;
  title: string;
  icon: React.JSX.Element;
  component: React.ReactElement;
}

export interface NavigatorProps {
  navigations: Navigation[];
}

export const Navigator: React.FunctionComponent<NavigatorProps> = ({
  navigations,
}) => {
  const [bottomNavigationValue, setBottomNavigationValue] = React.useState(0);
  const [snackbarState, setSnackbarState] = React.useState<
    { open: false } | { open: true; message: string }
  >({ open: false });
  const getHintByIndex = (index: number) => {
    const hintByIndex = navigations.reduce(
      (acc, cur, index) => ({ ...acc, [index]: cur.disabledHint }),
      {} as { [index: number]: string | undefined }
    );
    if (hintByIndex[index] == undefined || hintByIndex[index] == '') {
      return undefined;
    } else {
      return hintByIndex[index];
    }
  };
  const bottomNavigationActions = navigations.map((navigation) => (
    <BottomNavigationAction
      label={navigation.title}
      icon={navigation.icon}
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
          <div
            style={{ height: '100%' }}
            hidden={index != bottomNavigationValue}
          >
            {it.component}
          </div>
        ))}
      </div>
      <footer
        style={{
          position: 'relative',
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Snackbar
          sx={{ paddingBottom: '80px' }}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbarState.open}
          autoHideDuration={1200}
          onClose={() => setSnackbarState({ open: false })}
          message={snackbarState.open && snackbarState.message}
        ></Snackbar>
        <BottomNavigation
          style={{
            backgroundColor: theme.palette.primary.main,
            width: '100%',
            border: 'solid',
          }}
          className="bottomNavigation"
          showLabels
          value={bottomNavigationValue}
          onChange={(event, newValue) => {
            const hint = getHintByIndex(newValue);
            if (hint) {
              setSnackbarState({ open: true, message: hint });
            } else {
              setBottomNavigationValue(newValue);
            }
          }}
        >
          {bottomNavigationActions}
        </BottomNavigation>
      </footer>
    </main>
  );
};
