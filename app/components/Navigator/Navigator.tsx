import {BottomNavigation, BottomNavigationAction, Snackbar, Typography, useTheme,} from '@mui/material';
import React, {useEffect, useRef} from 'react';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import {RoundedFrame} from "../misc/RoundedFrame";

export interface Navigation {
    disabledHint: string | undefined;
    title: string;
    icon: React.JSX.Element;
    component: React.ReactElement;
}

export interface NavigatorProps {
    icon?: React.JSX.Element;
    navigations: Navigation[];
}

export const headerAndBottomNavigationHeight = '5rem';

export const Navigator: React.FunctionComponent<NavigatorProps> = ({
                                                                       navigations,
                                                                       icon = <SportsTennisIcon color="secondary"
                                                                                                fontSize="large"/>,
                                                                   }) => {
    const theme = useTheme()
    const bottomNavigationRef = useRef<HTMLDivElement>(null);
    const [maxContentHeight, setMaxContentHeight] = React.useState('0%');
    useEffect(() => {
        if (bottomNavigationRef.current) {
            const top = bottomNavigationRef.current.getBoundingClientRect().top;
            setMaxContentHeight(
                `calc((${top}px - ${headerAndBottomNavigationHeight}))`
            );
        }
    }, [bottomNavigationRef]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [bottomNavigationValue, setBottomNavigationValue] = React.useState(0);
    const [scrollPosition, setScrollPosition] = React.useState<{
        [navigation: number]: number;
    }>({});
    const [snackbarState, setSnackbarState] = React.useState<
        { open: false } | { open: true; message: string }
    >({open: false});
    const getHintByIndex = (index: number) => {
        const hintByIndex = navigations.reduce(
            (acc, cur, index) => ({...acc, [index]: cur.disabledHint}),
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
        />
    ));
    useEffect(() => {
        const currentContainerRef = containerRef.current;
        const onScroll = () => {
            if (currentContainerRef) {
                setScrollPosition({
                    ...scrollPosition,
                    [bottomNavigationValue]: currentContainerRef.scrollTop,
                });
            }
        };

        if (currentContainerRef) {
            currentContainerRef.addEventListener('scroll', onScroll);
        }

        return () => {
            if (currentContainerRef) {
                currentContainerRef.removeEventListener('scroll', onScroll);
            }
        };
    }, [bottomNavigationValue, scrollPosition]);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(
                0,
                scrollPosition[bottomNavigationValue] ?? 0
            );
        }
    }, [bottomNavigationValue, scrollPosition]);

    return (
        <main>
            <>
                <div style={{position: 'fixed', top: 0, zIndex: 1000, width: '100%'}}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: theme.palette.primary.main,
                            height: headerAndBottomNavigationHeight,
                            border: 'solid',
                        }}
                    >
                        <div style={{paddingRight: '20px', paddingLeft: '20px'}}>
                            {icon}
                        </div>
                    </div>
                </div>
            </>
            <div
                ref={containerRef}
                style={{
                    zIndex: 1,
                    position: 'fixed',
                    top: headerAndBottomNavigationHeight,
                    width: '100%',
                    overflow: 'auto',
                    height: '100%',
                    maxHeight: maxContentHeight,
                }}
            >
                {navigations.map((it, index) => (
                    <div
                        key={`navigation-${index}`}
                        style={{height: '100%'}}
                        hidden={index != bottomNavigationValue}
                    >
                        <RoundedFrame test={`test-${index}`}>
                            {it.component}
                        </RoundedFrame>
                    </div>
                ))}
            </div>
            <Snackbar
                sx={{paddingBottom: '80px'}}
                color="primary"
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={snackbarState.open}
                autoHideDuration={1200}
                onClose={() => setSnackbarState({open: false})}
                message={snackbarState.open && snackbarState.message}
            ></Snackbar>
            <>
                <div
                    ref={bottomNavigationRef}
                    style={{position: 'fixed', bottom: 0, left: 0, right: 0}}
                >
                    <BottomNavigation
                        style={{
                            backgroundColor: theme.palette.primary.main,
                            height: headerAndBottomNavigationHeight,
                            width: '100%',
                            border: 'solid',
                        }}
                        className="bottomNavigation"
                        showLabels
                        value={bottomNavigationValue}
                        onChange={(event, newValue) => {
                            const hint = getHintByIndex(newValue);
                            if (hint) {
                                setSnackbarState({open: true, message: hint});
                            } else {
                                setBottomNavigationValue(newValue);
                            }
                        }}
                    >
                        {bottomNavigationActions}
                    </BottomNavigation>
                </div>
            </>
        </main>
    );
};
