import { Mark } from "@mui/base"
import { Box, Slider, Typography } from "@mui/material"
import { setSimulationStep, simulationStep } from "../../appState/simulationSignals"

// hard-code some marks
const marks: Mark[] = [
    // {value: 5, label: '5'},
    {value: 10, label: '10 Jahre'},
    {value: 30, label: '30 Jahre'},
    {value: 50, label: '50 Jahre'},
    {value: 80, label: '80 Jahre'},
]

const SimulationStepSlider: React.FC = () => {
    return <>
        <Typography variant="h6">simuliere Baumwachstum</Typography>
        <Box display="flex" mt={1}>
            <Typography variant="body1" mr={2}>{simulationStep.value.current}</Typography>
            <Slider marks={marks} valueLabelDisplay="auto" value={simulationStep.value.current} onChange={(e, value) => setSimulationStep(value as number)}/>
            <Typography variant="body1" ml={1}>Jahre</Typography>
        </Box>
        
    </>
}

export default SimulationStepSlider