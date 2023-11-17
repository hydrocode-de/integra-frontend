import { useParams, Link } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"


import TreeLineDetails from "../../components/TreeLines/TreeLineDetails"
import { Box, CircularProgress, IconButton, Typography } from "@mui/material"
import { treeLines } from "../../appState/treeLineSignals"
import { useSignal } from "@preact/signals-react"
import TreeLineActionsButtonGroup from "../../components/TreeLines/TreeLineActionsButtonGroup"


const TreeLineDetailCard: React.FC = () => {
    // use url params to get the tree id
    const { treeId } = useParams()

    // get the correct treeLine
    const treeLine = useSignal(treeLines.value.features.find(f => f.properties.id === treeId)!)

    return <>
        <Box display="flex" justifyContent="space-between" p="0.5rem">
            <Link to="/">
            <IconButton size="small" edge="start" >
                <ArrowBack />
            </IconButton>
            </Link>
            <Typography variant="h6">{ treeLine.value?.properties.name }</Typography>
            <TreeLineActionsButtonGroup treeLine={treeLine.value} />
        </Box>
        { treeLines.value.features.map(f => f.properties.id).includes(treeId!) ? (
            <TreeLineDetails treeLine={treeLines.value.features.find(f => f.properties.id === treeId)!} />
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
                <CircularProgress />
            </Box>
        ) }
    </>
}

export default TreeLineDetailCard