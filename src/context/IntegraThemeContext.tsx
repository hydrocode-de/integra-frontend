import { Theme, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { Dispatch, createContext, useContext, useReducer } from "react";


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
            return createTheme({...theme, palette: {mode: 'dark'}})
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
        },
        components: {
            MuiSelect: {
                styleOverrides: {
                    root: {
                        borderRadius: 8
                    }
                }
            }
        }
    })
    
    // use the reducer to get the initial state
    const [theme, dispatch] = useReducer(themeReducer, initialTheme)


    // render the Application wrapped in the contexts
    return <>
        <ThemeContext.Provider value={theme}>
            <ThemeProvider theme={theme}>
            <ThemeDispatchContext.Provider value={dispatch}>
                
                    { children }
                
            </ThemeDispatchContext.Provider>
            </ThemeProvider>
        </ThemeContext.Provider>
    </>
}

export const useIntegraTheme = () => useContext(ThemeContext)

export const useIntegraThemeDispatch = () => useContext(ThemeDispatchContext)

export const useModeToggler = () => {
    // get the contexts
    const dispatch = useIntegraThemeDispatch()
    const theme = useIntegraTheme()

    return () => dispatch({type: theme.palette.mode === "dark" ? ThemeActionTypes.LIGHT : ThemeActionTypes.DARK })
}

export const useLightMode = () => {
    const dispatch = useIntegraThemeDispatch()

    return () => dispatch({type: ThemeActionTypes.LIGHT})
}

export const useDarkMode = () => {
    const dispatch = useIntegraThemeDispatch()

    return () => dispatch({type: ThemeActionTypes.DARK})
}


export default IntegraThemeProvider