import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Card, CardActionArea, Collapse, Typography } from "@mui/material";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { zoom } from "../../../appState/mapSignals";
import ReferenceAreaEditor from "./ReferenceAreaEditor";
import DraggableElements from "./DraggableElements";

const MainActionCard: React.FC = () => {
    // create a signal to track collapsible state of the card
    const open = useSignal<boolean>(true);

    // the main action card toggles between different modes:
    // - finding a location and adding a reference area
    // - adding trees
    
    const actionMode = useSignal<"reference" | "addTree">("reference")

    // listen to changes in the zoom level
    useSignalEffect(() => {
        if (zoom.value > 14.5 && actionMode.value !== "addTree") {
            actionMode.value = "addTree"
        } 
        
        // TODO: after reference areas are re-implemented, we can change this 
        if (zoom.value <= 14.5 && actionMode.peek() !== "reference" ) {
            actionMode.value = "reference"
        }
    })

    return <>
        <Card sx={{
            p: open.value ? 2 : 1, 
            marginLeft: open.value ? '16px' : '0px', 
            //transitionDuration: '800ms',
            marginTop: open.value ? '16px' : '0px'
        }}>
            <CardActionArea onClick={() => (open.value = !open.peek())}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                    <Typography variant={open.value ? "h6" : "body1"} my="auto">
                        {actionMode.value === 'addTree' ? 'Bäume hinzufügen' : 'Agrarfläche hinzufügen' }
                    </Typography>
                    { open.value ? <ExpandLess /> : <ExpandMore /> }
                </Box>
            </CardActionArea>  
        

            <Collapse in={open.value}>
                <Box component="div" display="flex" flexDirection="row" mt="1">
                    { actionMode.value === 'addTree' ? <DraggableElements /> : <ReferenceAreaEditor /> }
                </Box>
            </Collapse>
        </Card>
    </>
}

export default MainActionCard