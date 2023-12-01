import { AppBar, Box, Card, IconButton, Paper, Toolbar, Typography } from "@mui/material"
import { ArrowBack, DarkMode, LightMode } from "@mui/icons-material"
import { Link } from "react-router-dom"

import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext"
import SimulationStepSlider from "../components/Simulation/SimulationStepSlider"
import AgroforestryScene from "../components/3DPreview/AgroforestryScene"
import GroundLayerSwitch from "../components/3DPreview/GroundLayerSwitch"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"



const Desktop3DMain: React.FC = () => {
    // use the Intrgra theme a expose a theme toggler
    const theme = useIntegraTheme()
    const modeToggler = useModeToggler()

    
    return <>
        <Box component="div" sx={{flexGrow: 1}}>
            <AppBar position="static" variant="elevation" color="default">
                <Toolbar>
                    
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}} component={Link} to="/">
                
                    <ArrowBack />
                    
                </IconButton>
                    

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        INTEGRA - 3D preview
                    </Typography>

                    
                    <IconButton size="medium" edge="start" color="inherit" aria-label="switch color mode" sx={{ml: 2}} onClick={modeToggler}>
                        { theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>


        <Box component="div" width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex" flexDirection="column">

            <Box component="div" width="100vw" flexGrow={1} display="flex">
                <Suspense fallback={<span>Loading...</span>}>
                    <Canvas frameloop="demand" style={{width: '100%', height: '100%'}}>
                        <AgroforestryScene />
                    </Canvas>
                </Suspense>
            </Box>

            {/* add the simulation slider */}
            <Box component="div" minWidth="250px" width="40vw" maxWidth="450px" position="fixed" bottom="5px" left="0" right="0" mx="auto" zIndex="99">
                <Card>
                    <SimulationStepSlider />
                </Card>
            </Box>

            <Box component="div" width="100px" height="100px" position="fixed" bottom="10px" left="10px">
                <Paper sx={{p: '5px', m: 0}}>
                    <GroundLayerSwitch />
                </Paper>
            </Box>

        </Box>
    </>}

export default Desktop3DMain