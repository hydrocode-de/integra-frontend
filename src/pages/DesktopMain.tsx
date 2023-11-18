import { AppBar, Box, Drawer, IconButton, MenuItem, MenuList, Toolbar, Typography } from "@mui/material"
import { DarkMode, LightMode, Menu, ArrowBack } from "@mui/icons-material"
import { Outlet } from "react-router-dom"

import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext"
import MainMap from "../components/MainMap/MainMap"
import DrawControl from "../components/MainMap/DrawControl"
import TreeLineSource from "../components/MainMap/TreeLineSource"
import { drawState } from "../appState/treeLineSignals"
import { DrawState } from "../appState/treeLine.model"
import DesktopContentCard from "../layout/desktop/DesktopContentCard"
import TreeLineNewCard from "../layout/desktop/TreeLineNewCard"
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip"
import ProjectSelect from "../components/ProjectSelect"
import { useSignal } from "@preact/signals-react"


const DesktopMain: React.FC = () => {
    // get the current theme
    const theme = useIntegraTheme()

    // get the theme toggler
    const modeToggler = useModeToggler()

    // drawer state
    const drawerOpen = useSignal<boolean>(false)

    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}} onClick={() => drawerOpen.value = true}>
                        <Menu />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        INTEGRA
                    </Typography>

                    {/* <Typography variant="h6" component="div" sx={{flexFlow: 1, mr: 2}}>
                        Lng: {center.lng} Lat: {center.lat} Zoom: {zoom}
                    </Typography> */}

                    <ProjectSelect />
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={modeToggler}>
                        { theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>

        <Drawer variant="temporary" open={drawerOpen.value} onClose={() => drawerOpen.value = false}>
            <AppBar position="static">
                    <Toolbar color="default">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}} onClick={() => drawerOpen.value = false}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Menü
                        </Typography>
                    </Toolbar>
            </ AppBar>
            <MenuList sx={{width: 250, height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                <span />
                <Box>
                    <MenuItem>Datenschutzerklärung</MenuItem>
                    <MenuItem>Impressum</MenuItem>
                </Box>
            </MenuList>
        </Drawer>

        <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex">

            {/* 
              * Navigation children can be placed on top of the map this way 
              * Only show if the draw Mode is OFF. This feels a bit hacky...
              */}
            { drawState.value !== DrawState.OFF ? (
                <DesktopContentCard noOutlet>
                    <TreeLineNewCard />
                </DesktopContentCard>
            ) : <Outlet /> }


            <MainMap mapId="desktop">
                <DrawControl />
                <TreeLineSource />
                <TreeLineTooltip />
            </MainMap>
        </Box>
    </>
}

export default DesktopMain