import { Box, Button, Typography } from "@mui/material"

import DraggableTree  from "../../../components/TreeLines/DraggableTree"
import { editAge, editTreeLineId } from "../../../appState/treeLocationSignals"
import { useSignal } from "@preact/signals-react"
import { nanoid } from "nanoid"
import TreeLinesOverview from "../../../components/TreeLines/TreeLinesOverview"
import TreeSpeciesSelectionModal from "../../../components/TreeSpeciesSelection/TreeSpeciesSelectionModal"

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
    const treeSelectionOpen = useSignal<boolean>(false)

    return <>
        <TreeSpeciesSelectionModal isOpen={treeSelectionOpen} />

        <Box display="flex" flexDirection="column">
            <Box onClick={() => (treeSelectionOpen.value = !treeSelectionOpen.peek())}   sx={{display:'flex', p:1, borderRadius:2, bgcolor:'grey.100', width:'100%'}}>
                <DragBox>
                    <DraggableTree treeType="Acer pseudoplatanus"  age={editAge.value} />
                </DragBox>

                <DragBox>
                    <DraggableTree treeType="Prunus avium"  age={editAge.value} />
                </DragBox>
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