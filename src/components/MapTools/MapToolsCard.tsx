import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton } from "@mui/material"
import { ExpandMore, FitScreenOutlined } from "@mui/icons-material"
import { fitReferenceArea, referenceArea } from "../../appState/referenceAreaSignals"
import { activeCard, handleCardToggle } from "../../appState/appViewSignals"

const MapToolsCard: React.FC = () => {
    return <>
        <Accordion 
            expanded={activeCard.value === 'map-tools'} 
            onChange={() => handleCardToggle('map-tools')}
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