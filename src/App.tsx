import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material"
import MainPage from "./pages/MainPage"
import { createContext, useMemo, useState } from "react"


// create a Context to handle ColorMode Switches
export const ColorModeContext = createContext({toggleColorMode: () => {}})

export const App = () => {
  // handle dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light')

  const colorMode = useMemo(() => {
    return {
      toggleColorMode: () => setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light')
    }
  }, [])

  // make the theme accessible
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
      }
    })
  }, [mode])

  return <>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainPage />
      </ThemeProvider>
    </ColorModeContext.Provider>
  </>
}
