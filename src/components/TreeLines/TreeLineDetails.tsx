import { AccordionActions, AccordionDetails, Button, ButtonGroup } from "@mui/material"
import { VisibilityOutlined, EditOutlined } from "@mui/icons-material"
import center from "@turf/center"

import { TreeLine } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { flyTo } from "../MainMap/MapObservableStore"

interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    // define a functtion to flyTo the selected treeLine
    const onView = () => {
        // get the center of the feature
        const centerPoint = center(treeLine)
        flyTo({
            center: {lng: centerPoint.geometry.coordinates[0], lat: centerPoint.geometry.coordinates[1]},
            speed: 0.8
        })
    }

    return <>
        <AccordionActions>
            <ButtonGroup>
                <Button size="small" startIcon={<VisibilityOutlined />} onClick={onView}>Anzeigen</Button>
                <Button size="small" startIcon={<EditOutlined />} disabled>Bearbeiten</Button>
            </ButtonGroup>
        </AccordionActions>
        <AccordionDetails>
            <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre>
        </AccordionDetails>
    </>
}

export default TreeLineDetails