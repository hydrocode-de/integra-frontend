import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"

import { useTreeLines } from "../MainMap/treeLineFeatures/treeLinesHooks"
import TreeLineDetails from "./TreeLineDetails"

/**
 * Accrodion of existing tree lines, used to render child components
 */
const TreeLineList: React.FC = () => {
    // get the current state of the treeLines
    const treeLines = useTreeLines()

    return <>
    {/* Generate one Accordion for each treeLine feature */}
    { treeLines.features.map(((treeLine, idx) => (
        <Accordion key={treeLine.id!} TransitionProps={{unmountOnExit: false}}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`line-${treeLine.id!}`} id={`line-${treeLine.id!}`}>
                <Typography>Pflanzreihe { idx + 1}  ({treeLine.properties.treeCount} Bäume - {treeLine.properties.length?.toFixed(0)}m)</Typography>
            </AccordionSummary>
            <TreeLineDetails treeLine={treeLine} />
        </Accordion>
    ))) }
    </>
}

export default TreeLineList