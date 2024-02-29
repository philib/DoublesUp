import {
  BottomNavigation,
  BottomNavigationAction,
  Snackbar,
} from '@mui/material';
import React, { useEffect } from 'react';
import { theme } from '../../theme';
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
  const [scrollPosition, setScrollPosition] = React.useState<{
    [navigation: number]: number;
  }>({});
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
      key={navigation.title}
      label={navigation.title}
      icon={navigation.icon}
      style={{ color: theme.palette.background.default }}
    />
  ));
  useEffect(() => {
    window.scrollTo(0, scrollPosition[bottomNavigationValue] ?? 0);
  }, [bottomNavigationValue, scrollPosition]);

  return (
    <main>
      <>
        <div style={{ position: 'fixed', top: 0, zIndex: 1000 }}>
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
              style={{
                width: '100vw',
                color: theme.palette.background.default,
              }}
            >
              Header Title
            </div>
          </div>
        </div>
        <div style={{ height: '5rem' }} />
      </>
      <div>
        {navigations.map((it, index) => (
          <div
            key={`navigation-${index}`}
            style={{ height: '100%' }}
            hidden={index != bottomNavigationValue}
          >
            {it.component}
          </div>
        ))}
      </div>
      <Snackbar
        sx={{ paddingBottom: '80px' }}
        color="primary"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarState.open}
        autoHideDuration={1200}
        onClose={() => setSnackbarState({ open: false })}
        message={snackbarState.open && snackbarState.message}
      ></Snackbar>
      <>
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
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
                setScrollPosition({
                  ...scrollPosition,
                  [bottomNavigationValue]: window.scrollY,
                });
                setBottomNavigationValue(newValue);
              }
            }}
          >
            {bottomNavigationActions}
          </BottomNavigation>
        </div>
        {/* This is a dummy to prevent items hiding behind the actual bottom navigation due to its fixed position */}
        <BottomNavigation />
      </>
    </main>
  );
};
