import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { useIntegraTheme, useModeToggler, } from "../context/IntegraThemeContext"
import  { Menu, LightMode, DarkMode } from "@mui/icons-material"

import MainMap from "../components/MainMap"


const MainPage: React.FC = () => {
    // get the theme 
    const theme = useIntegraTheme()
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

                    <Button color="inherit">Button</Button>
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={modeToggler}>
                        { theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>

        <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0">
            <MainMap />
        </Box>
    </>
}

export default MainPage