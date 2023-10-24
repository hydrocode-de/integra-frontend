import { CssBaseline } from "@mui/material"
import MainPage from "./pages/MainPage"
import IntegraThemeProvider from "./shared/IntegraThemeContext"


export const App = () => {
  return <>
    <IntegraThemeProvider>
      <CssBaseline />
      <MainPage />
    </IntegraThemeProvider>
  </>
}
