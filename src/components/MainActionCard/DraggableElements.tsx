import { Box, Button, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import TreeSpeciesSelectionModal from "../treeSpeciesSelection/TreeSpeciesSelectionModal"
import DraggableTree from "../TreeLines/DraggableTree"
import { editAge, editTreeLineId } from "../../appState/treeLocationSignals"
import TreeLinesOverview from "../TreeLines/TreeLinesOverview"
import { nanoid } from "nanoid"
import { treePalette } from "../../appState/appViewSignals"
import DragBox from "./DragBox"


const DraggableElements: React.FC = () => {
    // state to handle card state
    const treeSelectionOpen = useSignal<boolean>(false)

    return <>
        <TreeSpeciesSelectionModal isOpen={treeSelectionOpen} />

        <Box display="flex" flexDirection="column">
            <Box onClick={() => (treeSelectionOpen.value = !treeSelectionOpen.peek())}   sx={{display:'flex', p:1, borderRadius:2, bgcolor:'grey.100', width:'100%'}}>
                {/* use the tree Palette to fill here */}
                { treePalette.value.map((tree, idx) => (
                    <DragBox key={idx}>
                        <DraggableTree treeType={tree} age={editAge.value} />
                    </DragBox>
                )) }
            </Box>


            {/* TODO: This might go into its own component */}
            <Typography sx={{mt: 2}} variant="h6">Übersicht</Typography>


            <Typography sx={{mt: 2}} variant="h6">Baureihen</Typography>

            <TreeLinesOverview /> 

            <Box sx={{mt: 1, p: 1}}>
                <Button variant="contained" onClick={() => editTreeLineId.value = nanoid(8)}>Neue Baumline</Button>
            </Box>
        </Box>
    </>
}

export default DraggableElements