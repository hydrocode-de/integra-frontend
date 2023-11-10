import { Accordion, AccordionSummary, Box, Button, Typography } from "@mui/material"
import { ExpandMore, Add } from "@mui/icons-material"

import { useDrawState, useTreeLines } from "../MainMap/treeLineFeatures/treeLinesHooks"
import TreeLineDetails from "./TreeLineDetails"
import { useAppDispatch } from "../../hooks"
import { DrawControlState, updateDrawState } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { useZoom } from "../MainMap/mapFeatures/mapHooks"
 
/**
 * Accrodion of existing tree lines, used to render child components
 */
const TreeLineList: React.FC = () => {
    // get a dispatcher
    const dispatch = useAppDispatch()
    
    // get the current state of the treeLines
    const treeLines = useTreeLines()

    // get the current Draw state and zoom level to disable the ADD button
    const drawState = useDrawState()
    const zoom = useZoom()

    // add the fuction to enable adding
    const onAdd = () => {
        dispatch(updateDrawState(DrawControlState.LINE))
    }

    // if we are editing, do not show anything
    // DEVELOPMENT ONLY -> this should all be done better in the final version
    if (drawState === DrawControlState.LINE || drawState === DrawControlState.EDIT_LINE) return null

    return <>
        {/* Place a heading and a ADD button */}
        <Box display="flex" justifyContent="space-between" p={1}>
            <Typography variant="h6" component="div">Baumreihen</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={onAdd} disabled={zoom < 13}>Neu</Button>
        </Box>

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