import { Card, CardActionArea, CardHeader } from "@mui/material"
import { ArrowRight } from "@mui/icons-material"
import { Link } from "react-router-dom"

import { treeLines } from "../../appState/treeLineSignals"
 

const TreeLineList: React.FC = () => {
    return <>
        {/* Generate one Accordion for each treeLine feature */}
        { treeLines.value.features.map((treeLine => (
            <Card key={treeLine.properties.id}>
                
                <CardActionArea component={Link} to={`/detail/${treeLine.properties.id}`}>
                    <CardHeader 
                        title={ treeLine.properties.name } 
                        subheader={`${treeLine.properties.treeCount} Bäume (${treeLine.properties.length?.toFixed(0)}m)`}
                        action={<ArrowRight />}
                    />
                </CardActionArea>
                
            </Card>
        ))) }
    </>
}

export default TreeLineList