import { useEffect, useState } from "react"
import { Box, Slider, Typography } from "@mui/material"

import DraggableTree  from "../../components/TreeLines/DraggableTree"
import { loadClosestDataPoint } from "../../appState/backendSignals"


const DraggableElements: React.FC = () => {
    // the intial age can be adjusted?
    const [age, setAge] = useState<number>(1)

    // debug, to test which data is available as the slider changes
    useEffect(() => {
        // load the associated data from memory, whenever age changes and log to console
        console.log(loadClosestDataPoint('Bergahorn', age))
    }, [age])

    return <>
        {/* Draggable components box */}
        <Box component="div">
            
            <DraggableTree src="icons/bergahorn-1.png" treeType="Bergahorn" treeLineId="0" age={age} />
        </Box>

        {/* Controls */}
        <Box sx={{mt: 1, p: 1}}>
            <Typography variant="body2" id="age-slider">Alter</Typography>
            <Box display="flex">
                <Slider 
                    aria-labelledby="age-slider"
                    min={1}
                    max={100}
                    marks={true}
                    value={age}
                    onChange={(e, value) => setAge(value as number)}
                />
            </Box>
            <Typography sx={{ml: 1}} variant="body1">{age} years</Typography>
        </Box>
    </>
}

export default DraggableElements