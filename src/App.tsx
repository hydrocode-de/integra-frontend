import { CssBaseline } from "@mui/material"
import MainPage from "./pages/MainPage"
import IntegraThemeProvider from "./context/IntegraThemeContext"


export const App = () => {
  return <>
    <IntegraThemeProvider>
      <CssBaseline />
      <MainPage />
    </IntegraThemeProvider>
  </>
}
