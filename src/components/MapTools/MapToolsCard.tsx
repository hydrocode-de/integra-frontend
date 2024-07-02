import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Tooltip } from "@mui/material"
import { ErrorOutline, ExpandMore, FitScreenOutlined, VisibilityOff } from "@mui/icons-material"
import { fitReferenceArea, referenceArea } from "../../appState/referenceAreaSignals"
import { activeCard, handleCardToggle } from "../../appState/appViewSignals"
import { useSignal } from "@preact/signals-react"
import { maximumDistances, minimumDistanceArea, showDistances } from "../../appState/legalSignals"

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

                        <Tooltip title="Zeige Abstandshinweise für Förderbedingungen">
                            <IconButton 
                                color={minimumDistanceArea.value.features.length + maximumDistances.value.features.length > 0 ? 'primary' : 'default'}
                                disabled={minimumDistanceArea.value.features.length + maximumDistances.value.features.length === 0}
                                onClick={() => showDistances.value = !showDistances.peek()}
                            >
                                {showDistances.value ? <VisibilityOff /> : <ErrorOutline />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default MapToolsCard