import React, { useEffect, useState } from "react"
import { Box, CardActionArea, Collapse, Slider, Typography } from "@mui/material"

import DraggableTree  from "../../components/TreeLines/DraggableTree"
import { editAge } from "../../appState/treeLocationSignals"
import { useSignal } from "@preact/signals-react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

const DragBox: React.FC<React.PropsWithChildren> = ({children}) => (
    <Box
        marginRight="5px"
        borderRadius="4px"
        border="5px solid rgba(128,128,128,0.1)" 
        sx={{padding: '2px', backgroundColor: 'rgba(128,128,128,0.3)', maxWidth: '60px', maxHeight: '60px', minWidth: '60px', minHeight: '60px'}} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
    >
        { children }
    </Box>
)
const DraggableElements: React.FC = () => {
    // state to handle card state
    const open = useSignal<boolean>(true)

    return <>
    <Box sx={{mx: 1, m: open.value ? 1 : 0, mb: 0.5}}>
        {/* Draggable components box */}
        <CardActionArea onClick={() => (open.value = !open.peek())}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                <Typography variant={open.value ? "h6" : "body1"} my="auto">
                    Bäume hinzufügen
                </Typography>
                { open.value ? <ExpandMore /> : <ExpandLess /> }
            </Box>
        </CardActionArea>

        <Collapse in={open.value}>
            <Box component="div" display="flex" flexDirection="row">
                
                <DragBox>
                    <DraggableTree treeType="Bergahorn"  age={editAge.value} />
                </DragBox>

                <DragBox>
                    <DraggableTree treeType="Vogelbeere"  age={editAge.value} />
                </DragBox>
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
        </Collapse>
    </Box>
    </>
}

export default DraggableElements