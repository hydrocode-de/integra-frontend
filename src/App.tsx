import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material"
import MainPage from "./pages/MainPage"
import { useMemo } from "react"


export const App = () => {
  // handle dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // make the theme accessible
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      }
    })
  }, [prefersDarkMode])
  return <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  </>
}
