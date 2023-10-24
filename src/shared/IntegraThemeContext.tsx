import { Theme, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { Dispatch, createContext, useReducer } from "react";


// initialize the contexts
export const ThemeContext = createContext<Theme>(createTheme());
export const ThemeDispatchContext = createContext<Dispatch<ThemeAction>>(() => {});

// create and export some types to dispatch changes to the theme
export enum ThemeActionTypes {
    LIGHT = 'light',
    DARK = 'dark'
}

export type ThemeAction = {
    type: ThemeActionTypes,
    payload?: any
}

// create a reducer to chance the theme dynamically
const themeReducer = ((theme: Theme, action: ThemeAction) => {
    switch (action.type) {
        case ThemeActionTypes.LIGHT: {
            return createTheme({...theme, palette: {mode: 'light'}})
            //return {...theme, palette: {mode: 'light'}}
        }
        case ThemeActionTypes.DARK: {
            return createTheme({palette: {mode: 'dark'}})
        }
    }
})

// create a ThemeProvider Component
const IntegraThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // to set the initial state of the theme, read out the users preference
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const initialTheme = createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light'
        }
    })
    
    // use the reducer to get the initial state
    const [theme, dispatch] = useReducer(themeReducer, initialTheme)


    // render the Application wrapped in the contexts
    return <>
        <ThemeContext.Provider value={theme}>
            <ThemeDispatchContext.Provider value={dispatch}>
                <ThemeProvider theme={theme}>
                    { children }
                </ThemeProvider>
            </ThemeDispatchContext.Provider>
        </ThemeContext.Provider>
    </>
}

export default IntegraThemeProvider