import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, Collapse, Typography } from "@mui/material";
import { useSignalEffect } from "@preact/signals-react";
import ReferenceAreaEditor from "./ReferenceAreaEditor";
import DraggableElements from "./DraggableElements";
import { zoom } from "../../appState/mapSignals";
import { referenceArea } from "../../appState/referenceAreaSignals";
import { useState } from "react";
import ZoomBackCard from "./ZoomBackCard";

const MainActionCard: React.FC = () => {
    // the main action card toggles between different modes:
    // - finding a location and adding a reference area
    // - adding trees
    const [actionMode, setActionMode] = useState<"reference" | "addTree" | "zoomIn">("reference")

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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>Meine Planung</AccordionSummary>

            <AccordionDetails>
                <Box component="div" display="flex" flexDirection="row" width="100%">
                    { actionMode === 'reference' ? <ReferenceAreaEditor /> : null }
                    { actionMode === 'addTree' ? <DraggableElements /> : null }
                    { actionMode === 'zoomIn' ? <ZoomBackCard /> : null }
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default MainActionCard