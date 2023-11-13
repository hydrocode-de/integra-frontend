import { AccordionActions, AccordionDetails, Box, Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material"
import { VisibilityOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material"
import center from "@turf/center"

import { flyTo } from "../MainMap/MapObservableStore"
import { TreeLine } from "../MainMap/treeLineFeatures/treeLine.model"
import { updateEditSettings } from "../../components/MainMap/treeLineFeatures/treeLineSignals"
import { useSignal, useSignalEffect } from "@preact/signals-react"


interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    // set component state to change the treeLine on the fly
    const spacing = useSignal<number>(treeLine.properties.editSettings.spacing)
    const width = useSignal<number>(treeLine.properties.editSettings.width)
    const centered = useSignal<boolean>(treeLine.properties.editSettings.centerOnLine)
    const treeType = useSignal<string>(treeLine.properties.editSettings.treeType)


    // extract the treeId for more readable code
    const treeId = treeLine.properties.id

    // effect to adjust the treeLine geometry, when the spacing changes
    useSignalEffect(() => updateEditSettings(treeId, {spacing: spacing.value}))

    // effect to adjust the treeLine geometry, when the centered flag changes
    useSignalEffect(() => updateEditSettings(treeId, {centerOnLine: centered.value}))

    // effect to update the treeLine Properties, when width changes
    useSignalEffect(() => updateEditSettings(treeId, {width: width.value}))

    // effect to update the treeLine Properties, when treeType changes
    useSignalEffect(() => updateEditSettings(treeId, {treeType: treeType.value}))

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
        console.log("Not yet implemented")
    }

    // define the event handler to edit the treeLine
    const onEdit = () => {
        // not yet implemented
        console.log("Not yet implemented")
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

            {/* tree type selection */}
            <Box sx={{mt: 2}}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="tree-type-select">Baumart</InputLabel>
                    <Select labelId="tree-type-select" value={treeType.value} onChange={e => treeType.value = e.target.value}>
                        <MenuItem value="birch">Birke</MenuItem>
                        <MenuItem value="oak">Eiche</MenuItem>
                        <MenuItem value="poplar">Pappel</MenuItem>
                    </Select>
                </FormControl>
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
                        max={Math.min(Math.floor(treeLine.properties.length as number), 50)}
                        marks={true}
                        value={spacing.value} 
                        //onChange={(e, value) => setSpacing(value as number)} 
                        onChange={(e, value) => spacing.value = value as number}
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
                        value={width.value}
                        onChange={(e, value) => width.value = value as number}
                    />
                    <Typography sx={{ml: 1}} variant="body1">{width}m</Typography>
                </Box>
            </Box>

            {/* center on line */}
            <Box sx={{mt: 2}}>
                <Typography id="width-slider" gutterBottom>
                    Position
                </Typography>
                <FormControlLabel control={<Checkbox checked={centered.value} onChange={(e, checked) => centered.value = checked} />} label="gleichmäßig Ausrichten"/>
            </Box>

            {/* <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre> */}

        </AccordionDetails>
    </>
}

export default TreeLineDetails