import { useEffect, useState } from "react"
import { Box, Slider, Typography } from "@mui/material"

import DraggableTree  from "../../components/TreeLines/DraggableTree"
import { editAge } from "../../appState/treeLocationSignals"

const DraggableElements: React.FC = () => {
    return <>
        {/* Draggable components box */}
        <Box component="div">
            
            <DraggableTree treeType="Bergahorn"  age={editAge.value} />
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
                    value={editAge.value}
                    onChange={(e, value) => editAge.value = value as number}
                />
            </Box>
            <Typography sx={{ml: 1}} variant="body1">{editAge.value} years</Typography>
        </Box>
    </>
}

export default DraggableElements