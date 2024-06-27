import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton } from "@mui/material"
import { ExpandMore, FitScreenOutlined } from "@mui/icons-material"
import { fitReferenceArea, referenceArea } from "../../appState/referenceAreaSignals"
import { activeCard, handleCardToggle } from "../../appState/appViewSignals"
import { useSignal } from "@preact/signals-react"

const MapToolsCard: React.FC = () => {
    // create a local signal to handle open
    const open = useSignal(false)

    return <>
        <Accordion 
            // expanded={activeCard.value === 'map-tools'} 
            // onChange={() => handleCardToggle('map-tools')}
            expanded={open.value}
            onChange={() => open.value = !open.peek()}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                Kartenwerkzeuge
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    <Box display="flex" flexDirection="row">
                        <IconButton 
                            color="primary" 
                            onClick={() => fitReferenceArea()} 
                            disabled={referenceArea.value.features.length === 0}
                        >
                            <FitScreenOutlined />
                        </IconButton>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default MapToolsCard