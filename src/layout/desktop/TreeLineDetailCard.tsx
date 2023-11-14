import { useParams, Link } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"


import TreeLineDetails from "../../components/TreeLines/TreeLineDetails"
import { Box, CircularProgress, IconButton } from "@mui/material"
import { treeLines } from "../../appState/treeLineSignals"


const TreeLineDetailCard: React.FC = () => {
    // TODO: maybe a local signal might be needed here

    // use url params to get the tree id
    const { treeId } = useParams()

    return <>
        <Box display="flex" justifyContent="space-between" p="0.5rem">
            <Link to="/">
            <IconButton size="small" edge="start" >
                <ArrowBack />
            </IconButton>
            </Link>
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