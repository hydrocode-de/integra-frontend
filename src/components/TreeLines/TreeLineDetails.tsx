import { AccordionActions, AccordionDetails, Button, ButtonGroup } from "@mui/material"
import { VisibilityOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material"
import center from "@turf/center"

import { DrawControlState, TreeLine, lineToDrawAction, removeLineAction, updateDrawState } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { flyTo } from "../MainMap/MapObservableStore"
import { useAppDispatch } from "../../hooks"

interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    // get a state dispatcher
    const dispatch = useAppDispatch()

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
        dispatch(updateDrawState(DrawControlState.SELECT))
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
            <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre>
        </AccordionDetails>
    </>
}

export default TreeLineDetails