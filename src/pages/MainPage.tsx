import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import {   useDarkMode, useIntegraTheme, useLightMode, } from "../shared/IntegraThemeContext"
import  { Menu, LightMode, DarkMode } from "@mui/icons-material"

import MainMap from "../components/MainMap"


const MainPage: React.FC = () => {
    // get the theme 
    const theme = useIntegraTheme()

    const onThemeToggle = () => {
        if (theme.palette.mode === 'dark') {
            useLightMode()
        } else {
            useDarkMode()
        }
    }

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
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={onThemeToggle}>
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