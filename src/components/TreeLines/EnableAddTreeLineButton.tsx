import { Button } from "@mui/material"
import { Add } from "@mui/icons-material"

import { zoom } from "../../appState/mapSignals"
import { drawState } from "../../appState/treeLineSignals"
import { DrawState } from "../../appState/treeLine.model"

const EnabledAddTreeLineButton: React.FC = () => {
    // add handler
    const onAdd = () => {
        // debounce if it is already on
        if (drawState.value === DrawState.LINE) drawState.value = DrawState.OFF
        
        // enabled drawing
        drawState.value = DrawState.LINE
    }
    
    return <>
        <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />} disabled={zoom.value < 13}>Neu</Button>
    </>
}

export default EnabledAddTreeLineButton