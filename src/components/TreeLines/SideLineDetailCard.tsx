import { useSignal, useSignalEffect } from "@preact/signals-react"
import { CalculatedTreeLine } from "../../appState/tree.model";
import { activeTreeLineId, setDetailId } from "../../appState/sideContentSignals";
import { calculatedTreeLineFeatures, updateTreeLineProps } from "../../appState/treeLineSignals";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, Collapse, IconButton, Slider, Typography } from "@mui/material";
import { Close,  ExpandMore, VisibilityOutlined } from "@mui/icons-material";
import { center } from "@turf/turf";
import { flyTo } from "../MainMap/MapObservableStore";
import { activeCard, handleCardToggle } from "../../appState/appViewSignals";

const SideLineDetailCard: React.FC = () => {
    // create a local signal to handle open
    const open = useSignal(true)

    // get a copy of the treeline
    const treeLine = useSignal<CalculatedTreeLine["features"][0] | undefined>(undefined)

    // listen to changes in the active
    useSignalEffect(() => {
        if (activeTreeLineId.value) {
            treeLine.value = calculatedTreeLineFeatures.value.filter(line => line.properties.id === activeTreeLineId.peek())[0]

            // if the card is not open, open it
            // if (activeCard.peek() !== 'line-detail') {
            //     handleCardToggle('line-detail')
            // }
        } else {
            treeLine.value = undefined
        }
    })

    // some card handlers
    const handleClose = () => {
        setDetailId({lineId: undefined})
    }

    const handleView = () => {
        const c = center(treeLine.peek()!)
        flyTo({
            center: {lon: c.geometry.coordinates[0], lat: c.geometry.coordinates[1]},
        })
    }

    const setNewWidth = (width: number) => {
        updateTreeLineProps(treeLine.value!.properties.id, { width })
    }

    // if the treeLine is undefined, we don't render anything
    // because either another card, or nothing is shown in the side content
    if (!treeLine.value) return null

    return <>
        <Accordion
            // expanded={activeCard.value === 'line-detail'}
            // onChange={() => handleCardToggle('line-detail')}
            expanded={open.value}
            onChange={() => open.value = !open.peek()}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                { treeLine.value.properties.name || 'Unbekannte Baumreihe'}
            </AccordionSummary>

            <AccordionDetails>
                <Box>
                    <Box p={1}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Anzahl Bäume:</Typography>
                            <Typography variant="body1">{ treeLine.value.properties.treeCount }</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Länge:</Typography>
                            <Typography variant="body1">{ treeLine.value.properties.lineLength?.toFixed(1) } m</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Breite des Baumstreifens:</Typography>
                            <Typography variant="body1">{ treeLine.value.properties.width } m</Typography>
                        </Box>
                    </Box>

                    <Box p={1} mt={1}>
                        <Slider
                            min={1}
                            max={15}
                            marks={[
                                {value: 1, label: '1 m'}, 
                                {value: 5, label: '5m'}, 
                                {value: 10, label: '10 m'},
                                {value: 15, label: '15 m'}
                            ]}
                            value={treeLine.value.properties.width}
                            onChange={(_, v) => setNewWidth(v as number)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>
            </AccordionDetails>

            <AccordionActions>
                <IconButton onClick={handleView} size="small">
                    <VisibilityOutlined />
                </IconButton>

                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </AccordionActions>
        </Accordion>  
    </>
}

export default SideLineDetailCard