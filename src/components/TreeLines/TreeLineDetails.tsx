import { AccordionActions, AccordionDetails, Button, ButtonGroup } from "@mui/material"
import { VisibilityOutlined, EditOutlined } from "@mui/icons-material"

import { TreeLine } from "../MainMap/treeLineFeatures/treeLinesSlice"

interface TreeLineDetailsProps {
    treeLine:  TreeLine["features"][0],
}

const TreeLineDetails: React.FC<TreeLineDetailsProps> = ({ treeLine }) => {
    return <>
        <AccordionActions>
            <ButtonGroup>
                <Button size="small" startIcon={<VisibilityOutlined />} >Anzeigen</Button>
                <Button size="small" startIcon={<EditOutlined />}>Bearbeiten</Button>
            </ButtonGroup>
        </AccordionActions>
        <AccordionDetails>
            <pre><code>{ JSON.stringify(treeLine, null, 4) }</code></pre>
        </AccordionDetails>
    </>
}

export default TreeLineDetails