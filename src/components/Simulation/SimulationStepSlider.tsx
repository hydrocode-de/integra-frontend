import { Box, CardActionArea, Collapse, IconButton, Slider, Typography } from "@mui/material"
import { ExpandMore, ExpandLess } from "@mui/icons-material"
import { Mark } from "@mui/base"
import { setSimulationStep, simulationStep } from "../../appState/simulationSignals"
import { useSignal } from "@preact/signals-react"

// hard-code some marks
const marks: Mark[] = [
    // {value: 5, label: '5'},
    {value: 10, label: '10 Jahre'},
    {value: 30, label: '30 Jahre'},
    {value: 50, label: '50 Jahre'},
    {value: 80, label: '80 Jahre'},
]

const SimulationStepSlider: React.FC = () => {
    // state to handle card state
    const open = useSignal<boolean>(true)

    return <>
        <Box p={open.value ? 0 : 0}>
            <CardActionArea onClick={() => open.value = !open.peek()}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" ml={1}>
                <Typography variant={open.value ? 'h6' : 'body2'} my="auto">simuliere Baumwachstum</Typography>
                <IconButton size="small">
                    { open.value ? <ExpandMore /> : <ExpandLess /> }
                </IconButton>
            </Box>
            </CardActionArea>
        <Collapse in={open.value}>
        <Box display="flex" mt={1} p={1.5}>
            <Typography variant="body1" mr={2}>{simulationStep.value.current}</Typography>
            <Slider marks={marks} valueLabelDisplay="auto" value={simulationStep.value.current} onChange={(e, value) => setSimulationStep(value as number)}/>
            <Typography variant="body1" ml={1}>Jahre</Typography>
        </Box>
        </Collapse>
        </Box>
    </>
}

export default SimulationStepSlider