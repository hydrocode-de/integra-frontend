import { useSignal, useSignalEffect } from "@preact/signals-react";
import { activeTreeDetailId, setDetailId } from "../../appState/sideContentSignals";
import { deleteTreeLocation, rawTreeFeatures, updateSingleTreeSeed } from "../../appState/treeLocationSignals";
import { TreeLocation } from "../../appState/tree.model";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Chip, IconButton, Slider, Typography } from "@mui/material";
import { Close, ExpandMore, VisibilityOutlined, DeleteOutline } from "@mui/icons-material";
import { flyTo } from "../MainMap/MapObservableStore";
import { simulationStep } from "../../appState/simulationSignals";
import { activeCard, handleCardToggle } from "../../appState/appViewSignals";
import { germanSpecies } from "../../appState/backendSignals";

const SideTreeDetailCard: React.FC = () => {
    // get a copy of the tree
    const tree = useSignal<TreeLocation["features"][0] | undefined>(undefined)

    // use a signal to handle the open state locally
    const open = useSignal(true)

    // listen to changes in the activeTreeDetailId signal
    useSignalEffect(() => {
        if (activeTreeDetailId.value) {
            // set the data of the current tree
            tree.value = rawTreeFeatures.value.filter(f => f.id === activeTreeDetailId.peek())[0]

            // // if the accordion is not open, open it
            // if (activeCard.peek() !== 'tree-detail') {
            //     handleCardToggle('tree-detail')
            // }
        } else {
            tree.value = undefined
        }
    })

    // some card handlers
    const handleClose = () => {
        setDetailId({treeId: undefined})
    }

    const handleView = () => {
        const center = {lng: tree.peek()!.geometry.coordinates![0], lat: tree.peek()!.geometry.coordinates![1]}
        // fly the map to the tree location
        flyTo({
            center: center,
            zoom: 20.5,
            pitch: 45
        })
    }

    const handleDelete = () => {
        // delete the tree
        deleteTreeLocation(tree.peek()!.properties.id)

        // close the card
        setDetailId({treeId: undefined})
    }
    
    // if the tree is undefined, we do not need the card at all
    // because either another card, or nothing is shown in the side content
    if (!tree.value) return null

    return <>
        <Accordion 
            // expanded={activeCard.value === 'tree-detail'} 
            // onChange={() => handleCardToggle('tree-detail')}
            expanded={open.value}
            onChange={() => open.value = !open.peek()}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                { germanSpecies.peek()[tree.value.properties.treeType] }
            </AccordionSummary>

            <AccordionDetails>
                <Box>
                    {/* Place chips to inform if the Tree actually exists */}
                    { tree.value.properties.age! > 0 ? (
                        tree.value.properties.harvestAge! > tree.value.properties.age! ? (
                            <Chip label="In Wachstum" color="warning" variant="outlined" />
                        ) : (
                            <Chip label={`geerntet nach ${tree.value.properties.harvestAge} Jahren`} color="success" variant="outlined" />
                        )
                    ) : <Chip label="In Planung" color="info" variant="outlined" /> }

                    {/* Basic info about the tree */}
                    <Box sx={{p: 1}}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Höhe:</Typography>
                            <Typography variant="body1">{tree.value.properties.height?.toFixed(1)} m</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Stammlänge:</Typography>
                            <Typography variant="body1">{tree.value.properties.canopyHeight?.toFixed(1)} m</Typography>
                        </Box>
                    </Box>

                    {/* Create a silder to adjust the age and harvest Age */}
                    <Box sx={{p: 1, mt: 1}}>
                        <Typography variant="h6">Planung</Typography>
                        <Slider 
                            min={0}
                            max={100}
                            value={[
                                // current simulation step minus the current age
                                simulationStep.value.current - (tree.value.properties.age || 1), 
                                // position of the first slider plus the harvest age
                                ((simulationStep.value.current - (tree.value.properties.age || 1)) + (tree.value.properties.harvestAge! || 60))
                            ]}
                            onChange={(e, v) => {updateSingleTreeSeed(
                                tree.peek()!.id!.toString(), 
                                {
                                    age: simulationStep.peek().current - (v as number[])[0],
                                    harvestAge: ((v as number[])[1] + tree.peek()?.properties.age!) - simulationStep.peek().current
                                }
                            )}}
                            
                        />
                        <Typography variant="caption">
                            {tree.value.properties.treeType} ({tree.value.properties.age} Jahre)&nbsp;
                            wird in {tree.value.properties.harvestAge! - tree.value.properties.age!} Jahren geerntet&nbsp;
                            (mit {tree.value.properties.harvestAge!} Jahren)
                        </Typography>
                    </Box>
                </Box>
            </AccordionDetails>

            <AccordionActions>
            {/* <Box mt={0.5} display="flex" flexDirection="row" justifyContent="space-between"> */}
                        <IconButton onClick={handleView} size="small">
                            <VisibilityOutlined />
                        </IconButton>
                        {/* <Box display="flex" flexDirection="row"> */}
                            <IconButton onClick={handleClose} size="small">
                                <Close />
                            </IconButton>
                            <IconButton onClick={handleDelete} size="small">
                                <DeleteOutline />
                            </IconButton>
                        {/* </Box> */}
                    {/* </Box> */}
            </AccordionActions>

        </Accordion>
    </>
}

export default SideTreeDetailCard