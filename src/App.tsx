import { useEffect, useState } from "react"
import { CssBaseline } from "@mui/material"
import { MapProvider } from "react-map-gl"
import { isMobile } from "react-device-detect"

import IntegraThemeProvider from "./context/IntegraThemeContext"

// the two main anchor sites for the two app routes (Mobile / Desktop)
import DesktopNavigation from "./layout/DesktopNavigation"
import MobileNavigation from "./layout/MobileNavigation"


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
    <IntegraThemeProvider>
      
      <CssBaseline />

      
      <MapProvider>
        {isMobile || windowWidth < 768 ? <MobileNavigation /> : <DesktopNavigation /> }
      </MapProvider>

    </IntegraThemeProvider>
  </>
}
