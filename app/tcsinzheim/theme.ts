import {createTheme} from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#d90e29',
        },
        secondary: {
            main: '#000000',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Poppins',
    },
    components: {
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: ({theme})=> ({
                    color: theme.palette.secondary.contrastText,
                    '&.Mui-selected': {
                        color: theme.palette.secondary.main,
                    },
                }),
            },

        }
    },
});
