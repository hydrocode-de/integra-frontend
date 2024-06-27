import { Box, Button, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import TreeSpeciesSelectionModal from "../treeSpeciesSelection/TreeSpeciesSelectionModal"
import DraggableTree from "../TreeLines/DraggableTree"
import { editAge, editTreeLineId } from "../../appState/treeLocationSignals"
import TreeLinesOverview from "../TreeLines/TreeLinesOverview"
import { nanoid } from "nanoid"
import { treePalette } from "../../appState/appViewSignals"
import DragBox from "./DragBox"
import { Add  } from "@mui/icons-material"


const DraggableElements: React.FC = () => {
    // state to handle card state
    const treeSelectionOpen = useSignal<boolean>(false)

    return <>
        <TreeSpeciesSelectionModal isOpen={treeSelectionOpen} />

        <Box display="flex" flexDirection="column" width="100%">
            
            <Typography variant="h6">Gehölzauswahl</Typography>
            <Box onClick={() => (treeSelectionOpen.value = !treeSelectionOpen.peek())}   sx={{display:'flex', p:1, borderRadius:2, bgcolor:'grey.100', width:'100%'}}>
                {/* use the tree Palette to fill here */}
                { treePalette.value.map((tree, idx) => (
                    <DragBox key={idx}>
                        <DraggableTree treeType={tree} age={editAge.value} />
                    </DragBox>
                )) }
                <DragBox>
                    <Add fontSize="large" style={{color: 'grey', cursor: 'pointer'}} />
                </DragBox>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{mt: 2}} variant="h6">Angelegte Strukturen</Typography>
                <Button variant="contained" color="success" onClick={() => editTreeLineId.value = nanoid(8)}>Neu</Button>
            </Box>
            <TreeLinesOverview /> 

        </Box>
    </>
}

export default DraggableElements