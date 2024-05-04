import { useSignal, useSignalEffect } from "@preact/signals-react";
import { activeTreeDetailId, setDetailId } from "../../appState/sideContentSignals";
import { rawTreeFeatures, updateSingleTreeSeed } from "../../appState/treeLocationSignals";
import { TreeLocation } from "../../appState/treeLine.model";
import { Box, Card, CardActionArea, Chip, Collapse, IconButton, Rating, Slider, Tooltip, Typography } from "@mui/material";
import { Close, ExpandLess, ExpandMore, VisibilityOutlined } from "@mui/icons-material";
import { flyTo } from "../MainMap/MapObservableStore";
import StarRating from "../StarRating";
import { simulationStep } from "../../appState/simulationSignals";

const SideTreeDetailCard: React.FC = () => {
    // state to track if the card is open
    const open = useSignal<boolean>(true);

    // get a copy of the tree
    const tree = useSignal<TreeLocation["features"][0] | undefined>(undefined)

    {/* For now, we use a mix of pollen, nectar and blossoms, like an overall rating */}
    const pollenRating = useSignal<number>(0)
    const nectarRating = useSignal<number>(0)
    const blossomsRating = useSignal<number>(0)

    // for now hard-code the limits, can be requested from supabase one day
    useSignalEffect(() => {
        // pollenRating is the relative amount of pollen compared to the max of 140.000.000.000.000, rescaled to 0-5
        pollenRating.value = tree.value?.properties.pollen! / 140000000000000 * 5 || 0
        // nectarRating is the relative amount of nectar compared to the max of 12.000, rescaled to 0-5
        nectarRating.value = tree.value?.properties.nectar! / 12000 * 5 || 0
        //blossomsRating is the relative amount of blossoms compared to the max of 4.000.000, rescaled to 0-5
        blossomsRating.value = tree.value?.properties.blossoms! / 4000000 * 5 || 0
    })

    // listen to changes in the activeTreeDetailId signal
    useSignalEffect(() => {
        if (activeTreeDetailId.value) {
            tree.value = rawTreeFeatures.value.filter(f => f.id === activeTreeDetailId.peek())[0]
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
    
    // if the tree is undefined, we do not need the card at all
    // because either another card, or nothing is shown in the side content
    if (!tree.value) return null

    return <>
        <Card sx={{mt: 1, mx: 1, p: open.value ? 2 : 1}}>
            <Box display="flex">
                <IconButton onClick={handleView} size="small">
                    <VisibilityOutlined />
                </IconButton>

                <CardActionArea onClick={() => open.value =!open.peek()}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                        <Typography variant={open.value ? "h6" : "body1"} my="auto">
                            { tree.value.properties.treeType }
                        </Typography>
                        { open.value ? <ExpandLess /> : <ExpandMore /> }
                    </Box>
                </CardActionArea>

                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <Collapse in={open.value}>
                <Box sx={{overflowY: 'scroll', p: 1}}>
                    {/* Place chips to inform if the Tree actually exists */}
                    { tree.value.properties.age! > 0 ? (
                        tree.value.properties.harvestAge! > tree.value.properties.age! ? (
                            <Chip label="wächst" color="warning" variant="outlined" />
                        ) : (
                            <Chip label={`geerntet nach ${tree.value.properties.harvestAge} Jahren`} color="success" variant="outlined" />
                        )
                    ) : <Chip label="in Planung" color="info" variant="outlined" /> }

                    {/* Basic info about the tree */}
                    <Box sx={{p: 1}}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Höhe:</Typography>
                            <Typography variant="body1">{tree.value.properties.height?.toFixed(1)} m</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Stamm Länge:</Typography>
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

                        <Typography variant="h6" mt="2">
                            Schatten
                        </Typography>
                        <Rating value={4} readOnly />

                        <Tooltip 
                            title={<Box display="flex" flexDirection="column">
                                <span>Pollen: {pollenRating.value.toFixed(1)}</span>
                                <span>Nektar: {nectarRating.value.toFixed(1)}</span>
                                <span>Blühtenzahl {blossomsRating.value.toFixed(1)}</span>
                            </Box>} 
                            placement="right"
                        >
                            <Box>
                                <Typography variant="h6" mt="2">
                                    Blühangebot
                                </Typography>
                                <Rating 
                                    readOnly 
                                    value={(blossomsRating.value + nectarRating.value + pollenRating.value) / 3.} 
                                    precision={0.5}
                                />
                            </Box>
                        </Tooltip>
                        
                        
                    </Box>

                    {/* <pre><code>{ JSON.stringify(tree, null, 2)}</code></pre> */}
                </Box>
            </Collapse>
        </Card>
    </>
}

export default SideTreeDetailCard