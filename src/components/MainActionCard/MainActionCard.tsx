import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Card, CardActionArea, Collapse, Typography } from "@mui/material";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import ReferenceAreaEditor from "./ReferenceAreaEditor";
import DraggableElements from "./DraggableElements";
import { zoom } from "../../appState/mapSignals";
import { referenceArea } from "../../appState/referenceAreaSignals";
import { useState } from "react";

const MainActionCard: React.FC = () => {
    // create a signal to track collapsible state of the card
    const open = useSignal<boolean>(true);

    // the main action card toggles between different modes:
    // - finding a location and adding a reference area
    // - adding trees
    const [actionMode, setActionMode] = useState<"reference" | "addTree" | "zoomIn">("reference")
    const [hasReference, setHasReference] = useState<boolean>(false)
    const [zoomedOut, setZoomedOut] = useState<boolean>(false)

    // listen to changes in the zoom level and the reference area
    useSignalEffect(() => {
        // the first check is, if a reference area already exists
        if (referenceArea.value!.features.length > 0) {
            // now, we use either zoomIn or addTree
            if (zoom.value > 14.5) {
                setActionMode("addTree")
            } else {
                setActionMode("zoomIn")
            }
        } else {
            // there is no reference area -> so we add one in any case
            setActionMode("reference")
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
                        {actionMode === 'addTree' ? 'Bäume hinzufügen' : 'Agrarfläche hinzufügen' }
                    </Typography>
                    { open.value ? <ExpandLess /> : <ExpandMore /> }
                </Box>
            </CardActionArea>  

            <Collapse in={open.value}>
                <Box component="div" display="flex" flexDirection="row" mt="1">
                    { actionMode === 'addTree' ? <DraggableElements /> : <ReferenceAreaEditor /> }
                </Box>
            </Collapse>
        </Card>
    </>
}

export default MainActionCard