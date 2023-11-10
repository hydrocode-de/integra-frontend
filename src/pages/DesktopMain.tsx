import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { DarkMode, LightMode, Menu } from "@mui/icons-material"
import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext"
import MainMap from "../components/MainMap/MainMap"
import DrawControl from "../components/MainMap/DrawControl"
import TreeLineSource from "../components/MainMap/TreeLineSource"


const DesktopMain: React.FC = () => {
    // get the current theme
    const theme = useIntegraTheme()

    // get the theme toggler
    const modeToggler = useModeToggler()

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

            <MainMap mapId="desktop">
                <DrawControl />
                <TreeLineSource />
            </MainMap>
        </Box>
    </>
}

export default DesktopMain