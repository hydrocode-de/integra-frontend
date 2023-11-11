import { useEffect, useState } from "react"
import { CssBaseline } from "@mui/material"
import { MapProvider } from "react-map-gl"
import { Provider as ReduxProvider } from "react-redux"
import { isMobile } from "react-device-detect"

import IntegraThemeProvider from "./context/IntegraThemeContext"
import { store } from "./store"

// the two main anchor sites for the two app routes (Mobile / Desktop)
import MobileMain from "./pages/MobileMain"
import DesktopNavigation from "./layout/DesktopNavigation"


export const App = () => {
  // state to store the current window size
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  // subscribe to window resize events before rendering anything
  const handleResize = () => setWindowWidth(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <>
    <ReduxProvider store={store}>
      <IntegraThemeProvider>
        
        <CssBaseline />

        
        <MapProvider>
          {isMobile || windowWidth < 768 ? <MobileMain /> : <DesktopNavigation /> }
        </MapProvider>

      </IntegraThemeProvider>
    </ReduxProvider>
  </>
}
