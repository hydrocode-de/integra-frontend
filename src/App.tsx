import { useEffect, useState } from "react"
import { CssBaseline } from "@mui/material"
import { MapProvider } from "react-map-gl"
import { isMobile } from "react-device-detect"

// import the signals to start pre-loading the projects
import "./appState/projectSignals"

import IntegraThemeProvider from "./context/IntegraThemeContext"

// invoke the backend to start loading data
import "./appState/backendSignals"

// the two main anchor sites for the two app routes (Mobile / Desktop)
import DesktopNavigation from "./layout/DesktopNavigation"
import MobileNavigation from "./layout/MobileNavigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"


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

      
      <DndProvider backend={HTML5Backend}>
        <MapProvider>
          {isMobile || windowWidth < 768 ? <MobileNavigation /> : <DesktopNavigation /> }
        </MapProvider>
      </DndProvider>

    </IntegraThemeProvider>
  </>
}
