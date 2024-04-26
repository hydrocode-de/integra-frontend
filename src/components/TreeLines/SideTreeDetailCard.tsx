import { useSignal, useSignalEffect } from "@preact/signals-react";
import { activeTreeDetailId, setDetailId } from "../../appState/sideContentSignals";
import { treeFeatures, updateSingleTreeSeed } from "../../appState/treeLocationSignals";
import { TreeLocation } from "../../appState/treeLine.model";
import { Box, Card, CardActionArea, Collapse, IconButton, Slider, Typography } from "@mui/material";
import { Close, ExpandLess, ExpandMore, VisibilityOutlined } from "@mui/icons-material";
import { flyTo } from "../MainMap/MapObservableStore";

const SideTreeDetailCard: React.FC = () => {
    // state to track if the card is open
    const open = useSignal<boolean>(true);

    // get a copy of the tree
    const tree = useSignal<TreeLocation["features"][0] | undefined>(undefined)

    // listen to changes in the activeTreeDetailId signal
    useSignalEffect(() => {
        if (activeTreeDetailId.value) {
            tree.value = treeFeatures.value.filter(f => f.id === activeTreeDetailId.peek())[0]
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
            zoom: 17,
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
                    {/* Create a silder to adjust the age and harvest Age */}
                    <Box sx={{p: 1}}>
                        <Typography variant="h6">Planung</Typography>
                        <Slider 
                            min={1}
                            max={100}
                            value={[tree.value.properties.age || 1, tree.value.properties.harvestAge || 60]}
                            onChange={(e, v) => {updateSingleTreeSeed(
                                tree.peek()!.id!.toString(), 
                                {age: (v as number[])[0], harvestAge: (v as number[])[1]}
                            )}}
                        />
                        <Typography variant="caption">
                            {tree.value.properties.treeType} ({tree.value.properties.age} Jahre)&nbsp;
                            wird in {tree.value.properties.harvestAge! - tree.value.properties.age!} Jahren geerntet&nbsp;
                            (mit {tree.value.properties.harvestAge!} Jahren)
                        </Typography>
                    </Box>

                    {/* <pre><code>{ JSON.stringify(tree, null, 2)}</code></pre> */}
                </Box>
            </Collapse>
        </Card>
    </>
}

export default SideTreeDetailCard