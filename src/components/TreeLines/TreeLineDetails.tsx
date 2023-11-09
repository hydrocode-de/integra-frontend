import { AccordionActions, AccordionDetails, Box, Button, ButtonGroup, Checkbox, FormControlLabel, Slider, Typography } from "@mui/material"
import { VisibilityOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material"
import center from "@turf/center"

import { DrawControlState, TreeLine, lineToDrawAction, removeLineAction, updateDrawState, updateTreeGeometryAction, updateTreeLinePropertiesAction } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { flyTo } from "../MainMap/MapObservableStore"
import { useAppDispatch } from "../../hooks"
import { useEffect, useState } from "react"

interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    // set component state to change the treeLine on the fly
    const [spacing, setSpacing] = useState<number>(treeLine.properties.editSettings.spacing)
    const [width, setWidth] = useState<number>(treeLine.properties.editSettings.width)
    const [centered, setCentered] = useState<boolean>(treeLine.properties.editSettings.centerOnLine)

    // get a state dispatcher
    const dispatch = useAppDispatch()

    // extract the treeId for more readable code
    const treeId = treeLine.properties.id

    // effect to adjust the treeLine geometry, when the spacing changes
    useEffect(() => {
        dispatch(updateTreeGeometryAction({treeId,  spacing}))
    }, [spacing, treeId, dispatch])

    // effect to adjust the treeLine geometry, when the centered flag changes
    useEffect(() => {
        dispatch(updateTreeGeometryAction({treeId, centerOnLine: centered}))
    }, [centered, treeId, dispatch])

    // effect to update the treeLine Properties, when width or treeType changes
    useEffect(() => {
        dispatch(updateTreeLinePropertiesAction({treeId, width}))
    }, [width, treeId, dispatch])

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
            <Box sx={{mt: 2}}>
                <Typography id="spacing-slider" gutterBottom>
                    Abstand
                </Typography>
                <Box display="flex">
                    <Slider 
                        aria-labelledby="spacing-slider" 
                        min={1} 
                        max={Math.floor(treeLine.properties.length as number)} 
                        value={spacing} 
                        onChange={(e, value) => setSpacing(value as number)} 
                    />
                    <Typography sx={{ml: 1}} variant="body1">{spacing}m</Typography>
                </Box>
            </Box>

            {/* width slider */}
            <Box sx={{mt: 2}}>
                <Typography id="width-slider" gutterBottom>
                    Breite
                </Typography>
                <Box display="flex">
                    <Slider 
                        aria-labelledby="width-slider"
                        min={1}
                        max={25}
                        marks={true}
                        value={width}
                        onChange={(e, value) => setWidth(value as number)}
                    />
                    <Typography sx={{ml: 1}} variant="body1">{width}m</Typography>
                </Box>
            </Box>

            {/* center on line */}
            <Box sx={{mt: 2}}>
                <Typography id="width-slider" gutterBottom>
                    Position
                </Typography>
                <FormControlLabel control={<Checkbox checked={centered} onChange={(e, checked) => setCentered(checked)} />} label="gleichmäßig Ausrichten"/>
            </Box>

            {/* <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre> */}

        </AccordionDetails>
    </>
}

export default TreeLineDetails