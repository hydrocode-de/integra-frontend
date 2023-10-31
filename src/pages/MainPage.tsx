import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { useIntegraTheme, useModeToggler, } from "../context/IntegraThemeContext"
import  { Menu, LightMode, DarkMode } from "@mui/icons-material"

import MainMap from "../components/MainMap/MainMap"
import TreeLineSource from "../components/MainMap/TreeLineSource"
import DrawControl from "../components/MainMap/DrawControl"
// import { useAppDispatch } from "../hooks"
// import { useDrawBuffer } from "../components/MainMap/treeLineFeatures/treeLinesHooks"
// import { useCenter, useZoom } from "../components/MainMap/mapFeatures/mapHooks"
import DrawPalette from "../components/DrawPalette"


const MainPage: React.FC = () => {
    // get the theme 
    const theme = useIntegraTheme()
    const modeToggler = useModeToggler()

    // // development only
    // const buffer = useDrawBuffer()
    // const dispatch = useAppDispatch()

    // // development only
    // const center = useCenter()
    // const zoom = useZoom()

    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <Menu />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        INTEGRA
                    </Typography>

                    {/* <Typography variant="h6" component="div" sx={{flexFlow: 1, mr: 2}}>
                        Lng: {center.lng} Lat: {center.lat} Zoom: {zoom}
                    </Typography> */}

                    <Button color="inherit">Button</Button>
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={modeToggler}>
                        { theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        
        <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex">
            <Box height="100%" width="33vw" maxWidth="600px" m="0" p="1rem">
                <DrawPalette />
            </Box>

            <MainMap>
                <DrawControl />
                <TreeLineSource />
            </MainMap>
        </Box>
    </>
}

export default MainPage