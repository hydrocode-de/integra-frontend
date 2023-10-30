import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { useIntegraTheme, useModeToggler, } from "../context/IntegraThemeContext"
import  { Menu, LightMode, DarkMode } from "@mui/icons-material"

import MainMap from "../components/MainMap/MainMap"
import TreeLineSource from "../components/MainMap/TreeLineSource"
import DrawControl from "../components/MainMap/DrawControl"
import { useAppDispatch } from "../hooks"
import { addLineAction } from "../components/MainMap/treeLineFeatures/treeLinesSlice"
import { useDrawBuffer } from "../components/MainMap/treeLineFeatures/treeLinesHooks"
import { useCenter, useZoom } from "../components/MainMap/mapFeatures/mapHooks"


const MainPage: React.FC = () => {
    // get the theme 
    const theme = useIntegraTheme()
    const modeToggler = useModeToggler()

    // development only
    const buffer = useDrawBuffer()
    const dispatch = useAppDispatch()
    const onSave = () => dispatch(addLineAction({distance: 40, type: 'birch'}))

    // development only
    const center = useCenter()
    const zoom = useZoom()

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

                    <Typography variant="h6" component="div" sx={{flexFlow: 1, mr: 2}}>
                        Lng: {center.lng} Lat: {center.lat} Zoom: {zoom}
                    </Typography>

                    <Button color="inherit" onClick={onSave} disabled={buffer.features.length === 0}>SAVE</Button>
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={modeToggler}>
                        { theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>

        <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0">
            <MainMap>
                <DrawControl />
                <TreeLineSource />
            </MainMap>
        </Box>
    </>
}

export default MainPage