import { useState } from "react"
import { Alert, Box, CircularProgress, Fab, FormControlLabel, IconButton, Typography, Checkbox  } from "@mui/material"
import { ArrowBack,  Check } from "@mui/icons-material"
import length from "@turf/length"

import { drawBuffer, drawState, addTreeLine } from "../appState/treeLineSignals"
import { DrawState } from "../appState/treeLine.model"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { simulationStep } from "../appState/simulationSignals"
import { platform } from "os"



const NewTreeLineControl: React.FC = () => {
    // define a state to show the statistics
    const [len, setLen] = useState<number>(0)
    const [maxLen, setMaxLen] = useState<number>(100)

    // define a state to plant in the past
    const step = useSignal(simulationStep.peek().current)
    useSignalEffect(() => {
        step.value = simulationStep.value.current
    })
    const plantInPast = useSignal<boolean>(false)


    // handler to abort the editing
    const onAbort = () => {
        // empty the buffer
        drawBuffer.value = []

        // disable the draw control
        drawState.value = DrawState.OFF
    }

    // handler to add a new tree line
    const onAdd = () => {
        // figure out the needed age
        const opts = plantInPast.peek() ? {age: simulationStep.peek().current} : {}

        addTreeLine(opts)

        // disable the draw control
        drawState.value = DrawState.OFF
    }

    // side-effect to update the current length and update the maximum length
    useSignalEffect(() => {
        // get the length of the current buffer
        const bufferLen = length({type: "FeatureCollection", features: drawBuffer.value}, {units: 'meters'})

        // update the maximum length of the circular progress
        if (bufferLen > 90 && bufferLen < 240) {
            setMaxLen(250)
        } else if (bufferLen > 240 && bufferLen < 490) {
            setMaxLen(500)
        } else if (bufferLen > 490 && bufferLen < 990) {
            setMaxLen(1000)
        } else if (bufferLen > 990) {
            setMaxLen(10000)
        }

        // update the length
        setLen(bufferLen)
    })


    // render the correct version of the control
    return <>
        <Box component="div">
            <Box component="div" sx={{flexGrow: 1}} display="flex" justifyContent="space-between">
                <IconButton size="small" edge="start" color="inherit" aria-label="zurück" sx={{mr: 2}} onClick={onAbort}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" component="div">
                    Neue Baumreihe
                </Typography>
                <span />
            </Box>
            <Box component="div" sx={{flexGrow: 1}} display="flex" justifyContent="space-around">
                <span />
                <Box component="div" position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value={Math.min((len / maxLen) * 100, 100)} />
                    <Box component="div" top="0" left="0" right="0" bottom="0" position="absolute" display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="caption" component="div" color="text.secondary">
                            {len > 1000 ? `${(len / 1000).toFixed(1)}km` : `${len.toFixed(0)}m`}
                        </Typography>
                    </Box>
                </Box>

                <Fab size="small" color="success" aria-label="add" disabled={drawBuffer.value.length === 0} onClick={onAdd}>
                    <Check />
                </Fab>
                <span />
            </Box>
        </Box>

        {/* if the simulation is not at timestep 0 show a warning */}
        { step.value !== 0 ? (
            <Box component="div" mt={2}>
                <Alert severity="warning">
                Die Simulation steht nicht bei 0 Jahren. 
                    { plantInPast.value ? 
                        `Die Baumreihe wird rückwirkend geplanzt und wird dann bereits ${step.value} Jahre alt sein.` 
                    : 
                        `Die Baumreihe wird bei ${step.value} Jahren als Setzlinge gepflanzt.`
                    }
                </Alert>
                <FormControlLabel
                    control={<Checkbox value={plantInPast.value} onChange={() => plantInPast.value = !plantInPast.peek()} />}
                    label="Baumreihe rückwirkend pflanzen"
                />
            </Box>
        ) : null }
    </>
}

export default NewTreeLineControl