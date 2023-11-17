import { ButtonGroup, IconButton } from "@mui/material"
import { DeleteOutline, EditOutlined, VisibilityOutlined } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import center from "@turf/center"

import { TreeLine } from "../../appState/treeLine.model"
import { flyTo } from "../MainMap/MapObservableStore"
import { moveTreeLineToDrawBuffer, removeTreeLine } from "../../appState/treeLineSignals"


const TreeLineActionsButtonGroup: React.FC<{treeLine: TreeLine["features"][0]}> = ({ treeLine }) => {
    // we need a navigator to navigate after the treeLine is removed
    const navigate = useNavigate()

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
        // remove the raw treeLine feature
        removeTreeLine(treeLine.properties.id)

        // navigate to the treeLines overview
        navigate("/")
    }

    // define the event handler to edit the treeLine
    const onEdit = () => {
        moveTreeLineToDrawBuffer(treeLine.properties.id)
    }

    return <>
        <ButtonGroup size="small" variant="outlined">
            <IconButton size="small" onClick={onView} disabled={!treeLine}>
                <VisibilityOutlined />
            </IconButton>
            <IconButton size="small" onClick={onEdit} disabled={!treeLine}>
                <EditOutlined />
            </IconButton>
            <IconButton size="small" onClick={onRemove} disabled={!treeLine}>
                <DeleteOutline />
            </IconButton>

        </ButtonGroup>
    </>
}

export default TreeLineActionsButtonGroup