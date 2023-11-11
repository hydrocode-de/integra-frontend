import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"

import { TreeLine } from "../../components/MainMap/treeLineFeatures/treeLinesSlice"
import { useTreeLines } from "../../components/MainMap/treeLineFeatures/treeLinesHooks"
import TreeLineDetails from "../../components/TreeLines/TreeLineDetails"
import { Box, Button, CircularProgress, IconButton } from "@mui/material"

const TreeLineDetailCard: React.FC = () => {
    // component state for handling the current tree line
    const [treeLine, setTreeLine] = useState<TreeLine["features"][0] | undefined>(undefined)

    // use url params to get the tree id
    const { treeId } = useParams()

    // use the treeLines to find the correct tree line
    const treeLines = useTreeLines()

    useEffect(() => {
        const line = treeLines.features.find((line) => line.properties.id === treeId)
        setTreeLine(line)
    }, [treeLines, treeId])

    return <>
        <Box display="flex" justifyContent="space-between" p="0.5rem">
            <Link to="/">
            <IconButton size="small" edge="start" >
                <ArrowBack />
            </IconButton>
            </Link>
        </Box>
        { treeLine ? (
            <TreeLineDetails treeLine={treeLine} />
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
                <CircularProgress />
            </Box>
        ) }
    </>
}

export default TreeLineDetailCard