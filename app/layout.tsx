'use client'

import {createTheme, Paper, ThemeProvider} from "@mui/material";
import {lightGreen, lime} from "@mui/material/colors";

const theme = createTheme(
//     {
//     palette: {
//         primary: {
//             main: '#698834'
//         },
//         secondary: {
//             main: '#8bc34a'
//         },
//         // background: {
//         //     default: '#fffe8a',
//         //     paper: '#fffe8a'
//         // }
//
//     },
// }
)

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" style={{height: '100%'}}>
        <ThemeProvider theme={theme}>
            <body style={{height: '100%', margin: 0, padding: 0}}>
            {children}
            </body>
        </ThemeProvider>
        </html>
    )
}
