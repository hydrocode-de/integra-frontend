import { CssBaseline } from "@mui/material"
import { MapProvider } from "react-map-gl"
import { Provider } from "react-redux"
import { store } from "./store"

import MainPage from "./pages/MainPage"
import IntegraThemeProvider from "./context/IntegraThemeContext"


export const App = () => {
  return <>
    <Provider store={store}>
      <IntegraThemeProvider>
        <MapProvider>
          <CssBaseline />
          <MainPage />
        </MapProvider>
      </IntegraThemeProvider>
    </Provider>
  </>
}
