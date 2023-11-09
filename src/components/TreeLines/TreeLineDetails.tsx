import { AccordionActions, AccordionDetails, Box, Button, ButtonGroup, Slider, Typography } from "@mui/material"
import { VisibilityOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material"
import center from "@turf/center"

import { DrawControlState, TreeLine, lineToDrawAction, removeLineAction, updateDrawState, updateSpacingAction } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { flyTo } from "../MainMap/MapObservableStore"
import { useAppDispatch } from "../../hooks"
import { useEffect, useState } from "react"

interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    // set component state to change the treeLine on the fly
    const [spacing, setSpacing] = useState<number>(treeLine.properties.editSettings.spacing)

    // get a state dispatcher
    const dispatch = useAppDispatch()

    // effect to adjust the treeLine in the state , when the spacing changes
    const treeId = treeLine.properties.id
    useEffect(() => {
        dispatch(updateSpacingAction({treeId,  spacing}))
    }, [spacing, treeId])

    // define a functtion to flyTo the selected treeLine
    const onView = () => {
        // get the center of the feature
        const centerPoint = center(treeLine)
        flyTo({
            center: {lng: centerPoint.geometry.coordinates[0], lat: centerPoint.geometry.coordinates[1]},
            speed: 0.8
        })
    }

    // define the event handler to remove the treeLine entirely
    const onRemove = () => {
        dispatch(removeLineAction(String(treeLine.id)))
    }

    // define the event handler to edit the treeLine
    const onEdit = () => {
        // add the geometry back to the draw buffer
        dispatch(lineToDrawAction(String(treeLine.id)))
        dispatch(removeLineAction(String(treeLine.id)))

        // enable drawing again
        dispatch(updateDrawState(DrawControlState.EDIT_LINE))
    }

    return <>
        <AccordionActions>
            <ButtonGroup>
                <Button size="small" startIcon={<VisibilityOutlined />} onClick={onView}>Anzeigen</Button>
                <Button size="small" startIcon={<EditOutlined />} onClick={onEdit}>Bearbeiten</Button>
                <Button size="small" startIcon={<DeleteOutline />} onClick={onRemove}>Löschen</Button>
            </ButtonGroup>
        </AccordionActions>
        <AccordionDetails>

            <Box sx={{flexGrow: 1}} display="flex" justifyContent="space-between">
                <Typography variant="body1">Länge</Typography>
                <Typography variant="body1">{treeLine.properties.length?.toFixed(0)}m</Typography>
            </Box>
            
            {/* Spacing slider */}
            <Box>
                <Typography id="spacing-slider" gutterBottom>
                    Abstand
                </Typography>
                <Box display="flex">
                    <Slider aria-labelledby="spacing-slider" min={1} max={Math.floor(treeLine.properties.length as number)} value={spacing} onChange={(e, value) => setSpacing(value as number)} />
                    <Typography variant="caption">{spacing}m</Typography>
                </Box>
            </Box>

            <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre>

        </AccordionDetails>
    </>
}

export default TreeLineDetails