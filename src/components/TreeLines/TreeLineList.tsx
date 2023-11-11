import { Card, CardActionArea, CardHeader } from "@mui/material"
import { ArrowRight } from "@mui/icons-material"
import { Link } from "react-router-dom"

import {  useTreeLines } from "../MainMap/treeLineFeatures/treeLinesHooks"

 
/**
 * Accrodion of existing tree lines, used to render child components
 */
const TreeLineList: React.FC = () => {
    // get the current state of the treeLines
    const treeLines = useTreeLines()



    return <>
        {/* Generate one Accordion for each treeLine feature */}
        { treeLines.features.map(((treeLine, idx) => (
            <Card key={treeLine.properties.id}>
                
                <CardActionArea component={Link} to={`/detail/${treeLine.properties.id}`}>
                    <CardHeader 
                        title={`Pflanzreihe ${ idx + 1}`} 
                        subheader={`${treeLine.properties.treeCount} Bäume (${treeLine.properties.length?.toFixed(0)}m)`}
                        action={<ArrowRight />}
                    />
                </CardActionArea>
                
            </Card>
        ))) }
    </>
}

export default TreeLineList